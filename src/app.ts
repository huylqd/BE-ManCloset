import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import categoryRouter from "./routers/category";
import couponRouter from "./routers/coupon";
import productRouter from "./routers/product";
import VnPayRouter from "./routers/VnPay";
import dotenv from "dotenv";
import UserRouter from "./routers/auth";

//Config express
const app: any = express();
dotenv.config();
app.use(cors());
app.use(express.json());

//Router
app.use("/api", categoryRouter);
app.use("/api", couponRouter);
app.use("/api", productRouter);
app.use("/order", VnPayRouter);

app.use("/", UserRouter);

//Connect DB
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, {
  dbName: "datn",
  autoCreate: true,
});

const db = mongoose.connection;

// Set up event listeners for the connection
const port = 8088;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

app.listen(port, () => {
  console.log(`App is running at the ${port}`);
});
export const viteNodeApp = app;
