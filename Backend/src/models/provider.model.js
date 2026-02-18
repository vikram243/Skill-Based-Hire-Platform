import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String },
    mimetype: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
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
      max: 100,
    },

    contactPhone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 15,
    },

    selectedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    pricing: {
      rateType: {
        type: String,
        enum: ["hourly", "perJob", "daily"],
        default: "hourly",
      },
      serviceRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100000,
      },
    },

    documents: {
      type: [DocumentSchema],
      default: [],
    },

    agreedToTOS: { type: Boolean, default: false },
    consentBackgroundCheck: { type: Boolean, default: false },

    isOnline: { type: Boolean, default: false },

    isAvailable: { type: Boolean, default: false },

    location: {
      geo: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    verification: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    meta: {
      avgRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      completedJobs: { type: Number, default: 0 },
      cancelledJobs: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

ProviderSchema.index({
  businessName: "text",
  professionalDescription: "text",
});

ProviderSchema.index({ "location.geo": "2dsphere" });

const Provider = mongoose.model("Provider", ProviderSchema);
export default Provider;
