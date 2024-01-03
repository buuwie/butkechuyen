const mongoose = require("mongoose")
const session = require("express-session")
const eventEmitter = require('events');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect("mongodb+srv://hungtranngoc2002:hung04112002@cluster0.iui52lf.mongodb.net/");
        console.log(`DB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
    }
}

connectDB();

const express = require("express");
const app = express();
const Post = require('./models/post.model');
const Like = require('./models/like.model');
const { ObjectId, MongoGridFSChunkError } = require('mongodb');

var http = require('http').createServer(app);
var { Server, Socket } = require('socket.io');
var io = new Server(http,{});
const emitter = new eventEmitter();

const isBlog = require("./middlewares/isBlog");
app.use(isBlog.isBlog);

const adminRoute = require("./routes/adminRoutes");
app.use('/', adminRoute);

const userRoute = require("./routes/userRoute");
app.use('/', userRoute);

const blogRoute = require("./routes/blogRoute");
app.use('/', blogRoute);

io.on("connection", function(socket) {
    console.log('User connected');

    socket.on("new_post", function (formData) {
        console.log(formData);
        socket.broadcast.emit("new_post", formData);
    });

    socket.on("new_comment", function (comment) {
        io.emit("new_comment", comment);
    });

    socket.on("delete_post", function (postId) {
        socket.broadcast.emit("delete_post", postId);
    });

    socket.on("increment_page_view", async function (post_id) {
        var data = await Post.findOneAndUpdate({_id: post_id}, {
            $inc: {views: 1}
        }, {
            new: true
        });
        socket.broadcast.emit("updated_views", data);
    });

    socket.on("like", async function(data){
        await Like.updateOne({
            post_id:data.post_id,
            user_id:data.user_id
        }, {
            type:1
        },
        {
            upsert: true
        });

        const likes = await Like.find({ "post_id":data.post_id,type:1 }).count();
        const dislikes = await Like.find({ "post_id":data.post_id,type:0 }).count();

        io.emit("like_dislike",{
            post_id:data.post_id,
            likes:likes,
            dislikes:dislikes
        });
    });

    socket.on("dislike", async function(data){
        await Like.updateOne({
            post_id:data.post_id,
            user_id:data.user_id
        }, {
            type:0
        },
        {
            upsert: true
        });

        const likes = await Like.find({ "post_id":data.post_id,type:1 }).count();
        const dislikes = await Like.find({ "post_id":data.post_id,type:0 }).count();

        io.emit("like_dislike",{
            post_id:data.post_id,
            likes:likes,
            dislikes:dislikes
        });
    });
});

http.listen(3000, function() {
    console.log("App running on port 3000!");
});

// app.listen(3000, function() {
//     console.log("App running on port 3000!");
// });