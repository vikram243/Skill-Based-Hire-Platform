const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },

	amount: { type: Number, required: true, min: 0 },
	currency: { type: String, default: 'USD' },

	method: {
		type: String,
		enum: ['card','wallet','stripe','paypal','cash','manual'],
		default: 'card'
	},

	status: {
		type: String,
		enum: ['pending','succeeded','failed','refunded','cancelled'],
		default: 'pending'
	},

	transactionId: { type: String, default: null },
	rawResponse: { type: Object, default: null },

	// optional metadata for card (last4, brand) but don't store full card info
	card: {
		last4: { type: String, default: null },
		brand: { type: String, default: null },
		expMonth: { type: Number, default: null },
		expYear: { type: Number, default: null }
	}

}, { timestamps: true });

PaymentSchema.index({ order: 1 });
PaymentSchema.index({ customer: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
