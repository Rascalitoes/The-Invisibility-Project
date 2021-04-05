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
	const parsedURL = url.parse(req.url, true);
	let quantity = Number(parsedURL.query.qty);
	Quote.aggregate([{ $sample: { size: quantity } }])
		.then(results => {
			//set the header and status
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			//send the JSON data to be displayed and read by the frontend
			res.send(JSON.stringify(results));
		})
		.catch(error => console.error(error))
}

//For testing purposes only
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

//Add a new quote
exports.postQuote = (req, res) => {
	const parsedURL = url.parse(req.url, true);

	var auth = new Author({
		Name: parsedURL.query.author
	});

	var user = new User({
		Username: parsedURL.query.username
	});

	//for now, I'm assuming that the keywords will come comma spearated
	//if (parsedURL.query.keywords) {
		keywords = parsedURL.query.keywords.split(", ");
		keywordArr = [];
		for (var k in keywords) {
			if (keywords[k]) {
				keywordArr.push(
					new Keywords({
						Word: k
					})
				);
			}
		}
	//}

	var quote = new Quote({
		Quote: parsedURL.query.quote,
		Text_source: parsedURL.query.text_source,
		Author: auth._id,
		User: user._id,
		Keywords: keywordArr(keyword => keyword._id)
	});

	user.Quotes.push(quote._id);
	auth.Quotes.push(quote._id);
	for (var ka in keywordArr) {
		ka.Quotes.push(quote._id)
	}

	quote.save(function (err) {
		if (err) return console.error(err.stack)
		console.log("Quote is added")
	});

	auth.save(function (err) {
		if (err) return console.error(err.stack)
		console.log("Author is added")
	});

	user.save(function (err) {
		if (err) return console.error(err.stack)
		console.log("Username is added")
	});

}


// Find a Student by firstname
exports.findByName = (req, res) => {
	Quote.findOne({ firstname: req.params.firstname })
		.populate('subjects')
		.exec(function (err, student) {
			if (err) {
				if (err.kind === 'ObjectId') {
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