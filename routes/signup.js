const express = require('express')
const router = express.Router();
const checkNotLogin = require('../middlewares/check').checkNotLogin
const fs = require('fs')
const sha1 = require('sha1')
const UserModel = require('../models/users')
const path = require('path')

router.get('/', checkNotLogin,  function(req, res, next) {
    res.render('signup')
})


function ShowTheObject(obj){
  var des = "";
    for(var name in obj){
	des += name + ":" + obj[name] + ";";
     }
  console.log(des);
}

router.post('/', checkNotLogin, function(req, res, next) {

    console.log(req.files)
    ShowTheObject(req.body)

    const name = req.body.name;
    const gender = req.body.gender;
    const bio = req.body.bio;
    const avatar = "images/"+req.files[0].filename;
    let password = req.body.password;
    const repassword = req.body.repassword;

    try {
        if(!(name.length > 1 && name.length < 10)) {
            throw new Error('名字请限制在 1-10 个字符');
        }
        if(['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('性别只能是 m、f 或 x');
        }
        if(!(bio.length > 1 && bio.length < 30)) {
            throw new Error('个人简介请限制在 1-30 个字符')
        }
        if(!req.files[0].fieldname) {
            throw new Error('缺少头像')
        }
        if(password.length < 6) {
            throw new Error('密码至少 6 个字符')
        }
        if(password != repassword) {
            throw new Error('两次输入密码不一致')
        }
    } catch (e) {
         req.flash('bbbb2222', e)
        fs.unlink(avatar, (err) => {
            console.log("bbbbbb" + err)
        })
        req.flash('error', e.message)
        return res.redirect('/signup')
    }

    password = sha1(password)

    let user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    }

    UserModel.create(user).then(function (result) {
        user = result.ops[0]
        delete user.password

        req.session.user = user
        req.flash('success', '注册成功')
        res.redirect('/posts')
    }).catch(function (e) {
        console.log("aaaaa222" + e)
        fs.unlink(avatar, (err) => {
            console.log(err)
        })
        if(e.message.match('duplicate key')) {
            req.flash('error', '用户名已被占用')
            return res.redirect('/signup')
        }
        next()
    })
})

module.exports = router