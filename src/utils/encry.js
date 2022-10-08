const CryptoJS = require('crypto-js') //引用AES源码js

const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') //十六位十六进制数作为密钥偏移量

//加密方法
function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}

//解密方法
const Decrypt = (word) => {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedStr.toString())
}

const desKey = CryptoJS.enc.Utf8.parse('11')

//DES加密方法
function desEncrypt(message) {
  let encrypted = CryptoJS.DES.encrypt(message, desKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
//DES解密方法
function desDecrypt(ciphertext) {
  if (ciphertext === '' || ciphertext === null || ciphertext === undefined) {
    return ''
  }
  if (typeof ciphertext != 'string') {
    ciphertext = ciphertext.toString()
  }
  var decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    },
    desKey,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}

module.exports = {
  Encrypt,
  Decrypt,
  desEncrypt,
  desDecrypt
}
