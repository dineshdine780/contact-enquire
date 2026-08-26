const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const session = require("express-session");


const organizationRoutes = require("./routes/Organization.js");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");  
const organizationProfileRoutes = require("./routes/organizationProfileRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const captchaRoutes =require("./routes/captchaRoutes");


dotenv.config();

const app = express();

app.set("trust proxy", 1);

// Connect MongoDB

connectDB();

app.use(
    "/uploads",
    express.static(path.join(__dirname,"uploads"))
);

// Middleware 

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",

  process.env.ADMIN_FRONTEND_URL,
  process.env.ORGANIZATION_FRONTEND_URL,
  process.env.CONTACT_FRONTEND_URL,
].filter(Boolean);


app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [   
      "GET",     
      "POST",    
      "PUT",      
      "DELETE",   
      "OPTIONS",  
    ],      

    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "enquiry-platform-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge: 10 * 60 * 1000,
                              
      httpOnly: true,        
                             
      secure: process.env.NODE_ENV === "production",
                             
      sameSite:               
        process.env.NODE_ENV === "production"
          ? "none"            
          : "lax",           
    },                       
  })                         
);                           
                             
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
app.use("/api/captcha",captchaRoutes); 

const PORT = process.env.PORT || 5000; 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


