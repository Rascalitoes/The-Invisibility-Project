const mongoose = require('mongoose'), Schema = mongoose.Schema;

const QuoteSchema = mongoose.Schema({
    _id: { type: Schema.Types.ObjectId },
    Quote: String,
    Text_source: String,
    Author: { type: Schema.Types.ObjectId, ref: 'Author' },
    User: { type: Schema.Types.ObjectId, ref: 'User' },
    Keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }]
});

module.exports = mongoose.model('Quote', QuoteSchema);