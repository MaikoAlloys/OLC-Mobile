const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure database connection is correct

// Storekeeper Dashboard Overview
router.get("/dashboard", async (req, res) => {
    try {
        // Fetch total categories
        const [categories] = await db.promise().query("SELECT DISTINCT category FROM store_items");
        const totalCategories = categories.length;

        // Fetch total items
        const [items] = await db.promise().query("SELECT COUNT(*) AS totalItems FROM store_items");
        const totalItems = items[0].totalItems;

        // Fetch low stock alerts (items with quantity <= 5)
        const [lowStockItems] = await db.promise().query("SELECT COUNT(*) AS lowStock FROM store_items WHERE quantity <= 5");
        const lowStockAlerts = lowStockItems[0].lowStock;

        // Fetch pending requests (assuming you have a `store_requests` table for item requests)
        const [pendingRequests] = await db.promise().query("SELECT COUNT(*) AS pending FROM store_requests WHERE status = 'pending'");
        const pendingRequestsCount = pendingRequests[0].pending;

        // Send the dashboard data
        res.status(200).json({
            success: true,
            totalCategories,
            totalItems,
            lowStockAlerts,
            pendingRequests: pendingRequestsCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// Storekeeper Requests an Item
router.post("/request-item", async (req, res) => {
    const { storekeeper_id, item_id, quantity_requested, supplier_id } = req.body;

    if (!storekeeper_id || !item_id || !quantity_requested || !supplier_id) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Fetch item cost from store_items
        const [item] = await db.promise().query("SELECT cost FROM store_items WHERE id = ?", [item_id]);

        if (!item.length) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const itemCost = item[0].cost;
        const totalCost = itemCost * quantity_requested;

        // Insert the request with supplier_id
        await db.promise().query(
            "INSERT INTO store_requests (storekeeper_id, item_id, quantity_requested, total_cost, supplier_id) VALUES (?, ?, ?, ?, ?)",
            [storekeeper_id, item_id, quantity_requested, totalCost, supplier_id]
        );

        res.status(201).json({ success: true, message: "Request submitted successfully", totalCost });
    } catch (error) {
        console.error("Error requesting item:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// Fetch all suppliers (ID & Name)
router.get("/suppliers", async (req, res) => {
    try {
        const [suppliers] = await db.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM suppliers");
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Fetch all items (ID & Name)
router.get("/items", async (req, res) => {
    try {
        const [items] = await db.promise().query("SELECT id, item_name, cost FROM store_items");
        res.status(200).json({ success: true, items });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Fetch storekeeper requests
router.get("/requests", async (req, res) => {
    try {
        const [requests] = await db.promise().query(`
            SELECT 
                sr.id, 
                si.item_name, 
                sr.quantity_requested, 
                sr.total_cost, 
                CONCAT(s.first_name, ' ', s.last_name) AS supplier_name, 
                sr.status,
                sr.requested_at
            FROM store_requests sr
            JOIN store_items si ON sr.item_id = si.id
            JOIN suppliers s ON sr.supplier_id = s.id
            ORDER BY sr.requested_at DESC
        `);
        
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching storekeeper requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// Fetch store items grouped by category
router.get("/categories", async (req, res) => {
    try {
        const [items] = await db.promise().query(`
            SELECT category, item_name, quantity, description
            FROM store_items
            ORDER BY category, item_name
        `);

        // Group items by category
        const categorizedItems = {};
        items.forEach((item) => {
            if (!categorizedItems[item.category]) {
                categorizedItems[item.category] = [];
            }
            categorizedItems[item.category].push({
                item_name: item.item_name,
                quantity: item.quantity,
                description: item.description,
            });
        });

        res.status(200).json({ success: true, categories: categorizedItems });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Fetch storekeeper profile
// Fetch logged-in storekeeper's profile
router.get("/profile", async (req, res) => {  
    try {
        console.log("Fetching storekeeper profile...");

        // Use db.promise().query() instead of db.query()
        const [rows] = await db.promise().query("SELECT username, first_name, last_name, email, phone FROM storekeepers LIMIT 1");

        if (rows.length === 0) {
            return res.status(404).json({ message: "Storekeeper not found" });
        }

        res.json({ profile: rows[0] }); // Return the first record
    } catch (error) {
        console.error("Error fetching storekeeper profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//To receive item

router.post("/receive-item", async (req, res) => {
    const { request_id } = req.body;

    try {
        // Get the request details
        const request = await db.query("SELECT * FROM store_requests WHERE id = ?", [request_id]);

        if (!request.length) return res.json({ success: false, message: "Request not found." });

        const { item_id, quantity_requested, status } = request[0];

        if (status !== "approved") return res.json({ success: false, message: "Item not approved yet." });

        // Update status to "received"
        await db.query("UPDATE store_requests SET status = 'received' WHERE id = ?", [request_id]);

        // Update the store_items table (add received quantity to current quantity)
        await db.query(
            "UPDATE store_items SET quantity = quantity + ? WHERE id = ?",
            [quantity_requested, item_id]
        );

        return res.json({ success: true, message: "Item received successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});


// Get all approved stock requests for storekeeper
router.get("/requests/approved", async (req, res) => {
    try {
        // Wrap the query with a promise-based version of mysql2 query
        const [requests] = await new Promise((resolve, reject) => {
            db.query(`
                SELECT sr.id, sr.storekeeper_id, sr.item_id, si.item_name, sr.quantity_requested, sr.supplier_id, sr.total_cost, sr.status 
                FROM store_requests sr
                JOIN store_items si ON sr.item_id = si.id
                WHERE sr.status = 'approved'
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (requests.length === 0) {
            return res.status(404).json({ message: "No approved requests found" });
        }

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching approved requests:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Storekeeper receives stock and updates quantity
router.put("/requests/:id/receive", (req, res) => {
    const { id } = req.params;
    console.log(`Received request to update stock for request ID: ${id}`);

    // Check if the request exists and is approved
    db.query("SELECT item_id, quantity_requested, status FROM store_requests WHERE id = ?", [id], (err, rows) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ message: "Server error", error: err.message });
        }

        if (rows.length === 0) {
            console.log(`No request found with ID: ${id}`);
            return res.status(404).json({ message: "Request not found" });
        }

        const request = rows[0];
        console.log("Request found:", request);

        if (request.status !== "approved") {
            console.log(`Request status is not 'approved': ${request.status}`);
            return res.status(400).json({ message: "Only approved requests can be received." });
        }

        const { item_id, quantity_requested } = request;

        // Update request status to "received"
        console.log("Updating request status to 'received'...");
        db.query("UPDATE store_requests SET status = 'received' WHERE id = ?", [id], (err) => {
            if (err) {
                console.error("Error updating request status:", err);
                return res.status(500).json({ message: "Server error", error: err.message });
            }

            // Increase stock quantity in store_items
            console.log(`Updating stock for item ID: ${item_id}, adding quantity: ${quantity_requested}`);
            db.query("UPDATE store_items SET quantity = quantity + ? WHERE id = ?", [quantity_requested, item_id], (err) => {
                if (err) {
                    console.error("Error updating stock:", err);
                    return res.status(500).json({ message: "Server error", error: err.message });
                }

                console.log("Stock received and inventory updated successfully.");
                res.status(200).json({ message: "Stock received successfully and inventory updated." });
            });
        });
    });
});

//supplier payments
// Assuming you have authentication middleware, make sure it's not applied to this route
router.get("/received", (req, res) => {
    const query = `
        SELECT sr.id AS request_id, sr.item_id, sr.quantity_requested, sr.total_cost, sr.requested_at, 
               s.first_name, s.last_name, sr.supplier_id,
               sp.status AS payment_status, sp.payment_method, sp.payment_reference
        FROM store_requests sr
        JOIN suppliers s ON sr.supplier_id = s.id
        LEFT JOIN supplier_payments sp ON sr.id = sp.request_id
        WHERE sr.status = 'received';
    `;

    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching received requests:", err);
            return res.status(500).json({ message: "Server error", error: err.message });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No received requests found." });
        }

        res.status(200).json(rows);
    });
});


// Create a payment record for a supplier
// Create a payment record for a supplier
router.post("/pay", (req, res) => {
    const { request_id, total_cost, payment_method, payment_reference, supplier_id } = req.body;

    // Check if request_id is valid and not null
    if (!request_id) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    // Check if supplier_id is valid and not null
    if (!supplier_id) {
        return res.status(400).json({ message: "Supplier ID is required" });
    }

    // Validate payment reference
    if (payment_method === 'mpesa' && !/^[A-Za-z0-9]{10}$/.test(payment_reference)) {
        return res.status(400).json({ message: "MPesa reference must be 10 characters long (letters and numbers)." });
    }

    if (payment_method === 'bank' && !/^[A-Za-z0-9]{14}$/.test(payment_reference)) {
        return res.status(400).json({ message: "Bank reference must be 14 characters long (letters and numbers)." });
    }

    // Query to check if a payment already exists for this request_id
    const checkPaymentQuery = `
        SELECT * FROM supplier_payments 
        WHERE request_id = ?;
    `;

    db.query(checkPaymentQuery, [request_id], (err, result) => {
        if (err) {
            console.error("Error checking payment:", err); // Log the error
            return res.status(500).json({ message: "Server error", error: err.message });
        }

        // If a payment already exists for the request_id
        if (result.length > 0) {
            return res.status(400).json({ message: "Payment for this request has already been made." });
        }

        // Proceed with inserting the payment
        const query = `
            INSERT INTO supplier_payments (request_id, total_cost, payment_method, payment_reference, supplier_id)
            VALUES (?, ?, ?, ?, ?);
        `;

        db.query(query, [request_id, total_cost, payment_method, payment_reference, supplier_id], (err, result) => {
            if (err) {
                console.error("Error inserting payment:", err); // Log the error
                return res.status(500).json({ message: "Server error", error: err.message });
            }

            res.status(200).json({ message: "Payment recorded successfully." });
        });
    });
});


module.exports = router;
