require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db"); // ✅ Import Database Connection

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const coursesRoutes = require("./routes/courses");
const paymentsRoutes = require("./routes/payments");
const studentRoutes = require("./routes/students");
const applicationRoutes = require("./routes/applications");
const financeRoutes = require("./routes/finance"); 
const hodRoutes = require("./routes/hod"); 
const tutorRoutes = require("./routes/tutors"); 
const librarianRouter = require("./routes/librarian"); 
const storekeeperRouter = require("./routes/storekeeper");
const supplierRouter = require("./routes/supplier");
const feedbackRouter = require("./routes/feedback");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Register Routes (Logging for Debugging)
const routes = [
  { path: "/auth", route: authRoutes },
  { path: "/admin", route: adminRoutes },
  { path: "/courses", route: coursesRoutes },
  { path: "/payments", route: paymentsRoutes },
  { path: "/students", route: studentRoutes },
  { path: "/applications", route: applicationRoutes },
  { path: "/finance", route: financeRoutes }, 
  { path: "/hod", route: hodRoutes }, 
  { path: "/tutors", route: tutorRoutes }, 
  { path: "/librarian", route: librarianRouter }, 
  { path: "/storekeeper", route: storekeeperRouter }, 
  { path: "/supplier", route: supplierRouter }, 
  { path: "/feedback", route: feedbackRouter }, 
];

routes.forEach(({ path, route }) => {
  if (route) {
    console.log(`✅ Registering route: ${path}`);
    app.use(path, route);
  } else {
    console.error(`❌ Route registration failed for: ${path}`);
  }
});

// ✅ Test API Route
app.get("/", (req, res) => {
  res.send("Oracle Language Centre API is running...");
});

// ✅ Test Database Connection
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("❌ Database connection error:", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    res.json({ message: "✅ Database connected successfully!" });
  });
});

// ✅ Catch-All Route for Unmatched Endpoints
app.use((req, res) => {
  res.status(404).json({ message: "❌ Endpoint not found" });
});

// // ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


//added for testing duckdns
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// ✅ Serve Certificates Folder
const path = require("path");
app.use("/certificates", express.static(path.join(__dirname, "certificates")));
console.log("✅ Serving certificates from /certificates");

