'use strict';

import './guard';
import fs from 'fs';
import hook from './hook';
import postcss from 'postcss';

import extractImports from 'postcss-modules-extract-imports';
import localByDefault from 'postcss-modules-local-by-default';
import scope from 'postcss-modules-scope';

let plugins = [localByDefault, extractImports, scope];

hook(filename => postcss(plugins).process(fs.readFileSync(filename, 'utf8')).css);

/**
 * @param  {object} opts
 * @param  {array}  opts.u
 * @param  {array}  opts.use
 */
export default function configure(opts) {}
