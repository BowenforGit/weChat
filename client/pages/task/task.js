// pages/project/task/task.js
const util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index: 0,
      projectID:0,
      task: {},

      enableButton: true,
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  save: function () {
    var key2 = this.data.projectID + '-logs';
    wx.setStorageSync(key2, this.data.logs);
  },
  load: function () {
    var key1 = this.data.projectID + '-tasks';
    var key2 = this.data.projectID + '-logs';
    var tasks = wx.getStorageSync(key1);
    var logs = wx.getStorageSync(key2);
    if(tasks){
    for(var item in tasks)
    {
      if(item.taskID == this.data.taskID)
        this.setData({
          task: item
        });
    }}
    if (logs) {
      this.setData({ logs: logs });
    }
  },
  
  // load the task data from the server
  load_online: function() {
    app.request({
      url: '/task/'+this.data.index.toString(),
      success: function(res) {
        var format_task ={};
        var task = res.data[0];
        var members = res.data[1];
        var taskMembersId = [];
        var subtasks = [];
        var taskMembers = [];
        taskMembersId.push(task.member_id1, task.member_id2, task.member_id3);
        taskMembersId.splice("", 1);
        subtasks.push(task.subtask1, task.subtask2, task.subtask3);
        subtasks.splice("", 1);
        var i = 0;
        for(var item in taskMembersId) {
          var name = members.filter(member => member.open_id == item)[0].name;
          taskMembers.push({
            name: name,
            task: subtasks[i]
          });
          i++;
        }
        format_task.taskName = task.name;
        format_task.taskType = task.type;
        format_task.taskInfo = task.info;
        format_task.taskDate = task.start_date;
        format_task.taskTime = task.deadline;
        format_task.taskMembers = taskMembers;
      }
    });
  },

  onLoad: function (options) {
    this.load();
    this.setData({
        index: options.id
    });
    console.log('task index is ' + this.data.index);

    for(var member in this.data.task.taskMembers)
    {
      if(member.name == userInfo.nickName)
        this.setData({
          enableButton: true
        });
    }

  },
  onShow: function()
  { 
      //get data from the project page
      var arr = getCurrentPages();
      if (arr[arr.length - 2].route == 'pages/project/project')
      {
        this.setData({
          task: arr[arr.length - 2].data.project.tasks[this.data.index],
          projectID: arr[arr.length - 2].data.project.proID
        });
      }
  },
  openConfirm: function () {
    var that = this;
    wx.showModal({
      title: 'Declaration',
      content: 'By clicking the confirm button, I acknowledge that my part of the task is doned',
      confirmText: "Confirm",
      cancelText: "Cancel",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          var arr = getCurrentPages();
          var theProject = arr[arr.length-2];

          console.log('user click confirm');    
          var logs = theProject.data.project.logs;
          logs.push({ timestamp: util.formatTime(new Date()), action: 'Finish Task', actionInfo: that.data.task.taskName, userInfo: that.data.userInfo });
          theProject.setData({
            'project.logs': logs
          });
          theProject.save();
          wx.navigateBack();
        } else {
          console.log('user click cancel');
        }
        //change the status 
        //Make finish button disable
      }
    });
  },
  bindGetUserInfo: function (e) {
    console.log("bindinput");
    this.setData({
      userInfo: e.detail.userInfo
    });
    this.openConfirm();
   
  }
});