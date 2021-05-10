//callAPI only fetches (GET) data, it can't POST or PUT
export function callAPI(quantity = "5", terms = "") {
    //replace localhost:2000 url with the URL where your database will live (e.g. http://robertglick.com/database/show)
    //Alternatively, you can go to package.json, and set "proxy":"http://robertglick.com", and fetch("/show")
    //You could write a function to randomize the this.state.entries array then store it in state for random card order, like in the original
    let queries = addQueries({ "qty": quantity, "terms": terms });
    //console.log(queries);
    return fetch(`http://localhost:2000/show${queries}`)
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        });
}


//This function is used in callAPI and formats the queries for the url
//The argument 'query' is a dictionary.
function addQueries(query = {}) {
    let returnString = "";
    //check for elements in dictionary, if there are any, prep for queries by adding '?'
    returnString += "?";
    for (var q in query) {
        if (query[q]) {
            returnString += (q + "=" + query[q] + "&");
        }
    }
    //Because my code is sloppy, delete the last '&' that was added
    returnString = returnString.slice(0, -1);
    return returnString;
}