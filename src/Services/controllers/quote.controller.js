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
/*
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
*/

// Return qty number of quotes
exports.showRand = (req, res) => {
	const parsedURL = url.parse(req.url, true);
	let quantity = Number(parsedURL.query.qty);
	Quote.aggregate([{ $sample: { size: quantity } }])
		.populate('Author')
		.then(results => {
			//set the header and status
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			//send the JSON data to be displayed and read by the frontend
			let returnJSON = {
				_id: results._id,
				Quote: results.Quote,
				Author: results.Author.Name,
				Text_source: results.Text_source
			}
			res.send(JSON.stringify(returnJSON));
		})
		.catch(error => console.error(error))
}

//For testing purposes only
exports.showOne = (req, res) => {
	var returnput = Quote.findById("606ccf207b608edd3759e4d3")
		.populate('Author Keywords')
		.then(quotes => {
			//let mapy = new Map(quotes)
			let returnJSON = []
			for (var card in quotes) {
				console.log(card)
				/*
				returnJSON.push({
					_id: card["_id"],
					Quote: card["Quote"],
					Author: card["Author"]["Name"],
					Text_source: card["Text_source"]
				})
				*/
			}
			console.log("****************************")
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			res.send(returnJSON);//JSON.stringify(returnJSON));
		}).catch(error => console.error(error));
};

exports.specialOne = (req, res) => {
	Quote.find({Quote: {
        $in: ["I'm an observer. I read about life. I research life. I find a corner in a room and melt into it. I can become invisible. It's an art, and I am a wonderful practitioner.",
		 "Spookyman"]}})
		.populate('Author Keywords')
		.then(results => {
			let returnJSON = []
			for (var card in results){
				returnJSON.push({
					_id: results[card]["_id"],
					Quote: results[card]["Quote"],
					Author: results[card]["Author"]["Name"],
					Text_source: results[card]["Text_source"]
				})
				//returnJSON.push(results[card]["Author"]["Name"])
			}
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			res.send(returnJSON);
			//console.log(results[1]["Author"]["Name"]);
			//console.log(JSON.stringify(results))
		}).catch(error => console.error(error));
	//console.log(results);
	//console.log(res.json(results));
	//console.log(JSON.stringify(results))
		/*
		.then(quotes => {
			var myVar = quotes
			console.log(quotes)
			console.log(type(myVar))
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			res.send(quotes);
		}).catch(error => console.error(error));
		*/
};

//Add a new quote
exports.postQuote = (data) => {
	var auth = new Author({
		Name: data.author
	});

	var user = new User({
		Username: data.user
	});
	/*
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
		*/

	var quote = new Quote({
		Quote: data.quote,
		Text_source: data.source,
		Author: auth._id,
		User: user._id,
		//Keywords: keywordArr(keyword => keyword._id)
	});

	user.Quotes.push(quote._id);
	auth.Quotes.push(quote._id);
	/*
	for (var ka in keywordArr) {
		ka.Quotes.push(quote._id)
	}
	*/

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