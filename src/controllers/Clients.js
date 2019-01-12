const ObjectId = require('mongoose').Types.ObjectId
const crypto = require('crypto');

class ClientController {

  constructor(db) {
    this.db = db;
  }

  async create (params) {
    try {

      let client = new this.db.clients();

      client.name = params.name;
      client.redirectUris = params.redirectUris;
      client.clientId = this.generateClientId();
      client.clientSecret = this.generateClientSecret();

      let account = new this.db.accounts();
      let encode = this.encodePassword(params.password);

      if (typeof params.grants === 'string' && params.grants.search(/,|,\s*/) > -1) {
        client.grants = params.grants.split(/,|,\s/);
      } else client.grants = params.grants;

      account.identifier = [params.identifier];
      account.password = encode.hash;
      account.salt = encode.salt;
      account.client = ObjectId(client._id);

      await client.save();
      await account.save();

      return { data: client };

    } catch (error) {
      throw error;
    }
  }

  generateClientId () {
    return crypto.randomBytes(32).toString('hex');
  }

  generateClientSecret () {
    let salt = crypto.randomBytes(32).toString('hex');
    let secret = crypto.createHmac('sha256', salt).update(process.env.SECRET_KEY).digest('hex');
    return secret;
  }

  encodePassword(password) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.createHmac('sha1', salt).update(password).digest('hex');
    return { salt, hash };
  };

  validateHash(password, param) {
    let validate = crypto.createHmac('sha1', param.salt).update(password).digest('hex');
    if (validate !== param.password) return false;
    else return true;
  }

}

module.exports = ClientController;