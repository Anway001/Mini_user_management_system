const express = require("express");
const PORT = process.env.PORT || 8080;
const authrouter = require("./Routers/auth.Router");
const cookieParser = require("cookie-parser");
const adminrouter = require("./Routers/admin.Router");
const userRouter = require("./Routers/user.Router");
// Initialize express app
const app = express();

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cookieParser());


// Connect to MongoDB
const ConnectDB = require("./db/db");
ConnectDB();

// Define routes
app.get("/", (req, res) => {
    res.send("User Management System !");
});
app.use("/api/auth", authrouter);
app.use("/api/admin", adminrouter);
app.use("/api/user", userRouter);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});