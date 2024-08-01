const fs = require('fs');

settingsPath = './settings.json';
var parsed = JSON.parse(fs.readFileSync(settingsPath, 'UTF-8'));

exports.value = parsed;
