require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

//process.argv
var nodeLocation = process.argv[0];
var nodeLocation = process.argv[1];
var requestedService = process.argv[2];
var command = process.argv[3];


//test - remove me
let song = "Buffalo Soldier";
let artist = "Chronixx";
let movie = "The Matrix";
//test - remove me

//spotify
let searchSpotify = (search) => {
    spotify.search({
        type: 'artist,track',
        query: search
    }, function (err, response) {
        // console.log(response.tracks);
            console.log(response.tracks.items[0].artists[0].name);
        let searchResult = {
            size: response.tracks.items.length,
            artist: response.tracks.items[0].artists[0].name,
            song: response.tracks.items[0].name,
            album: response.tracks.items[0].album.name,
            preview: response.tracks.items[0].external_urls.spotify
        }
            console.log(searchResult);
            logActivity(searchResult);
    });
}


let searchOMDB = (search) => {
    //http://www.omdbapi.com/?t=%22The%20Matrix%22&y=&plot=short&apikey=trilogy
    axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            // console.log(response.data);
            let movieResult = {
                size: response.length,
                title: response.data.Title,
                year: response.data.Year,
                rating: response.data.Ratings[0].Value,
                country: response.data.Country,
                language: response.data.Language,
                plot: response.data.Plot,
                actors: response.data.Actors
            }
            console.log(movieResult);
        })
        .catch(function (error) {
            console.log(error);
        });
}


let searchBandsInTown = (search) => {
    //https://rest.bandsintown.com/artists/Chronixx/events?app_id=codingbootcamp
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // console.log(response.data);
            let searchResult = {
                size: response.data.length,
                venue: response.data[0].venue.name,
                location: response.data[0].venue.city,
                date: response.data[0].datetime,
                formattedDate: moment(response.data[0].datetime).format("MM/DD/YYYY")
            }
            console.log(searchResult);
        })
        .catch(function (error) {
            console.log(error);
        });
}


let doWhatItSays = function(){
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        searchSpotify(dataArr[1])
    })
}


let logActivity = function (data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Content Added!");
        }

    });
}


let printUsage = function () {
    console.log("LIRI is a Language Interpretation and Recognition Interface")
    console.log("Usage: node liri.js [service] [value]");
    console.log("options");
    
}

let testCode = () => {
    // searchSpotify(song);
    // searchBandsInTown(artist);
    // searchOMDB(movie);
    doWhatItSays();
}


console.clear();
switch (requestedService) {
    case "concert-this":
        console.log("concert this: " + command);
        searchBandsInTown(command);
        break;
    case "spotify-this-song":
        console.log("spotify this song " + command);
        searchSpotify(command);
        break;
    case "movie-this":
        searchOMDB(command);
        console.log("movie this " + command);
        break;
    case "do-what-it-says":
        console.log("do what it says");
        break;
    case "test":
        testCode();
        break;
    default:
        console.log("I don't know to do that yet");
        printUsage();
}

//Commnads
//concert-this
//spotify-this-song
//movie-this
//do-what-it-says

