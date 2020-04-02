function ua2str(array) {
  return String.fromCharCode.apply(null, new Uint16Array(array));
}

function str2ua(string) {
  const array = new Uint8Array(string.length);
  for (let i = string.length - 1; i !== -1; i -= 1) {
    const code = string.charCodeAt(i);
    if (code > 255) throw new Error('Expected char code between 0 to 255');
    array[i] = code;
  }
  return array;
}

module.exports = { ua2str, str2ua };
