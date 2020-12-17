const express = require('express');
const { checkNotLogin } = require('../middlewares/check');
const router = express.Router();
const UserModel = require('../models/users');
const sha1 = require('sha1')

router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin')
})

router.post('/', checkNotLogin, function(req, res, next) {
    const name = req.body.name
    const password = req.body.password

    try {
        if(!name.length) {
            throw new Error('请填写用户名')
        }

        if(!password.length) {
            throw new Error('请填写密码')
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name).then(function (user) {
        if(!user) {
            req.flash('error', '用户不存在')
            return res.redirect('back')
        }

        if(sha1(password) !== user.password) {
            req.flash('error', '用户名或密码错误')
            return res.redirect('back')
        }

        delete user.password
        req.session.user = user
        res.redirect('/posts')
    }).catch(next)
})

module.exports = router