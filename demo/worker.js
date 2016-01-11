'use strict';

const express = require('express');
const hook = require('css-modules-require-hook');
const path = require('path');

const config = require('./package').config;
const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => res.render('page'));

app.listen(config.port, _ => console.log(`listening ${config.port}`));
