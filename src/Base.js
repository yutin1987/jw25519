function num(value) {
  // eslint-disable-next-line no-bitwise
  return value >>> 0;
}

function construct(ALPHABET) {
  const BASE_MAP = new Uint8Array(256);
  for (let j = 0; j < BASE_MAP.length; j += 1) BASE_MAP[j] = 255;
  for (let i = 0; i < ALPHABET.length; i += 1) {
    const x = ALPHABET.charAt(i);
    const xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) { throw new TypeError(`${x} is ambiguous`); }
    BASE_MAP[xc] = i;
  }

  const BASE = ALPHABET.length;
  const LEADER = ALPHABET.charAt(0);
  const FACTOR = Math.log(BASE) / Math.log(256);
  const iFACTOR = Math.log(256) / Math.log(BASE);

  function encode(payload) {
    if ((Array.isArray(payload) || payload instanceof Uint8Array) === false) {
      throw new TypeError('Expected Uint8Array');
    }

    const source = Uint8Array.from(payload);

    if (source.length === 0) return '';

    let length = 0;
    let pbegin = 0;
    const pend = source.length;
    let skip = 0;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin += 1;
      skip += 1;
    }

    const size = num((pend - pbegin) * iFACTOR + 1);
    const b256 = new Uint8Array(size);
    while (pbegin !== pend) {
      let carry = source[pbegin];

      let i = 0;
      for (let it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1 -= 1, i += 1) {
        carry += num(256 * b256[it1]);
        b256[it1] = num(carry % BASE);
        carry = num(carry / BASE);
      }
      length = i;
      pbegin += 1;
    }

    let offset = size - length;
    let str = LEADER.repeat(skip);
    for (; offset < size; offset += 1) str += ALPHABET.charAt(b256[offset]);
    return str;
  }

  function decode(payload) {
    if (typeof payload !== 'string') {
      throw new TypeError('Expected String');
    }

    if (payload.length === 0) return new Uint8Array();

    const source = payload.trim();

    let skip = 0;
    while (source[skip] === LEADER) skip += 1;

    let length = 0;
    const size = num(((source.length - skip) * FACTOR) + 1);
    const b256 = new Uint8Array(size);
    for (let idx = skip; source[idx]; idx += 1) {
      let carry = BASE_MAP[source.charCodeAt(idx)];
      if (carry === 255 || carry === undefined) {
        throw new Error('Excluded carry');
      }
      let i = 0;
      for (let it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3 -= 1, i += 1) {
        carry += num(BASE * b256[it3]);
        b256[it3] = num(carry % 256);
        carry = num(carry / 256);
      }
      length = i;
    }

    let offset = size - length;
    const result = new Uint8Array(skip + (size - offset));
    for (let idx = skip; offset !== size; idx += 1, offset += 1) result[idx] = b256[offset];
    return result;
  }

  function pads(value, fixed) {
    if (typeof value === 'string') {
      if (fixed > value.length) {
        return LEADER.repeat(fixed - value.length) + value;
      }

      return value.substring(value.length - fixed);
    }

    if (Array.isArray(value) || value instanceof Uint8Array) {
      const result = new Uint8Array(fixed);
      let vIdx = value.length;
      let rIdx = result.length;
      while (rIdx !== -1 && vIdx !== -1) {
        vIdx -= 1;
        rIdx -= 1;
        result[rIdx] = value[vIdx];
      }
      return result;
    }

    throw new TypeError('Expected String or Uint8Array');
  }

  return { encode, decode, pads };
}

module.exports = {
  construct,
  base58: construct('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
  base16: construct('0123456789abcdef'),
};
