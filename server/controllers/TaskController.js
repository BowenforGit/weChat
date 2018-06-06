var express = require('express')
var mysql = require('../util').mysql
var only = require('../util').only
var taskTable = 'task'
var taskAttrs = 'name info start_date deadline task_type'

module.exports = {
  // check all tasks of the user
  checkTasks (req, res, next) {
    mysql(taskTable)
      .where({ member_id1: req.params.open_id })
      .orWhere({ member_id2: req.params.open_id })
      .orWhere({ member_id3: req.params.open_id })
      .select('*')
      .then(function (result) {
        res.json(result)
      })
  },

  // check a specific task
  checkOneTask (req, res, next) {
    mysql(taskTable)
      .where({ task_id: req.params.id })
      .select('*')
      .then(function (result) {
        if(result.length === 0) {
          res.status(404).json({
            error: 'No such task.'
          })
        }
        else {
          res.json(result[0])
        }
      })
  },

  // edit a task
  editTask (req, res, next) {
    var changedAttrs = req.body
    mysql(taskTable).where({
      task_id: req.params.id
    })
      .select('*')
      .update(changedAttrs)
      .then(function () {
        res.json(changedAttrs)
      })
  },

  // change the status of a task
  toggleTask (req, res, next) {
    mysql(taskTable).where({
      task_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        changedAttrs = {}
        if (result[0].finish == true) { changedAttrs.finish = false }
        else { changedAttrs.finish = true }
        mysql(taskTable)
          .where({ task_id: req.params.id })
          .update(changedAttrs)
          .then(function() {
            res.json(changedAttrs)
          })
      })
  },

  addTask (req, res, next) {
    var task = req.body
    mysql(taskTable)
      .insert(task)
      .then(function (result) {
        task.task_id = result[0].task_id
        res.json(task)
      })
  }
}