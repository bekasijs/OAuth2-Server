const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

let now = {
  iso: moment().tz('Asia/Jakarta').format(),
  timestamp: moment().tz('Asia/Jakarta').unix()
}

const addressSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  address: {
    type: String
  },
  geolocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Array]
    }
  },
  createdAt: {
    type: Schema.Types.Mixed,
    default: now
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

module.exports = mongoose.model('addresses', addressSchema);