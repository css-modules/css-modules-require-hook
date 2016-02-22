'use strict';

const express = require('express');
const hook = require('css-modules-require-hook');
const path = require('path');
const viewEngine = require('./view-engine');

const config = require('../package').config;
const app = express();

hook({
  generateScopedName: config.css,
});

// setting rendering engine
app.engine('js', viewEngine);
app.set('views', path.join(__dirname, '../components'));
app.set('view engine', 'js');

app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (req, res) => res.render('Page'));

app.listen(config.port, _ => console.log(`listening ${config.port}`));
