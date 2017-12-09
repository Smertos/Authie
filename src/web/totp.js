import { HmacSHA1, enc } from 'crypto-js';

const { Hex: { parse: parseHex } } = enc;

export default class Totp {

  constructor (secret, length, expireTime) {
    if (secret === undefined) {
      throw new Error('Secret is undefined');
    }

    this.secret = secret;
    this.length = length || 6;
    this.expireTime = expireTime || 30;
  }

  getCode () {
    const now = new Date().getTime();
    const key = base32ToHex(this.secret);
    const epoch = Math.round(now / 1000);
    const time = leftpad(dec2Hex(Math.floor(epoch / this.expireTime)), 16, '0');
    const hmac = HmacSHA1(parseHex(time), parseHex(key)).toString();
    const offset = hex2Dec(hmac.substring(hmac.length - 1));


    const code = (hex2Dec(hmac.substr(offset * 2, 8)) & hex2Dec('7fffffff')) + '';
    return code.substr(code.length - this.length, this.length);
  }


  getRemainingTime () {
    const passed = new Date().getTime() % (this.expireTime * 1000);

    return Math.floor(((this.expireTime * 1000) - passed) / 1000);
  }

}

function leftpad (str, len, pad) {
  return len + 1 >= str.length ? new Array(len + 1 - str.length).join(pad) + str : str;
}

function base32ToHex (base32) {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let hex = '';

  for (let i = 0; i < base32.length; i += 1) {
    const val = abc.indexOf(base32.charAt(i).toUpperCase());

    bits += leftpad(val.toString(2), 5, '0');
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16);
  }

  return hex;
}

function dec2Hex (dec) {
  return (dec < 15.5 ? '0' : '') + Math.round(dec).toString(16);
}

function hex2Dec (hex) {
  return parseInt(hex, 16);
}

