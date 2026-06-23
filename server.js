const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");
const http = require("http");
const {Server} = require("socket.io");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : "*"
    }
});
app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);
io.on("connection", (socket)=>{
    console.log("User Connected", socket.id);
    socket.on("sendMessage", async(data)=>{
       try{
        await Message.create({
            username : data.username,
            message : data.message
        });
        io.emit("receiveMessage", data);
       }catch(error){
        console.log(error.message);
       }
    });
    socket.on("disconnect", ()=>{
        console.log("User Disconnected:", socket.id);
    });
});
app.get("/", (req, res)=>{
    res.send("Messaging App API Running");
});
const PORT = 3001;
server.listen(PORT, ()=>{
    console.log(`Server running on Port ${PORT}`);
});