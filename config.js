const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const z = require('zod');
const path = require('path');
const PORT = 3001;

module.exports = {
  express,
  bodyParser,
  fs,
  z,
  path,
  PORT,
  rootDir: path.dirname(require.main.filename)
};