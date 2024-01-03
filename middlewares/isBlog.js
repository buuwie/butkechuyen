const BlogSetting = require("../models/blog.model");

const isBlog = async(req, res, next) => {
    try {
        
        const blogSetting = await BlogSetting.find({});
        blogSetting.length = 1;
        if (blogSetting.length == 0 && req.originalUrl != "/blog-setup") {
            res.redirect('/blog-setup');
        }
        else {
            next();
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isBlog
}