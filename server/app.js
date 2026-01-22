// server/app.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const killPort = require("kill-port");
const getPort = require("get-port").default;
const productRoutes = require('./routers/productRoutes');
const authRoutes = require('./routers/authRoutes');
const sellerRoutes = require('./routers/sellerRoutes');

const checkPort = async (port, maxPort = 65535) => {
  if (port > maxPort) {
    throw new Error("No available ports found");
  }

  try {
    await killPort(port, "tcp");
    await killPort(port, "udp");

    return port;
  } catch (err) {
    return checkPort(port + 1, maxPort);
  }
};

require('dotenv').config();

const app = express();
const server = http.createServer(app);


const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, HTTP authentication) cross-origin
  optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
};

// Middleware
app.use(express.json());

//use cors
app.use(cors(corsOptions))

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller', sellerRoutes);

const parsedPort = parseInt(process.env.PORT, 10);
const PORT = parsedPort || 5000;

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log('New socket connection');

  // Listen for incoming messages and broadcast them to other clients
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

(async () => {
  const safePort = await checkPort(PORT);
  const final_port = await getPort({ port: safePort });

  server.listen(final_port, () =>
    console.log(`Server running on port ${final_port}`)
  );
})();