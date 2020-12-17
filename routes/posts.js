const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const checkLogin = require('../middlewares/check').checkLogin
const ejsLint = require('ejs-lint');

router.get('/', function(req, res, next) {
    const author = req.query.author
    PostModel.getPosts(author).then(function(posts) {
        res.render('posts', {posts: posts});
    }).catch(next)
})

router.get('/create', checkLogin, function(req, res, next) {
    res.render('create')
})

router.post('/create', checkLogin, function(req, res, next) {
    const author = req.session.user._id
    const title = req.body.title
    const content = req.body.content

    try {
        if(!title.length) {
            throw new Error('请填写标题')
        }
        if(!content.length) {
            throw new Error('请填写内容')
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('back')
    }

    let post = {
        author: author,
        title: title, 
        content: content
    }

    PostModel.create(post).then(function(result) {
        post = result.ops[0]
        req.flash('success', '发表成功')

       

        res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})

router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId

    Promise.all([
        PostModel.getPostById(postId)
    ]).then(function(result) {
        const post = result[0]

        
        console.log("title" + post.title)
        console.log("content" + post.content)
        console.log("created_at" + post.created_at)
        console.log("author" + post.author)
        console.log("_id" + post._id)
        console.log("pv" + post.pv)

        if(!post) {
            throw new Error('该文章不存在')
        }

        res.render('post', {
            post: post
        })
    }).catch(next)
})

module.exports = router