
const crypto = require('crypto');
const generate = require('bluebird').promisify(crypto.pbkdf2);

const encrypt = async (password) => {
  crypto.DEFAULT_ENCODING = 'hex';
  const salt =  crypto.randomBytes(128).toString('base64');
  const iterelations = 1000;
  const hash = await generate(password, salt, iterelations, 32, 'sha1');
  console.log(hash);
  return {
    salt,
    hash
  }
};

const decrypt = async (passwordValue, { password, salt }) => {
  crypto.DEFAULT_ENCODING = 'hex';
  return password === crypto.pbkdf2Sync(passwordValue, salt, 1000, 32, 'sha1');
}

module.exports = {
  encrypt,
  decrypt
}