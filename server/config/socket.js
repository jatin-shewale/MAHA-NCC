import { Server } from 'socket.io';

export const setupSocket = (server, clientUrl) => {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST'],
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
