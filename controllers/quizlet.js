var request = require('request');

var quizlet = {
  ENDPOINT: "https://api.quizlet.com/2.0",
  CLIENT_ID: "Yvb6VJ8UfV",
  SECRET_KEY: "3NsQp1HUWGOij6nPXN50ng"
};


exports.searchSets = function (query, cb) {
  var searchQs = {per_page: 10, client_id: quizlet.CLIENT_ID, q: query};
  request({url: quizlet.ENDPOINT+"/search/sets", qs: searchQs}, function(e, r, body) {
    if(!e && r.statusCode == 200) {
      var sets = JSON.parse(body).sets;
      cb(undefined, sets);
    } else {
      cb({message:"Invalid search"});
    }
  });

};

exports.getIdFromURL = function(theURL) {
  var parsedURL = url.parse(theURL);
  return parsedURL.pathname.split('/')[0];
};

exports.fetchSet = function(setId, cb) {
  var qs = {client_id: quizlet.CLIENT_ID};
  request({url: quizlet.ENDPOINT+"/sets/"+setId, qs: qs}, function(e, r, body) {
     if(!e && r.statusCode == 200) {
      var set = JSON.parse(body);
      cb(undefined, set);
    } else {
      cb({message:"Could not fetch set"});
    }
  });
};
