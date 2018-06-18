var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysql = require('../util').mysql;
var checkNotLogin = require('../util').checkNotLogin;
var TC = require('../controllers/TaskController');

var router = express.Router();

router.use(loginCheckMiddleware);

router.all('*', checkNotLogin);

router.get('/', TC.checkTasks); // check all the tasks of a specific user
router.get('/:id', TC.checkOneTask); // check one single task of a specific user, id for task_id
router.get('/toggle/:id', TC.toggleTask); // toggle the status of a specific task

router.post('/', TC.addTask); // add one task
router.put('/:id', TC.editTask); // edit one task, id for task_id

module.exports = router;
