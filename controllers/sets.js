var mongoskin = require('mongoskin');
var db = mongoskin.db('localhost:27017/spacelet');
var sets = db.collection('sets');

exports.getSetForUser = function (setId, userId, cb) {
  console.log(setId, userId);
  sets.findOne({userId: userId, setId: setId}, cb);
};

exports.initializeSetForUser = function(setId, userId, title, terms, cb) {
  var document = {title: title, userId: userId, setId: setId, cards: []};
  for(var i = 0, len = terms.length; i < len; i++) {
    var card = terms[i];
    card.eFactor = 2.5;
    card.numRepetitions = 0;
    card.replayDate = null;
    card.lastPlayed = null;
    document.cards.push(card);
  }

  sets.insert(document, function(err, inserted){
    if(inserted.length !== undefined) {
      cb(err, inserted[0]);
    } else {
      cb(err, null);
    }
  });
};

exports.updateCards = function(setId, userId, cards, cb){
  sets.update({setId: setId, userId: userId}, {$set: {cards: cards}}, cb);
};
