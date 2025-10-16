import Notification from '../models/notification.model';
import { getIO } from '../config/socket.io.config.js';
import asyncHandler from './async.handeller.js';


export const sendNotification = asyncHandler(async(userId,message,type = 'general',meta = {}) => {

    const notification = await Notification.create({
        user:userId,
        message,
        type,
        meta
    });

    const io = getIO();
    const room = io.sockets.adapter.rooms.get(userId.toString());
    if(room && room.size > 0){
        io.to(userId.toString()).emit("new-notification",notification);
    }
    return notification;
})