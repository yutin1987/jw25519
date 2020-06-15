/* eslint-disable no-bitwise */
const BS16_ALPHABET = '0123456789abcdef';
const BS16 = new Uint8Array(256);
for (let i = 0; i < BS16_ALPHABET.length; i += 1) BS16[BS16_ALPHABET.charCodeAt(i)] = i;

const BS32_ALPHABET = 'ybndrfg8ejkmcpqxot1uwisza345h769';
const BS32 = new Uint8Array(256);
for (let i = 0; i < BS32_ALPHABET.length; i += 1) BS32[BS32_ALPHABET.charCodeAt(i)] = i;

function encode32(buf) {
  let str = '';
  let tmp = 0;
  let offset = 0;
  for (let i = buf.length - 1; i > -1; i -= 1) {
    tmp |= buf[i] << offset;
    offset += 8;
    while (offset >= 5) {
      str = BS32_ALPHABET.charAt(tmp & 0b11111) + str;
      tmp >>>= 5;
      offset -= 5;
    }
  }
  if (offset > 0) str = BS32_ALPHABET.charAt(tmp) + str;
  return str;
}

function decode32(str) {
  const buf = new Uint8Array(Math.floor((str.length * 5) / 8));
  let index = buf.length - 1;
  let tmp = 0;
  let offset = 0;
  for (let i = str.length - 1; i > -1; i -= 1) {
    tmp |= BS32[str.charCodeAt(i)] << offset;
    offset += 5;
    while (offset >= 8) {
      buf[index] = tmp & 0xff;
      index -= 1;
      tmp >>>= 8;
      offset -= 8;
    }
  }
  if (offset > 0) buf[index] = tmp;
  return buf;
}

function encode16(buf) {
  let str = '';
  for (let i = buf.length - 1; i > -1; i -= 1) {
    str = BS16_ALPHABET.charAt(buf[i] >>> 4) + BS16_ALPHABET.charAt(buf[i] & 0b1111) + str;
  }
  return str;
}

function decode16(str) {
  const buf = new Uint8Array(str.length / 2);
  for (let i = str.length - 2; i > -1; i -= 2) {
    buf[i / 2] = (BS16[str.charCodeAt(i)] << 4) | BS16[str.charCodeAt(i + 1)];
  }
  return buf;
}

function code16to32(b16) {
  let b32 = '';
  let tmp = 0;
  let offset = 0;
  for (let i = b16.length - 1; i > -1; i -= 1) {
    tmp |= BS16[b16.charCodeAt(i)] << offset;
    offset += 4;
    while (offset >= 5) {
      b32 = BS32_ALPHABET.charAt(tmp & 0b11111) + b32;
      tmp >>>= 5;
      offset -= 5;
    }
  }
  if (offset > 0) b32 = BS32_ALPHABET.charAt(tmp) + b32;
  return b32;
}

function code32to16(b32) {
  let b16 = '';
  let tmp = 0;
  let offset = 0;
  for (let i = b32.length - 1; i > -1; i -= 1) {
    tmp |= BS32[b32.charCodeAt(i)] << offset;
    offset += 5;
    while (offset >= 4) {
      b16 = BS16_ALPHABET.charAt(tmp & 0b1111) + b16;
      tmp >>>= 4;
      offset -= 4;
    }
  }
  if (b16.length % 2 === 1) b16 = b16.substring(1);
  return b16;
}

module.exports = {
  encode16, decode16, encode32, decode32, code16to32, code32to16,
};
