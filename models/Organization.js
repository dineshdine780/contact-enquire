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
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    publicSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // THEME
    // ==========================================

    theme: {
      // ----------------------------------------
      // MAIN COLORS
      // ----------------------------------------

      primaryColor: {
        type: String,
        default: "#2563eb",
      },

      secondaryColor: {
        type: String,
        default: "#f4f6f8",
      },

      // ----------------------------------------
      // TEXT COLORS
      // ----------------------------------------

      textColor: {
        type: String,
        default: "#111827",
      },

      mutedTextColor: {
        type: String,
        default: "#6b7280",
      },

      // ----------------------------------------
      // CARD
      // ----------------------------------------

      cardBackground: {
        type: String,
        default: "#ffffff",
      },

      // ----------------------------------------
      // INPUT
      // ----------------------------------------

      inputBackground: {
        type: String,
        default: "#ffffff",
      },

      inputTextColor: {
        type: String,
        default: "#111827",
      },

      // ----------------------------------------
      // BORDER
      // ----------------------------------------

      borderColor: {
        type: String,
        default: "#d1d5db",
      },

      // ----------------------------------------
      // PLACEHOLDER
      // ----------------------------------------

      placeholderColor: {
        type: String,
        default: "#9ca3af",
      },

      // ----------------------------------------
      // FILE UPLOAD
      // ----------------------------------------

      fileBackground: {
        type: String,
        default: "#fafafa",
      },

      // ----------------------------------------
      // CAPTCHA
      // ----------------------------------------

      captchaBackground: {
        type: String,
        default: "#f8f9fa",
      },

      captchaImageBackground: {
        type: String,
        default: "#f3f4f6",
      },

      // ----------------------------------------
      // FONT
      // ----------------------------------------

      fontFamily: {
        type: String,
        default: "Arial",
      },

      // ----------------------------------------
      // RADIUS
      // ----------------------------------------

      buttonRadius: {
        type: String,
        default: "6px",
      },

      cardRadius: {
        type: String,
        default: "12px",
      },
    },

    // ==========================================
    // CUSTOM CSS
    // ==========================================

    customCSS: {
      type: String,
      default: "",
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Organization",
  organizationSchema
);