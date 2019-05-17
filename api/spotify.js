const keys = require("../config/keys");
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);

let searchSpotify = (search) => {
    console.log("Search Spotify: " + search);
    spotify.search({
        type: 'artist,track',
        query: search
    }, (err, response) => {
        spotifyResult(response.tracks.items);
    });
}

let spotifyResult = (result) => {
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


module.exports = {
    searchSpotify: searchSpotify
};
