const Quote = require('../models/quote.model.js');
const Author = require('../models/author.model.js');
const Keywords = require('../models/keyword.model.js');
const User = require('../models/user.model.js');

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

//Only include relevant data, and format it so that it can 
//be read by the frontend. This includes setting HTTP header & status
function formatForPage(req, res, results) {
	let returnJSON = []
	for (var card in results) {
		returnJSON.push({
			Quote: results[card]["Quote"],
			Author: results[card]["Author"],
			Text_source: results[card]["Text_source"]
		})
	}
	//set the header and status
	res.setHeader('content-type', 'Application/json');
	res.status(200);
	//send back
	res.send(returnJSON);
}

// Get All Quotes & Data - TESTING PURPOSES ONLY
exports.showAll = (req, res) => {
	Quote.find({ "Inspected": true })
		//.explain("executionStates")
		.then(results => {
			//set the header and status
			res.setHeader('content-type', 'Application/json');
			res.status(200);
			//send back
			res.send(results);
		})
		.catch(error => console.error(error))
};

//Returns specified number of random quotes
exports.showRand = (req, res) => {
	Quote.aggregate([
		{ $match: { "Inspected": true } },
		{ $sample: { size: Number(req.query.qty) } }])
		.then(results => {
			formatForPage(req, res, results)
		})
		.catch(error => console.error(error))
}

//Allows the user to search the data with keywords or phrases
exports.searchFor = (req, res) => {

	//Removes any non-value elements, and trims whitespace from others
	function trimAndRemove(arr) {
		var returnArr = []
		for (let i in arr) {
			if (arr[i] != '') {
				returnArr.push(arr[i].trim());
			}
		}
		return returnArr;
	}

	//This line splits the comma-separate query terms into different
	//elements in an array. Then, it sends it to trimAndRemove()
	let terms = trimAndRemove(req.query.terms.split(","));

	//The $search query REQUIRES a search index in your MongoDB cluster
	//https://docs.atlas.mongodb.com/data-explorer/indexes/#create-an-index
	Quote.aggregate([
		{
			$search: {
				"phrase": {
					"query": terms,
					"path": "Quote"
				}
			}
		},
		{ $match: { "Inspected": true } },
		{ $sample: { size: Number(req.query.qty) } }
	])
		.then(results => {
			formatForPage(req, res, results);
		})
		.catch(error => console.error(error))

}//end of searchFor

//Add a new quote
exports.postQuote = (res, data) => {

	/* 
	 * All of these are async functions (you can use await) because there's some issues with 
	 * queries. I don't fully understand it, but it seems like you have to use await or .then()
	 * to get a desirable answer when using queries.
	 */
	async function initializeModel(fields) {
		//Finds or (if no document exists) creates a new document, and returns its _id
		let fieldValues = Object.values(fields)
		if (fieldValues.length > 0 && fieldValues[0] != "") {
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
		else {
			return null;
		}
	}

	//This is used for dealing with arrays of keywords
	//Unfortunately, .forEach() does not work with async functions, so must create a for loop
	async function initializeManyKeywords(arr) {

		//Remove unwanted values (e.g. blank ones), trim, and lowercase each keyword
		var array = []
		for (let item in arr) {
			if (item != "") {
				array.push(arr[item].trim().toLowerCase())
			}
		}

		let keywIDs = [];
		for (let item in array) {
			let keyw = await Keywords.findOne({ Word: array[item] });
			if (keyw) {
				keywIDs.push(keyw._id);
			}
			else {
				let newKeyw = await new Keywords({ Word: array[item], Inspected: false });
				newKeyw.save();
				keywIDs.push(newKeyw._id);
			}
		}
		return keywIDs
	}

	//Returns true if there are duplicates, false if there aren't any
	async function hasDuplicates(data) {
		const result = await Quote.findOne({
			Quote: data.quote,
			Text_source: data.source,
			Author: data.author,
			User: data.user,
			Date: data.date,
			Keywords: data.keywords
		})
		if (result == null) {
			return false
		}
		else {
			return true
		}
	}

	//Returns the relevant documents' _ids.
	async function getDocumentIDs(data) {
		//Since the initializeModel function uses await, so does this function
		const [quoteID, authID, userID, keyIDs] = await Promise.all([
			//By using the call() method, the given 'this' value can be set to the mongoose models
			//Technically, we don't have to use initializeModel() for the Quote model, but it makes things look cleaner
			initializeModel.call(Quote, {
				Quote: data.quote,
				Text_source: data.source,
				Author: data.author,
				User: data.user,
				Keywords: data.keywords.split(", "),
				Date: data.date,
				Inspected: false
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
		.then(duplicate => {
			if (!duplicate) {
				getDocumentIDs(data)
					.then(addIDtoDocuments)
					.then(res.status(201).send())
			}
			else {
				res.status(409).send("Already exists")
			}
		})

}