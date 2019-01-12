const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

let now = {
  iso: moment().tz('Asia/Jakarta').format(),
  timestamp: moment().tz('Asia/Jakarta').unix()
}

const profileSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients',
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  identifier: {
    type: [String],
    required: true
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  gender: {
    type: String
  },
  birthday: {
    timestamp: {
      type: Number
    },
    iso: {
      type: Date
    }
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'addresses'
  },
  profession: {
    type: String
  },
  createdAt: {
    type: Schema.Types.Mixed,
    default: now
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

module.exports = mongoose.model('profiles', profileSchema);