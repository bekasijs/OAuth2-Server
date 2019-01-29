const acl = require('./../lib/Acl');
const Error = require('./../lib/Error');
const crypto = require('crypto');
const _ = require('lodash');

class Merchants { 

  constructor(client, models) {
    this.client = client;
    this.models = models;
  }

  async create ({ identifier, password, roles }) {
    try {

      let merchant = await this.models.accounts.findOne({ identifier: [identifier], roles: [roles] });
      if (merchant) throw Error(400, 'AccountAlreadyExist', 'this account already exist');

      let accessControl = await this.models.roles.findById(roles).lean();

      if (!accessControl) throw Error(400, 'AccessControlError', 'access control list not found for ' + roles);

      let { hash, salt } = this.encodePassword(password);

      merchant = new this.models.accounts();
      merchant.client = this.client._id;
      merchant.identifier = identifier;
      merchant.password = hash;
      merchant.salt = salt;
      merchant.roles = roles;
      merchant.scope = config.get(params.roles).scope;

      accessControl.roles = accessControl._id;

      acl.addUserRoles(merchant._id.toString(), accessControl.roles, err => {
        if (err) console.error('Failed', roles, 'role to user', identifier, 'with id', merchant._id);
        console.info(`Added`, roles, `role to user`, identifier, 'with id', merchant._id);
      });

      await merchant.save();

      merchant = await this.models.accounts.findById(merchant._id).select('identifier scope roles client isVerify');

      return merchant;

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

module.exports = Merchants;