const Quote = require('../models/quote.model.js');
const Author = require('../models/author.model.js');
const Keywords = require('../models/keyword.model.js');
const User = require('../models/user.model.js');
const url = require('url');

// Get All Quotes
exports.showAll = (res) => {
	Quote.find()
	.populate('Author Keywords')
    .then(quotes => {
        res.send(quotes);
    }).catch(err => {
		res.status(500).send({
			message: err.message
		})
    });
};

// Return qty number of quotes
exports.showRand = (req, res) => {
	const parsedURL = url.parse(req.url,true);
	let quantity = Number(parsedURL.query.qty);
	Quote.aggregate([{$sample: {size: quantity}}])
	.then(results => {
		//set the header and status
		res.setHeader('content-type', 'Application/json');
		res.statusCode = 200;
		//send the JSON data to be displayed and read by the frontend
		res.send(JSON.stringify(results));
	})
	.catch(error => console.error(error))
}

exports.showOne = (req, res) => {
	Quote.findById("60521b898b3a3da67d2dcaf8")
	.populate('Author Keywords')
    .then(quotes => {
		let returnJSON = {
			Quote: quotes.Quote,
			Author: quotes.Author.Name,
			Text_source: quotes.Text_source
		}
        res.send(returnJSON);
    }).catch(err => {
		res.status(500).send({
			message: err.message
		})
    });
};

// Find a Student by firstname
exports.findByName = (req, res) => {
	Quote.findOne({ firstname: req.params.firstname })
	.populate('subjects')
	.exec(function (err, student) {
		if (err){
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Student not found with given firstname " + req.params.firstname
				});                
			}
			return res.status(500).send({
				message: "Error retrieving Student with given firstname" + req.params.firstname
			});
		}
					
		res.send(student);
	});
};