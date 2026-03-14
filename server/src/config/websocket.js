import Message from "../models/messageModel.js";
const OnlineUsers = {};

const WebSocket = (io) => {
  console.log("🔌 Socket Connected");

  io.on("connection", (socket) => {
    socket.on("createPath", (userID) => {
      OnlineUsers[userID] = socket.id;
      console.log("OnlineUsers", OnlineUsers);
      io.emit("onlineUsers",OnlineUsers)
    });

    socket.on("destroyPath", (userID) => {
      delete OnlineUsers[userID];
      console.log("OnlineUsers", OnlineUsers);
      io.emit("onlineUsers",OnlineUsers)
    });

    socket.on("send", async (messagePacket) => {
      console.log("Message Packet", messagePacket);

      const newMessage = await Message.create({
        senderId: messagePacket.senderId,
        receiverId: messagePacket.receiverId,
        message: messagePacket.message,
      });

      const NewMessagePack = newMessage.toObject();
      delete NewMessagePack._id;
      delete NewMessagePack.__v;

      console.log("New Message", newMessage);

      const receiverSocketId = OnlineUsers[messagePacket.receiverId]
      if(receiverSocketId){
        io.to(receiverSocketId).emit("receive",NewMessagePack)
      }
    });
  });
};

export default WebSocket;