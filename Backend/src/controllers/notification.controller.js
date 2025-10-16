import Notification from '../models/notification.model.js';
import { getIO } from '../config/socket.io.config.js';
import asyncHandler from '../utils/async.handeller.js';
import { ApiResponse } from '../utils/api.handeller.js'

export const createNotification = asyncHandler(async(req, res) => {
    const { userId, message, type } =  req.body;

    const notification = await Notification.create({user : userId, message, type});

    const io = getIO();

    const room = io.sockets.adapter.rooms.get(userId);
    if(room && room.size > 0){
        io.to(userId).emit("new-notification",notification);
    }

    res.status(201).json(
        new ApiResponse(201,notification,"notify successfully")
    )
})