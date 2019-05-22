const axios = require("axios");

let searchOMDB = (search) => {
    if (!search) {
        search = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
        .then( (response) =>{
            omdbResult(search, response.data);
        })
        .catch( (error) =>{
            console.log(error);
        });
}

let omdbResult = (search, result) => {
    console.log("Search result for: " + search);
    console.log("");
    console.log("Title: " + result.Title);
    console.log("Year: " + result.Year);
    console.log("Country: " + result.Country);
    console.log("Language: " + result.Language);
    console.log("Plot: " + result.Plot);
    console.log("Actors: " + result.Actors);
    console.log("");
}

module.exports = {
    searchOMDB: searchOMDB
};