// Workspace from a git URL: clone it on first start, fast-forward it on every start.
// So a team can share one agent workspace (CLAUDE.md, skills, hooks) without anyone opening a
// terminal. Every failure is non-fatal: the app then works with the copy it already has.
import { execFile } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { t } from './i18n';

export type WorkspaceSyncResult = { ok: true; line: string } | { ok: false; text: string };

function git(args: string[], cwd: string | undefined, timeoutMs: number): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    // No terminal prompts (nobody could answer them); Git Credential Manager's sign-in window still works.
    const env = { ...process.env, GIT_TERMINAL_PROMPT: '0' };
    execFile('git', args, { cwd, env, timeout: timeoutMs, windowsHide: true }, (err, stdout, stderr) => {
      const code = err ? (typeof (err as { code?: unknown }).code === 'number' ? (err as { code: number }).code : -1) : 0;
      const missing = (err as NodeJS.ErrnoException | null)?.code === 'ENOENT';
      resolve({ code: missing ? 127 : code, out: `${stdout}${stderr}`.trim() });
    });
  });
}

/** Clone `url` into `dir` if it is missing, otherwise `git pull --ff-only` (local changes are never overwritten). */
export async function syncWorkspace(url: string, dir: string): Promise<WorkspaceSyncResult> {
  const lastLine = (s: string) => s.split(/\r?\n/).filter(Boolean).pop() ?? '';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    const r = await git(['clone', '--quiet', url, dir], undefined, 10 * 60_000);
    if (r.code === 127) return { ok: false, text: t('workspace.gitMissing') };
    if (r.code !== 0) return { ok: false, text: t('workspace.cloneFailed', { url, e: lastLine(r.out) }) };
    return { ok: true, line: t('workspace.cloned', { url, dir }) };
  }
  if (!fs.existsSync(path.join(dir, '.git'))) return { ok: true, line: t('workspace.notGit', { dir }) };
  const r = await git(['pull', '--ff-only', '--quiet'], dir, 2 * 60_000);
  if (r.code === 127) return { ok: false, text: t('workspace.gitMissing') };
  if (r.code !== 0) return { ok: false, text: t('workspace.pullFailed', { e: lastLine(r.out) }) };
  return { ok: true, line: t('workspace.updated', { dir }) };
}
