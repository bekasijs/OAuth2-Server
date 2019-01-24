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
  isVerify: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Schema.Types.Mixed,
  },
  updatedAt: {
    type: Schema.Types.Mixed
  }
});

accountSchema.statics.create = () => {
  
};

module.exports = mongoose.model('accounts', accountSchema);