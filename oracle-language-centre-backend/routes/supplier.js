const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");


// ✅ Fetch pending requests for the logged-in supplier
router.get("/requests", authenticateToken, async (req, res) => {
    const supplierId = req.user.id; // Get supplier ID from token

    const query = `
        SELECT 
            sr.id, sr.storekeeper_id, sr.item_id, sr.supplier_id, sr.quantity_requested, 
            sr.total_cost, sr.status, sr.requested_at, 
            si.item_name, si.cost AS cost_per_item
        FROM store_requests sr
        JOIN store_items si ON sr.item_id = si.id
        WHERE sr.supplier_id = ? AND sr.status = 'pending'
    `;

    db.query(query, [supplierId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});


// ✅ Approve or Reject Store Request
router.put("/request/:id", authenticateToken, async (req, res) => {
    const supplierId = req.user.id; // Ensure the supplier is updating their own requests
    const requestId = req.params.id;
    const { status } = req.body; // Expected values: "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    db.query(
        "UPDATE store_requests SET status = ? WHERE id = ? AND supplier_id = ?",
        [status, requestId, supplierId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Request not found or not authorized to update." });
            }

            res.json({ message: `Request ${status} successfully.` });
        }
    );
});

//Fetching supplier details
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const supplierId = req.user.id; // Extract supplier ID from the token

        // Use promise-based query execution
        const [supplier] = await db.promise().query(
            "SELECT id, username, first_name, last_name, email, phone FROM suppliers WHERE id = ?",
            [supplierId]
        );

        if (supplier.length === 0) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(supplier[0]);
    } catch (error) {
        console.error("Error fetching supplier profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//endpoint for rejected, approved or received items
router.get("/approved-items", authenticateToken, async (req, res) => {
    try {
        const supplierId = req.user.id; // Logged-in supplier's ID

        // Fetch approved, rejected, and received items for the supplier
        const [items] = await db.promise().query(
            "SELECT id, storekeeper_id, item_id, quantity_requested, total_cost, status, requested_at FROM store_requests WHERE supplier_id = ? AND status IN ('approved', 'rejected', 'received')",
            [supplierId]
        );

        res.json(items);
    } catch (error) {
        console.error("Error fetching approved/rejected/received items:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Get supplier payments
// Get supplier payments by ID
router.get("/payments/:supplier_id", async (req, res) => {
    const { supplier_id } = req.params; // Get supplier ID from URL params

    if (!supplier_id) {
        return res.status(400).json({ message: "Bad request: Supplier ID is required" });
    }

    try {
        // Query payments for the given supplier ID
        db.query(
            "SELECT * FROM supplier_payments WHERE supplier_id = ?", 
            [supplier_id], 
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: "Database error", error: err });
                }

                console.log("✅ Payments Fetched:", results);
                res.json(results);
            }
        );
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});

//supplier to confirm payment
router.put("/payments/confirm/:payment_id", (req, res) => {
    const { payment_id } = req.params;

    if (!payment_id) {
        return res.status(400).json({ message: "Payment ID is required" });
    }

    const updateQuery = `
        UPDATE supplier_payments 
        SET status = 'confirmed' 
        WHERE id = ? AND status = 'paid';
    `;

    db.query(updateQuery, [payment_id], (err, result) => {
        if (err) {
            console.error("Error updating payment status:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found or already confirmed." });
        }

        res.status(200).json({ message: "Payment confirmed successfully." });
    });
});

module.exports = router;
