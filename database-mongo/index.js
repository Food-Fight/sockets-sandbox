var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_0l61t1lh:m517foi3891b0vu1985qmo1rcp@ds135810.mlab.com:35810/heroku_0l61t1lh');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var messageSchema = mongoose.Schema({
  name: String,
  message: String
});

var Message= mongoose.model('Message', messageSchema);

var selectAll = function(callback) {
  Message.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

var saveMessage = function(message, callback) {
  new Message({
    name: message.name,
    message: message.message
  }).save((err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

module.exports = {
  saveMessage: saveMessage,
  selectAll: selectAll,
}