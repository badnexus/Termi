import { EventEmitter } from 'node:events';
import { spawn, type ChildProcess } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IEngine } from './IEngine';
import type { EngineEvent, EngineOptions, ModelChoice } from './EngineTypes';
import { assistantTerminalLines, describeTool } from './EngineTypes';
import { t } from './i18n';

export class AgyEngine extends EventEmitter implements IEngine {
  private stopped = false;
  private proc: ChildProcess | null = null;
  /** stdout arrives in arbitrary chunks; keep the unfinished last line until its newline comes. */
  private stdoutRest = '';
  /** Agent text of the current response, mirrored to the Terminal view when it is done. */
  private responseText = '';
  private toolNames = new Map<string, string>();
  /** A message was sent and its 'result' has not arrived yet. */
  private turnOpen = false;

  constructor(private readonly opts: EngineOptions) {
    super();
  }

  emitEvent(ev: EngineEvent): void {
    if (this.stopped) return;
    this.emit('event', ev);
  }

  async start(): Promise<void> {
    this.emitEvent({ kind: 'terminal', line: t('engine.starting', { agent: this.opts.agentName || 'Agy', cwd: this.opts.cwd }), level: 'info' });

    const args = ['--input-format', 'stream-json', '--output-format', 'stream-json'];
    if (this.opts.skipPermissions) {
      args.push('--dangerously-skip-permissions');
      this.emitEvent({ kind: 'terminal', line: t('engine.skipWarning'), level: 'stderr' });
    }
    if (this.opts.model) {
      if (!SAFE_ARG.test(this.opts.model)) {
        this.emitEvent({ kind: 'error', text: t('agy.invalidModel', { model: this.opts.model }) });
        return;
      }
      args.push('--model', this.opts.model);
    }

    const exe = findOnPath('agy');
    if (!exe) {
      this.emitEvent({ kind: 'error', text: t('agy.notFound') });
      return;
    }
    // A .cmd/.bat wrapper (npm installs agy that way on Windows) can only run through cmd.exe;
    // all arguments are fixed flags or SAFE_ARG-checked, so the joined command line is safe.
    this.proc = /\.(cmd|bat)$/i.test(exe)
      ? spawn(`"${exe}" ${args.join(' ')}`, { cwd: this.opts.cwd, shell: true, windowsHide: true })
      : spawn(exe, args, { cwd: this.opts.cwd, windowsHide: true });

    this.proc.on('error', (err: NodeJS.ErrnoException) => {
      this.emitEvent({ kind: 'error', text: err.code === 'ENOENT' ? t('agy.notFound') : t('agy.startFailed', { e: String(err) }) });
    });
    this.proc.stdin?.on('error', (err) => {
      this.emitEvent({ kind: 'terminal', line: `stdin: ${String(err)}`, level: 'stderr' });
    });

    this.proc.stdout?.on('data', (data: Buffer) => {
      const lines = (this.stdoutRest + data.toString()).split(/\r?\n/);
      this.stdoutRest = lines.pop() ?? '';
      for (const line of lines) this.handleLine(line);
    });

    this.proc.stderr?.on('data', (data: Buffer) => {
      for (const line of data.toString().split(/\r?\n/).filter((l) => l.trim())) {
        this.emitEvent({ kind: 'terminal', line, level: 'stderr' });
      }
    });

    this.proc.on('close', (code) => {
      if (this.stdoutRest) this.handleLine(this.stdoutRest);
      this.stdoutRest = '';
      this.emitEvent({ kind: 'status', text: t('agy.exited', { code: String(code) }) });
      // Unlock the UI if the process died mid-turn.
      if (this.turnOpen) this.emitEvent({ kind: 'result', costUsd: 0, durationMs: 0, numTurns: 0, isError: true });
      this.turnOpen = false;
    });

    // agy has no init handshake we wait for; the UI may send as soon as the process is spawned.
    this.emitEvent({
      kind: 'init',
      model: this.opts.model || 'gemini',
      version: 'agy-cli',
      permissionMode: this.opts.skipPermissions ? 'bypassPermissions' : 'default',
      skills: [],
      slashCommands: [],
      tools: [],
    });
  }

