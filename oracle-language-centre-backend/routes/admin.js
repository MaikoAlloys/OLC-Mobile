const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/auth"); // Import auth middleware
require("dotenv").config();

const router = express.Router();

// Admin Login
router.post("/login", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM admins WHERE name = ?", [name], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const admin = results[0];
        const isMatch = password === admin.password; // Insecure, should use bcrypt

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ message: "Login successful", token });
    });
});

// Get students by approval status
router.get("/students", (req, res) => {
    const { status } = req.query;
    let query = "SELECT * FROM users WHERE role = 'student'";
    
    if (status === "pending") query += " AND is_approved = 0";
    if (status === "approved") query += " AND is_approved = 1";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});

// Approve a student
router.put("/students/:id/approve", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET is_approved = 1 WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Student approved successfully" });
    });
});

// Fetch all tutors
router.get("/tutors", (req, res) => {
    db.query("SELECT id, username, Firstname, Lastname FROM tutors", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});

// Protect Admin Dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!" });
});



// Endpoint to fetch supplier details along with requested item, quantity, status, and payment information
router.get('/suppliers/payments', async (req, res) => {
    const query = `
        SELECT
            s.first_name, s.last_name, 
            si.item_name, sr.quantity_requested, sr.status, 
            sp.total_cost, sp.payment_method
        FROM suppliers s
        INNER JOIN store_requests sr ON s.id = sr.supplier_id
        INNER JOIN store_items si ON sr.item_id = si.id
        INNER JOIN supplier_payments sp ON sr.id = sp.request_id
    `;
    
    try {
        const [rows] = await db.promise().query(query); // Use .promise().query() to return a Promise
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching supplier data' });
    }
});


// Fetch all finance users
router.get('/finance', async (req, res) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT username, email, CONCAT(firstname, " ", lastname) AS fullname, phone FROM finance_managers'
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching finance users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Fetch all suppliers
router.get('/suppliers', async (req, res) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT username, email, CONCAT(first_name, " ", last_name) AS fullname, phone FROM suppliers'
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Fetch all courses
router.get("/courses", async (req, res) => {
    try {
      const query = "SELECT * FROM courses";
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
// Get resource requests with student name, course name, and requested resource
router.get("/resource-requests", (req, res) => {
    const query = `
      SELECT 
        rr.id, 
        u.first_name, 
        u.last_name, 
        lr.resource_name, 
        c.name AS course_name, 
        rr.status, 
        rr.requested_at
      FROM resource_requests rr
      JOIN users u ON rr.student_id = u.id
      JOIN courses c ON rr.course_id = c.id
      JOIN learning_resources lr ON rr.resource_id = lr.id
      ORDER BY rr.requested_at DESC;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching resource requests:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });

  // Get all HODs
router.get("/head-management", (req, res) => {
    const query = "SELECT username, firstname, lastname, email, phone FROM hods";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Endpoint to fetch storekeepers' data
router.get('/storekeepers', (req, res) => {
    const query = 'SELECT username, first_name, last_name, email, phone FROM storekeepers';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching storekeepers data' });
      }
      res.json(results);
    });
  });
  

  // API to get attendance data
router.get('/attendance', (req, res) => {
    const query = `
      SELECT 
        u.first_name AS student_firstname, u.last_name AS student_lastname,
        t.firstname AS tutor_firstname, t.lastname AS tutor_lastname,
        c.name AS course_name, sa.attended_at
      FROM student_attendance sa
      JOIN users u ON sa.student_id = u.id
      JOIN tutors t ON sa.tutor_id = t.id
      JOIN courses c ON sa.course_id = c.id
      ORDER BY sa.attended_at DESC;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching attendance data' });
      }
      res.json(results);
    });
  });
module.exports = router;
