const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    attachment: {
      type: String,
      default: ""
    },

    priority: {
      type: String,
      enum: ["Urgent", "Medium", "Low"],
      default: "Low"
    },

    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "Resolved",
        "Closed"
      ],
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Contact", contactSchema);