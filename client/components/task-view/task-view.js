// components/task-view/task-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    taskID: 0,
    task: {},

    progress: [
      { name: 'Alice', task: 'Task for Alice', status: false },
      { name: 'Bob', task: 'Task for Bob', status: true },
      { name: 'Cindy', task: 'Task for Cindy', status: false },
    ],
    isFinish: false,
    taskName: 'example',

    logs: [],
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    save: function () {
      wx.setStorageSync('project_logs', this.data.logs)
    },
    load: function () {
      var logs = wx.getStorageSync('project_logs')
      if (logs) {
        this.setData({ logs: logs })
      }
    },
    onLoad: function (options) {
      this.load()
      console.log(options.id)
      this.setData({
        taskID: options.id
      })
      console.log(this.data.taskID)
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
            logs.push({ timestamp: util.formatTime(new Date()), action: 'Finish Task', actionInfo: that.data.taskName, userInfo: that.data.userInfo })
            that.setData({
              logs: logs
            })
            that.save()
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
  }
})
