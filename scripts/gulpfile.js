'use strict';

const babel = require('gulp-babel');
const debug = require('gulp-debug');
const gulp = require('gulp');

gulp.task('transpile', () =>
  gulp.src('src/*.js')
    .pipe(babel({
      presets: [
        [
          'env',
          {
            loose: true,
            modules: 'commonjs',
            targets: {
              node: 4,
            },
          },
        ],
      ],
    }))
    .pipe(debug({title: 'transpiled'}))
    .pipe(gulp.dest('lib')));
