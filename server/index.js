var express = require('express');
var bodyParser = require('body-parser');

var messages = require('../database-mongo');

var app = express();

var socket = require('socket.io');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/messages', (req, res) => {
  messages.selectAll((err, data) => {
    if(err) {
      res.status(404).end();
    } else {
      res.json(data);
    }
  });
});

app.post('/messages',(req, res) => {
  const { name, message } = req.body;
  messages.saveMessage({'name': name, 'message': message}, (err) => {
    if (err) {
      console.log('Error in saving message to the database');
      res.status(500).end();
    } else {
      res.end('Message saved');
    }
  });
});

var server = app.listen(process.env.PORT || 5000, () => {
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

