const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        platformName: {
            type: String,
            required: true,
            trim: true
        },

        supportEmail: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Settings", settingsSchema);