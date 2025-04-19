const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register', (userId) => {
    users[socket.id] = userId;
    socket.broadcast.emit('user-connected', userId);
    io.to(socket.id).emit('user-list', Object.values(users).filter(id => id !== userId));
  });

  // Handle offer
  socket.on('offer', (data) => {
    io.to(Object.keys(users).find(key => users[key] === data.target)).emit('offer', {
      offer: data.offer,
      sender: users[socket.id]
    });
  });

  // Handle answer
  socket.on('answer', (data) => {
    io.to(Object.keys(users).find(key => users[key] === data.target)).emit('answer', {
      answer: data.answer,
      sender: users[socket.id]
    });
  });

  // Handle ICE candidate
  socket.on('ice-candidate', (data) => {
    io.to(Object.keys(users).find(key => users[key] === data.target)).emit('ice-candidate', {
      candidate: data.candidate,
      sender: users[socket.id]
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user-disconnected', userId);
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
