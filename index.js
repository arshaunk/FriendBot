var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var app = express()
var db = null

var url = "mongodb://root:Nishank@ds019101.mlab.com:19101/friendbotdb"
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db = database
});

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'test123') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            
            if (sender == 1134345316597574) {
            	sendTextMessage(854092591384757, text)
        	} else if (sender == 854092591384757) {
        		sendTextMessage(1134345316597574, text)
        	}
        }
    }
    res.sendStatus(200)
})

var token = "CAAGZCjqmOZAN0BAHdHJ5KqHuxZCekEMGV0maLkq2UQXDApJ9FEKto041YOE1JLYEHZCRyB3jcb5RAi7p0gAh4HBZAZC798u7axmkAbno9kGF9YZCEdZBk9qK8F68BZBnLatoZAexaIxfwueIWyZCgWFKk9ZA5wmhckKh3LHTju47yiSUPzgLclle9ZBR5ZCHH4KVLmb5ZAZB6h92AIdXiwZDZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

var addUser = function(db, callback, user, name) {
    var collection = db.collection('allusers');
    collection.insert({
        Name: name,
        id: user
    }, function(err, returnedUser){
        if (err) throw err
    })
}





