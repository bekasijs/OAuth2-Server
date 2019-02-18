const crypto = require('crypto');
const randomBytes = require('bluebird').promisify(crypto.randomBytes);

const generate = () => {
  return randomBytes(256).then(function(buffer) {
    return crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');
  });
}

module.exports = generate;