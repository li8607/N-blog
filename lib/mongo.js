const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect('mongodb://localhost:27017/myblog')

exports.User = mongolass.model('User', {
    name: { type: 'string', required: true },
    password: { type: 'string', require: true },
    avatar: { type: 'string', require: true },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
    bio: { type: 'string', required: true }
})

exports.User.index({ name: 1 }, { unique: true }).exec()

const moment = require('moment')

mongolass.plugin('addCreateAt', {
    afterFind: function(results) {
        results.forEach(element => {
            element.created_at = moment().format('YYYY-MM-DD HH:mm')
        });
        return results;
    },

    afterFindOne: function(result) {
        if(result) {
            result.created_at = moment().format('YYYY-MM-DD HH:mm')
        }
        return result;
    }
})

exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId, required: true},
    title: {type: 'string', required: true},
    content: {type: 'string', required: true},
    pv: {type: 'number', default: 0}
})

exports.Post.index({author: 1, _id: -1}).exec()

exports.Comment = mongolass.model('Comment', {
    author: {type: Mongolass.Types.ObjectId, required: true},
    content: {type: 'string', required: true},
    postId: {type: Mongolass.Types.ObjectId, required: true}
})

exports.Comment.index({postId: 1, _id: 1}).exec()