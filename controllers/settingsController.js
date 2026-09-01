const Settings = require("../models/Settings");


// Get settings

exports.getSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({
                message: "Settings not found"
            });
        }

        res.status(200).json(settings);

    } catch (error) {

        console.error("GET SETTINGS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// Update settings

exports.updateSettings = async (req, res) => {

    try {

        const {
            platformName,
            supportEmail,
            website
        } = req.body;


        let settings = await Settings.findOne();


        if (!settings) {

            settings = new Settings({
                platformName,
                supportEmail,
                website
            });

        } else {

            settings.platformName = platformName;
            settings.supportEmail = supportEmail;
            settings.website = website;

        }


        await settings.save();


        res.status(200).json({
            message: "Settings updated successfully",
            settings: settings
        });

    } catch (error) {

        console.error("UPDATE SETTINGS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};