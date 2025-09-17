const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	// event that triggered the notification (order_created, order_accepted, payment_succeeded, etc.)
	event: { type: String, required: true },

	// who the notification is intended for (provider or user)
	targetType: { type: String, enum: ['provider','user','admin'], required: true },
	targetId: { type: mongoose.Schema.Types.ObjectId, required: true },

	// channels: email, whatsapp, push
	channel: { type: String, enum: ['email','whatsapp','push','sms'], required: true },

	// the payload (flexible) - store the prepared message and template meta
	payload: { type: Object, default: null },

	// reference to related order/payment if any
	order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
	payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },

	// delivery tracking
	status: { type: String, enum: ['pending','sent','failed'], default: 'pending' },
	attempts: { type: Number, default: 0 },
	lastAttemptAt: { type: Date, default: null },
	deliveredAt: { type: Date, default: null },

	// store gateway/provider response for debugging
	response: { type: Object, default: null }

}, { timestamps: true });

NotificationSchema.index({ targetId: 1, targetType: 1 });
NotificationSchema.index({ event: 1, channel: 1, status: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);