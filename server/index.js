var express = require('express');
var multer = require('multer');
var uuid =  require('node-uuid');
var request = require('request');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ObjectStorage = require('bluemix-object-storage');
var OpenWhisk = require('openwhisk');

var Twitter = require('twitter');

var app = express();
var storage = multer.memoryStorage();
var uploadr = multer({storage: storage});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

        console.log("req: "+JSON.stringify(req.query));

var client = new Twitter ({
        consumer_key: 'HwhwHpy4WyOWigCmObQE5DWVU',
        consumer_secret: 'lGXgjNDiWa5lMx2QdztWi6ZtwBs8DsaUlrHUPZXzo4QMmjIzEX',
        access_token_key: '743533649862103042-gB6KZ2eiqcyWYIxw5mBbOcB0fD9R120',
        access_token_secret: 'hesbvKtV6aoaj9nMUh4SNTiqZbYxdnroPwjjxFoKOCk38'
      });

 /*     var params = {
        screen_name: 'V12345Valery',
        count: 5,
        include_rts: false
      };
*/
        var params = req.query;
  //     $http.get('/tweets').then(function(response) {

      client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
          console.log("OK: got tweets...");
        }
        else {
          console.log("Error: " + error);
        }

        res.send(tweets);

      });
/*
  request('http://bluemixphuc1.mybluemix.net/coffeetweets', function(error, response, body) {
    console.log("error:", error);
    console.log("status:", response.statusCode);
    res.send(body);
  })
*/
});