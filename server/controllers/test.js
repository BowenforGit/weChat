const mongoose = require('mongoose')
const Test = require('../models/test.js')

module.exports = {
  add (req, res, next) {
    const user = new Test(req.body)
    user.save((err) => {
      return next(err)
    })
  },

  ask (req, res, next) {
    const name = req.body.username
    Test.find((err, user) => {
      if(err) { return next(err) }
      res.send(user)
    })
  }
}