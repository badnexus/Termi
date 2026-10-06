// Skills of the connected workspace, read straight from its skill folders.
// Deterministic (no model call): used when the engine itself does not report its skills
// (agy, gpts). Skill name = "name:" from the SKILL.md frontmatter, else the folder name.
// Not a YAML parser — the engine's own loader stays the source of truth.
import * as fs from 'node:fs';
import * as path from 'node:path';

const SKILL_DIRS = [path.join('.claude', 'skills'), path.join('.agents', 'skills')];

function skillName(skillMd: string, folder: string): string {
  try {
    const text = fs.readFileSync(skillMd, 'utf8');
    const front = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
    const name = front?.[1].match(/^name:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
    return name ? name[1].trim() : folder;
  } catch {
    return folder;
  }
}

/** Skill names found in the workspace; [] if the workspace is missing or has none (= not connected). */
export function listWorkspaceSkills(workspaceRepo: string): string[] {
  const found = new Set<string>();
  for (const rel of SKILL_DIRS) {
    const dir = path.join(workspaceRepo, rel);
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const skillMd = path.join(dir, e.name, 'SKILL.md');
      if (fs.existsSync(skillMd)) found.add(skillName(skillMd, e.name));
    }
  }
  return [...found].sort();
}
