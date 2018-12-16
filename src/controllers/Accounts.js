const ObjectId = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken');
const redis = require('./../adapters/redis');
const crypto = require('crypto');

class AccountController {

  constructor(db) {
    this.db = db;
  }

  async register(params) {
    try {

      let account = await this.db.accounts.findOne({ identifier: [params.identifier] });

      if (account) throw { code: 400, message: 'Email Already Registered' }

      account = new this.db.accounts();

      let { hash, salt } = this.encodePassword(params.password);

      account.identifier = [params.identifier];
      account.client = params.client._id;
      account.password = hash;
      account.salt = salt;

      let profile = new this.db.profiles({ account: ObjectId(account._id) });

      profile = await profile.save();

      account = await account.save();

      return {
        account,
        profile
      }

    } catch (error) {
      throw error;
    }
  }

  async login(params) {
    try {

      let account = await this.db.accounts.findOne({ identifier: [params.identifier] }).lean();

      if (!account) throw { code: 400, message: 'Account Not Register' }

      if (!this.validateHash(params.password, account)) throw { code: 400, message: 'Oops, Wrong Password' };

      delete account.password;
      delete account.salt;

      let profile = await this.db.profiles.findOne({ account: ObjectId(account._id) }).populate(['address']);

      let data = {
        account,
        profile
      }

      data.token = jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: 86400,
        algorithm: "HS256"
      });

      redis.SETEX(`AccessToken:${account._id}`, 86400, JSON.stringify(data))

      return data;

    } catch (error) {
      throw error;
    }
  }

  async profile(params) {
    try {
      
      // let account = await this.db.accounts.findById

    } catch (error) {
      throw error;
    }
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

module.exports = AccountController;