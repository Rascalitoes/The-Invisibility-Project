const mongoose = require('mongoose'), Schema = mongoose.Schema;

const KeywordSchema = mongoose.Schema({
    _id: { type: Schema.Types.ObjectId },
    Word: String,
    Quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }]
});

module.exports = mongoose.model('Keyword', KeywordSchema);