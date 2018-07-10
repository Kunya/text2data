var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');
var config = require('./server/config.json');
var path = require('path');
var fs = require('fs');
var blacklist = require('express-blacklist');
var IPList = {};

var isProduction = false; //process.env.NODE_ENV === 'production';
var app = express();
app.use(function(req, res, next) {
  var ip = req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  if (req.headers['x-forwarded-for']) ip = ip || req.headers['x-forwarded-for'].split(',').pop();

  console.log('%s %s %s', req.method, req.url, ip);
  next();
});

//uncomment in PROD
var helmet = require('helmet');
app.use(helmet());
app.use(blacklist.blockRequests('./IP_Blacklist.txt'));


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

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  if (req.trueIP) {
    if (IPList[req.trueIP]) {
      IPList[req.trueIP] = IPList[req.trueIP] + 1;
    }
    else { IPList[req.trueIP] = 1; }

    if (IPList[req.trueIP] > 3) {
      blacklist.addAddress(req.trueIP);
    }

  }


  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



var http = require('http');
var server = http.createServer(app).listen(80, function() {
  console.log('Express HTTP server listening');
});


var https = require('https');
var httpsOptions = {
  key: fs.readFileSync(path.resolve(path.join('/root/.getssl/text2data.space', 'text2data.space.key'))),
  cert: fs.readFileSync(path.resolve(path.join('/root/.getssl/text2data.space', 'text2data.space.crt')))
};

var secureServer = https.createServer(httpsOptions, app);
jobAPI.io = require('socket.io').listen(server);

jobAPI.io.on('connection', function(socket) {
  // once a client has connected, we expect to get a ping from them saying what they want to track
  console.log("Client connected via Socket");

  socket.on('job', function(job) {
    console.log("Client connected to track job:" + job);
    socket.join(job);
  });

});


secureServer.listen(443, function() {
  console.log('Express HTTPS server listening');
});
