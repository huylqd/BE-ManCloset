import express from "express";
import mongoose from "mongoose";
import multer from "multer"
// import ExcelJS from "exceljs"
import cors from "cors";
import categoryRouter from "./routers/category.js";
import couponRouter from "./routers/coupon.js";
import saleRouter from "./routers/sale.js";
import { isCheckedSale } from "./controller/saleController.js";
import VnPayRouter from "./routers/VnPay.js";
import orderRouter from "./routers/order.js";
import AnalystRouter from "./routers/analyst.js";
import productRouter from "./routers/product.js";
import cartRouter from "./routers/cart.js";
import messageRouter from "./routers/message.js";
import dotenv from "dotenv";
import UserRouter from "./routers/auth.js";
import commentRouter from "./routers/comment.js";
import passport from "passport";
import routerPassport from "./routers/passport.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import socket, { Server, Socket } from "socket.io";
import http from "http";
import { SocketServer } from "./config/socket.js";


//Config express
const app: any = express();
dotenv.config();
const { ACCESSTOKEN_SECRET } = process.env;
const corsOptions = {
  origin: 'http://localhost:3000', // Đổi thành địa chỉ của ứng dụng React của bạn
  credentials: true, // Cho phép gửi cookie
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: ACCESSTOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000, // Thời gian hết hạn cho phiên (30 phút)
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
//Router
app.use("/api", categoryRouter);
app.use("/api", couponRouter);
app.use("/api", productRouter);
app.use("/order", VnPayRouter);
app.use("/api", commentRouter);
app.use("/api", saleRouter);
app.use("/", orderRouter);
app.use("/api", routerPassport);
app.use("/", UserRouter);
app.use("/", AnalystRouter);
app.use("/api/message", messageRouter)


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

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});


io.on("connection", (socket: Socket) => SocketServer(socket))


server.listen(process.env.port || port, () => {
  console.log(`App running on port ${process.env.port || port}`);
});
export const viteNodeApp = app;

