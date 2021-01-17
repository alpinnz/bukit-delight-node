require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;
const index = require("./routes");

const { Mongoose } = require("./config");
Mongoose.connect();

const app = express();
app.use(cors());
app.use("/", (req, res, next) => {
  const {} = req;
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "./../public")));
app.use(index);

// error handler middleware
const { Response } = require("./middlewares");
app.use(Response.Error);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:80",
    methods: ["GET", "POST"],
  },
});

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// const getApiAndEmit = (socket) => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("AccountUpdate", response);
// };

app.io = io;

server.listen(port, () => console.log(`Listening on port ${port}`));
