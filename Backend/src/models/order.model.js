import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  full: { type: String, required: true },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null }
}, { _id: false });

const PricingSchema = new mongoose.Schema({
  serviceRate: { type: Number, default: 0, min: 0 },
  taxes: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },

  // allow linking to a known Skill, but also keep a snapshot of the name
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', default: null },

  description: { type: String, trim: true, default: '',min: 10, max: 300 },

  address: { type: AddressSchema, required: true, min: 10, max: 200 },

  urgency: {
    type: String,
    enum: ['normal','emergency'],
    default: 'normal'
  },

  pricing: { type: PricingSchema, required: true },

  status: {
    type: String,
    enum: ['pending','accepted','ongoing','completed','cancelled','rejected'],
    default: 'pending'
  },

  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },

  contactPhone: { type: String, trim: true, default: '', min: 9, max: 15 },

  meta: {
    providerRated: { type: Boolean, default: false },
    customerRated: { type: Boolean, default: false }
  }

}, { timestamps: true });

// Index common queries: customer, provider, status, schedule.preferredDate
OrderSchema.index({ customer: 1 });
OrderSchema.index({ provider: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'schedule.preferredDate': 1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;