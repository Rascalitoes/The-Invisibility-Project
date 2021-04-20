const Quote = require('../models/quote.model.js');
const Author = require('../models/author.model.js');
const Keywords = require('../models/keyword.model.js');
const User = require('../models/user.model.js');
const URL = require('url').URL;
const { db } = require('../models/quote.model.js');

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
		{ $sample: { size: quantity } }//,
		//{ $lookup: { from: "authors", localField: "Author", foreignField: "_id", as: "Author_info" } }
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
					Quote: results[card]["Quote"],
					Author: results[card]["Author"],
					Text_source: results[card]["Text_source"]
				})
			}
			res.send(returnJSON);
		})
		.catch(error => console.error(error))
}

//Add a new quote
exports.postQuote = (data) => {

	/* 
	 * All of these are async functions (you can use await) because there's some issues with 
	 * queries. I don't fully understand it, but it seems like you have to use await or .then()
	 * to get a desirable answer when using queries.
	 */
	async function initializeModel(fields) {
		//Finds or (if no document exists) creates a new document, and returns its _id
		const docResults = await this.findOne(fields);
		if (docResults) {
			return docResults._id;
		}
		else {
			const newDoc = await new this(fields);
			newDoc.save();
			return newDoc._id;
		}
	}

	//This is used for dealing with arrays of keywords
	async function initializeManyKeywords(array) {
		let keywIDs = [];
		//Unfortunately, .forEach() does not work with async functions, so must create a for loop
		for (let item in array) {
			let tempID = await initializeModel.call(Keywords, { Word: array[item] })
			keywIDs.push(tempID)
		}
		return keywIDs
	}


	async function hasDuplicates(data) {
		//Returns true if there are duplicates, false if there aren't any
		const result = await Quote.findOne({
			Quote: data.quote,
			Text_source: data.source,
			Author: data.author,
			User: data.user,
			Keywords: data.keywords
		})
		if (result == null) {
			return false
		}
		else {
			return true
		}
	}

	async function getDocumentIDs(data) {
		//Returns the relevant documents' _ids.

		//Since the initializeModel function uses await, so does this function
		const [quoteID, authID, userID, keyIDs] = await Promise.all([
			//By using the call() method, the given 'this' value can be set to the mongoose models
			//Technically, we don't have to use initializeModel() for the Quote model, but it makes things look cleaner
			initializeModel.call(Quote, {
				Quote: data.quote,
				Text_source: data.source,
				Author: data.author,
				User: data.user,
				Keywords: data.keywords
			}),
			initializeModel.call(Author, { Name: data.author }),
			initializeModel.call(User, { Username: data.user }),
			initializeManyKeywords(data.keywords.split(", "))
		]);

		//return an object literal of all the IDs
		return { quoteID, authID, userID, keyIDs };
	}




	async function addIDtoDocuments(ID) {
		//Since the quote doesn't change, all the data was set in getDocumentIDs
		await Author.findOneAndUpdate({ _id: ID.authID }, { $push: { Quotes: ID.quoteID } });
		await User.findOneAndUpdate({ _id: ID.userID }, { $push: { Quotes: ID.quoteID } });
		ID.keyIDs.forEach(async keyword => {
			await Keywords.findOneAndUpdate({ _id: keyword }, { $push: { Quotes: ID.quoteID } })
		});
	}

	//This is what is run when postQuote is called
	hasDuplicates(data)
		.then(result => {
			if (!result) {
				getDocumentIDs(data)
					.then(addIDtoDocuments)
			}
		})
}