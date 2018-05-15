const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const BaseModel = require('./base_model')

var GroupSchema = new Schema({
  groupname: {type: String}, 
  groupmember: [], // ObjectId of all the members
  create_at: Date,
  update_at: Date,
  timeslot: [] 
  /* in the form of 
  { task_name: Writing report, 
    deadline: 2018/9/30, 
    pic: Bowen, 
    duration: 10,
    importance: 2 }
  */
}, {timestamps: true})

GroupSchema.pre('save', function save (next) {
  
})

GroupSchema.plugin(BaseModel)
const Group = mongoose.model('Group', GroupSchema)
module.exports = Group
