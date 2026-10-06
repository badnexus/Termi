// After `npm run dist`: write release/RELEASE-INFO.txt with name, size and SHA-256 of each built .exe,
// so IT can whitelist exactly this file (see ../IT-Anfrage_Electron_Quarantaene.md).
// Usage: node scripts/release-info.js [release-dir]
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const dir = path.resolve(process.argv[2] || path.join(root, 'release'));
const pkg = require(path.join(root, 'package.json'));
let electronVersion = '?';
try {
  electronVersion = require(path.join(root, 'node_modules', 'electron', 'package.json')).version;
} catch {
  // not installed – leave '?'
}

const exes = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.exe')) : [];
if (!exes.length) {
  console.error(`Keine .exe in ${dir} gefunden.`);
  process.exit(1);
}

const lines = [
  `${pkg.productName || pkg.name} ${pkg.version} – Release-Informationen für die IT-Freigabe`,
  `Erstellt: ${new Date().toISOString()}`,
  `Electron: ${electronVersion} · nicht signiert`,
  '',
];
for (const name of exes) {
  const file = path.join(dir, name);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
  lines.push(`Datei:   ${name}`, `Größe:   ${fs.statSync(file).size} Bytes`, `SHA-256: ${hash}`, '');
}
const text = lines.join('\n');
fs.writeFileSync(path.join(dir, 'RELEASE-INFO.txt'), text, 'utf8');
console.log(text);
