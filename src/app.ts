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
// Cấu hình Multer để xử lý tệp tải lên
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     // Đọc dữ liệu từ tệp Excel và thêm vào MongoDB
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(req.file.buffer);

//     const productData = {};

//     workbook.eachSheet((worksheet, sheetId) => {
//       worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => cell.value = cell.text);
//       worksheet.eachRow({min:2,max:worksheet.actualRowCount},(row, rowNumber) => {
//         const productId = row.getCell('A').value;
//         if (!productData[productId]) {
//           productData[productId] = {
//             productName: row.getCell('A').value,
//             price: row.getCell('B').value,
//             description: row.getCell('C').value,
//             categoryId: row.getCell('D').value,
//             discount: row.getCell('E').value,
//             properties: [],
//           };
//         }

//         const property = {
//           imageUrl: row.getCell('F').text,
//           color: row.getCell('G').value,
//           variants: [
//             {
//               size: row.getCell('H').value,
//               quantity: row.getCell('I').value,
//             },
//           ],
//         };

//         productData[productId].properties.push(property);
//       });
//     });

//     // Chuyển đổi dữ liệu từ object sang array
//     const productsArray = Object.values(productData);

//     // Thêm dữ liệu vào MongoDB
//     await product.insertMany(productsArray);

//     res.status(200).json({ message: 'Import completed' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

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
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

var onlineUsers = new Map();

// io.on('connection', (socket) => {
//   global.chatSocket = socket;

//   socket.on("addUser", (userId) => {
//     onlineUsers.set(userId, socket.id)
//   })

//   socket.on('sendMsg', (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if(sendUserSocket) {
//       socket.to(sendUserSocket).emit('msg-recieve', data.msg)
//     }
//   })
// })

io.on("connection", (socket: Socket) => SocketServer(socket))


server.listen(process.env.port || port, () => {
  console.log(`App running on port ${process.env.port || port}`);
});
export const viteNodeApp = app;

