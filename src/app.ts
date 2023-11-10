import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import categoryRouter from "./routers/category";
import couponRouter from "./routers/coupon";
import saleRouter from "./routers/sale";
import { isCheckedSale } from "./controller/saleController";
import VnPayRouter from "./routers/VnPay";
import orderRouter from "./routers/order";
import productRouter from "./routers/product";
import cartRouter from "./routers/cart";
import dotenv from "dotenv";
import UserRouter from "./routers/auth";
import commentRouter from "./routers/comment";

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
app.use("/comment", commentRouter);
app.use("/api", saleRouter);
app.use("/", orderRouter);

app.use("/", UserRouter);

isCheckedSale();
//Connect DB

app.use("/api", cartRouter);

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
