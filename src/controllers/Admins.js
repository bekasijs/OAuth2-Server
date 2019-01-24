const acl = require('./../lib/Acl');
const logger = require('./../lib/Logging');
const Error = require('./../lib/Error');
const crypto = require('crypto');
const _ = require('lodash');

class Admins {

  constructor(client, models) {
    this.client = client;
    this.models = models;
  }

  async create ({ identifier, password, roles }) {
    try {

      let admin = await this.models.accounts.findOne({ identifier: [identifier], roles: [roles] });
      if (admin) throw Error(400, 'AccountAlreadyExist', 'this account already exist');

      let accessControl = await this.models.roles.findById(roles).lean();
      let { hash, salt } = this.encodePassword(password);

      admin = new this.models.accounts();
      admin.client = this.client._id;
      admin.identifier = identifier;
      admin.password = hash;
      admin.salt = salt;
      admin.roles = roles;  

      accessControl.roles = accessControl._id;

      acl.addUserRoles(admin._id.toString(), accessControl.roles, err => {
        if (err) logger.error('Failed', roles, 'role to user', identifier, 'with id', admin._id);
        logger.info(`Added`, roles, `role to user`, identifier, 'with id', admin._id);
      });

      admin = await admin.save();

      return { admin }

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

module.exports = Admins;