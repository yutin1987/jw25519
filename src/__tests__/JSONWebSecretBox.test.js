const nacl = require('tweetnacl');
const JWSB = require('../JSONWebSecretBox');
const { convertStringToUTF16, convertUTF16ToString } = require('../TextArray');

describe('JSONWebSecretBox', () => {
  it('encrypt <=> decrypt', () => {
    const keyPair = nacl.box.keyPair();
    const alice = new JWSB();
    const bob = new JWSB(keyPair.secretKey);
    const ciphertext = alice.encrypt(
      convertStringToUTF16(JSON.stringify({ keypass: 'Hello World', isBox: true })),
      keyPair.publicKey,
    );
    const result = bob.decrypt(ciphertext, alice.keyPair.publicKey);
    expect(JSON.parse(convertUTF16ToString(result))).toEqual({ keypass: 'Hello World', isBox: true });
  });

  it('when key invalid', () => {
    expect(() => new JWSB('XYZ')).toThrowError(new Error('Expected Uint8Array'));
  });

  it('when verify failed', () => {
    const alice = new JWSB();
    const bob = new JWSB();
    const ciphertext = alice.encrypt(convertStringToUTF16('Hello World'), bob.keyPair.publicKey);
    expect(() => bob.decrypt(ciphertext, bob.keyPair.publicKey)).toThrowError(new Error('ciphertext invalid'));
  });
});
