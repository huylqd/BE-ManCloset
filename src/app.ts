import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import categoryRouter from "./routers/category";
import couponRouter from "./routers/coupon";
import saleRouter from "./routers/sale";
import { isCheckedSale } from "./controller/saleController";
import VnPayRouter from "./routers/VnPay";
import orderRouter from "./routers/order";
import AnalystRouter from "./routers/analyst";
import productRouter from "./routers/product";
import cartRouter from "./routers/cart";
import messageRouter from "./routers/message";
import dotenv from "dotenv";
import UserRouter from "./routers/auth";
import commentRouter from "./routers/comment";
import passport from "passport";
import routerPassport from "./routers/passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import socket, { Server, Socket }  from "socket.io";
import http from "http";
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
app.use("/api/message", messageRouter )
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

// const server = app.listen(port, () => {
//   console.log(`App is running at the ${port}`);
// });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

var onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('sendMsg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.msg)
    }
  })
})
server.listen(process.env.port || port, () => {
  console.log(`App running on port ${process.env.port || port}`);
});
export const viteNodeApp = app;

