import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";

// env variables configuration
dotenv.config();

// App Configuration
const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fixed CORS configuration
app.use(
  cors({
    origin: "https://paynalyze-expense-tracker.vercel.app/",  //true
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);
app.use("/api/v1/investments", authenticateUser, investmentRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`MongoDB Connected Successfully!`);
      console.log(`Server started on PORT ${PORT}!`);
    });
  } catch (error) {
    console.log(`Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

