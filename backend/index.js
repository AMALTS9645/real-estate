import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import listsRoute from "./routes/lists.js";

//Database
import connectDB from "./connection.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/lists", listsRoute);


const port = process.env.PORT || 8080;

// SERVER
app.listen(port, () => {
  connectDB();
  console.log(`connected to backend...Lstening port ${port}`);
});
