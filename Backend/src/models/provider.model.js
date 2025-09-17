const mongoose = require('mongoose');

const ServiceAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  geo: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // [lng, lat]
  },
  radiusKm: { type: Number, default: 10 }
}, { _id: false });

const SkillEntrySchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', default: null },
  name: { type: String, required: true },
  isCustom: { type: Boolean, default: false }
}, { _id: false });

const PricingSchema = new mongoose.Schema({
  skill: SkillEntrySchema,
  hourlyRate: { type: Number, required: true, min: 0 }
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String },
  mimetype: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const ProviderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  professionalDescription: { type: String, required: true, trim: true },
  yearsExperience: { type: Number, required: true, min: 0 },

  serviceArea: { type: ServiceAreaSchema, required: true },
  contactPhone: { type: String, required: true },

  selectedSkills: { type: [SkillEntrySchema], default: [] },
  customSkills: { type: [String], default: [] },
  pricing: { type: [PricingSchema], default: [] },

  documents: { type: [DocumentSchema], default: [] },
  agreedToTOS: { type: Boolean, default: false },
  consentBackgroundCheck: { type: Boolean, default: false },

  // minimal lifecycle (user submits → pending → approved)
  applicationStatus: {
    type: String,
    enum: ['draft','pending','approved'],
    default: 'pending'
  },
  submittedAt: { type: Date, default: Date.now },

  meta: {
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  }
}, { timestamps: true });

ProviderSchema.index({ businessName: 'text', professionalDescription: 'text' });
ProviderSchema.index({ 'serviceArea.geo': '2dsphere' });

module.exports = mongoose.model('Provider', ProviderSchema);