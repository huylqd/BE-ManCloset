import {Socket} from 'socket.io'

var onlineUsers = new Map();
export const SocketServer = (socket: Socket) => {

  // chat
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('sendMsg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.msg)
    }
  })

  socket.on('updateOrderStatus', (data) => {
    console.log('Received order status update:', data);
    socket.broadcast.emit('orderStatusUpdated', data);
  })

  
}