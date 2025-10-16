import Notification from '../models/notification.model';

export const registerNotificationHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected", socket.id);

        socket.on("join", async(userId) => {
            socket.join(userId.toString());
            console.log(`User ${userId} joint their room.`);

            try {
                const unread = await Notification.find({ user: userId , isRead: false}).sort({ createdAt: -1 })
                if(unread.length > 0){
                    io.on(userId).emit("unread-notification", unread)
                }
            } catch (error) {
                console.error("Error fetching unread notifications : " , error.message);
            }
        })

        socket.on("mark-as-read", async(notificationId) => {
            try {
                await Notification.findByIdAndUpdate(notificationId, { isRead : true });
                console.log("Notification marked as read:",notificationId);
            } catch (error) {
                console.error("Error marking as read:",error.message);
            }
        });

        socket.on("disconnected", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};