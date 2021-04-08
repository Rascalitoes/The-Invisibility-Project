const mongoose = require('mongoose'), Schema = mongoose.Schema;

const AuthorSchema = mongoose.Schema({
    Name: String,
    Quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }]
});

module.exports = mongoose.model('Author', AuthorSchema);