const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessTokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true
  },
  accessTokenExpiresAt: {
    type: Date,
    required: true
  },
  scope: {
    type: Array
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

module.exports = mongoose.model('accessTokens', accessTokenSchema);