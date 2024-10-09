import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:5173", "http://localhost:3000"],
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// let onlineUsers = [
//     {
//         email:"zohre@gmail.com"  //admin
//         socketId:"nTlGkrq9i9DREtK1AAAC"
//     },
//     {
//         email:"mina@gmail.com"    //user
//         socketId:"mk_TWB1ku_RuT61_AAAD"
//     },
//     {
//         email:"mohammad@gmail.com"   //user
//         socketId:"AAADTGkrq9_RuT61_"
//     }
// ];
let onlineUsers = [];
const addNewUser = (email, socketId) => {
  !onlineUsers.some((item) => item.email === email) &&
    onlineUsers.push({ email, socketId });
};
const getUser = (email) => {
  console.log("email:", email);
  return onlineUsers.find((item) => item.email === email);
};
io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);
  socket.on("newUser", (email) => {
    addNewUser(email, socket.id);
    console.log("onlineUsers  ", onlineUsers);
  });

  socket.on("sendMessage", ({ senderEmail, receiverEmail, message }) => {
    const receiver = getUser(receiverEmail);
    console.log("receiver : ", receiver);
    console.log(senderEmail, receiverEmail, message);
    io.to(receiver.socketId).emit("receiveMessage", { senderEmail, message });
    //socket.broadcast.emit("receiveMessage", { senderEmail, message });
  });
});

// io.emit()
// io.to().emit()
// io.on();
const port = process.env.PORT;
server.listen(port, () => {
  console.log("server is running");
});
