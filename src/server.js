const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to PlaceTrack API!");
});

// Health check route
app.get("/api/health", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database connection error"
            });
        }

        res.json({
            success: true,
            message: "PlaceTrack API and MySQL are working!"
        });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PlaceTrack server running on port ${PORT}`);
});
