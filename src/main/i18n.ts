// UI language of the main process: the app's own Terminal lines, error texts, dialog and window
// titles. The renderer has its own table (src/renderer/i18n.js). Not translated on purpose: the
// tokens the engine receives ([Datei: …], [Projekt: …]) and the persona system prompt.
export type Language = 'de' | 'en';
export const LANGUAGES: Language[] = ['de', 'en'];

const DE = {
  'window.title': '{agent} für alle – Proof of Concept',
  'dialog.chooseFolder': 'Arbeitsordner wählen',
  'greeting': 'Hallo {agent}',
  'err.unexpected': 'Unerwarteter Fehler: {e}',
  'err.engineStart': 'Engine konnte nicht starten: {e}',
  'err.engineNotRunning': 'Die Engine läuft gerade nicht – bitte kurz warten oder neu starten.',
  'err.saveConfig': 'Einstellungen konnten nicht gespeichert werden ({path})',
  'err.workspaceMissing': 'Arbeitsumgebung nicht gefunden: {repo} – Pfad in {config} prüfen',
  'err.modelList': 'Modellliste nicht verfügbar: {e}',
  'err.liveSwitch': 'Live-Wechsel fehlgeschlagen ({e}) – neue Sitzung',
  'engine.starting': '{agent}-Engine startet in {cwd}',
  'engine.skipWarning': 'ACHTUNG: --dangerously-skip-permissions – Freigaben sind deaktiviert',
  'engine.startFailed': 'Engine-Start fehlgeschlagen: {e}',
  'engine.error': 'Engine-Fehler: {e}',
  'engine.interrupted': 'Unterbrochen durch Nutzer',
  'engine.interruptFailed': 'Unterbrechen fehlgeschlagen: {e}',
  'engine.deniedByUser': 'Vom Nutzer in der Freigabe-Karte abgelehnt.',
  'engine.sessionEnded': 'Sitzung beendet.',
  'engine.aborted': 'Abgebrochen.',
  'engine.allowed': 'FREIGEGEBEN',
  'engine.denied': 'ABGELEHNT',
  'engine.approvalAsk': 'FREIGABE? {tool}: {summary}',
  'engine.modelSwitched': 'Modell gewechselt: {model}',
  'engine.defaultModel': 'Standard',
  'engine.thinking': '… denkt nach',
  'engine.toolRunning': '  … {tool} läuft seit {s} s',
  'engine.readyClaude': 'Bereit · Claude Code {version} · Modell {model} · Freigabemodus {mode} · {n} Skills',
  'engine.readyAgy': 'Bereit · agy{model}',
  'engine.modelSuffix': ' · Modell {model}',
  'engine.done': '✓ fertig',
  'engine.failed': '✗ Fehler',
  'engine.resultLine': '{status} · {s} s · {n} Schritte',
  'engine.costSuffix': ' · Gesamtkosten der Sitzung ≈ ${cost}',
  'engine.toolOk': 'Erfolgreich',
  'engine.toolError': 'Fehler',
  'agy.invalidModel': 'Ungültiger Modellname: {model}',
  'agy.notFound': 'Agy-Engine konnte nicht starten: agy nicht gefunden – ist es installiert und im PATH?',
  'agy.startFailed': 'Agy-Engine konnte nicht starten: {e}',
  'agy.exited': 'Agy-Prozess beendet mit Code {code}',
  'agy.notRunning': 'Agy-Prozess läuft nicht – Nachricht nicht gesendet.',
  'agy.noInterrupt': 'Unterbrechen wird von agy noch nicht unterstützt.',
  'gpts.notImplemented': 'GPTS Integration ist in dieser Version noch nicht implementiert.',
  'gpts.placeholder': 'GPTS Engine ist noch ein Platzhalter.',
  'tool.write': 'Datei anlegen: {path}',
  'tool.edit': 'Datei ändern: {path}',
  'tool.editDetail': 'Ersetzen:\n{old}\n\nDurch:\n{new}',
  'tool.read': 'Datei lesen: {path}',
  'tool.search': 'Suchen: {pattern}',
  'tool.webFetch': 'Webseite abrufen: {url}',
  'tool.webSearch': 'Im Web suchen: {query}',
  'tool.agent': 'Hilfsagent: {desc}',
  'tool.emptyResult': '(leer)',
};

