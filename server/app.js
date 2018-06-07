var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var config = require('./config');
var user = require('./routes/user');
var project = require('./routes/project');
var task = require('./routes/task');
var AC = require('./controllers/AuthenticationController');

var port = config.serverPort;

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/test', function (req, res) {
  res.send('<h1>Hello World!</h1>');
});

app.get('/login', AC.login);

app.use('/user', user);
app.use('/project', project);
app.use('/task', task);

app.use(errorHandler());

app.listen(port, function(err) {
  if(err) { console.log(err); }
  else {
    console.log("Server start! Listening on localhost:" + port);
  }
});
