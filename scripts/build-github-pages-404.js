const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const target = resolveApp('dist/index.html');
const html404 = resolveApp('dist/404.html');

if (! fs.existsSync(target)) {
  throw new Error('The file "dist/index.html" not found.');
}

const htmlContent = fs.readFileSync(target);

fs.writeFileSync(html404, htmlContent);
