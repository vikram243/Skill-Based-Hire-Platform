const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
	skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', default: null },
	skillName: { type: String, required: true },
	provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
	hourlyRate: { type: Number, required: true, min: 0 },
	estimatedHours: { type: Number, required: true, min: 0 },
	subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	items: { type: [CartItemSchema], default: [] },
	meta: {
		totalItems: { type: Number, default: 0 },
		totalAmount: { type: Number, default: 0, min: 0 }
	}
}, { timestamps: true });

CartSchema.index({ customer: 1 });

module.exports = mongoose.model('Cart', CartSchema);
