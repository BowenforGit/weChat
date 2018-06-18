var express = require('express');
var router = express.Router();
var loginCheckMiddleware = require('../util').loginCheckMiddleware;
var mysql = require('../util').mysql;
var checkNotLogin = require('../util').checkNotLogin;
var PC = require('../controllers/ProjectController');

router.use(loginCheckMiddleware);

router.all('*', checkNotLogin);

// GET
router.get('/', PC.getProjects); // get all the projects of a user
router.get('/:id', PC.getOneProject); // get one project, id for project_id
router.get('/quit/:id', PC.quitProject); // quit a project, id for project_id
router.get('/document/:id', PC.getDocument); // get all the document of the project, id for project_id
router.get('/logs/:id', PC.getLogs); // get all the logs of a project, id for project_id

// DELETE
router.delete('/:id', PC.deleteProject); // delete one project, id for project_id
router.delete('/image/:id', PC.deleteImage);

// POST
router.post('/', PC.createProject); // create one project
router.post('/invite/:id', PC.inviteMembers); // invite one member
router.put('/:id', PC.editProject); // edit the info of a project

module.exports = router;