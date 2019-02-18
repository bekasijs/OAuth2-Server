const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const profileSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'accounts',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  msisdn: {
    type: String,
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
  settings: {
    type: Schema.Types.Mixed
  },
  createdAt: {
    date: {
      type: Date
    },
    timezone: {
      type: String
    }
  },
  updatedAt: {
    date: {
      type: Date
    },
    timezone: {
      type: String
    }
  }
}, { strict: true });

profileSchema.set({ iAmNotInTheSchema: true });

module.exports = mongoose.model('profiles', profileSchema);