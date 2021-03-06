const mongoose = require('mongoose'), Schema = mongoose.Schema;

const KeywordSchema = mongoose.Schema({
    Word: String,
    Quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }],
    Inspected: Boolean
});

module.exports = mongoose.model('Keyword', KeywordSchema);