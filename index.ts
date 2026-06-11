import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db';
import app from './app';


// Connect DB
connectDB();

const PORT: number = Number(process.env.PORT) || 3001;

const server = http.createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Attach io to express app
app.set('io', io);

// Socket events
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Socket connected: ${socket.id}`);
  }

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Socket disconnected: ${socket.id}`);
    }
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});