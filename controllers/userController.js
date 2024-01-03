const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');



const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email: email});

        if (userData) {

            console.log(userData.name);
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                res.cookie(`user`, JSON.stringify(userData));
                if (userData.is_admin == 1) {
                    res.redirect('/dashboard');
                    const userNAME = new Buffer(userData.name);
                } else {
                    res.redirect('/blog');
                }
            } else {
                res.render('login', {message: "Email and Password is incorrect!"});
            }
        } else {
            res.render('login', {message: "Email and Password is incorrect!"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('user');
        res.redirect('/login');
    } catch (error) {
        console.log(error.message)
    }
}

const profile = async (req, res) => {
    try {
        res.send('Hi profile here');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetLoad = async (req, res) => {
    try {
        res.render('forget-password');
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try {
        
        res.render('register');

    } catch (error) {
        console.log(error.message);
    }
}

const register = async(req, res)=>{

    try {

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        });

        await user.save();

        res.render('register',{ message: 'Đăng kí thành công' });
        
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    loadLogin, verifyLogin, profile, logout, forgetLoad, loadRegister, register
}