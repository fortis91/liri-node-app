require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

const spotify = new Spotify(keys.spotify);

//process.argv
let nodeLocation = process.argv[0];
let nodeProgram = process.argv[1];
let requestedService = process.argv[2];//.toLowerCase();
let command = process.argv.slice(3).join(" ");

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
        let searchResult = {
            size: response.tracks.items.length,
            artist: response.tracks.items[0].artists[0].name,
            song: response.tracks.items[0].name,
            album: response.tracks.items[0].album.name,
            preview: response.tracks.items[0].external_urls.spotify
        }
        spotifyResult(response.tracks.items);
    });
}


//OMDB
let searchOMDB = (search) => {
    //http://www.omdbapi.com/?t=%22The%20Matrix%22&y=&plot=short&apikey=trilogy
    axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
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
            omdbResult(search, response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


//Bands in Town
let searchBandsInTown = (search) => {
    //https://rest.bandsintown.com/artists/Chronixx/events?app_id=codingbootcamp
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then(function (response) {
            let searchResult = {
                size: response.data.length,
                venue: response.data[0].venue.name,
                location: response.data[0].venue.city,
                date: response.data[0].datetime,
                formattedDate: moment(response.data[0].datetime).format("MM/DD/YYYY")
            }
            bandsInTownResult(search, response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


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
`;
    console.log(usage);

}

let testCode = () => {
    // searchSpotify(song);
    // searchBandsInTown(artist);
    searchOMDB(movie);
    // doWhatItSays();
}

let displaySearchResult =  (result) => {
    console.log("Artist: " + result.artist);
    console.log("Song: " + result.song);
    console.log("Preview: " + result.preview);
    console.log("Album: " + result.album);
}

let spotifyResult =  (result) => {
    let displayAmount = result.length;
    if (result.length > 5) {
        console.log("Very popular song, displaying the first 5 results:");
        displayAmount = 5;
    }
    for (let i = 0; i < displayAmount; i++) {
        console.log("\tArtists: " + result[i].artists[0].name);
        console.log("\tSong: " + result[i].name);
        console.log("\tAlbum: " + result[i].album.name);
        console.log("\tPreview: " + result[i].external_urls.spotify);
        console.log("");
    }
}

let bandsInTownResult =  (search, result) => {
    console.log("Times and Location for: " + search);
    for (let i = 0; i < result.length; i++) {
        console.log("\tVenue: " + result[i].venue.name);
        console.log("\tLocation: " + result[i].venue.city)
        console.log("\tDate: " + moment(result[i].datetime).format("MM/DD/YYYY"));
        console.log("");
    }
}

let omdbResult =  (search, result) => {
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