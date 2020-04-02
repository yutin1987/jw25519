const nacl = require('tweetnacl');
const JWSB = require('../JSONWebSecretBox');

describe('JSONWebSecretBox', () => {
  it('encrypt <=> decrypt', () => {
    const keyPair = nacl.box.keyPair();
    const alice = new JWSB();
    const bob = new JWSB(keyPair.secretKey);
    const ciphertext = alice.encrypt({ keypass: 'Hello World', isBox: true }, keyPair.publicKey);
    const result = bob.decrypt(ciphertext, alice.keyPair.publicKey);
    expect(result).toEqual({ keypass: 'Hello World', isBox: true });
  });

  it('when key invalid', () => {
    expect(() => new JWSB('XYZ')).toThrowError(new Error('Expected Uint8Array'));
  });

  it('when verify failed', () => {
    const alice = new JWSB();
    const bob = new JWSB();
    const ciphertext = alice.encrypt({ keypass: 'Hello World', isBox: true }, bob.keyPair.publicKey);
    expect(() => bob.decrypt(ciphertext, bob.keyPair.publicKey)).toThrowError(new Error('ciphertext invalid'));
  });
});