  private handleLine(line: string): void {
    if (!line.trim()) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      // plain-text output (warnings, banners) – show it instead of dropping it
      this.emitEvent({ kind: 'terminal', line, level: 'info' });
      return;
    }
    this.handleAgyEvent(parsed as AgyEvent);
  }

  private handleAgyEvent(ev: AgyEvent): void {
    if (ev.event === 'init') {
      this.emitEvent({ kind: 'terminal', line: t('engine.readyAgy', { model: ev.model ? t('engine.modelSuffix', { model: ev.model }) : '' }), level: 'info' });
    } else if (ev.event === 'step_update' && ev.step_update) {
      const step = ev.step_update;

      if (step.step_type === 'agent_response') {
        if (step.text_delta) {
          if (!this.responseText) this.emitEvent({ kind: 'text_start' });
          this.responseText += step.text_delta;
          this.emitEvent({ kind: 'text_delta', text: step.text_delta });
        }
        if (step.state === 'DONE') {
          this.emitEvent({ kind: 'text_done' });
          if (this.responseText.trim()) for (const t of assistantTerminalLines(this.responseText)) this.emitEvent(t);
          this.responseText = '';
        }
      } else if (step.step_type === 'tool') {
        const id = `step-${step.step_index}`;
        if (step.state === 'ACTIVE') {
          if (this.toolNames.has(id)) return; // repeated ACTIVE updates for the same step
          const name = step.tool_name || 'Tool';
          const input = (step.tool_info?.parameters || {}) as Record<string, unknown>;
          const { summary } = describeTool(name, input);
          this.toolNames.set(id, name);
          this.emitEvent({ kind: 'terminal', line: `▶ ${name}  ${summary}`, level: 'tool' });
          this.emitEvent({ kind: 'tool_use', id, name, summary, input });
        } else if (step.state === 'DONE' || step.state === 'ERROR') {
          const isError = step.state === 'ERROR';
          const summary = step.tool_info?.error?.message || (isError ? t('engine.toolError') : t('engine.toolOk'));
          this.toolNames.delete(id);
          this.emitEvent({ kind: 'terminal', line: `${isError ? '✗' : '✓'} ${summary}`, level: isError ? 'stderr' : 'tool' });
          this.emitEvent({ kind: 'tool_result', id, summary, isError });
        }
      } else {
        this.emitEvent({ kind: 'terminal', line: `${step.step_type ?? 'step'} ${step.state ?? ''}`.trim(), level: 'info' });
      }
    } else if (ev.event === 'permission_request' && ev.request_id) {
      // Assumed shape – verify against agy's real stream-json output (see README).
      const toolName = ev.tool_name || 'Tool';
      const input = (ev.parameters || {}) as Record<string, unknown>;
      const { summary, detail } = describeTool(toolName, input);
      this.emitEvent({ kind: 'terminal', line: t('engine.approvalAsk', { tool: toolName, summary }), level: 'hook' });
      this.emitEvent({ kind: 'permission_request', requestId: ev.request_id, toolName, summary, detail, input, canAlways: false });
    } else if (ev.event === 'result') {
      const durationMs = (ev.result?.duration_seconds || 0) * 1000;
      const numTurns = ev.result?.num_turns || 0;
      const isError = ev.result?.status === 'ERROR';
      this.emitEvent({
        kind: 'terminal',
        line: t('engine.resultLine', { status: isError ? t('engine.failed') : t('engine.done'), s: (durationMs / 1000).toFixed(1), n: numTurns }),
        level: 'result',
      });
      this.turnOpen = false;
      this.emitEvent({ kind: 'result', costUsd: 0, durationMs, numTurns, isError });
    } else {
      // Unknown event types are shown, never silently dropped.
      this.emitEvent({ kind: 'terminal', line: `agy/${ev.event ?? '?'}`, level: 'info' });
    }
  }

  private write(msg: unknown): boolean {
    const stdin = this.proc?.stdin;
    if (!stdin || !stdin.writable) return false;
    stdin.write(JSON.stringify(msg) + '\n');
    return true;
  }

  async stop(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    this.proc?.kill();
    this.removeAllListeners();
  }

  send(text: string): void {
    this.emitEvent({ kind: 'terminal', line: `> ${text.replace(/\s+/g, ' ').slice(0, 200)}`, level: 'info' });
    if (this.write({ event: 'user', message: { content: text } })) this.turnOpen = true;
    else {
      this.emitEvent({ kind: 'error', text: t('agy.notRunning') });
    }
  }

  async interrupt(): Promise<void> {
    // agy's stream-json input has no known interrupt event; ending the process is the only reliable stop.
    this.emitEvent({ kind: 'terminal', line: t('agy.noInterrupt'), level: 'info' });
  }

  answerPermission(requestId: string, allow: boolean, always: boolean): void {
    this.write({ event: 'permission_resolved', request_id: requestId, allowed: allow, always });
    this.emitEvent({ kind: 'permission_resolved', requestId, allowed: allow });
    this.emitEvent({ kind: 'terminal', line: `${allow ? t('engine.allowed') : t('engine.denied')} (${requestId.slice(0, 8)})`, level: 'hook' });
  }

  async listModels(): Promise<ModelChoice[]> {
    const models = new Set(this.opts.availableModels ?? []);
    if (this.opts.model) models.add(this.opts.model);
    return [...models].map((m) => ({ value: m, displayName: m }));
  }

  async setModel(): Promise<boolean> {
    return false; // --model is a launch argument: the caller restarts the engine
  }
}

/** Model names like "gemini-3-pro", "models/gemini:latest" – nothing a shell could interpret. */
const SAFE_ARG = /^[\w.:/@-]+$/;

/** Locate a command the way the shell would (PATH × PATHEXT on Windows). */
function findOnPath(cmd: string): string | null {
  const dirs = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);
  const exts = process.platform === 'win32' ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT').split(';').filter(Boolean) : [''];
  for (const dir of dirs) {
    for (const ext of exts) {
      const full = path.join(dir.replace(/^"|"$/g, ''), cmd + ext.toLowerCase());
      try {
        if (fs.statSync(full).isFile()) return full;
      } catch {
        // not here
      }
    }
  }
  return null;
}

interface AgyEvent {
  event?: string;
  model?: string;
  request_id?: string;
  tool_name?: string;
  parameters?: unknown;
  step_update?: {
    step_type?: string;
    step_index?: number;
    state?: string;
    text_delta?: string;
    tool_name?: string;
    tool_info?: { parameters?: unknown; error?: { message?: string } };
  };
  result?: { duration_seconds?: number; num_turns?: number; status?: string };
}
