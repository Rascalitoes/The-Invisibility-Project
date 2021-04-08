const Quote = require('../models/quote.model.js');
const Author = require('../models/author.model.js');
const Keywords = require('../models/keyword.model.js');
const User = require('../models/user.model.js');
const URL = require('url').URL;

/*
 * Some important things to know for the following functions:
 *
 * res.statusCode is the HTTP status code. 200 means OK, 400 means Bad Request
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * res.setHeader changes the header. Headers allow the frontend to know
 * some extra infor such as content-type
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */

// Get All Quotes & Data
exports.showAll = (req, res) => {
	Quote.find()
		.populate('Author Keywords')
		.then(results => {
			//set the header and status
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			//send the JSON data to be displayed and read by the frontend
			res.send(JSON.stringify(results));
		})
		.catch(error => console.error(error))
};

// Return qty number of quotes
exports.showRand = (req, res) => {
	//req.url only returns ?qty=x, which the WHATWG URL API can't use on its own
	//So I need to add in a host to create a pseudo-URL (the actual host doesn't matter)
	const parsedURL = new URL(req.url, 'https://localhost:2000/');
	console.log(parsedURL.search)
	let quantity = Number(parsedURL.searchParams.get('qty'));

	Quote.aggregate([
		{ $sample: { size: quantity } },
		{ $lookup: { from: "authors", localField: "Author", foreignField: "_id", as: "Author_info" } }
	])
		//.populate('Author')
		.then(results => {
			//set the header and status
			res.setHeader('content-type', 'Application/json');
			res.statusCode = 200;
			//send the JSON data to be displayed and read by the frontend
			//only relevant data is pushed to returnJSON and sent
			let returnJSON = []
			for (var card in results) {
				returnJSON.push({
					_id: results[card]["_id"],
					Quote: results[card]["Quote"],
					Author: results[card]["Author_info"][0]["Name"],
					Text_source: results[card]["Text_source"]
				})
			}
			res.send(returnJSON);
		})
		.catch(error => console.error(error))
}

//Add a new quote
exports.postQuote = (data) => {
	var auth = new Author({
		Name: data.author
	});

	var user = new User({
		Username: data.user
	});

	//for now, I'm assuming that the keywords will come comma spearated
	var keyObjArr = [];
	if (data.keywords) {
		let keywordArr = data.keywords.split(", ");
		keywordArr.forEach(keyword => 
			keyObjArr.push(
				new Keywords({
					Word: keyword
				})
			)
		)
	}

	keyObjIDs = []
	keyObjArr.forEach(function(keyword){
		keyObjIDs.push(keyword._id)
	})
	var quote = new Quote({
		Quote: data.quote,
		Text_source: data.source,
		Author: auth._id,
		User: user._id,
		Keywords: keyObjIDs
	});

	user.Quotes.push(quote._id);
	auth.Quotes.push(quote._id);
	keyObjArr.forEach(keyword => keyword.Quotes.push(quote._id));

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

	keyObjArr.forEach(keyword =>
		keyword.save(function (err) {
			if (err) return console.error(err.stack)
			console.log("Keyword is added")
		}))

}