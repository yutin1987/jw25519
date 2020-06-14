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
  if (tmp > 0) str = BS32_ALPHABET.charAt(tmp) + str;
  str = BS32_ALPHABET[0].repeat(Math.ceil((buf.length * 8) / 5) - str.length) + str;
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
  if (index > -1) buf[index] = tmp;
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
  const { length } = str;
  for (let i = 0; i < length; i += 2) {
    buf[i / 2] = (BS16[str.charCodeAt(i)] << 4) | BS16[str.charCodeAt(i + 1)];
  }
  return buf;
}

module.exports = {
  encode16, decode16, encode32, decode32,
};
