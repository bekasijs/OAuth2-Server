const ObjectId = require('mongoose').Types.ObjectId
const logger = require('./../lib/Logging');
const acl = require('./../lib/Acl');
const crypto = require('crypto');
const _ = require('lodash');

class AccountController {

  constructor(client, models) {
    this.client = client;
    this.models = models;
  }

  async register(params) {
    try {

      let account = await this.models.accounts.findOne({ identifier: [params.identifier], roles: [params.roles] });
      let accessControl = await this.models.roles.findById(params.roles).lean();

      if (account) throw { code: 400, message: 'Email Already Registered' };

      let { hash, salt } = this.encodePassword(params.password);

      account = new this.models.accounts();
      account.identifier = params.identifier;
      account.client = this.client._id;
      account.password = hash;
      account.salt = salt;
      account.roles = params.roles;

      accessControl.roles = accessControl._id;

      acl.addUserRoles(account._id.toString(), accessControl.roles, err => {
        if (err) logger.error('Failed', params.roles, 'role to user', params.identifier, 'with id', account._id);
        logger.info(`Added`, params.roles, `role to user`, params.identifier, 'with id', account._id);
      });

      account = await account.save();

      return { account }

    } catch (error) {
      throw error;
    }
  }

  async doLogin(params) {
    try {

      let profile = await this.db.profiles.findOne({ account: ObjectId(params.user._id) });

      if (!profile) throw { statusCode: 404, code: 404, error: 'profile_not_found', message: 'profile not found' };

      return { data: profile };

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