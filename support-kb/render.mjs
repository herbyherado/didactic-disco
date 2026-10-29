// Turns a prerendered kb page into one standalone HTML file: styles inlined, no scripts.
// node render.mjs <route> <out.html>   e.g. kb/incidents/4471-split
import fs from 'node:fs';
import path from 'node:path';
const [route, out] = process.argv.slice(2);
const file = `build/${route}.html`;
let html = fs.readFileSync(file, 'utf8');
html = html.replace(/<link\b[^>]*>/g, (tag) => {
  if (!/rel="stylesheet"/.test(tag)) return '';
  const href = tag.match(/href="([^"]+)"/)[1];
  return `<style>${fs.readFileSync(path.join(path.dirname(file), href), 'utf8')}</style>`;
});
html = html.replace(/<script[\s\S]*?<\/script>/g, '');
fs.writeFileSync(out, html);
