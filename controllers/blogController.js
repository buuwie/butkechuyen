const Post = require('../models/post.model');
const { post } = require('../routes/userRoute');
const Like = require('../models/like.model');
const Setting = require('../models/setting.model');
var ObjectId = require('mongodb').ObjectId;

const loadBlog = async (req, res) => {
    try {

        var setting = await Setting.findOne({});

        var limit = setting.post_limit;

        const posts = await Post.find({}).limit(limit);
        const sliderPosts = await Post.find({}).limit(5);
        const rmcdposts = await Post.find({}).skip(0).limit(3);
        res.render('blog', {posts: posts, sliderPosts: sliderPosts, rmcdposts: rmcdposts, postLimit: limit});
    } catch (error) {
        console.log(error.message);
    }
}

const loadPost = async (req, res) => {
    try {
        console.log(req.params.id);
        const dataid=req.params.id;
        const objectId =new ObjectId(dataid);
        const likes = await Like.find({ "post_id":objectId, "type" :1 }).count();
        const dislikes = await Like.find({ "post_id":objectId, "type" :0 }).count();
        
        console.log(likes);
        console.log(dislikes);
        const post = await Post.findOne({ "_id": req.params.id });
        const rmcdposts = await Post.find({}).skip(0).limit(3);
        res.render('post', {post: post, likes_count: likes, dislikes_count: dislikes, rmcdposts: rmcdposts});
    } catch (error) {
        console.log(error.message);
    }
}


const addComment = async (req, res) => {
    try {

        var post_id = req.body.post_id;
        var username = req.body.username;
        var comment = req.body.comment;

        var comment_id = new ObjectId();

        await Post.findByIdAndUpdate({ _id: post_id }, {
            $push: {
                "comments": {_id:comment_id, username: username, comment: comment }
            }
        });

        res.status(200).send({ success: true, msg: 'Đã thêm bình luận!', _id: comment_id})
    } catch (error) {
        res.status(200).send({ success: false, msg: error.message});
    }
}

const getPosts = async (req, res) => {
    try {

        const posts = await Post.find({}).skip(req.params.start).limit(req.params.limit);
        res.send(posts);
        
    } catch (error) {
        res.status(200).send({ success: false, msg: error.message});
    }
}


module.exports = {
    loadBlog, loadPost, addComment, getPosts
}