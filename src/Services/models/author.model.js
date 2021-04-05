const mongoose = require('mongoose'), Schema = mongoose.Schema;

const AuthorSchema = mongoose.Schema({
    //_id: { type: Schema.Types.ObjectId },
    Name: String,
    Quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }]
});

module.exports = mongoose.model('Author', AuthorSchema);