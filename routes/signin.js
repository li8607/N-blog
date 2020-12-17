const express = require('express');
const { checkNotLogin } = require('../middlewares/check');
const router = express.Router();

router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin')
})

module.exports = router