const mongoose = require('mongoose'), Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    _id: { type: Schema.Types.ObjectId },
    Username: String,
    Quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }]
});

module.exports = mongoose.model('User', UserSchema);