var express = require('express');
var mysql = require('../util').mysql;
var only = require('../util').only;
var taskTable = 'task';
var userTable = 'user';
var logsTable = 'logs';
var taskAttrs = 'name info start_date deadline task_type subtask1 subtask2 subtask3 importance';

module.exports = {
  // check all tasks of the user
  checkTasks: function(req, res, next) {
    mysql(taskTable)
      .where({ member_id1: req.session.open_id })
      .orWhere({ member_id2: req.session.open_id })
      .orWhere({ member_id3: req.session.open_id })
      .select('*')
      .then(function (result) {
        res.send(result);
      });
  },

  // check a specific task
  checkOneTask: function(req, res, next) {
    mysql(taskTable)
      .where({ task_id: req.params.id })
      .select('*')
      .then(function (result) {
        if(result.length === 0) {
          res.status(404).json({
            error: 'No such task.'
          });
        }
        else {
          var task = result;
          mysql(userTable)
            .where({ open_id: member_id1 })
            .orWhere({ open_id: member_id2 })
            .orWhere({ open_id: member_id3 })
            .then(function (result) {
              res.send([task, result]);
            });
        }
      });
  },

  // edit a task
  editTask: function(req, res, next) {
    var changedAttrs = req.body;
    mysql(taskTable).where({
      task_id: req.params.id
    })
      .select('*')
      .update(changedAttrs)
      .then(function () {
        res.json(changedAttrs);
      });
  },

  // change the status of a task
  toggleTask: function(req, res, next) {
    mysql(taskTable).where({
      task_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        changedAttrs = {};
        if (result[0].finish == true) { changedAttrs.finish = false; }
        else { changedAttrs.finish = true; }
        mysql(taskTable)
          .where({ task_id: req.params.id })
          .update(changedAttrs)
          .then(function() {
            res.json(changedAttrs);
          });
      });
  },


  addTask: function(req, res, next) {
    var task = req.body;
    
    mysql(logsTable).insert({
      project_id: task.project_id,
      action: 'Add task',
      item: task.name,
    });
    
    mysql(taskTable)
      .insert(task)
      .then(function (result) {
        task.task_id = result[0].task_id;
        res.json(task);
      });  
  }
};