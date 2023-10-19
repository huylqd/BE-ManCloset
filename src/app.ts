import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routers/auth"
const app: any = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/', UserRouter)

const port = 8088;
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(
  `mongodb://admin:123zXc_@27.118.27.251:27017?authMechanism=DEFAULT`,
  {
    dbName: "datn",
    autoCreate: true,
  }
);

const db = mongoose.connection;

// Set up event listeners for the connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

app.listen(port, () => {
  console.log(`App is running at the ${port}`);
});
export const viteNodeApp = app;
