const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')

router.get('/', function(req, res, next) {
    const author = req.query.author
    PostModel.getPosts(author).then(function(posts) {
        res.render('posts', {posts: posts});
    }).catch(next)
})

module.exports = router