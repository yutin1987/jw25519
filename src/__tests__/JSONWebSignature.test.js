const JWS = require('../JSONWebSignature');
const { decode16 } = require('../codec');

const keyPair = {
  publicKey: decode16('491394e268850f85d82a8dbff0fbb31942e9eff2fa8ad2f2964e106b2e2cb316'),
  secretKey: decode16('fcaed636b35fbcf2deda7cf71ead026009afd7e3dc257df60a4c008e4d65a6b7491394e268850f85d82a8dbff0fbb31942e9eff2fa8ad2f2964e106b2e2cb316'),
};

describe('JSONWebSignature', () => {
  it('sign <=> verify', () => {
    const jws = new JWS(keyPair.secretKey);
    const signature = jws.sign({ username: 'bella', isAdmin: true });
    expect(jws.verify(signature, { maxAge: 3600 })).toEqual(
      expect.objectContaining({ isAdmin: true, username: 'bella' }),
    );
  });

  it('when key invalid', () => {
    expect(() => new JWS('XYZ')).toThrowError(new Error('Expected Uint8Array'));
  });

  describe('invalid signature', () => {
    const jws = new JWS(keyPair.secretKey);

    let signature;
    beforeAll(() => {
      signature = jws.sign({ username: 'bella', isAdmin: true });
    });

    it('when use public key', () => {
      const decoder = new JWS(keyPair.publicKey);
      expect(() => decoder.sign({ isAdmin: true })).toThrowError(
        new Error('not sign use public key'),
      );
      expect(jws.verify(signature)).toEqual(expect.objectContaining({ isAdmin: true, username: 'bella' }));
    });

    it('when verify failed', () => {
      const encoder = new JWS(
        decode16('fcaed636b35fbcf2deda7cf71ead026009afd7e3dc257df60a4c008e4d65a6b7491394e268850f85d82a8dbff0fbb31942e9eff2fa8ad2f2964e106b2e2cb121'),
      );

      const code = encoder.sign({ isAdmin: true, username: 'bella' });
      expect(() => jws.verify(code)).toThrowError(
        new Error('signature invalid'),
      );
    });

    it('when expired', () => {
      const code = jws.sign({ isAdmin: true, exp: -1 });

      expect(jws.verify(code, { ignoreExpiration: true })).toEqual(
        expect.objectContaining({ isAdmin: true }),
      );
      expect(() => jws.verify(code)).toThrowError(new Error('expired'));
    });

    it('when exp type invalid', () => {
      const code = jws.sign({ isAdmin: true, exp: true });
      expect(() => jws.verify(code)).toThrowError(new Error('invalid exp value'));
    });

    it('when over maxAge', () => {
      const code = jws.sign({ isAdmin: true, iat: 1 });
      expect(() => jws.verify(code, { maxAge: 60 * 60 })).toThrowError(new Error('maxAge exceeded'));
    });

    it('when iat type invalid', () => {
      const code = jws.sign({ isAdmin: true, iat: false });

      expect(() => jws.verify(code, { maxAge: 60 * 60 })).toThrowError(
        new Error('iat required when maxAge is specified'),
      );
    });

    it('when sub not match', () => {
      const code = jws.sign({ isAdmin: true, sub: 'refresh-token' });

      expect(() => jws.verify(code, { sub: 'access-token' })).toThrowError(
        new Error('subject not matched'),
      );
    });
  });
});
