const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

let now = {
  iso: moment().tz('Asia/Jakarta').format(),
  timestamp: moment().tz('Asia/Jakarta').unix()
}

const accountSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients',
    required: true
  },
  identifier: {
    type: [String],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
  },
  scope: {
    type: Array
  },
  createdAt: {
    type: Schema.Types.Mixed,
    default: now
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

module.exports = mongoose.model('accounts', accountSchema);