
const express = require("express");
const router = express.Router();

const db = require("../config/db");


// GET all applications with search and filtering
router.get("/", (req, res) => {

    const { search, status } = req.query;

    let sql = "SELECT * FROM applications WHERE 1=1";
    const values = [];

    // Search by company name or job role
    if (search && search.trim() !== "") {
        sql += " AND (company_name LIKE ? OR job_role LIKE ?)";

        const searchValue = `%${search.trim()}%`;

        values.push(searchValue, searchValue);
    }

    // Filter by application status
    if (status && status.trim() !== "") {
        sql += " AND status = ?";
        values.push(status.trim());
    }

    // Show newest applications first
    sql += " ORDER BY created_at DESC";

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error("Error fetching applications:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch applications"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
});


// POST - Add a new job application
router.post("/", (req, res) => {
    const {
        company_name,
        job_role,
        location,
        salary,
        application_date,
        status,
        interview_date,
        job_description
    } = req.body;

    const sql = `
        INSERT INTO applications
        (company_name, job_role, location, salary,
         application_date, status, interview_date, job_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        company_name,
        job_role,
        location || null,
        salary || null,
        application_date || null,
        status || "Applied",
        interview_date || null,
        job_description || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding application:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to add application"
            });
        }

        res.status(201).json({
            success: true,
            message: "Job application added successfully!",
            applicationId: result.insertId
        });
    });
});


// PUT - Update an existing job application
router.put("/:id", (req, res) => {
    const { id } = req.params;

    const {
        company_name,
        job_role,
        location,
        salary,
        application_date,
        status,
        interview_date,
        job_description
    } = req.body;

    const sql = `
        UPDATE applications
        SET company_name = ?,
            job_role = ?,
            location = ?,
            salary = ?,
            application_date = ?,
            status = ?,
            interview_date = ?,
            job_description = ?
        WHERE id = ?
    `;

    const values = [
        company_name,
        job_role,
        location || null,
        salary || null,
        application_date || null,
        status || "Applied",
        interview_date || null,
        job_description || null,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating application:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update application"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Job application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job application updated successfully!"
        });
    });
});

// DELETE - Delete a job application
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM applications WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting application:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete application"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Job application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job application deleted successfully!"
        });
    });
});



// GET - Dashboard application statistics
router.get("/stats", (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS total_applications,

            COALESCE(SUM(CASE
                WHEN status = 'Applied' THEN 1 ELSE 0
            END), 0) AS applied,

            COALESCE(SUM(CASE
                WHEN status = 'Online Assessment' THEN 1 ELSE 0
            END), 0) AS online_assessment,

            COALESCE(SUM(CASE
                WHEN status = 'Interview' THEN 1 ELSE 0
            END), 0) AS interviews,

            COALESCE(SUM(CASE
                WHEN status = 'Selected' THEN 1 ELSE 0
            END), 0) AS selected,

            COALESCE(SUM(CASE
                WHEN status = 'Rejected' THEN 1 ELSE 0
            END), 0) AS rejected

        FROM applications
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error fetching statistics:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard statistics"
            });
        }

        res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully!",
            data: results[0]
        });
    });
});

module.exports = router;
