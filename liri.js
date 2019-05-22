require("dotenv").config();
const fs = require("fs");

let spotify = require("./api/spotify");
let omdb = require("./api/omdb");
let band = require("./api/bands");

//process.argv
let requestedService = process.argv[2];//.toLowerCase();
let command = process.argv.slice(3).join(" ");

let song = "Buffalo Soldier";
let artist = "Chronixx";
let movie = "The Matrix";

//do what it says
let doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        searchSpotify(dataArr[1])
    })
}

let logActivity = (data) => {
    fs.appendFile("log.txt", data + "\n", function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Content Added!");
        }

    });
}

let printUsage = () => {
    const usage = `
    LIRI is a Language Interpretation and Recognition Interface.
    LIRI uses the command to search various services and gives you data back.

    usage: 
        node liri.js <service> <value>

        service:
            spotify-this-song:  Search Spotify and return information about the song(value) specified.
            concert-this:  Search Bands in Town Artists and return information about the artist(value) specified.
            movie-this:  Search OMDB and return information about the movie(value) specified.
            do-what-it-says:  Perform search specified in random.txt

        value:  value to search for.
`
    console.log(usage);
}

let testCode = () => {
    spotify.searchSpotify(song);
    band.searchBandsInTown(artist);
    omdb.searchOMDB(movie);
    doWhatItSays();
}


console.clear();
switch (requestedService) {
    case "concert-this":
        console.log("concert this: " + command);
        band.searchBandsInTown(command);
        break;
    case "spotify-this-song":
        console.log("spotify this song " + command);
        spotify.searchSpotify(command);
        break;
    case "movie-this":
        console.log("movie this " + command);
        omdb.searchOMDB(command);
        break;
    case "do-what-it-says":
        doWhatItSays();
        console.log("do what it says");
        break;
    case "test":
        testCode();
        break;
    default:
        console.log("Hi, I'm LIRI: I don't know to do that yet. See what I can do below.");
        printUsage();
}