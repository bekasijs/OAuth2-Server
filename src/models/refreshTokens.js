const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const refreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true
  },
  scope: {
    type: Array,
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

module.exports = mongoose.model('refreshTokens', refreshTokenSchema);