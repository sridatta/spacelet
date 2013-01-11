var quizlet = require('../controllers/quizlet');
var auth = require('../controllers/auth');
var sets = require('../controllers/sets');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var sampleQuery = "Roman history";
  res.render('index', {query: sampleQuery, sets: sampleResults, authenticated: req.session.authenticated});
};

exports.searchSets = function(req, res) {
  quizlet.searchSets(req.query.q, function(error, sets) {
    if(error) {
      res.render('ajax', {obj: [], layout: false});
      return;
    }
    res.render('ajax', {obj: sets, layout: false});
  });
};

exports.practiceSet = function(req, res) {
  var setId = req.params.setId;
  var userId = req.session.userId;

  sets.getSetForUser(setId, userId, function(err, set){
    if(err) {
      res.send(500);
      return;
    }

    if(!set){
      quizlet.fetchSet(setId, function(err, set) {
        if(err) {
          res.send(500);
          return;
        }

        var title = set.title;
        var terms = set.terms;
        sets.initializeSetForUser(setId, userId, title, terms, function(error, dbSet){
          if(!error && dbSet !== undefined) {
            set = dbSet;
            res.render('practice', {setTitle: set.title, setCards: set.cards, authenticated: req.session.authenticated});
          }
        });
      });
    } else {
      res.render('practice', {setTitle: set.title, setCards: set.cards, authenticated: req.session.authenticated});
    }
  });
};

exports.updateSet = function(req, res) {
  if(req.body && req.body.cards && req.body.setId){
    sets.updateCards(req.body.setId, req.session.userId, req.body.cards, function(err, result){
      if(err) {
        console.log(err);
        res.send(400);
        return;
      }
      res.send(200);
    });
  } else {
    res.send(400);
  }
};

exports.loginPage = function(req, res) {
  res.render('login', {authenticated: req.session.authenticated});
};

exports.logout = function(req, res){
  delete req.session.userId;
  res.redirect('/');
};

exports.login = function(req, res) {
  auth.login(req.body.username, req.body.password, function(success){
    if(success){
      req.session.userId = req.body.username;
      req.session.authenticated = true;
      res.redirect('/');
    } else {
      res.redirect('/login?loginFailed=true');
    }
  });
};

exports.signup = function (req, res) {
  auth.signup(req.body.username, req.body.password, req.session.userId, function(success){
     if(success){
      req.session.userId = req.body.username;
      req.session.authenticated = true;
      res.redirect('/');
     } else {
      res.redirect('/login?userExists=true');
     }
  });
};


