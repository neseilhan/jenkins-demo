var express = require('express');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get('/profile-picture', function (req, res) {
  var img = fs.readFileSync('/home/app/images/profile-1.jpg');
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.post('/update-profile', function (req, res) {
  var userObj = req.body;

  MongoClient.connect("mongodb://admin:password@mongodb", function (err, client) {
    if (err) throw err;

    var db = client.db('my-db');
    userObj['userid'] = 1;
    
    var myquery = { userid: 1 };
    var newvalues = { $set: userObj };
    
    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  var response = {};
  // Connect to the db
  MongoClient.connect("mongodb://admin:password@mongodb", function (err, client) {
    if (err) throw err;

    var db = client.db('my-db');

    var myquery = { userid: 1 };
    
    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();
      
      // Send response
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
