// entry point for the server
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const errorHandler = require('errorhandler')

// connect to the MongoDB database
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/mini-program')
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error('connect to mongodb err: ', err))

const app = express()
app.use(morgan('combined')) // printing logs
app.use(bodyParser.json()) // parse the request body


require('./router')(app) // route

app.use(errorHandler()) // handle the errors

app.listen(5757)
