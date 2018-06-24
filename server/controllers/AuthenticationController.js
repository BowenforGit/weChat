var express = require('express');
var request = require('request');
var crypto = require('crypto');
var moment = require('moment');
var config = require('../config');
var mysql = require('../util').mysql;
var sessionTable = 'session';
var projectTable = 'project';
var taskTable = 'task';

function sha1(message) {
  return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
}

module.exports = {
  login: function (req, res, next) {
    var code = req.query.code;
    var curTime = moment().format('YYYY-MM-DD HH:mm:ss');

    request.get({
      uri: 'https://api.weixin.qq.com/sns/jscode2session',
      json: true,
      qs: {
        grant_type: 'authorization_code',
        appid: config.appId,
        secret: config.appSecret,
        js_code: code
      }
    }, function (err, response, data) {
      console.log(err);
      if (response.statusCode === 200) {
        console.info(200);
        var sessionKey = data.session_key;
        var openId = data.openid;
        var skey = sha1(sessionKey);
        console.log(skey);
        var sessionData = {
          skey: skey,
          create_time: curTime,
          last_login_time: curTime,
          session_key: sessionKey
        };

        mysql(sessionTable).count('open_id as hasUser').where({
          open_id: openId
        })
          .then(function (res) {
            // 如果存在用户就更新session
            if (res[0].hasUser) {
              console.info('hasUser');
              return mysql(sessionTable).update(sessionData).where({
                open_id: openId
              });
            }
            // 如果不存在用户就新建session
            else {
              sessionData.open_id = openId;
              var project_demo = {
                name: "My First Project",
                leader: openId,
                info: "Welcome to Deadline Fighter!"
              };
              mysql(projectTable).insert(project_demo)
                .then(function(result) {
                  console.info("new project", result);
                  var task_demo1 = {
                    project_id: result[0],
                    name: 'Your first task!',
                    member_id1: openId,
                    info: 'Try to add a new task!',
                    importance: 1,
                    deadline: curTime
                  };
                  var task_demo2 = {
                    project_id: result[0],
                    name: 'Your second task!',
                    member_id1: openId,
                    info: 'Try to finish a new task!',
                    importance: 2,
                    deadline: '20180705000000'
                  };
                  mysql(taskTable).insert(task_demo1);
                  mysql(taskTable).insert(task_demo2)
                  .then(function() {
                    return mysql(sessionTable).insert(sessionData);
                  });
                });
            }
          })
          .then(function () {
            res.json({
              skey: skey
            });
          })
          .catch(function(e) {
            console.info('error1');
            res.json({
              skey: null
            });
          });

      } else {
        console.info('error2');        
        res.json({
          skey: null
        });
      }
    });
    //res.send({skey: 'Yesss!'});
  }
};