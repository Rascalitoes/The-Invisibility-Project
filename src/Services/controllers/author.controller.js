const Author = require('../models/author.model.js');


exports.findAll = (req, res) => {
	Author.find()
    .then(authors => {
        res.send(authors);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};