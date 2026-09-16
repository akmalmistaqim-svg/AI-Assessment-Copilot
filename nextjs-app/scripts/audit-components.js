const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(path.join(process.cwd(), 'src'));
let serverCount = 0;
let clientCount = 0;
const details = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Look for "use client" or 'use client' at the beginning of file or before any imports
  const lines = content.split('\n');
  let isClient = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    if (/^['"]use client['"]/.test(trimmed)) {
      isClient = true;
    }
    break;
  }
  if (isClient) clientCount++;
  else serverCount++;
  details.push({ file: path.relative(process.cwd(), f).replace(/\\/g, '/'), type: isClient ? 'Client' : 'Server' });
});

console.log('=== AUDIT RESULTS ===');
console.log('Total files:', files.length);
console.log('Server Components:', serverCount);
console.log('Client Components:', clientCount);
const ratio = (serverCount / files.length) * 100;
console.log('Server Ratio:', ratio.toFixed(2) + '%');
console.log('\n--- Component Breakdown ---');
details.forEach(d => {
  console.log(`[${d.type.padEnd(6)}] ${d.file}`);
});
