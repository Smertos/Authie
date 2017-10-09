import { HmacSHA1, enc } from 'crypto-js'

const { Hex: { parse: parseHex } } = enc

export default class Totp {
  
  constructor (secret, length, expireTime) {
    if (secret === void 0) {
      throw new Exception("Error: Secret is undefined")
    }
    
    this.secret = secret
    this.length = length || 6
    this.expireTime = expireTime || 30
  }

  getCode () {
    let
      now = new Date().getTime(),
      key = base32ToHex(this.secret),
      epoch = Math.round(now / 1000),
      time = leftpad(dec2Hex(Math.floor(epoch / this.expireTime)), 16, '0'),
      hmac = HmacSHA1(parseHex(time), parseHex(key)).toString(),
      offset = hex2Dec(hmac.substring(hmac.length - 1))


    let code = (hex2Dec(hmac.substr(offset * 2, 8)) & hex2Dec('7fffffff')) + ''
    return code.substr(code.length - this.length, this.length)
  } 


  getRemainingTime () {
    let
        now = new Date().getTime(),
        passed = now % (this.expireTime * 1000)
      
      return Math.floor(((this.expireTime * 1000) - passed) / 1000)
  }

}

function leftpad (str, len, pad) {
  return len + 1 >= str.length ? new Array(len + 1 - str.length).join(pad) + str : str
}

function base32ToHex (base32) {
  let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
      bits = '', hex = ''

  for (let i = 0; i < base32.length; i += 1) {
    let val = abc.indexOf(base32.charAt(i).toUpperCase())
    bits += leftpad(val.toString(2), 5, '0')
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16)
  }

  return hex
}

function dec2Hex (dec) {
  return (dec < 15.5 ? '0' : '') + Math.round(dec).toString(16)
}

function hex2Dec (hex) {
  return parseInt(hex, 16)
}

