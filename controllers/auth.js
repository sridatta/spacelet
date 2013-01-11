var mongoskin = require('mongoskin');
var db = mongoskin.db('localhost:27017/spacelet');
var users = db.collection('users');
var sets = db.collection('sets');

var crypto = require('crypto');

exports.checkUser = function(req, res, next) {
  if(!req.session.userId) {
    var nonce = Math.random().toString(36).substring(7);
    req.session.userId = "guest-"+nonce;
    req.session.authenticated = false;
  }
  next();
};

exports.login = function(userId, password, cb) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(password);
  var hashed = md5sum.digest("hex");

  users.findOne({userId: userId, password: hashed}, function(err, result) {
    if(result){
      cb(true);
    } else {
      cb(false);
    }
  });
};


exports.signup = function(userId, password, tempId, cb) {
  users.findOne({userId: userId}, function(err, result) {
    if(!result){
      console.log("username is valid!");
      var md5sum = crypto.createHash('md5');
      md5sum.update(password);
      var hashed = md5sum.digest("hex");
      var document = {userId: userId, password: hashed};
      users.insert(document, function(err, result){
        console.log("inserted user");
        if(result){
          sets.update({userId: tempId}, {$set: {userId: userId}}, function(){
            console.log("migrated guest");
            cb(true);
          });
        }
      });
    } else {
      cb(false);
    }
  });
};
