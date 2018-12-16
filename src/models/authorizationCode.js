const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const authorizationCodeSchema = new Schema({
  authorizationCode: {
    type: String,
    required: true
  },
  authorizationCodeExpiresAt: {
    type: Date,
    required: true
  },
  scope: {
    type: [String]
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients'
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'accounts'
  }
});

module.exports = mongoose.model('authorizationCode', authorizationCodeSchema);