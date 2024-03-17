import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { on } from "events";
import { chatapp } from "./schema.js";
import { mongoosedatabse } from "./mongodb.js";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/assets'));



app.set("views", path.join(__dirname, "views"));


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use(cors());

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("adduser", (username) => {
    const getdata = chatapp
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .then((data) => {
        const reversedata = data.reverse();
        socket.emit("previousdata", reversedata);
      })
      .catch((err) => {
        console.log(err);
      });

    onlineUsers[socket.id] = username;

    console.log(onlineUsers);

    io.emit("updateUserList", Object.values(onlineUsers));
  });

  socket.on("message", (valueoftext) => {
    const data = valueoftext;

    let hourandtime = data[0] + ":" + data[1];
    const usermessage = data[2];

    const result = new chatapp({
      message: usermessage,
      time: hourandtime,
      username: data[3],
    });

    result.save();

    socket.broadcast.emit("broadcastmessage", valueoftext);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];

    io.emit("updateUserList", Object.values(onlineUsers));

    console.log("Connection disconnected.");
  });
});

const port = 8000;
server.listen(port, () => {
  console.log("Listening on port 3000");

  mongoosedatabse();
});


