const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

const CommentModel = require('../models/comments')

router.post('/', checkLogin, function(req, res, next) {
    const author = req.session.user._id
    const postId = req.body.postId
    const content = req.body.content

    try {
        if(!content.length) {
            throw new Error('请填写留言内容')
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('back')
    }

    const comment = {
        author: author,
        postId: postId,
        content: content
    }

    CommentModel.create(comment).then(function() {
        req.flash('success', '留言成功')
        res.redirect('back')
    }).catch(next)
});

module.exports = router