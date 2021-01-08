const app = require('express')();
const { time } = require('console');
//const uuid = require('uuid');

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require('unique-names-generator');

const http = require('http').createServer(app);
const socketio = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

let users = [];
let history = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

socketio.on('connection', (socket) => {
  //  Create a random animal username
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
  });

  //  Load message history
  socketio.emit('load', history);

  users.push(username);
  //console.log('user connected - ' + username);
  console.log(
    'Users online right now: ' + users.toString() + '\n' + '~~~~~~~~~~~~~~~'
  );

  socket.on('disconnect', () => {
    users = users.filter((name) => name !== username);
    //console.log('User ' + username + ' has left the chat!');
    console.log(
      'Users online right now: ' + users.toString() + '\n' + '~~~~~~~~~~~~~~~'
    );
  });

  socket.on('chat message', (msg) => {
    socketio.emit('chat message', {
      msg: msg,
      id: username,
    });
    history.push({
      message: msg,
      userID: username,
      time: Date.now(),
    });
  });
});

http.listen(5000, () => {
  console.log(`Listening on port ${PORT}`);
});
