// NPM Modules
var twitterKeysFile = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
// Input
var input = process.argv[2];
var argument = "";

action(input, argument);

function action(input, argument) {
  argument = getThirdInput();

  switch (input) {

    case "my-tweets":
      getMyTweets();
      break;

    case "spotify-this-song":
      var songTitle = argument;
      if (songTitle === "") {
        lookupSpecificSong();
      } else {
        getSongInfo(songTitle);
      }
      break;
    case "movie-this":
      var movieTitle = argument;
      if (movieTitle === "") {
        getMovieInfo("A Quiet Place");
      } else {
        getMovieInfo(movieTitle);
      }
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}

// Gets last 20 tweets

function getMyTweets() {
  var client = new Twitter(twitterKeysFile.twitterKeys);
  var paramaters = {q: '@SerZach', count: 5};

  client.get('search/tweets', paramaters, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.statuses.length; i++){
        var tweetText = tweets.statuses[i].text;
        console.log("Tweet Text: " + tweetText);
        var tweetCreationDate = tweets.statuses[i].created_at;
        console.log("Tweet Creation Date: " + tweetCreationDate);
      }
    } else {
      console.log(error);
    }
  })
}

// Retrieves song information from Spotify API
function getSongInfo(songTitle) {
  spotify.search({type: 'track', query: songTitle}, function (err, data) {
    if (err) {
      console.log.error(err);
      return
    }
    var artistsArray = data.tracks.items[0].album.artists;
    var artistsNames = [];

    for (var i = 0; i < artistsArray.length; i++){
      artistsNames.push(artistsArray[i].name);
    }
    var artists = artistsNames.join(", ");

    console.log("Artists: " + artists);
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Spotify Preview URL: " + data.tracks.items[0].preview_URL);
    console.log("Album Name: " + data.tracks.items[0].album.name);
  })
}

function lookupSpecificSong() {
  spotify.lookup({ type: 'track', id: '6rqhFgbbKwnb9MLmUQDhG6' }, function (err, data) {
    if (err) {
      console.log.error(err);
      return
    }
    console.log("Artist: " + data.artists[0].name);
    console.log("Song: " + data.name);
    console.log("Spotify Preview URL: " + data.preview_url);
    console.log("Album Name: " + data.album.name);
  })
}

function getMovieInfo(movieTitle) {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var movie = JSON.parse(body);

      // Prints out movie info.
      console.log("Movie Title: " + movie.Title);
      console.log("Release Year: " + movie.Year);
      console.log("IMDB Rating: " + movie.imdbRating);
      console.log("Country Produced In: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
      console.log("Rotten Tomatoes URL: " + movie.tomatoURL);
    }
  });
}

function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      console.log.error(err);
    } else {

      // Creates array with data.
      var array = data.split(",");

      // Sets action to first item in array.
      input = array[0];

      // Sets optional third argument to second item in array.
      argument = array[1];

      // Calls main controller to do something based on action and argument.
      action(input, argument);
    }
  });
}


function getThirdInput() {

  // Stores all possible arguments in array.
  argumentArray = process.argv;

  // Loops through words in node argument.
  for (var i = 3; i < argumentArray.length; i++) {
    argument += argumentArray[i];
  }
  return argument;
}

