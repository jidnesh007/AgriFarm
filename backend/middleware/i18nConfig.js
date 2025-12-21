const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'hi', 'mr', 'bn', 'te', 'ta'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  header: 'accept-language',
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  cookie: 'language',
});

module.exports = i18n;
