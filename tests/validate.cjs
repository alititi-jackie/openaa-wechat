const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const project = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
const codeFiles = ['app.js', 'config.js', 'utils/api.js', 'utils/web-publish.js'];

for (const page of project.pages) {
  for (const ext of ['js', 'json', 'wxml', 'wxss']) {
    const pathname = path.join(root, `${page}.${ext}`);
    if (!fs.existsSync(pathname)) throw new Error(`Missing registered page asset: ${pathname}`);
    if (ext === 'json') JSON.parse(fs.readFileSync(pathname, 'utf8'));
    if (ext === 'js') codeFiles.push(`${page}.${ext}`);
  }
}

for (const file of codeFiles) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}

// Legacy classified-information tests remain in history but no longer describe this product.
const testFiles = ['dmv-smoke.cjs'];
for (const file of testFiles) {
  execFileSync(process.execPath, [path.join(__dirname, file)], { stdio: 'inherit' });
}

console.log(`Validation passed: ${codeFiles.length} JavaScript files, ${testFiles.length} test suites (wx mocked).`);
