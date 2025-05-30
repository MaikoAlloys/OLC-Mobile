const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/users/:student_id", async (req, res) => {
    const studentId = req.params.student_id;

    const results = {
        student: null,
        student_id: studentId,
        users: []
    };

    // 1. Get student full name from `users` table
    db.query("SELECT first_name, last_name FROM users WHERE id = ?", [studentId], (err, studentRows) => {
        if (err) {
            console.error("❌ Error fetching student:", err);
            return res.status(500).json({ message: "Error fetching student info" });
        }

        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        results.student = `${studentRows[0].first_name} ${studentRows[0].last_name}`;

        // 2. Fetch tutors
        db.query("SELECT id, firstname, lastname FROM tutors", (err, tutorRows) => {
            if (err) {
                console.error("❌ Error fetching tutors:", err);
                return res.status(500).json({ message: "Error fetching tutors" });
            }

            tutorRows.forEach(tutor => {
                results.users.push({
                    id: tutor.id,
                    fullName: `${tutor.firstname} ${tutor.lastname}`,
                    role: "tutor"
                });
            });

            // 3. Fetch librarians
            db.query("SELECT id, first_name, last_name FROM librarians", (err, librarianRows) => {
                if (err) {
                    console.error("❌ Error fetching librarians:", err);
                    return res.status(500).json({ message: "Error fetching librarians" });
                }

                librarianRows.forEach(lib => {
                    results.users.push({
                        id: lib.id,
                        fullName: `${lib.first_name} ${lib.last_name}`,
                        role: "librarian"
                    });
                });

                // 4. Fetch finance
                db.query("SELECT id, firstname, lastname FROM finance_managers", (err, financeRows) => {
                    if (err) {
                        console.error("❌ Error fetching finance:", err);
                        return res.status(500).json({ message: "Error fetching finance" });
                    }

                    financeRows.forEach(fin => {
                        results.users.push({
                            id: fin.id,
                            fullName: `${fin.firstname} ${fin.lastname}`,
                            role: "finance"
                        });
                    });

                    // 5. Fetch HODs
                    db.query("SELECT id, firstname, lastname FROM hods", (err, hodRows) => {
                        if (err) {
                            console.error("❌ Error fetching HODs:", err);
                            return res.status(500).json({ message: "Error fetching HODs" });
                        }

                        hodRows.forEach(hod => {
                            results.users.push({
                                id: hod.id,
                                fullName: `${hod.firstname} ${hod.lastname}`,
                                role: "hod"
                            });
                        });

                        // ✅ Send the response once everything is fetched
                        return res.json(results);
                    });
                });
            });
        });
    });
});

