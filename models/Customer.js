const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Follow-up",
      ],
      default: "Active",
    },

    lastActivity: {  
      type: Date,
      default: Date.now, 
    },

    tags: { 
      type: [String],
      default: [],
    },

    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports =
  mongoose.model(
    "Customer",
    customerSchema
  );