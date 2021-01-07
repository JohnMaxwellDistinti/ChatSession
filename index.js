const app = require('express')();
const { time } = require('console');
const uuid = require('uuid');
const http = require('http').createServer(app);
const socketio = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

socketio.on('connection', (socket) => {
  const newUserID = uuid.v4();
  users.push(newUserID);
  console.log('~~~~~~~~~~~~~');
  console.log('user connected - ' + newUserID);
  console.log('~~~~~~~~~~~~~');
  console.log('Users online right now: ' + users.toString());
  socket.on('disconnect', () => {
    users = users.filter((id) => {
      id.toString() !== newUserID.toString();
    });
    console.log('User ' + newUserID + ' has left the chat!');
    console.log('Users online right now: ' + users.toString());
  });
});

http.listen(5000, () => {
  console.log(`Listening on port ${PORT}`);
});
