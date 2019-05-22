const axios = require("axios");
const moment = require("moment");

let searchBandsInTown = (search) => {
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then( (response) =>{
            bandsInTownResult(search, response.data);
        })
        .catch( (error) =>{
            console.log(error);
        });
}

let bandsInTownResult = (search, result) => {
    console.log("Times and Location for: " + search);
    for (let i = 0; i < result.length; i++) {
        console.log("\tVenue: " + result[i].venue.name);
        console.log("\tLocation: " + result[i].venue.city)
        console.log("\tDate: " + moment(result[i].datetime).format("MM/DD/YYYY"));
        console.log("");
    }
}


module.exports = {
    searchBandsInTown: searchBandsInTown
};
