const mongoose = require('mongoose'), Schema = mongoose.Schema;

const QuoteSchema = mongoose.Schema({
    Quote: String,
    Text_source: String,
    Author: String,
    User: String,
    Keywords: [String],
    Date: String,
    Inspected: Boolean
});

module.exports = mongoose.model('Quote', QuoteSchema);