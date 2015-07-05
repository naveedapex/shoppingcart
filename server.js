
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
    jwt=require('jsonwebtoken')
  //routes = require('./routes'),
 // api = require('./routes/api'),
  http = require('http'),
  fs=require('fs'),
  path = require('path');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/cart');

var app = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.set('superSecret','superSecret');
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
 // app.use(express.errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials

//app.get('/partials/:name', routes.partials);

// JSON API
//app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
//app.get('*', routes.

require(__dirname+'/app/models/cartModel.js');
var routes_path = __dirname + '/app/routes';
require('./app/routes/index.js')(app);
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
		
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app);
            }
        // We skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a 
        // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
//walk(routes_path);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
