const nacl = require('tweetnacl');
const { encode32, decode32 } = require('./codec');

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
    const nonce = nacl.randomBytes(nonceLength);
    const ciphertext = nacl.box(payload, nonce, publicKey, keyPair.secretKey);
    const box = new Uint8Array(nonce.length + ciphertext.length);
    box.set(nonce);
    box.set(ciphertext, nonce.length);

    return encode32(box);
  };

  this.decrypt = (box, publicKey) => {
    const bytes = decode32(box);
    const nonce = bytes.slice(0, nonceLength);
    const ciphertext = bytes.slice(nonceLength, bytes.length);
    const output = nacl.box.open(ciphertext, nonce, publicKey, keyPair.secretKey);
    if (output === null) throw new Error('ciphertext invalid');
    return output;
  };
};
