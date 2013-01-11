/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./controllers/auth.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.methodOverride());
  app.use(auth.checkUser);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/sets/search', routes.searchSets);
app.get('/sets/:setId', function(req, res){
  res.redirect('/sets/'+req.params.setId+'/practice');
});
app.get('/sets/:setId/practice', routes.practiceSet);
app.post('/sets/:setId', routes.updateSet);

app.get('/login', routes.loginPage);
app.post('/login', routes.login);
app.get('/logout', routes.logout);

app.post('/signup', routes.signup);

app.get('/saved', routes.savedSets);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

