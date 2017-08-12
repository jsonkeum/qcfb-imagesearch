var mongo = require('mongodb').MongoClient;
var https = require('https');
//DB URI path is hidden
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var express = require('express');
var app = express();

var updateHistory = require("./updateHistory.js");
var historyRecord = require("./historyRecord.js");
var answer = require("./answer.js");

//Connects to database hosted elsewhere
mongo.connect(MONGODB_URI, function(err, db){
  if(err) throw err;

  //public folder used for serving static pages
  app.use(express.static('public'));
  app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });
  //declare database storing search history
  var history = db.collection(process.env.COLLECTION);

  //handle new search requests
  app.get("/api/:string", function (req,res) {
    var string = req.params.string;
    var offset = req.query.offset ? parseInt(req.query.offset) + 1 : 1;
    var results;
    //Calls Google Custom Search api for the image search results payload
    https.get(process.env.APIURI + string + "&start=" + offset, (response) => {
      response.setEncoding('utf8');
      var payload="";
      response.on('data', (data) => {
        payload += data;
      });
      response.on('end', function(){
        results = answer(JSON.parse(payload).items);
        //Enters new search record into the image search history before sending the payload response.
        if(results){
          history.find({_id:process.env.ID}).toArray(function(err, docs){
            if(err) throw err;
            var newHistory = updateHistory(historyRecord(string),docs[0].history);
            history.update(
              {_id:process.env.ID},
              {history:newHistory},
              function(err) {
                if(err) throw err;
                res.json(results);
              }
            )
          })
        }
      })
    }).on('error', (e) => {
      throw e;
    })
  });

  //handle request for search history
  app.get("/history", function(req, res){
    history.find({_id:process.env.ID}).toArray(function(err, docs){
      if(err) throw err;
      res.json(docs[0].history);
    });
  });

  //Express server listener
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});
