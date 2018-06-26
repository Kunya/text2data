var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');
var config = require('./server/config.json');
var path = require('path');
var fs = require('fs');

var isProduction = false; //process.env.NODE_ENV === 'production';
var app = express();
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

//uncomment in PROD
var helmet = require('helmet');
app.use(helmet());


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
  mongoose.connect(config.dataBase.connectionString);
}

app.get('/api/help', function(req, res) {
  res.status(200).send("W.I.P.");
});


//router.all('/api/*', requireAuthentication);
var userAPI = require('./server/userController.js');
var projectAPI = require('./server/projectCtrl.js');
var jobAPI = require('./server/jobControl.js');

app.use('/api/job', jobAPI.router);
app.use('/api/user', userAPI);
app.use('/api/project', projectAPI);




app.use(express.static(__dirname + '/text2data/dist', { index: 'index.html' }));

if (!isProduction) {
  app.use(errorhandler());
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var fs = require('fs');
  var file = path.join(__dirname, '/text2data/dist', req.path);
  console.log(file);

  if (fs.existsSync(file)) {
    console.log("File exists");
  }

  console.log(JSON.stringify(req.originalUrl));
  var err = new Error('Not Found:');
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


var http = require('http');
var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function() {
  console.log('Express HTTP server listening');
});

/*
var https = require('https');
var httpsOptions = {
  key: fs.readFileSync(path.resolve(path.join('/root/.getssl/text2data.space', 'text2data.space.key'))),
  cert: fs.readFileSync(path.resolve(path.join('/root/.getssl/text2data.space', 'text2data.space.crt')))
};

var server = https.createServer(httpsOptions, app);
server.listen(443, function() {
  console.log('Express HTTPS server listening' + app.address);
});
*/


jobAPI.io = require('socket.io').listen(server);
jobAPI.io.on('connection', function(socket) {
  // once a client has connected, we expect to get a ping from them saying what they want to track
  console.log("Client connected via Socket");

  socket.on('job', function(job) {
    console.log("Client connected to track job:" + job);
    socket.join(job);
  });

});
