import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Provider from "../models/provider.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiResponse, ApiError } from "../utils/api.handeller.js";

// GET all conversations for current user
export const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Find all distinct communication partners from messages
  const messagePartners = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      },
    },
    {
      $project: {
        partnerId: {
          $cond: [{ $eq: ["$sender", currentUserId] }, "$receiver", "$sender"],
        },
        text: 1,
        createdAt: 1,
        read: 1,
        sender: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$partnerId",
        lastMessage: { $first: "$text" },
        lastMessageTime: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$sender", "$partnerId"] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const partnerIds = messagePartners.map((p) => p._id);

  // Also include contacts from recent orders if no prior messages exist
  const orderConditions = [{ customer: currentUserId }];
  if (req.user?.providerProfile) {
    orderConditions.push({ provider: req.user.providerProfile });
  }

  const orders = await Order.find({ $or: orderConditions })
    .populate("customer", "_id fullName avatar isProvider")
    .populate({
      path: "provider",
      populate: { path: "user", select: "_id fullName avatar isProvider" },
    })
    .limit(10)
    .lean();

  const orderPartnerMap = new Map();
  orders.forEach((o) => {
    let otherUser = null;
    if (o.customer?._id?.toString() === currentUserId.toString()) {
      otherUser = o.provider?.user;
    } else {
      otherUser = o.customer;
    }
    if (otherUser && otherUser._id?.toString() !== currentUserId.toString()) {
      const idStr = otherUser._id.toString();
      if (!orderPartnerMap.has(idStr) && !partnerIds.some((p) => p.toString() === idStr)) {
        orderPartnerMap.set(idStr, otherUser);
      }
    }
  });

  // Fetch user info for message partners
  const users = await User.find({ _id: { $in: partnerIds } })
    .select("_id fullName avatar isProvider")
    .lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const conversations = [];

  messagePartners.forEach((p) => {
    const userDoc = userMap.get(p._id.toString());
    if (userDoc) {
      conversations.push({
        id: userDoc._id.toString(),
        participantId: userDoc._id.toString(),
        participantName: userDoc.fullName || "User",
        participantAvatar:
          userDoc.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userDoc.fullName || "User"
          )}&background=6366f1&color=fff`,
        participantRole: userDoc.isProvider ? "provider" : "customer",
        lastMessage: p.lastMessage || "",
        lastMessageTime: p.lastMessageTime || new Date().toISOString(),
        unreadCount: p.unreadCount || 0,
        isOnline: true,
      });
    }
  });

  // Append order partners that don't have existing message history yet
  orderPartnerMap.forEach((userDoc) => {
    conversations.push({
      id: userDoc._id.toString(),
      participantId: userDoc._id.toString(),
      participantName: userDoc.fullName || "User",
      participantAvatar:
        userDoc.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userDoc.fullName || "User"
        )}&background=6366f1&color=fff`,
      participantRole: userDoc.isProvider ? "provider" : "customer",
      lastMessage: "Order connected. Start a conversation...",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isOnline: true,
    });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, conversations, "Conversations fetched successfully"));
});

// GET or fetch details for a specific conversation partner
export const getOrCreatePartnerConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const { partnerId } = req.params;

  if (!partnerId) throw new ApiError(400, "Partner ID is required");

  let userDoc = null;
  if (mongoose.Types.ObjectId.isValid(partnerId)) {
    // Check if partnerId is a Provider ID
    const prov = await Provider.findById(partnerId).populate(
      "user",
      "_id fullName avatar isProvider"
    );
    if (prov?.user) {
      userDoc = prov.user;
    }
  }

  if (!userDoc && mongoose.Types.ObjectId.isValid(partnerId)) {
    userDoc = await User.findById(partnerId)
      .select("_id fullName avatar isProvider")
      .lean();
  }

  if (!userDoc) {
    throw new ApiError(404, "User or provider not found");
  }

  const lastMsg = await Message.findOne({
    $or: [
      { sender: currentUserId, receiver: userDoc._id },
      { sender: userDoc._id, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const conv = {
    id: userDoc._id.toString(),
    participantId: userDoc._id.toString(),
    participantName: userDoc.fullName || "User",
    participantAvatar:
      userDoc.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userDoc.fullName || "User"
      )}&background=6366f1&color=fff`,
    participantRole: userDoc.isProvider ? "provider" : "customer",
    lastMessage: lastMsg?.text || "Start a conversation...",
    lastMessageTime: lastMsg?.createdAt || new Date().toISOString(),
    unreadCount: 0,
    isOnline: true,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, conv, "Partner conversation retrieved"));
});

// GET messages with a specific partner
export const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  let { participantId } = req.params;

  if (!participantId) throw new ApiError(400, "Participant ID is required");

  // Check if participantId is a Provider ID instead of User ID
  if (mongoose.Types.ObjectId.isValid(participantId)) {
    const prov = await Provider.findById(participantId);
    if (prov?.user) {
      participantId = prov.user.toString();
    }
  }

  // Mark all unread messages from participant to current user as read
  await Message.updateMany(
    { sender: participantId, receiver: currentUserId, read: false },
    { $set: { read: true } }
  );

  const rawMessages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: participantId },
      { sender: participantId, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  const messages = rawMessages.map((m) => ({
    id: m._id.toString(),
    _id: m._id.toString(),
    conversationId: participantId.toString(),
    senderId: m.sender.toString(),
    text: m.text,
    timestamp: m.createdAt,
    createdAt: m.createdAt,
    read: m.read,
    isMine: m.sender.toString() === currentUserId.toString(),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// POST send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  let { receiverId, text, orderId } = req.body;

  if (!receiverId) throw new ApiError(400, "Receiver ID is required");
  if (!text || !text.trim()) throw new ApiError(400, "Message text is required");

  // Check if receiverId is a Provider ID
  if (mongoose.Types.ObjectId.isValid(receiverId)) {
    const prov = await Provider.findById(receiverId);
    if (prov?.user) {
      receiverId = prov.user.toString();
    }
  }

  const newMsg = await Message.create({
    sender: senderId,
    receiver: receiverId,
    order: orderId || null,
    text: text.trim(),
  });

  const formattedMsg = {
    id: newMsg._id.toString(),
    _id: newMsg._id.toString(),
    conversationId: receiverId.toString(),
    senderId: senderId.toString(),
    text: newMsg.text,
    timestamp: newMsg.createdAt,
    createdAt: newMsg.createdAt,
    read: false,
    isMine: true,
  };

  // Emit to socket room if receiver is online
  try {
    const io = req.app.get("io");
    if (io) {
      io.to(receiverId.toString()).emit("new-message", {
        ...formattedMsg,
        conversationId: senderId.toString(),
        isMine: false,
      });
    }
  } catch (err) {
    console.error("Socket emit error in sendMessage:", err);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, formattedMsg, "Message sent successfully"));
});