var sampleResults = [
        {
            "id": 10089368,
            "url": "http:\/\/quizlet.com\/10089368\/roman-history-and-the-city-of-rome-review-flash-cards\/",
            "title": "Roman History and the City of Rome Review",
            "created_by": "wcshraffi",
            "term_count": 42,
            "created_date": 1329508998,
            "modified_date": 1329967894,
            "has_images": false,
            "subjects": [
                "Latin",
                "Roman history",
                "Rome"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10234583,
            "url": "http:\/\/quizlet.com\/10234583\/roman-history-review-flash-cards\/",
            "title": "Roman History Review",
            "created_by": "wcshraffi",
            "term_count": 64,
            "created_date": 1330053959,
            "modified_date": 1330054229,
            "has_images": false,
            "subjects": [
                "Latin",
                "Rome",
                "Roman history"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 17905960,
            "url": "http:\/\/quizlet.com\/17905960\/roman-history-government-and-society-flash-cards\/",
            "title": "Roman History, Government, and Society",
            "created_by": "Fulminator",
            "term_count": 58,
            "created_date": 1356017507,
            "modified_date": 1356017507,
            "has_images": false,
            "subjects": [
                "Latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 9912316,
            "url": "http:\/\/quizlet.com\/9912316\/nle-roman-history-govt-flash-cards\/",
            "title": "NLE Roman History & Govt.",
            "created_by": "scrappyjab",
            "term_count": 22,
            "created_date": 1328973386,
            "modified_date": 1357303485,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 15839620,
            "url": "http:\/\/quizlet.com\/15839620\/eagle-roman-history-flash-cards\/",
            "title": "Eagle Roman history",
            "created_by": "firemandan",
            "term_count": 50,
            "created_date": 1351733481,
            "modified_date": 1351733481,
            "has_images": false,
            "subjects": [
                "Latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 14789742,
            "url": "http:\/\/quizlet.com\/14789742\/roman-history-dates-flash-cards\/",
            "title": "Roman History Dates",
            "created_by": "hyphenation",
            "term_count": 49,
            "created_date": 1349559589,
            "modified_date": 1349559589,
            "has_images": false,
            "subjects": [
                "history"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 12439555,
            "url": "http:\/\/quizlet.com\/12439555\/roman-history-important-dates-flash-cards\/",
            "title": "Roman History-Important Dates",
            "created_by": "Simidamonkey",
            "term_count": 20,
            "created_date": 1338397334,
            "modified_date": 1338397334,
            "has_images": false,
            "subjects": [
                "Roman History"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 17273504,
            "url": "http:\/\/quizlet.com\/17273504\/major-battles-in-roman-history-flash-cards\/",
            "title": "Major Battles in Roman History",
            "created_by": "micki617",
            "term_count": 30,
            "created_date": 1354911571,
            "modified_date": 1356661788,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10229628,
            "url": "http:\/\/quizlet.com\/10229628\/roman-history-vocabulary-flash-cards\/",
            "title": "Roman History Vocabulary",
            "created_by": "emily722",
            "term_count": 24,
            "created_date": 1330045916,
            "modified_date": 1330046513,
            "has_images": false,
            "subjects": [
                "History"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 11210946,
            "url": "http:\/\/quizlet.com\/11210946\/greco-roman-history-key-terms-flash-cards\/",
            "title": "Greco-Roman history key terms",
            "created_by": "bradr",
            "term_count": 58,
            "created_date": 1333679826,
            "modified_date": 1333679826,
            "has_images": false,
            "subjects": [
                "new testament"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10204876,
            "url": "http:\/\/quizlet.com\/10204876\/important-dates-in-roman-history-flash-cards\/",
            "title": "Important Dates in Roman History",
            "created_by": "wcshraffi",
            "term_count": 17,
            "created_date": 1329969104,
            "modified_date": 1329969104,
            "has_images": false,
            "subjects": [
                "Latin",
                "Rome",
                "Roman history",
                "dates"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 7829448,
            "url": "http:\/\/quizlet.com\/7829448\/roman-history-chapter-15-flash-cards\/",
            "title": "Roman History Chapter 15",
            "created_by": "chickenwangs",
            "term_count": 39,
            "created_date": 1320732231,
            "modified_date": 1320778063,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 16494564,
            "url": "http:\/\/quizlet.com\/16494564\/major-battles-in-roman-history-flash-cards\/",
            "title": "Major Battles in Roman History",
            "created_by": "BeardenPenguin",
            "term_count": 27,
            "created_date": 1353085524,
            "modified_date": 1353887332,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 6920656,
            "url": "http:\/\/quizlet.com\/6920656\/early-roman-history-quiz-w-extra-credit-flash-cards\/",
            "title": "Early Roman History Quiz w\/ Extra Credit",
            "created_by": "olp2121",
            "term_count": 41,
            "created_date": 1317475468,
            "modified_date": 1317475843,
            "has_images": false,
            "subjects": [
                "latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 6337409,
            "url": "http:\/\/quizlet.com\/6337409\/roman-history-aabb-flash-cards\/",
            "title": "Roman History AABB",
            "created_by": "nkauffman",
            "term_count": 34,
            "created_date": 1315079601,
            "modified_date": 1315401737,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10524054,
            "url": "http:\/\/quizlet.com\/10524054\/roman-history-packet-7-flash-cards\/",
            "title": "Roman History Packet 7",
            "created_by": "firemandan",
            "term_count": 33,
            "created_date": 1331039168,
            "modified_date": 1332971001,
            "has_images": false,
            "subjects": [
                "Latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10112604,
            "url": "http:\/\/quizlet.com\/10112604\/level-4-roman-history-flash-cards\/",
            "title": "Level 4 - Roman History",
            "created_by": "karp1248",
            "term_count": 51,
            "created_date": 1329689552,
            "modified_date": 1329689552,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 789298,
            "url": "http:\/\/quizlet.com\/789298\/roman-history-govt-society-flash-cards\/",
            "title": "Roman History, Gov't, Society",
            "created_by": "vmdever",
            "term_count": 34,
            "created_date": 1236618157,
            "modified_date": 1296595970,
            "has_images": false,
            "subjects": [
                "vmdever"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 1906078,
            "url": "http:\/\/quizlet.com\/1906078\/roman-history-government-and-society-flash-cards\/",
            "title": "Roman History, Government and Society",
            "created_by": "vmdever",
            "term_count": 39,
            "created_date": 1267122787,
            "modified_date": 1268322626,
            "has_images": false,
            "subjects": [
                "vmdever"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 3956130,
            "url": "http:\/\/quizlet.com\/3956130\/roman-history-flash-cards\/",
            "title": "Roman History",
            "created_by": "belled",
            "term_count": 47,
            "created_date": 1294600579,
            "modified_date": 1294603110,
            "has_images": false,
            "subjects": [
                "world history i"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10112575,
            "url": "http:\/\/quizlet.com\/10112575\/level-2-roman-history-flash-cards\/",
            "title": "Level 2 - Roman History",
            "created_by": "karp1248",
            "term_count": 57,
            "created_date": 1329689440,
            "modified_date": 1329689440,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10112614,
            "url": "http:\/\/quizlet.com\/10112614\/level-5-roman-history-flash-cards\/",
            "title": "Level 5 - Roman History",
            "created_by": "karp1248",
            "term_count": 46,
            "created_date": 1329689600,
            "modified_date": 1329689600,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 9029915,
            "url": "http:\/\/quizlet.com\/9029915\/va-sol-roman-history-flash-cards\/",
            "title": "VA SOL Roman History",
            "created_by": "magisterwick",
            "term_count": 40,
            "created_date": 1326103721,
            "modified_date": 1326103721,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 8750270,
            "url": "http:\/\/quizlet.com\/8750270\/dates-for-roman-history-ch-1-16-flash-cards\/",
            "title": "Dates for Roman History Ch 1-16",
            "created_by": "chickenwangs",
            "term_count": 33,
            "created_date": 1323933445,
            "modified_date": 1323933445,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 1484516,
            "url": "http:\/\/quizlet.com\/1484516\/roman-history-study-guides-flash-cards\/",
            "title": "Roman History - Study Guides",
            "created_by": "14urvig",
            "term_count": 56,
            "created_date": 1259272518,
            "modified_date": 1259272518,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 11114774,
            "url": "http:\/\/quizlet.com\/11114774\/roman-history-powerpoint-quiz-flash-cards\/",
            "title": "Roman history powerpoint quiz",
            "created_by": "firemandan",
            "term_count": 50,
            "created_date": 1333329452,
            "modified_date": 1333378665,
            "has_images": false,
            "subjects": [
                "Latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 10112592,
            "url": "http:\/\/quizlet.com\/10112592\/level-3-roman-history-flash-cards\/",
            "title": "Level 3 - Roman History",
            "created_by": "karp1248",
            "term_count": 73,
            "created_date": 1329689492,
            "modified_date": 1329689492,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 15926074,
            "url": "http:\/\/quizlet.com\/15926074\/dates-in-roman-history-flash-cards\/",
            "title": "Dates in Roman History",
            "created_by": "missceelei",
            "term_count": 25,
            "created_date": 1351960307,
            "modified_date": 1352329848,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 16896744,
            "url": "http:\/\/quizlet.com\/16896744\/significant-figures-in-roman-history-flash-cards\/",
            "title": "Significant Figures in Roman History",
            "created_by": "deFontie",
            "term_count": 16,
            "created_date": 1354231689,
            "modified_date": 1354231689,
            "has_images": false,
            "subjects": [
                "Latin"
            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        },
        {
            "id": 2287729,
            "url": "http:\/\/quizlet.com\/2287729\/roman-history-britta-flash-cards\/",
            "title": "Roman History Britta",
            "created_by": "richjess",
            "term_count": 27,
            "created_date": 1273545227,
            "modified_date": 1274028965,
            "has_images": false,
            "subjects": [

            ],
            "visibility": "public",
            "editable": "only_me",
            "has_access": true
        }
    ];
