import Message from "../models/message.model.js";

export const registerChatHandler = (io) => {
  io.on("connection", (socket) => {
    const currentUserId = socket.user?.id || socket.user?._id;

    // Join room for chat
    socket.on("join-chat", (userId) => {
      const room = userId || currentUserId;
      if (room) {
        socket.join(room.toString());
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ receiverId, isTyping }) => {
      if (receiverId && currentUserId) {
        socket.to(receiverId.toString()).emit("user-typing", {
          senderId: currentUserId.toString(),
          isTyping,
        });
      }
    });

    // Mark messages as read
    socket.on("mark-chat-read", async ({ participantId }) => {
      if (currentUserId && participantId) {
        try {
          await Message.updateMany(
            { sender: participantId, receiver: currentUserId, read: false },
            { $set: { read: true } }
          );
          socket.to(participantId.toString()).emit("messages-read", {
            readBy: currentUserId.toString(),
          });
        } catch (err) {
          console.error("Error marking messages read via socket:", err.message);
        }
      }
    });
  });
};
