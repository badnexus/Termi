// Projekte list for the sidebar: read straight from the CaptAIn project-map/ folder.
// Deterministic (no model call): slug = file name, description = first comment line,
// Project base URL via a small regex. Not a YAML parser — the project map's own
// loader stays the source of truth for the engine.
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ProjectEntry {
  slug: string;
  name: string;
  description: string;
  projectUrl?: string;
}

const SKIP = new Set(['_shared.yaml', 'example-project.yaml']);

export function listProjects(workspaceRepo: string): ProjectEntry[] {
  const dir = path.join(workspaceRepo, 'project-map');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') && !SKIP.has(f));
  } catch {
    return [];
  }
  return files.sort().map((file) => {
    const slug = file.replace(/\.yaml$/, '');
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    const firstComment = text.split(/\r?\n/).find((l) => l.startsWith('#'));
    const description = firstComment
      ? firstComment.replace(/^#\s*/, '').replace(/^Project-map entry for\s*/i, '').replace(/\.$/, '')
      : '';
    const urlMatch = text.match(/base_url:\s*"?([^"\s]+)"?/);
    return {
      slug,
      name: slug.toUpperCase(),
      description,
      projectUrl: urlMatch ? urlMatch[1] : undefined,
    };
  });
}
