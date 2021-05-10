const Keyword = require('../models/keyword.model.js');


exports.findAll = (req, res) => {
    Keyword.find()
        .then(keywords => {
            res.send(keywords);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.findAllInspected = (req, res) => {
    Keyword.find({ "Inspected": true })
        .then(keywords => {
            //set the header and status
            res.setHeader('content-type', 'Application/json');
            res.statusCode = 200;

            let wordArray = [];
            for(let keyword in keywords){
                wordArray.push(keywords[keyword].Word)
            }

            res.send(JSON.stringify(wordArray))
        })
        .catch(error => console.error(error));
}