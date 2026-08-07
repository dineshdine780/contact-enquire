const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const organizationRoutes = require("./routes/Organization.js");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");  
const organizationProfileRoutes = require("./routes/organizationProfileRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");


dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

app.use(
    "/uploads",
    express.static(path.join(__dirname,"uploads"))
);


// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Enquiry Platform Backend Running"
  });
});


app.use("/api/organizations",organizationRoutes);               
app.use("/api/contact", contactRoutes);                         
app.use("/api/auth", authRoutes);                               
app.use("/api/dashboard", dashboardRoutes);                      
app.use("/api/customers", customerRoutes);                        
app.use("/api/users", userRoutes);                              
app.use("/api/organization-profile", organizationProfileRoutes);
app.use("/api/audit-logs", auditLogRoutes); 

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

