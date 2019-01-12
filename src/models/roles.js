const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    _id: String,
    allows: {
        resources: {
            type: Array,
            required: true
        },
        permissions: {
            type: Array,
            required: true
        }
    }
});

module.exports = mongoose.model('roles', RoleSchema);