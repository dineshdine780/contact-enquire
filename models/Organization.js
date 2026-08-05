// const mongoose = require("mongoose");

// const organizationSchema = new mongoose.Schema(
//   {
//     organizationName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     type: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     website: {
//       type: String,
//       trim: true,
//       default: ""
//     },

//     status: {
//       type: String,
//       enum: ["Active", "Inactive", "Pending"],
//       default: "Active"
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model(
//   "Organization",
//   organizationSchema
// );




const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      trim: true
    },

    website: {
      type: String,
      trim: true,
      default: ""
    },

    // Public website identifier
    publicSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Organization",
  organizationSchema
);