import assert from 'assert';
import fs from 'fs';
import path from 'path';
import FileSystemLoader from 'css-modules-loader-core/lib/file-system-loader';

const normalize = str => {
  return str.replace(/\r\n?/g, '\n');
};

const pipelines = {
  'test-cases': undefined,
  'cssi': [],
};

describe('css-modules-loader-core', () => {
  Object.keys( pipelines ).forEach( dirname => {
    describe( dirname, () => {
      const testDir = path.join(__dirname, dirname);

      fs.readdirSync(testDir).forEach(testCase => {
        if (fs.existsSync(path.join(testDir, testCase, 'source.css'))) {
          it( 'should ' + testCase.replace( /-/g, ' ' ), done => {
            const expected = normalize(fs.readFileSync(path.join(testDir, testCase, 'expected.css'), 'utf-8'));
            const loader = new FileSystemLoader(testDir, pipelines[dirname]);
            const expectedTokens = JSON.parse(fs.readFileSync(path.join(testDir, testCase, 'expected.json'), 'utf-8'));

            loader.fetch(`${testCase}/source.css`, '/').then(tokens => {
              assert.equal(loader.finalSource, expected);
              assert.equal(JSON.stringify( tokens ), JSON.stringify(expectedTokens));
            }).then(done, done);
          });
        }
      });
    });
  });

  // special case for testing multiple sources
  describe( 'multiple sources', () => {
    const testDir = path.join(__dirname, 'test-cases');
    const testCase = 'multiple-sources';
    const dirname = 'test-cases';

    if ( fs.existsSync( path.join( testDir, testCase, 'source1.css' ) ) ) {
      it( 'should ' + testCase.replace( /-/g, ' ' ), done => {
        const expected = normalize(fs.readFileSync(path.join(testDir, testCase, 'expected.css'), 'utf-8'));
        const loader = new FileSystemLoader(testDir, pipelines[dirname]);
        const expectedTokens = JSON.parse(fs.readFileSync(path.join(testDir, testCase, 'expected.json'), 'utf-8'));

        loader.fetch(`${testCase}/source1.css`, '/').then(tokens1 => {
          loader.fetch(`${testCase}/source2.css`, '/').then(tokens2 => {
            assert.equal(loader.finalSource, expected);
            const tokens = Object.assign({}, tokens1, tokens2);
            assert.equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          }).then(done, done);
        });
      });
    }
  });
});