//submitting feedback 
router.post("/submit-feedback", async (req, res) => {
    const { student_id, recipient_id, recipient_role, recipient_name, message, rating } = req.body;

    if (!student_id || !recipient_id || !recipient_role || !message) {
        return res.status(400).json({ message: "student_id, recipient_id, recipient_role, and message are required" });
    }

    // Map the frontend role names to database column names
    const roleToColumnMap = {
        tutor: "tutor_id",
        librarian: "librarian_id",
        finance: "finance_manager_id",
        hod: "hod_id"
    };

    // Verify the recipient exists in their respective table
    const tableMap = {
        tutor: "tutors",
        librarian: "librarians",
        finance: "finance_managers",
        hod: "hods"
    };

    const table = tableMap[recipient_role];
    if (!table) {
        return res.status(400).json({ message: "Invalid recipient role" });
    }

    try {
        // Verify the recipient exists
        const [rows] = await db.promise().query(
            `SELECT id FROM ${table} WHERE id = ? LIMIT 1`, 
            [recipient_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Recipient not found in specified role" });
        }

        // Build the insert object with the correct role ID field
        const insertData = {
            student_id,
            message,
            rating: rating || null,
            status: 'pending',
            [roleToColumnMap[recipient_role]]: recipient_id
        };

        await db.promise().query("INSERT INTO feedback SET ?", [insertData]);
        return res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        console.error("Error submitting feedback:", err);
        return res.status(500).json({ message: "Error submitting feedback" });
    }
});

//fetching feedback
router.get("/feedbacks/:student_id", async (req, res) => {
    const studentId = req.params.student_id;

    try {
        const [rows] = await db.promise().query(`
            SELECT 
              f.feedback_id,
              f.message AS feedback_message,
              f.rating,
              CONCAT(s.first_name, ' ', s.last_name) AS student_name,
              CONCAT(t.firstname, ' ', t.lastname) AS tutor_name,
              CONCAT(l.first_name, ' ', l.last_name) AS librarian_name,
              CONCAT(fin.firstname, ' ', fin.lastname) AS finance_name,
              CONCAT(h.firstname, ' ', h.lastname) AS hod_name,
              f.reply,
              f.reply_by,
              f.status,
              f.created_at,
              f.reply_time
            FROM feedback f
            LEFT JOIN users s ON f.student_id = s.id
            LEFT JOIN tutors t ON f.tutor_id = t.id
            LEFT JOIN librarians l ON f.librarian_id = l.id
            LEFT JOIN finance_managers fin ON f.finance_manager_id = fin.id
            LEFT JOIN hods h ON f.hod_id = h.id
            WHERE f.student_id = ?
            ORDER BY f.created_at DESC
        `, [studentId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ message: "Error fetching feedback" });
    }
});

// fetching feedback for finance with sender name
router.get('/finance-feedback', (req, res) => {
    const sql = `
      SELECT 
        f.*, 
        u.first_name, 
        u.last_name, 
        CONCAT(u.first_name, ' ', u.last_name) AS sender_name 
      FROM feedback f 
      JOIN users u ON f.student_id = u.id 
      WHERE f.finance_manager_id IS NOT NULL 
      ORDER BY f.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching finance feedback:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ feedback: results });
    });
  });
  
  
  //finance replying to feedback
  router.post('/finance-feedback/reply/:id', (req, res) => {
    const feedbackId = req.params.id;
    const { replyMessage, replyBy } = req.body;
  
    if (!replyMessage || !replyBy) {
      return res.status(400).json({ error: 'Missing replyMessage or replyBy' });
    }
  
    const sql = `
      UPDATE feedback 
      SET reply = ?, reply_by = ?, reply_time = NOW(), status = 'resolved'
      WHERE feedback_id = ? AND finance_manager_id IS NOT NULL
    `;
  
    db.query(sql, [replyMessage, replyBy, feedbackId], (err, result) => {
      if (err) {
        console.error('Error submitting finance reply:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Feedback not found or not assigned to finance' });
      }
  
      res.json({ message: 'Reply submitted successfully' });
    });
  });

  // Fetch feedback for a specific tutor by their ID
  router.get('/tutor-feedback/:tutorId', (req, res) => {
    const tutorId = req.params.tutorId;
  
    const sql = `
      SELECT 
        f.*, 
        u.first_name, 
        u.last_name, 
        CONCAT(u.first_name, ' ', u.last_name) AS sender_name 
      FROM feedback f
      JOIN users u ON f.student_id = u.id
      WHERE f.tutor_id = ?
      ORDER BY f.created_at DESC
    `;
  
    db.query(sql, [tutorId], (err, results) => {
      if (err) {
        console.error('Error fetching tutor feedback:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      res.json({ feedback: results });
    });
  });
  
  // Tutor replying to feedback
router.post('/tutor-feedback/reply/:id', (req, res) => {
    const feedbackId = req.params.id;
    const { replyMessage, replyBy } = req.body;
  
    if (!replyMessage || !replyBy) {
      return res.status(400).json({ error: 'Missing replyMessage or replyBy' });
    }
  
    const sql = `
      UPDATE feedback 
      SET reply = ?, reply_by = ?, reply_time = NOW(), status = 'resolved'
      WHERE feedback_id = ? AND tutor_id IS NOT NULL
    `;
  
    db.query(sql, [replyMessage, replyBy, feedbackId], (err, result) => {
      if (err) {
        console.error('Error submitting tutor reply:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Feedback not found or not assigned to this tutor' });
      }
  
      res.json({ message: 'Reply submitted successfully' });
    });
  });
  

  //fetching feedback for librarian
  router.get('/librarian-feedback', (req, res) => {
    const sql = `
      SELECT 
        f.*, 
        u.first_name, 
        u.last_name, 
        CONCAT(u.first_name, ' ', u.last_name) AS sender_name 
      FROM feedback f 
      JOIN users u ON f.student_id = u.id 
      WHERE f.librarian_id IS NOT NULL 
      ORDER BY f.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching librarian feedback:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ feedback: results });
    });
  });
  
  //endpoint for librarian to reply feedback
  router.post('/librarian-feedback/reply/:id', (req, res) => {
    const feedbackId = req.params.id;
    const { replyMessage, replyBy } = req.body;
  
    if (!replyMessage || !replyBy) {
      return res.status(400).json({ error: 'Missing replyMessage or replyBy' });
    }
  
    const sql = `
      UPDATE feedback 
      SET reply = ?, reply_by = ?, reply_time = NOW(), status = 'resolved'
      WHERE feedback_id = ? AND librarian_id IS NOT NULL
    `;
  
    db.query(sql, [replyMessage, replyBy, feedbackId], (err, result) => {
      if (err) {
        console.error('Error submitting librarian reply:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Feedback not found or not assigned to librarian' });
      }
  
      res.json({ message: 'Reply submitted successfully' });
    });
  });

  //fetching feedback for hod
  router.get('/hod-feedback', (req, res) => {
    const sql = `
      SELECT 
        f.*, 
        u.first_name, 
        u.last_name, 
        CONCAT(u.first_name, ' ', u.last_name) AS sender_name 
      FROM feedback f 
      JOIN users u ON f.student_id = u.id 
      WHERE f.hod_id IS NOT NULL 
      ORDER BY f.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching HOD feedback:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ feedback: results });
    });
  });

  //hod replying for feedback
  router.post('/hod-feedback/reply/:id', (req, res) => {
    const feedbackId = req.params.id;
    const { replyMessage, replyBy } = req.body;
  
    if (!replyMessage || !replyBy) {
      return res.status(400).json({ error: 'Missing replyMessage or replyBy' });
    }
  
    const sql = `
      UPDATE feedback 
      SET reply = ?, reply_by = ?, reply_time = NOW(), status = 'resolved'
      WHERE feedback_id = ? AND hod_id IS NOT NULL
    `;
  
    db.query(sql, [replyMessage, replyBy, feedbackId], (err, result) => {
      if (err) {
        console.error('Error submitting HOD reply:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Feedback not found or not assigned to HOD' });
      }
  
      res.json({ message: 'Reply submitted successfully' });
    });
  });
  
  
module.exports = router;
