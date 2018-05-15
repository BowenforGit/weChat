/*
PROGRAM base model
PROGRAMMER: LI Jiaxin
VERSION 1: written 22-02-2018
PURPOSE: Provide a base model which all other models could inherit from
FUNCTION: generate a time at creation or updating
*/
var moment = require('moment')

moment.locale('en')

var formatDate = function (date, friendly) {
  date = moment(date)
  if (friendly) {
    return date.fromNow()
  } else {
    return date.format('YYYY-MM-DD HH:mm')
  }
}

module.exports = function (schema) {
  schema.methods.create_at_ago = () => {
    return formatDate(this.create_at, true)
  }

  schema.methods.update_at_ago = () => {
    return formatDate(this.update_at, true)
  }
}
