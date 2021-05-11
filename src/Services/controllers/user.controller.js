const User = require('../models/user.model.js');
const ObjectId = require('mongodb').ObjectId; 

function formatForPage(req, res, results) {
	let returnJSON = []
	for (let card in results) {
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


exports.findAll = (req, res) => {
    console.log(req.query.id);
    User.findOne({"_id":ObjectId("6099b13b5002b3beea91e9a4")})
        .populate("Quotes")
        .then(results => {
            console.log(results)
            formatForPage(req, res, results.Quotes)
        }).catch(error => console.error(error));
};