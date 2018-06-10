//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    More:'更多de',
    navTab: ["Todo", "My log", "Missed"],
    currentNavtab: "0",
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
  },
  onLoad: function () {
    this.setLang(),
    getApp().request({
      url: '/task',
      success: function(res) {
        tasks = res.data.map(function(task) {
          var format_task = {
            taskID: task.task_id,
            taskName: task.name,
            taskType: task.type,
            status: task.finish,
            due: task.deadline
          };
          return format_task;
        });

        this.setData({tasks: tasks});
      }
    });
  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  setLang() {
    const _ = wx.T._
    this.setData({
      More: _('More'),
    })
  }
})
