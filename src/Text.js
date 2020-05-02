/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

function convertASCIIToString(bytes) {
  const chars = [];
  const { length } = bytes;
  let i = 0;
  while (i < length) {
    const code = bytes[i++];
    if ((code & 0x80) === 0) chars.push(code);
    else if ((code & 0xE0) === 0xC0) {
      chars.push(((code & 0x1F) << 6) | (bytes[i++] & 0x3F));
    } else if ((code & 0xF0) === 0xE0) {
      chars.push(((code & 0x0F) << 12) | ((bytes[i++] & 0x3F) << 6) | (bytes[i++] & 0x3F));
    } else {
      chars.push(
        ((code & 0x07) << 18)
        | ((bytes[i++] & 0x3F) << 12)
        | ((bytes[i++] & 0x3F) << 6)
        | (bytes[i++] & 0x3F),
      );
    }
  }
  return String.fromCodePoint.apply(null, chars);
}

function convertStringToASCII(string) {
  const bytes = [];
  const { length } = string;
  let i = 0;
  while (i < length) {
    const code = string.codePointAt(i++);
    if ((code & 0x7F) === code) bytes.push(code);
    else if ((code & 0x7FF) === code) {
      bytes.push(((code >> 6) & 0x1F) | 0xC0);
      bytes.push((code & 0x3F) | 0x80);
    } else if ((code & 0xFFFF) === code) {
      bytes.push(((code >> 12) & 0x0F) | 0xE0);
      bytes.push(((code >> 6) & 0x3F) | 0x80);
      bytes.push((code & 0x3F) | 0x80);
    } else {
      bytes.push(((code >> 18) & 0x07) | 0xF0);
      bytes.push(((code >> 12) & 0x3F) | 0x80);
      bytes.push(((code >> 6) & 0x3F) | 0x80);
      bytes.push((code & 0x3F) | 0x80);
      i += 1;
    }
  }
  return new Uint8Array(bytes);
}

function convertUnicodeToString(bytes) {
  const { length } = bytes;
  const buffer = new Uint16Array(length / 2);
  let i = 0;
  while (i < length) buffer[i / 2] = bytes[i++] | (bytes[i++] << 8);
  return String.fromCharCode.apply(null, buffer);
}

function convertStringToUnicode(string) {
  const { length } = string;
  const bytes = new Uint16Array(string.length);
  let i = 0;
  while (i < length) bytes[i] = string.charCodeAt(i++);
  return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

module.exports = {
  convertASCIIToString,
  convertStringToASCII,
  convertUnicodeToString,
  convertStringToUnicode,
};
