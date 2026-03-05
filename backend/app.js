// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import connectDB from "./config/db.js";

// import userRoutes from "./routes/userRoutes.js";
// import incomeRoutes from "./routes/incomeRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";

// import authenticateUser from "./middlewares/authenticateUser.js";

// // ⚠️⚠️⚠️ Note ⚠️⚠️⚠️
// // If you're a developer viewing this code in my repository, please make sure to create your own .env file with the necessary environment variables as it is not provided in this repository.

// // env variables configuration
// dotenv.config();

// // App Configuration
// const PORT = process.env.PORT || 3000;
// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // CORS configurations
// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use((req, res, next) => {
//   const allowedOrigins = ["http://localhost:8080"];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     next();
//   } else {
//     res.status(404).json({ error: "Blocked by cors!" });
//     return;
//   }
// });

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
// app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// // Start Server
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server started on PORT ${PORT}!`);
//     });
//   } catch (error) {
//     console.log(`Error in starting the server: ${error.message}`);
//     process.exit(1);
//   }
// };

// startServer();


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

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
    origin: true, // allows any origin in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

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


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import connectDB from "./config/db.js";

// import userRoutes from "./routes/userRoutes.js";
// import incomeRoutes from "./routes/incomeRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";

// import authenticateUser from "./middlewares/authenticateUser.js";

// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     credentials: true,
//   })
// );

// // const corsOptions = {
// //   origin: "true",
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // };

// // app.use(cors(corsOptions));
// // // app.options("*", cors(corsOptions)); // VERY IMPORTANT
// // app.use(cors());

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
// app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server started on PORT ${PORT}!`);
//     });
//   } catch (error) {
//     console.log(`Error in starting the server: ${error.message}`);
//     process.exit(1);
//   }
// };

// startServer();



// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

// import connectDB from "./config/db.js";

// import userRoutes from "./routes/userRoutes.js";
// import incomeRoutes from "./routes/incomeRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";

// import authenticateUser from "./middlewares/authenticateUser.js";

// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
// app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// // Start server
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server started on PORT ${PORT}`);
//     });
//   } catch (error) {
//     console.error(`Error in starting the server: ${error.message}`);
//     process.exit(1);
//   }
// };

// startServer();