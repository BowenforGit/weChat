//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    navTab: ["Todo", "My log", "Missed"],
    currentNavtab: "0",
    user: {
      tasks: [
        {
          taskID: 0,
          proName: 'Project 1',
          taskType: 'Submit file',
          taskName: 'submit final report',
          due: '2017-01-02',
          status: 0,
        },
        {
          taskID: 1,
          proName: 'Project 2',
          taskType: 'Meeting',
          taskName: 'discuss sth',
          due: '2018-02-03',
          status: 1,
        },
        {
          taskID: 1,
          proName: 'Project 2',
          taskType: 'Meeting',
          taskName: 'discuss sth',
          due: '2018-12-03',
          status: 0,
        }
      ]
    }
  },
  onLoad: function () {

  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  }
})
