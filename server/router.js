const AuthenticationController = require('./controllers/AuthenticationController.js')
const ProjectController = require('./controllers/ProjectController.js')
const TaskController = require('./controllers/TaskController.js')

module.exports = (app) => {
    // Authentication
    app.get('/login', AuthenticationController.login)
    
    // Project POST
    app.post('/create', AuthenticationController.check, ProjectController.createProject)
    app.post('/invite', AuthenticationController.check, ProjectController.inviteMembers)
    app.post('/edit_project', AuthenticationController.check, ProjectController.editProject)

    // Project DELETE   
    app.delete('/delete_project', AuthenticationController.check, ProjectController.deleteProject)

    // Project GET
    app.get('/project', AuthenticationController.check, ProjectController.getProject)
    app.get('/project/:id', AuthenticationController.check, ProjectController.getOneProject)

    // Task POST
    app.post('/add', AuthenticationController.check, TaskController.addTask)
    app.post('/edit_task',AuthenticationController.check, TaskController.editTask)

    // Task GET
    app.get('/task', AuthenticationController.check, TaskController.getTask)
    app.get('/task/:id', AuthenticationController.check, TaskController.getOneTask)
    app.get('/toggle/:id', AuthenticationController.check, TaskController.toggleTask)
}
