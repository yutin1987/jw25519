const _ = require('lodash');
const crypto = require('crypto');
const codec = require('../codec');

const {
  encode16, decode16, encode32, decode32, code16to32, code32to16,
} = codec;

describe('cryptoPermission', () => {
  it('encode32 & decode32', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const buffer = crypto.randomBytes(_.random(4, 32));
      expect(decode32(encode32(buffer))).toEqual(new Uint8Array(buffer));
    }
  });

  it('encode32', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const buffer = crypto.randomBytes(20);
      expect(encode32(buffer).length === 32).toBe(true);
    }
  });

  it('encode32 with zero', () => {
    expect(encode32(new Uint8Array([0, 0, 0, 0]))).toBe('yyyyyyy');
    expect(decode32('yyyyyyy')).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  it('encode32 empty string', () => {
    expect(encode32(new Uint8Array([]))).toBe('');
    expect(decode32('')).toEqual(new Uint8Array([]));
  });

  it('non-base32 string', () => {
    expect(decode32('#######')).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  it('encode16 & decode16', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const buffer = crypto.randomBytes(_.random(4, 32));
      expect(decode16(encode16(buffer))).toEqual(new Uint8Array(buffer));
    }
  });

  it('encode16', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const buffer = crypto.randomBytes(_.random(4, 32));
      expect(encode16(buffer)).toBe(buffer.toString('hex'));
    }
  });

  it('decode16', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const buffer = crypto.randomBytes(_.random(4, 32));
      expect(decode16(buffer.toString('hex'))).toEqual(new Uint8Array(buffer));
    }
  });

  it('code16 <=> code32', () => {
    expect.assertions(10000);
    for (let idx = 0; idx < 10000; idx += 1) {
      const str = crypto.randomBytes(_.random(4, 32)).toString('hex');
      expect(code32to16(code16to32(str))).toEqual(str);
    }
  });
});
