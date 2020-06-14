const codec = require('./codec');
const Text = require('./Text');
const JSONWebSignature = require('./JSONWebSignature');
const JSONWebSecretBox = require('./JSONWebSecretBox');

module.exports = {
  codec,
  ...codec,
  Text,
  ...Text,
  JSONWebSignature,
  JSONWebSecretBox,
};
