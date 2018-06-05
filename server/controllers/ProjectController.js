var express = require('express')
var loginCheckMiddleware = require('../util').loginCheckMiddleware
var mysql = require('../util').mysql
var only = require('../util').only
var projectTable = 'project'
var projectAttrs = 'name info start_date end_date project_type'

module.exports = {
  // First time the project is created
  createProject (req, res, next) {
    var project = req.body
    project = {
      name: project.name,
      leader: project.leader,
      info: project.info || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      project_type: project.type
    }
    mysql(projectTable).insert(project)
      .then(function (result) {
        project.project_id = result[0]
        res.json(project)
      })
  },

  // the leader invite the members
  inviteMembers (req, res, next) {
    var project_id = req.params.id
    members = {
      member_id1: req.body.member_id1,
      member_id2: req.body.member_id2,
      member_id3: req.body.member_id3,
      member_id4: req.body.member_id4,
      member_id5: req.body.member_id5,
    }
    
    mysql(projectTable).where({
      project_id: project_id
    })
      .select('*')
      .then(function (result) {
        if(result.length === 0) {
          res.status(404).json({
            error: 'There is no project with this project id.'
          })
        }
        else {
          mysql(projectTable).where({
            project_id: project_id
          })
            .update(members).
            then(function () {
              res.json(members)
            })
        }
      })
  },

  // edit the project information
  editProject (req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if (result.length === 0) {
          res.status(404).json({
            error: 'project does not exist.'
          })
        }
        else {
          if(result[0].leader != req.session.open_id) {
            res.status(403).json({
              error: 'Not authorized'
            })
          }
          else {
            var changedAttrs = only(req.body, projectAttrs)
            mysql(project).where({
              project_id: req.params.id
            })
              .update(changedAttrs)
              .then(function () {
                res.json(changedAttrs)
              })
          }
        }
      })
  },

  // delete a project
  deleteProject (req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if (result.length === 0) {
          res.status(404).json({
            error: 'project does not exist.'
          })
        }
        else {
          if (result[0].leader != req.session.open_id) {
            res.status(403).json({
              error: 'Not authorized'
            })
          }
          else {
            var changedAttrs = only(req.body, projectAttrs)
            mysql(project).where({
              project_id: req.params.id
            })
              .delete()
              .then(function () {
                res.status(204).json()
              })
          }
        }
      })
  },

  // get all the project for a specific user
  getProject (req, res, next) {
    mysql(projectTable).where({ leader: req.session.open_id })
      .orWhere({ member_id1: req.session.open_id })
      .orWhere({ member_id2: req.session.open_id })
      .orWhere({ member_id3: req.session.open_id })
      .orWhere({ member_id4: req.session.open_id })
      .orWhere({ member_id5: req.session.open_id })
      .select('*')
      .then(function (result) {
        res.json(result)
      })
  },

  getOneProject (req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if(result.length === 0) {
          res.status(404).json({
            error: 'Project does not exist.'
          })
        }
        else {
          res.json(result[0])
        }
      })
  }


}