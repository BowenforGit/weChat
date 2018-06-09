var express = require('express');
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysql = require('../util').mysql;
var only = require('../util').only;
var projectTable = 'project';
var taskTable = 'task';
var userTable = 'user';
var logsTable = 'logs';
var imageTable = 'image';
var projectAttrs = 'name info start_date end_date project_type';

module.exports = {
  // First time the project is created
  createProject: function(req, res, next) {
    var project = req.body;
    project = {
      name: project.name,
      leader: req.session.open_id,
      info: project.info || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      project_type: project.project_type
    };
    mysql(projectTable).insert(project)
      .then(function (result) {
        // project.project_id = result[0];
        res.json(result);
        var item = {
          project_id: result.project_id,
          action: 'create a project',
          item: result.name
        };
        mysql(logsTable).insert(item);
      });
  },

  // the leader invite the members
  inviteMembers: function(req, res, next) {
    var project_id = req.params.id;
    console.info("I am here1");
    mysql(projectTable).where({
      project_id: project_id
    })
      .select('*')
      .then(function (result) {
        
    console.info("I am here2");
    if(result.length === 0) {
          res.status(404).json({
            error: 'There is no project with this project id.'
          });
        }
        else {     
        console.info("I am here2");
        var attr = {};
          if(result[0].member_id1 === '') { attr.member_id1 = req.session.open_id; }
          else if(result[0].member_id2 === '') { attr.member_id2 = req.session.open_id; }
          else if(result[0].member_id3 === '') { attr.member_id3 = req.session.open_id; }
          else if(result[0].member_id4 === '') { attr.member_id4 = req.session.open_id; }
          else if(result[0].member_id5 === '') { attr.member_id5 = req.session.open_id; }
          else { res.send({ error: 'Maximum 5 members!' }); return; }
          console.info("attr", attr);
          mysql(projectTable).where({
            project_id: project_id
          })
            .update(attr)
            .then(function (result) {
              console.log(result);
              console.info("I am here3");              
              res.json(result);
            });
          
          var item = {
            project_id: project_id,
            action: 'New member joins!',
            item: attr.member_id1 || attr.member_id2 || attr.member_id3 || attr.member_id4 || attr.member_id5
          };
          mysql(logsTable).insert(item);
        }
      });
  },

  // edit the project information
  editProject: function(req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if (result.length === 0) {
          res.status(404).json({
            error: 'project does not exist.'
          });
        }
        else {
          if(result[0].leader != req.session.open_id) {
            res.status(403).json({
              error: 'Not authorized'
            });
          }
          else {
            var changedAttrs = only(req.body, projectAttrs);
            mysql(project).where({
              project_id: req.params.id
            })
              .update(changedAttrs)
              .then(function () {
                res.json(changedAttrs);
              });
          }
        }
      });
  },

  // delete a project
  deleteProject: function(req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if (result.length === 0) {
          res.status(404).json({
            error: 'project does not exist.'
          });
        }
        else {
          if (result[0].leader != req.session.open_id) {
            res.status(403).json({
              error: 'Not authorized'
            });
          }
          else {
            mysql(logsTable).where({
              project_id: req.params.id
            })
              .delete();
            
              mysql(projectTable).where({
                project_id: req.params.id
              })
              .delete()
              .then(function () {
                res.status(204).json();
              });
          }
        }
      });
  },

  quitProject: function(req, res, next) {
    mysql(projectTable)
      .where({ project_id: req.params.id} )
      .select('*')
      .then(function(result) {
        var attr = {};
        if(result[0].member_id1 === req.session.open_id) { attr.member_id1 = ''; }
        else if(result[0].member_id2 === req.session.open_id) { attr.member_id2 = ''; }
        else if(result[0].member_id3 === req.session.open_id) { attr.member_id3 = ''; }
        else if(result[0].member_id4 === req.session.open_id) { attr.member_id4 = ''; }
        else if(result[0].member_id5 === req.session.open_id) { attr.member_id5 = ''; }
        mysql(projectTable).where({ project_id: req.params.id })
          .update(attr)
          .then(function(){
            mysql(projectTable).where({ project_id: req.params.id })
              .then(function(result) {
                res.json({success: 'yes!'});
              });
          });
      });
  },
  // get all the project for a specific user
  getProjects: function(req, res, next) {
    console.log(req.session);
    mysql(projectTable).where({ leader: req.session.open_id })
      .orWhere({ member_id1: req.session.open_id })
      .orWhere({ member_id2: req.session.open_id })
      .orWhere({ member_id3: req.session.open_id })
      .orWhere({ member_id4: req.session.open_id })
      .orWhere({ member_id5: req.session.open_id })
      .select('*')
      .then(function (result) {
        console.log(result);
        res.send(result);
      });
  },

  getOneProject: function(req, res, next) {
    mysql(projectTable).where({
      project_id: req.params.id
    })
      .select('*')
      .then(function (result) {
        if(result.length === 0) {
          res.status(404).json({
            error: 'Project does not exist.'
          });
        }
        else {
          console.log("project", result);
          console.log("project", result[0]);
          project = result[0];
          var id_list = [project.leader, project.member_id1, project.member_id2, project.member_id3, project.member_id4, project.member_id5];
          for(var i = 0; i < id_list.length; i++) {
            if(id_list[i] === '') {
              id_list.splice(i, 1);
              i--;
            }
          }
          console.log(id_list);
          mysql(userTable)
            .whereIn('open_id', id_list)
            .select('*')
            .then(function(members) {
              mysql(taskTable)
              .where({ project_id: req.params.id })
              .then(function (result) {
                var num = req.params.num;
                if (result.length < 100) { res.json([project, members, result]); }
                else { 
                  result = result.slice(0,4); 
                  console.log('project!!!');
                  console.log(project);
                  console.log('members!!!');
                  console.log(members);
                  console.log('result!!!');
                  
                  console.log(result);
                  res.json([project, members, result]); 
                }
              });
            });
        }
      });
  },
  
  // start from num = 2
  getMoreTask: function(req, res, next) {
    mysql(taskTable)
      .where({ project_id: req.params.id })
      .then(function (result) {
        var num = req.params.num;
        if (result.length < (num - 1) * 5) { res.send({error: 'No more!'}); }
        else if (result.length < num * 5) { res.send(result.slice((num-1)*5, result.length-1)); }
        else { res.send([project, result.slice((num-1)*5, num*5-1)]); }
      });
  },

  getDocument: function(req,res, next) {
    mysql(imageTable).where({
      project_id: req.params.id
    })
      .then(function(result) {
        res.send(result);
      });
  },

  getLogs: function(req, res, next) {
    mysql(logsTable).where({
      project_id: req.params.id
    })
    .then(function(result) {
      res.send(result);
    });
  },

  deleteImage: function(req, res, next) {
    mysql(imageTable).where({ image_id: req.params.id }).delete();
  }
};