// server.js - Updated for Railway
const { Server } = require("socket.io");
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'GuardianEye Server' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Use Railway's port or default to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GuardianEye Server running on port ${PORT}`);
});

// Your existing Socket.io logic here
io.on("connection", (socket) => {
  console.log("Device connected:", socket.id);
  
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on("video_frame", (data) => {
    socket.to("family-1").emit("video_frame", data);
  });

  socket.on("sensor_data", (data) => {
    socket.to("family-1").emit("sensor_data", data);
  });

  socket.on("command", (data) => {
    socket.to("family-1").emit("command", data);
  });
  
  socket.on("alert", (data) => {
    socket.to("family-1").emit("alert", data);
  });
});
