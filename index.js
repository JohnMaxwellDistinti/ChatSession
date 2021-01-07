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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

socketio.on('connection', (socket) => {
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
  });
  //const newUserID = uuid.v4();
  users.push(username);
  console.log('~~~~~~~~~~~~~');
  console.log('user connected - ' + username);
  console.log('~~~~~~~~~~~~~');
  console.log('Users online right now: ' + users.toString());
  socket.on('disconnect', () => {
    users = users.filter((name) => name !== username);
    console.log('User ' + username + ' has left the chat!');
    //console.log('Users online right now: ' + users.toString());
  });
});

http.listen(5000, () => {
  console.log(`Listening on port ${PORT}`);
});
