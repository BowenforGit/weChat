const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const BaseModel = require('./base_model')

var UserSchema = new Schema({
  username: {type: String}, 
  userId: {type: String},
  avatar: {type: String},
  create_at: Date,
  group: [], // in the form of { groupId: ObjectId, leader: 0/1}
  task: [] // in the form of { task_name: Writing Report, deadline: 2018-9-8 }
}, {timestamps: true})

UserSchema.pre('save', function save (next) {
  
})

UserSchema.plugin(BaseModel)
const User = mongoose.model('User', UserSchema)
module.exports = User
