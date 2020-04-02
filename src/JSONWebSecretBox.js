const nacl = require('tweetnacl');
const { base58 } = require('./Base');
const { str2ua, ua2str } = require('./TextArray');

function keyPairFromArray(secretKey) {
  if (secretKey === undefined) return nacl.box.keyPair();

  if ((Array.isArray(secretKey) || secretKey instanceof Uint8Array) === false) {
    throw new TypeError('Expected Uint8Array');
  }

  return nacl.box.keyPair.fromSecretKey(new Uint8Array(secretKey));
}

module.exports = function JSONWebSecretBox(secretKey) {
  const keyPair = keyPairFromArray(secretKey);

  const nonceLength = 24;

  this.keyPair = keyPair;

  this.encrypt = (payload, publicKey) => {
    const input = JSON.stringify(payload);
    const nonce = nacl.randomBytes(nonceLength);
    const ciphertext = nacl.box(str2ua(input), nonce, publicKey, keyPair.secretKey);
    const box = new Uint8Array(nonce.length + ciphertext.length);
    box.set(nonce);
    box.set(ciphertext, nonce.length);

    return base58.encode(box);
  };

  this.decrypt = (box, publicKey) => {
    const bytes = base58.decode(box);
    const nonce = bytes.slice(0, nonceLength);
    const ciphertext = bytes.slice(nonceLength, bytes.length);
    const output = nacl.box.open(ciphertext, nonce, publicKey, keyPair.secretKey);
    if (output === null) throw new Error('ciphertext invalid');
    return JSON.parse(ua2str(output));
  };
};
