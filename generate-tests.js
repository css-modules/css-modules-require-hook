import { existsSync, readdirSync, writeFile } from 'fs';
import { join, resolve, sep } from 'path';
import { toArray } from 'lodash';

const destination = resolve('test/common-test-cases.js');
const cases = ['test-cases', 'cssi'];

function resolveTo() {
  const args = toArray(arguments);
  return resolve(join.apply(null, ['test'].concat(args)));
}

let content =
`import { equal } from 'assert';\n`+
`import { readFileSync } from 'fs';\n`+
`import { resolve } from 'path';\n`+
`import { extend } from 'lodash';\n`+
`import FileSystemLoader from 'css-modules-loader-core/lib/file-system-loader';\n`+
`import hook from '../src';\n`+
`\n`+
`const normalize = str => str.replace(/\\r\\n?/g, '\\n');\n`+
`const pipelines = {\n`+
`  'test-cases': undefined,\n`+
`  'cssi': [],\n`+
`};\n`+
`\n`+
`let expectedCSS;\n`+
`let expectedTokens;\n`+
`\n`+
`describe('common-test-cases', () => {\n`;

cases.forEach(dirname => {
  content +=
  `\n`+
  `  describe('${dirname}', () => {\n`;

  readdirSync(resolveTo(dirname)).forEach(testCase => {
    if (existsSync(resolveTo(dirname, testCase, 'source.css'))) {

      content +=
      `\n`+
      `    describe('${testCase.replace(/-/g, ' ')}', () => {\n`+
      `      before(() => {\n`+
      `        expectedCSS = normalize(readFileSync(resolve('test${sep + dirname + sep + testCase + sep}expected.css'), 'utf8'));\n`+
      `        expectedTokens = JSON.parse(readFileSync(resolve('test${sep + dirname + sep + testCase + sep}expected.json'), 'utf8'));\n`+
      `        hook({rootDir: resolve('test${sep + dirname}'), use: pipelines['${dirname}']});\n`+
      `      });\n`+
      `\n`+
      `      it('loader-core', done => {\n`+
      `        const loader = new FileSystemLoader(resolve('test${sep + dirname}'), pipelines['${dirname}']);\n`+
      `\n`+
      `        loader.fetch('${testCase + sep}source.css', '/')\n`+
      `          .then(tokens => {\n`+
      `            equal(loader.finalSource, expectedCSS);\n`+
      `            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));\n`+
      `          })\n`+
      `          .then(done, done);\n`+
      `      });\n`+
      `\n`+
      `      it('require-hook', () => {\n`+
      `        const tokens = require(resolve('test${sep + dirname + sep + testCase + sep}source.css'));\n`+
      `        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));\n`+
      `      });\n`+
      `    });\n`;

    } else {

      content +=
      `\n`+
      `    describe('${testCase.replace(/-/g, ' ')}', () => {\n`+
      `      before(() => {\n`+
      `        expectedCSS = normalize(readFileSync(resolve('test${sep + dirname + sep + testCase + sep}expected.css'), 'utf8'));\n`+
      `        expectedTokens = JSON.parse(readFileSync(resolve('test${sep + dirname + sep + testCase + sep}expected.json'), 'utf8'));\n`+
      `        hook({rootDir: resolve('test${sep + dirname}'), use: pipelines['${dirname}']});\n`+
      `      });\n`+
      `\n`+
      `      it('loader-core', done => {\n`+
      `        const loader = new FileSystemLoader(resolve('test${sep + dirname}'), pipelines['${dirname}']);\n`+
      `\n`+
      `        loader.fetch('${testCase + sep}source1.css', '/').then(tokens1 => {\n`+
      `          loader.fetch('${testCase + sep}source2.css', '/').then(tokens2 => {\n`+
      `            equal(loader.finalSource, expectedCSS);\n`+
      `            const tokens = extend({}, tokens1, tokens2);\n`+
      `            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));\n`+
      `          }).then(done, done);\n`+
      `        }).catch(done);\n`+
      `      });\n`+
      `\n`+
      `      it('require-hook', () => {\n`+
      `        const tokens = extend({},\n`+
      `          require(resolve('test${sep + dirname + sep + testCase + sep}source1.css')),\n`+
      `          require(resolve('test${sep + dirname + sep + testCase + sep}source2.css'))\n`+
      `        );\n`+
      `\n`+
      `        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));\n`+
      `      });\n`+
      `    });\n`;

    }
  });

  content +=
  `\n`+
  `  });\n`;
});

content +=
`\n`+
`});\n`;

writeFile(destination, content, 'utf8', err => {
  if (err) {
    throw err;
  }
});
