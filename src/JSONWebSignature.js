const nacl = require('tweetnacl');
const { base58 } = require('./Base');
const { convertStringToUintArray: str2ua, convertUintArrayToString: ua2str } = require('./TextArray');

function keyPairFromArray(secretKey) {
  if ((Array.isArray(secretKey) || secretKey instanceof Uint8Array) === false) {
    throw new TypeError('Expected Uint8Array');
  }
  if (secretKey.length === 64) {
    return nacl.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));
  }
  return { publicKey: new Uint8Array(secretKey) };
}

module.exports = function JSONWebSignature(secretKey) {
  const keyPair = keyPairFromArray(secretKey);

  this.keyPair = keyPair;

  this.sign = (payload) => {
    if (keyPair.secretKey === undefined) throw new Error('not sign use public key');
    const iat = Math.floor(Date.now() / 1000);
    const input = JSON.stringify({ exp: iat + 3600, iat, ...payload });
    const signature = nacl.sign(str2ua(input), keyPair.secretKey);
    return base58.encode(signature);
  };

  this.verify = (signature, options = {}) => {
    const output = nacl.sign.open(base58.decode(signature), keyPair.publicKey);
    if (output === null) throw new Error('signature invalid');
    const payload = JSON.parse(ua2str(output));

    const now = Math.floor(Date.now() / 1000);

    if (!options.ignoreExpiration) {
      if (typeof payload.exp !== 'number') throw new Error('invalid exp value');
      if (now >= payload.exp) throw new Error('expired');
    }

    if (options.maxAge) {
      if (typeof payload.iat !== 'number') {
        throw new Error('iat required when maxAge is specified');
      }
      if (now >= payload.iat + options.maxAge) {
        throw new Error('maxAge exceeded');
      }
    }

    if (options.sub && options.sub !== payload.sub) {
      throw new Error('subject not matched');
    }

    return payload;
  };
};