export type MessageKey = keyof typeof DE;

const EN: Record<MessageKey, string> = {
  'window.title': '{agent} for everyone – Proof of Concept',
  'dialog.chooseFolder': 'Choose working folder',
  'greeting': 'Hello {agent}',
  'err.unexpected': 'Unexpected error: {e}',
  'err.engineStart': 'Engine could not start: {e}',
  'err.engineNotRunning': 'The engine is not running right now – please wait a moment or restart.',
  'err.saveConfig': 'Settings could not be saved ({path})',
  'err.workspaceMissing': 'Workspace not found: {repo} – check the path in {config}',
  'err.modelList': 'Model list not available: {e}',
  'err.liveSwitch': 'Live switch failed ({e}) – new session',
  'engine.starting': '{agent} engine starting in {cwd}',
  'engine.skipWarning': 'WARNING: --dangerously-skip-permissions – approvals are disabled',
  'engine.startFailed': 'Engine start failed: {e}',
  'engine.error': 'Engine error: {e}',
  'engine.interrupted': 'Interrupted by user',
  'engine.interruptFailed': 'Interrupt failed: {e}',
  'engine.deniedByUser': 'Denied by the user in the approval card.',
  'engine.sessionEnded': 'Session ended.',
  'engine.aborted': 'Aborted.',
  'engine.allowed': 'APPROVED',
  'engine.denied': 'DENIED',
  'engine.approvalAsk': 'APPROVAL? {tool}: {summary}',
  'engine.modelSwitched': 'Model switched: {model}',
  'engine.defaultModel': 'Default',
  'engine.thinking': '… thinking',
  'engine.toolRunning': '  … {tool} running for {s} s',
  'engine.readyClaude': 'Ready · Claude Code {version} · model {model} · permission mode {mode} · {n} skills',
  'engine.readyAgy': 'Ready · agy{model}',
  'engine.modelSuffix': ' · model {model}',
  'engine.done': '✓ done',
  'engine.failed': '✗ error',
  'engine.resultLine': '{status} · {s} s · {n} steps',
  'engine.costSuffix': ' · total session cost ≈ ${cost}',
  'engine.toolOk': 'Succeeded',
  'engine.toolError': 'Error',
  'agy.invalidModel': 'Invalid model name: {model}',
  'agy.notFound': 'Agy engine could not start: agy not found – is it installed and on the PATH?',
  'agy.startFailed': 'Agy engine could not start: {e}',
  'agy.exited': 'Agy process exited with code {code}',
  'agy.notRunning': 'Agy process is not running – message not sent.',
  'agy.noInterrupt': 'Interrupting is not supported by agy yet.',
  'gpts.notImplemented': 'GPTS integration is not implemented in this version yet.',
  'gpts.placeholder': 'The GPTS engine is still a placeholder.',
  'tool.write': 'Create file: {path}',
  'tool.edit': 'Edit file: {path}',
  'tool.editDetail': 'Replace:\n{old}\n\nWith:\n{new}',
  'tool.read': 'Read file: {path}',
  'tool.search': 'Search: {pattern}',
  'tool.webFetch': 'Fetch web page: {url}',
  'tool.webSearch': 'Search the web: {query}',
  'tool.agent': 'Helper agent: {desc}',
  'tool.emptyResult': '(empty)',
};

const TABLES: Record<Language, Record<MessageKey, string>> = { de: DE, en: EN };
let current: Language = 'de';

export function setLanguage(lang: Language): void {
  if (LANGUAGES.includes(lang)) current = lang;
}

export function getLanguage(): Language {
  return current;
}

/** OS language -> 'de' for any German locale, otherwise 'en'. */
export function detectLanguage(locale: string): Language {
  return locale.toLowerCase().startsWith('de') ? 'de' : 'en';
}

/** Message in the current language; {name} placeholders are filled from vars, unknown ones stay. */
export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
  const text = TABLES[current][key] ?? DE[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

/** For the key-completeness check (scratch test). */
export const _tables = TABLES;
