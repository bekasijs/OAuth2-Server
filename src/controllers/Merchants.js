
const config = require('config');
const jwt = require('jsonwebtoken');
const Error = appRoot('src/lib/Error').errorJson;
const { encrypt, decrypt } = appRoot('src/lib/password');

class merchants {

  constructor(user=false, db) {
    this.user = user;
    this.db = db;
  }

  async create ({ username, password }) {
    try {

      let merchant = await this.db.accounts.findOne({ identifier: [username] });

      if (merchant) throw Error(400, 'AlreadyRegistered', 'Already Registered');

      const newMerchant = new this.db.accounts();
      const profile = new this.db.profiles();
      const { hash, salt } = await encrypt(password);

      newMerchant.client = this.user._id;
      newMerchant.identifier = username;
      newMerchant.password = hash;
      newMerchant.salt = salt;
      newMerchant.role = 'Merchant';
      newMerchant.scopes = this.user.scopes;

      profile.account = newMerchant._id;
      profile.email = username;
      profile.createdAt = { date: new Date, timezone: 'Asia/Jakarta' }
      profile.updatedAt = { date: new Date, timezone: 'Asia/Jakarta' }

      await newMerchant.save();
      await profile.save();

      merchant = await this.db.accounts.findById(newMerchant._id).select('-password -salt');

      return merchant;

    } catch (error) {
      throw error;
    }
  }

}

module.exports = merchants;