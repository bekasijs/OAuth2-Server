const ObjectId = require('mongoose').Types.ObjectId
const debug = require('debug')('AUTH_SERVER:Register');
const acl = require('./../lib/Acl');
const jwt = require('jsonwebtoken');
const redis = require('./../adapters/redis');
const crypto = require('crypto');
const _ = require('lodash');

class AccountController {

  constructor(db) {
    this.db = db;
  }

  async register(params) {
    try {

      let account = await this.db.accounts.findOne({ identifier: [params.identifier], roles: [params.roles] });
      let accessControl = await this.db.roles.findById(params.roles).lean();

      if (account) throw { code: 400, message: 'Email Already Registered' };

      account = new this.db.accounts();
      let profile = await this.db.profiles.findOne({ client: params.client._id, account: params.user._id });

      if (!profile) {

        profile = new this.db.profiles();
        profile.client = params.client._id;
        profile.account = ObjectId(account._id);
        profile.identifier = [params.identifier];

        await profile.save();

      }

      let { hash, salt } = this.encodePassword(params.password);

      account.identifier = [params.identifier];
      account.client = params.client._id;
      account.password = hash;
      account.salt = salt;
      account.roles = params.roles;
      account.profile = profile._id;

      accessControl.roles = accessControl._id;

      acl.addUserRoles(account._id.toString(), accessControl.roles, err => {
        if (err) debug('Failed', params.roles, 'role to user', params.identifier, 'with id', account._id);
        debug(`Added`, params.roles, `role to user`, params.identifier, 'with id', account._id);
      });

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