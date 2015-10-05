import { noop } from 'lodash';
import { equal, ok } from 'assert';
import { dropCache, spy, Through } from '../utils/sugar';
import hook from '../src';

describe('public api', () => {
  afterEach(() => dropCache('awesome-theme/oceanic.css'));

  describe('extending list of plugins', () => {
    describe('"prepend" should add plugins in the beginning of the pipeline', () => {
      let processor;

      beforeEach(() => {
        processor = spy(noop);

        hook({
          prepend: [
            new Through({processor: processor}),
          ],
        });

        require('awesome-theme/oceanic.css');
      });

      it('processor should be called', () =>
        ok(processor.called));
    });

    describe('"append" should add plugins to the pipeline', () => {
      let processor;

      beforeEach(() => {
        processor = spy(noop);

        hook({
          append: [
            new Through({processor: processor}),
          ],
        });

        require('awesome-theme/oceanic.css');
      });

      it('processor should be called', () =>
        ok(processor.called));
    });

    describe('"use" should set the new list of plugins', () => {
      let appendProcessor;
      let prependProcessor;
      let useProcessor;

      beforeEach(() => {
        appendProcessor = spy(noop);
        prependProcessor = spy(noop);
        useProcessor = spy(noop);

        hook({
          append: [
            new Through({processor: appendProcessor}),
          ],
          prepend: [
            new Through({processor: prependProcessor}),
          ],
          use: [
            new Through({processor: useProcessor}),
          ],
        });

        require('awesome-theme/oceanic.css');
      });

      it('plugin added by append option should not be called', () =>
        ok(!appendProcessor.called));

      it('plugin added by prepend option should not be called', () =>
        ok(!prependProcessor.called));

      it('plugin added by use option should be called', () =>
        ok(useProcessor.called));
    });
  });

  describe('setting custom processors for the CSS', () => {
    describe('"preprocessCss()" should transform CSS before the PostCSS', () => {
      let processor;
      let providedFilename;
      let providedContent;

      beforeEach(() => {
        processor = spy((content, filename) => {
          providedFilename = filename;
          providedContent = content;
          return '';
        });

        hook({preprocessCss: processor});
        require('awesome-theme/oceanic.css');
      });

      it('processor should be called', () =>
        ok(processor.called));

      it('filename should be provided', () =>
        equal(providedFilename, require.resolve('awesome-theme/oceanic.css')));

      it('content of the file should be provided', () =>
        ok(providedContent.length));
    });

    describe('"processCss()" should transform CSS after the PostCSS', () => {
      let processor;
      let providedFilename;
      let providedContent;

      beforeEach(() => {
        processor = spy((content, filename) => {
          providedFilename = filename;
          providedContent = content;
          return '';
        });

        hook({processCss: processor});
        require('awesome-theme/oceanic.css');
      });

      it('processor should be called', () =>
        ok(processor.called));

      it('filename should be provided', () =>
        equal(providedFilename, require.resolve('awesome-theme/oceanic.css')));

      it('content of the file should be provided', () =>
        ok(providedContent.length));
    });
  });
});
