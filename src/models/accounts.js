const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

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
  role: {
    type: String,
  },
  scopes: {
    type: Array
  },
  type: {
    type: String
  },
  isVerify: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  createdAt: {
    date: {
      type: Date,
      default: new Date()
    },
    timezone: {
      type: String,
      default: 'Asia/Jakarta'
    }
  },
  updatedAt: {
    date: {
      type: Date
    },
    timezone: String
  }
});

accountSchema.pre('save', (done) => {
  done();
});

module.exports = mongoose.model('accounts', accountSchema);