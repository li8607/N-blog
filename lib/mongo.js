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