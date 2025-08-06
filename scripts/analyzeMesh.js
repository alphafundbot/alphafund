const fs = require('fs');
const path = require('path');

const directoriesToScan = ['./src', './functions', './scripts']; // Add directories to scan

function findMarkers(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const markers = {
    todos: [],
    fixmes: [],
    consoles: [],
  };

  const todoRegex = /\/\/\s