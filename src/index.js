const Base = require('./Base');
const Text = require('./Text');
const JSONWebSignature = require('./JSONWebSignature');
const JSONWebSecretBox = require('./JSONWebSecretBox');

module.exports = {
  Base,
  ...Base,
  Text,
  ...Text,
  JSONWebSignature,
  JSONWebSecretBox,
};
