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

      accessControl.roles = accessControl._id;

      acl.addUserRoles(merchant._id.toString(), accessControl.roles, err => {
        if (err) console.error('Failed', roles, 'role to user', identifier, 'with id', merchant._id);
        console.info(`Added`, roles, `role to user`, identifier, 'with id', merchant._id);
      });

      merchant =  await merchant.save();

      return { merchant };

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