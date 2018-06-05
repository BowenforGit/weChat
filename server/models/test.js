const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TestSchema = new Schema({
  username: { type: String }},
{ timestamps: true })

const Test = mongoose.model('Test', TestSchema)
module.exports = Test
