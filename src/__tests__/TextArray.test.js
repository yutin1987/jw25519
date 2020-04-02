const { ua2str, str2ua } = require('../TextArray');

describe('Base', () => {
  it('String <=> Uint8Array', () => {
    const string = 'Hello world';
    const array = new Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
    expect(str2ua(string)).toEqual(array);
    expect(ua2str(array)).toBe(string);
  });

  it('when characters over ascii', () => {
    const string = '中文字';
    expect(() => str2ua(string)).toThrowError(new Error('Expected char code between 0 to 255'));
  });
});
