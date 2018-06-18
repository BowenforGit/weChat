var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var CosSdk = require('cos-nodejs-sdk-v5');
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var checkNotLogin = require('../util').checkNotLogin;
var router = express.Router();
var mysql = require('../util').mysql;
var config = require('../config');
var imageTable = 'image';
var userTable = 'user';

var qcloudConfig = JSON.parse(fs.readFileSync('/data/release/sdk.config.json', 'utf8'));

var cos = new CosSdk({
  AppId: qcloudConfig.qcloudAppId,
  SecretId: qcloudConfig.qcloudSecretId,
  SecretKey: qcloudConfig.qcloudSecretKey
});

router.use(loginCheckMiddleware);

router.all('*', checkNotLogin);

router.get('/', function (req, res, next) {
    mysql(userTable).where({
      open_id: req.session.open_id
    })
      .select('*')
      .then(function (result) {
        if (result.length > 0) {
          var data = result[0];
          res.send(data);
        }
        else {
          res.status(400).json({
            error: '未创建用户'
          });
        }
      });
  
  });
  
//新增用户
router.post('/', function (req, res, next) {

    var userInfo = req.body;

    if (!userInfo.name || !userInfo.avatar) {
        res.status(400).json({ error: '参数错误' });
        return;
    }

    mysql(userTable)
        .where({ open_id: req.session.open_id })
        .count('open_id as hasUser')
        .then(function (ret) {
            if (ret[0].hasUser) {
                res.status(400).json({
                error: '用户已创建'
                });
            }
            else {
                userInfo = {
                    open_id: req.session.open_id,
                    name: userInfo.name,
                    avatar: userInfo.avatar
                };
                mysql(userTable)
                    .insert(userInfo)
                    .then(function () {
                        // delete userInfo.open_id;
                        res.json(userInfo);
                    });
            }
        });
});

//更新用户
router.patch('/', function (req, res, next) {
    var userInfo = req.body;

    if (!userInfo.name && !userInfo.avatar) {
        res.status(400).json({
        error: '参数错误'
        });
        return;
    }

    var updateData = userInfo.name ? {
        name: userInfo.name
    } : {
        avatar: userInfo.avatar
    };

    mysql(userTable)
        .where({ open_id: req.session.open_id })
        .update(updateData)
        .then(function () {
            res.json(updateData);
        });
});

router.post('/image/:id', function (req, res, next) {
    //res.send('Hello').end();
    var form = new multiparty.Form({
        encoding: 'utf8',
        autoFiles: true,
        uploadDir: '/tmp'
    });

    console.log("Form OK!");
    form.parse(req, function (err, fields, files) {
        if (err) { console.log("there is an error"); next(err); }
        else {
            var imageFile = files.file[0];
            var fileExtension = imageFile.path.split('.').pop();
            var fileKey = parseInt(Math.random()*10000000) + '_' + (+new Date()) + '.' + fileExtension;

            var params = {
                Bucket: config.cos.fileBucket,
                Region: config.cos.region,
                Key: fileKey,
                Body: fs.readFileSync(imageFile.path),
                contentLength: imageFile.size
            };

            console.log("I am parsing the project!");
            cos.putObject(params, function (err, data) {
                fs.unlink(imageFile.path);
                if (err) {
                    console.log("there is another error!");
                    next(err);
                    return;
                }
                console.log("ready to insert into the sql");
                mysql(imageTable)
                    .insert({
                        project_id: req.params.id,
                        url: data.Location
                    })
                    .then(function(result){
                        console.log("Success?");
                        console.log(result);
                    });
                res.send(data.Location);
            });
        }
    });
});

module.exports = router;
