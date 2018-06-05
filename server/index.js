var express = require('express');
var bodyParser = require('body-parser');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
var items = require('../database-mongo');

var app = express();

var socket = require('socket.io');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.status(500).end();
    } else {
      res.json(data);
    }
  });
});

app.post('/items', function (req, res) {
  const { name, message } = req.body;
  items.saveMessage({'name': name, 'message': message}, (err) => {
    if (err) {
      console.log('Error in saving message to the database');
      res.status(404).end();
    } else {
      res.end('Message saved');
    }
  });
});

var server = app.listen(process.env.PORT || 5000, function() {
  console.log('listening on port ', process.env.PORT || 5000);
});

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    socket.on('chat', (data) => {
      console.log('Received chat!', data);
      io.sockets.emit('chat', data);
    })

});

