import mongoose from 'mongoose';

const ServiceAreaSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true, minlength: 2, maxlength: 20 },
  state: { type: String, required: true, minlength: 2, maxlength: 20, },
  pincode: { type: Number, minlength: 2, maxlength: 20, },
  country: { type: String, default: 'India', minlength: 2, maxlength: 100, },

  geo: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  radiusKm: { type: Number, default: 10 }
}, { _id: false });

const SkillEntrySchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    default: null,
    minlength: 3, maxlength: 100,
  },
  name: { type: String, required: true, minlength: 3, maxlength: 20, },
  isCustom: { type: Boolean, default: false }
}, { _id: false });

const PricingSchema = new mongoose.Schema({
  skill: SkillEntrySchema,

  rateType: {
    type: String,
    enum: ['hourly', 'perJob', 'daily'],
    default: 'hourly'
  },

  serviceRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100000
  },

  minimumCharge: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000
  }
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String },
  mimetype: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const ProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  businessName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },

  professionalDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },

  yearsExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  contactPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 15,
  },

  serviceArea: {
    type: ServiceAreaSchema,
    required: true
  },

  selectedSkills: {
    type: [SkillEntrySchema],
    default: []
  },

  pricing: {
    type: [PricingSchema],
    default: []
  },

  documents: {
    type: [DocumentSchema],
    default: []
  },

  agreedToTOS: { type: Boolean, default: false },
  consentBackgroundCheck: { type: Boolean, default: false },

  isOnline: { type: Boolean, default: false },

  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  meta: {
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 }
  }

}, { timestamps: true });

ProviderSchema.index({
  businessName: 'text',
  professionalDescription: 'text'
});

ProviderSchema.index({
  'serviceArea.geo': '2dsphere'
});

const Provider = mongoose.model('Provider', ProviderSchema);
export default Provider;
