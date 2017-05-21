var express = require('express');
var multer = require('multer');
var uuid =  require('node-uuid');
var request = require('request');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ObjectStorage = require('bluemix-object-storage');
var OpenWhisk = require('openwhisk');

var Twitter = require('twitter');

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var watson = require('watson-developer-cloud');

var extend = require('util')._extend;
//var i18n = require('i18next');

var app = express();
var storage = multer.memoryStorage();
var uploadr = multer({storage: storage});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//i18n settings
//require('../config/i18n')(app);

// Bootstrap application settings
//require('../config/express')(app);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('[LISTENING] - port:', process.env.PORT, 'ip:', process.env.IP);
});

app.post('/nodered', function(req, res){
  var o = JSON.parse(req.body.payload);

  console.log('Request to NodeRED:', o);
  request(o, function(e, r, b){
    console.log('Response from NodeRED:', b);
    res.send({error: e, status: r.statusCode, request: o, response: b});
  });
});

app.post('/openwhisk', function(req, res){
  var o = JSON.parse(req.body.payload);

  console.log('Request to OpenWhisk:', o);
  OpenWhisk(o.org, o.space, o.action, process.env.OPENWHISK, o.payload)
  .then(function(r){
    console.log('Response from OpenWhisk:', r);
    res.send(r);
  });
});

// ------------------------------------------------------------------------- //
// ------------------------------------------------------------------------- //
// ROUTES //
// ------------------------------------------------------------------------- //

app.get('/hello', function(req, res){
  res.send({payload: 'world'});
});

app.get('/tweets', function(req, res){

 //       console.log("req: "+JSON.stringify(req.query));

var client = new Twitter ({
        consumer_key: 'HwhwHpy4WyOWigCmObQE5DWVU',
        consumer_secret: 'lGXgjNDiWa5lMx2QdztWi6ZtwBs8DsaUlrHUPZXzo4QMmjIzEX',
        access_token_key: '743533649862103042-gB6KZ2eiqcyWYIxw5mBbOcB0fD9R120',
        access_token_secret: 'hesbvKtV6aoaj9nMUh4SNTiqZbYxdnroPwjjxFoKOCk38'
      });

        var params = req.query;
  //     $http.get('/tweets').then(function(response) {

      client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
          console.log("OK: got tweets...");
        }
        else {
          console.log("Error: " + JSON.stringify(error));
        }

        res.send(tweets);

      });
});


var personalityInsights = watson.personality_insights({
  version: 'v2',
  username: '002b8c93-6fdd-43a3-89a4-78960dff5301',
  password: '5gM5O1n6Fyis'
});


app.post('/api/myprofile', function(req, res, next) {
  var parameters = extend(req.body, { acceptLanguage : 'en' });

//  console.log("parameters : "+JSON.stringify(parameters));

  personalityInsights.profile(parameters, function(err, profile) {
      res.send(profile);
  });
});

app.post('/api/celprofile', function(req, res, next) {
  var parameters = extend(req.body, { acceptLanguage : 'en' });

  //console.log("parameters : "+JSON.stringify(parameters));

  personalityInsights.profile(parameters, function(err, profile) {
      return res.json(profile);
  });
});



