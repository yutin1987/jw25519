const _ = require('lodash');
const crypto = require('crypto');
const cryptoPermission = require('../codec');

const {
  encode16, decode16, encode32, decode32,
} = cryptoPermission;

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
});

// const { construct, base58, base16 } = require('../Base');

// describe('Base', () => {
//   it('Base16 <=> Base58', () => {
//     [{
//       bytes: new Uint8Array([97]),
//       b16: '61',
//       b58: '2g',
//     }, {
//       bytes: new Uint8Array([98, 98, 98]),
//       b16: '626262',
//       b58: 'a3gV',
//     }, {
//       bytes: new Uint8Array([0, 0, 81, 107, 111, 205, 15]),
//       b16: '00516b6fcd0f',
//       b58: '11ABnLTmg',
//     }, {
//       bytes: new Uint8Array([0, 191, 79, 137, 0, 30, 103, 2, 116, 221]),
//       b16: '0bf4f89001e670274dd',
//       b58: '13SEo3LWLoPntC',
//     }, {
//       bytes: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),
//       b16: 'ffffffffffffffffffffffffff',
//       b58: 'NKioeUVktgzXLJ1B3t',
//     }, {
//       bytes: new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]),
//       b16: '48656c6c6f20576f726c64',
//       b58: 'JxF12TrwUP45BMd',
//     }].forEach(({ bytes, b16, b58 }) => {
//       expect(base58.encode(bytes)).toBe(b58);
//       expect(base58.decode(b58)).toEqual(bytes);
//       expect(base16.encode(bytes)).toBe(b16);
//       expect(base16.decode(b16)).toEqual(bytes);
//     });
//   });

//   it('String <=> base2', () => {
//     const base2 = construct('12');
//     const source = new Uint8Array([10, 20]);
//     const string = '212111121211';
//     expect(base2.encode(source)).toBe(string);
//     expect(base2.decode(string)).toEqual(source);
//   });

//   it('successfully decode when is empty string', () => {
//     const arrayBuffer = base16.decode('');
//     expect(base58.encode(arrayBuffer)).toBe('');
//   });

//   it('successfully encode when pre-value is zero', () => {
//     expect(base58.encode(new Uint8Array([0, 0, 10]))).toBe('11B');
//     expect(base58.decode('11B')).toEqual(new Uint8Array([0, 0, 10]));
//   });

//   it('successfully decode when leading whitespace', () => {
//     expect(base58.decode(' 222222')).toEqual(new Uint8Array([39, 206, 234, 55]));
//   });

//   it('successfully decode when trailing whitespace', () => {
//     expect(base58.decode('222222 ')).toEqual(new Uint8Array([39, 206, 234, 55]));
//   });

//   it('when encode value is not array of 8-bit unsigned', () => {
//     expect(() => base58.encode('xyz')).toThrow(new TypeError('Expected Uint8Array'));
//   });

//   it('non-base58 string', () => {
//     expect(() => base58.decode({})).toThrow(new TypeError('Expected String'));
//   });

//   it('non-base58 string', () => {
//     expect(() => base58.decode('####')).toThrow(new TypeError('Excluded carry'));
//   });

//   it('non-base58 alphabet', () => {
//     expect(() => base58.decode('c2F0b3NoaQo=')).toThrow(new TypeError('Excluded carry'));
//   });

//   it('when characters is ambiguous', () => {
//     expect(() => construct('123123')).toThrow(new TypeError('1 is ambiguous'));
//   });

//   describe('pads', () => {
//     it('successfully padding', () => {
//       expect(base58.pads('3SEo3LWLoPntC', 16)).toBe('1113SEo3LWLoPntC');
//       expect(base58.pads('3SEo3LWLoPntC', 8)).toBe('LWLoPntC');
//       expect(base58.pads(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111]), 12)).toEqual(
//         new Uint8Array([0, 0, 0, 0, 72, 101, 108, 108, 111, 32, 87, 111]),
//       );
//       expect(base58.pads(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111]), 4)).toEqual(
//         new Uint8Array([111, 32, 87, 111]),
//       );
//     });

//     it('when value is not string or array of 8-bit unsigned', () => {
//       expect(() => base58.pads(false, 16)).toThrowError(new TypeError('Expected String or Uint8Array'));
//     });
//   });
// });
