var http = require('http'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');

var config = require('./server/config.json');
var isProduction = false; //process.env.NODE_ENV === 'production';

var app = express();

//uncomment in prov - 
//var helmet = require('helmet');
//app.use(helmet());


app.disable('x-powered-by');
// Normal express config defaults
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(bodyParser.json({ limit: '1mb' }));


mongoose.Promise = global.Promise;
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  var config = require('./server/config.json');
  mongoose.connect(config.dataBase.connectionString, { useMongoClient: true });
}

/*app.get('/api/help', function(req, res) {
  res.status(200).send("W.I.P.");
});
*/

//router.all('/api/*', requireAuthentication);
var userAPI = require('./server/userController.js');
var projectAPI = require('./server/projectCtrl.js');
var jobAPI = require('./server/jobControl.js');

app.use('/api/user', userAPI);
app.use('/api/project', projectAPI);
app.use('/api/job', jobAPI);



app.use(express.static(__dirname + '/text2data/dist'));

if (!isProduction) {
  app.use(errorhandler());
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + server.address().port);
});
