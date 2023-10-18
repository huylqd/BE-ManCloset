import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import categoryRouter from "./routers/category";
import couponRouter from "./routers/coupon";
import dotenv from "dotenv";
const app: any = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/category", categoryRouter);
app.use("/api/coupon", couponRouter);

const port = 8088;
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, {
  dbName: "datn",
  autoCreate: true,
});

const db = mongoose.connection;

// Set up event listeners for the connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

app.listen(port, () => {
  console.log(`App is running at the ${port}`);
});
export const viteNodeApp = app;
