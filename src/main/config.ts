// POC configuration: where the CaptAIn workspace lives, what the Datei-Explorer shows, which persona.
// Dev: config.json next to package.json. Packaged app: %APPDATA%/<productName>/config.json, seeded
// from the bundled config.json on first start (the app.asar archive is read-only).
// Missing or invalid keys fall back to the defaults below.
import { app } from 'electron';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { LANGUAGES, type Language } from './i18n';

export type Persona = 'captain' | 'soft';
export type EngineType = 'claude' | 'agy' | 'gpts';

export interface PocConfig {
  /** The backend engine to use ('claude' for Claude SDK, 'agy' for Antigravity, 'gpts' for GPTS). */
  engineType: EngineType;
  /** Name of the agent displayed in the UI. Defaults to 'CaptAIn'. */
  agentName: string;
  /** Path to the workspace (CLAUDE.md, .claude/skills, project-map/, connectors/). */
  workspaceRepo: string;
  /** Folder shown in the Datei-Explorer when the app opens. */
  workspaceRoot: string;
  /**
   * Send "Hallo {agentName}" at start. Normally unnecessary: the workspace's SessionStart
   * hook already opens the session with the welcome menu. Turn on only if that hook is absent.
   */
  greetOnStart: boolean;
  /** 'captain' = CaptAIn as in the CLI; 'soft' = fewer technical terms, shorter sentences. */
  persona: Persona;
  /** UI language. Omit to follow the OS language (German locale -> 'de', otherwise 'en'). Set by the DE|EN switch. */
  language?: Language;
  /** Optional model override (alias or full id). Omit to use the CLI default. Set by the model picker. */
  model?: string;
  /** Models offered in the picker for engines that cannot list them (agy, gpts). */
  availableModels?: string[];
  /** Optional path to a Claude Code executable; omit to use the one bundled with the SDK. */
  claudeExecutable?: string;
}

// dist/main/config.js -> ../.. = POC root (inside app.asar when packaged)
export const POC_ROOT = path.resolve(__dirname, '..', '..');
const BUNDLED_CONFIG = path.join(POC_ROOT, 'config.json');
const CONFIG_PATH = app.isPackaged ? path.join(app.getPath('userData'), 'config.json') : BUNDLED_CONFIG;

const DEFAULTS: PocConfig = {
  engineType: 'claude',
  agentName: 'CaptAIn',
  workspaceRepo: path.join(app.getPath('home'), '.my-agent-skills'),
  workspaceRoot: app.isPackaged ? app.getPath('documents') : path.resolve(POC_ROOT, '..'),
  greetOnStart: false,
  persona: 'captain',
};

const ENGINE_TYPES: EngineType[] = ['claude', 'agy', 'gpts'];
const PERSONAS: Persona[] = ['captain', 'soft'];

function readJson(file: string): Partial<PocConfig> | null {
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    return raw && typeof raw === 'object' ? (raw as Partial<PocConfig>) : null;
  } catch {
    return null;
  }
}

export function loadConfig(): PocConfig {
  const raw = readJson(CONFIG_PATH) ?? (app.isPackaged ? readJson(BUNDLED_CONFIG) : null) ?? {};
  // Handle migration from captainRepo to workspaceRepo for existing configs
  if ('captainRepo' in raw && !raw.workspaceRepo) {
    raw.workspaceRepo = (raw as { captainRepo?: string }).captainRepo;
  }
  const cfg: PocConfig = { ...DEFAULTS, ...raw };
  if (!ENGINE_TYPES.includes(cfg.engineType)) cfg.engineType = DEFAULTS.engineType;
  if (!PERSONAS.includes(cfg.persona)) cfg.persona = DEFAULTS.persona;
  if (cfg.language !== undefined && !LANGUAGES.includes(cfg.language)) delete cfg.language;
  if (typeof cfg.agentName !== 'string' || !cfg.agentName.trim()) cfg.agentName = DEFAULTS.agentName;
  if (typeof cfg.workspaceRepo !== 'string') cfg.workspaceRepo = DEFAULTS.workspaceRepo;
  if (typeof cfg.workspaceRoot !== 'string') cfg.workspaceRoot = DEFAULTS.workspaceRoot;
  if (cfg.availableModels !== undefined && !Array.isArray(cfg.availableModels)) delete cfg.availableModels;
  return cfg;
}

/** Returns false if the file could not be written (read-only location, locked file …). */
export function saveConfig(cfg: PocConfig): boolean {
  try {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
    return true;
  } catch {
    return false;
  }
}

export function configPath(): string {
  return CONFIG_PATH;
}
