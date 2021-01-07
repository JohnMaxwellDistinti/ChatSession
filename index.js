const app = require('express')();
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
  console.log('user connected - ' + newUserID);
  console.log('Users online right now: ' + users.toString());
  socket.on('disconnect', () => {
    users.filter((id) => id === newUserID);
    console.log('User ' + newUserID + ' has left the chat!');
  });
});

http.listen(5000, () => {
  console.log(`Listening on port ${PORT}`);
});
