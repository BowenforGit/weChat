// pages/project/task/task.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      projectID:0,
      taskID:0,
      task: {
        taskID: 3,
        taskName: 'Project Report',
        taskType: 'Report',
        taskInfo: 'Something about Task',
        taskDate: '2016-01-03',
        taskTime: '23:59',
        allotDetail: true,
        taskMembers: [
          { name: 'Alice', task: 'Introduction', status: false},
          { name: 'Bob', task: 'Summary', status: true },
          { name: 'Cindy', task: 'Task for Cindy', status: false },
        ]
      },

      isFinish: false,
      logs:[],
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  save: function () {
    var key2 = this.data.projectID + '-logs'
    wx.setStorageSync(key2, this.data.logs)
  },
  load: function () {
    var key1 = this.data.projectID + '-tasks'
    var key2 = this.data.projectID + '-logs'
    var tasks = wx.getStorageSync(key1)
    var logs = wx.getStorageSync(key2)
    if(tasks){
    for(item in tasks)
    {
      if(item.taskID == this.data.taskID)
        this.setData({
          task: item
        })
    }}
    if (logs) {
      this.setData({ logs: logs })
    }
  },
  onLoad: function (options) {
    this.load()
    //console.log('id_t '+ options.id_t)
    this.setData({
        taskID: options.id_t,
        projectID: options.id_p
    })
    //console.log('taskID is' + this.data.taskID)
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
          console.log('user click confirm')    
          var logs = that.data.logs
          logs.push({ timestamp: util.formatTime(new Date()), action: 'Finish Task', actionInfo: that.data.task.taskName, userInfo: that.data.userInfo })
          that.setData({
            logs: logs
          })
          that.save()   
          wx.navigateBack()
        } else {
          console.log('user click cancel')
        }
        //change the status 
        //Make finish button disable
      }
    });
  },
  bindGetUserInfo: function (e) {
    console.log("bindinput")
    this.setData({
      userInfo: e.detail.userInfo
    })
    this.openConfirm()
   
  }
})