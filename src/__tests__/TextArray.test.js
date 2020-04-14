const {
  convertUintArrayToString,
  convertStringToUintArray,
  convertStringToUTF16,
  convertUTF16ToString,
} = require('../TextArray');

describe('String <=> Uint8Array', () => {
  it('exchange', () => {
    const string = 'Hello world 中文字𠮷';
    expect(convertStringToUintArray(string)).toEqual(new Uint8Array(Buffer.from(string)));
    expect(convertUintArrayToString(convertStringToUintArray(string))).toBe(string);
  });

  it('Basic Multilingual Plane (BMP)', () => {
    for (let index = 0; index <= 0xD7FF; index += 13) {
      const string = String.fromCharCode(index);
      expect(convertStringToUintArray(string)).toEqual(new Uint8Array(Buffer.from(string)));
      expect(convertUintArrayToString(convertStringToUintArray(string))).toBe(string);
    }
    for (let index = 0xE000; index < 0xFFFF; index += 13) {
      const string = String.fromCharCode(index);
      expect(convertStringToUintArray(string)).toEqual(new Uint8Array(Buffer.from(string)));
      expect(convertUintArrayToString(convertStringToUintArray(string))).toBe(string);
    }
  });

  it('with Supplementary Planes', () => {
    for (let index = 0x10000; index <= 0x10FFFF; index += 23) {
      const string = String.fromCodePoint(index);
      expect(convertStringToUintArray(string)).toEqual(new Uint8Array(Buffer.from(string)));
      expect(convertUintArrayToString(convertStringToUintArray(string))).toBe(string);
    }
  });
});

describe('String <=> Uint16Array', () => {
  it('exchange', () => {
    const string = 'Hello world 中文字𠮷';
    expect(convertStringToUTF16(string)).not.toEqual(new Uint8Array(Buffer.from(string)));
    expect(convertUTF16ToString(convertStringToUTF16(string))).toBe(string);
  });
});
