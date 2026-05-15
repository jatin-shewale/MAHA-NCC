import { Server } from 'socket.io';
import { createOriginChecker } from "./origins.js";

export const setupSocket = (server, clientUrls) => {
  const isAllowedOrigin = createOriginChecker(clientUrls);
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Socket origin not allowed: ${origin}`));
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-unit', (unitName) => {
      socket.join(unitName);
      console.log(`User joined unit: ${unitName}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
