var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js')

Page({
  data: {
    files:[],
    tabs: ["Project", "Document","Logs"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    logs: [],
    projectID:1,
    tasks:[
      {
        taskID: 1,
        taskName: 'Initial Code',
        taskType: 'Readings',
        taskInfo: 'Something about Task',
        taskDate: '2016-01-01',
        taskTime: '23:59',
        allotDetail: false,
        taskMembers: [
          {name: 'Alice'},
          {name: 'Bob'},
          {name: 'Cindy'}
        ]
      },
      {
        taskID: 2,
        taskName: 'Project Demo',
        taskType: 'Presentation',
        taskInfo: 'Something about Task',
        taskDate: '2016-01-02',
        taskTime: '09:00',
        allotDetail: false,
        taskMembers: [
          { name: 'Alice' },
        ]
      },
      {
        taskID: 3,
        taskName: 'Project Report',
        taskType: 'Report',
        taskInfo: 'Something about Task',
        taskDate: '2016-01-03',
        taskTime: '23:59',
        allotDetail: true,
        taskMembers: [
          { name: 'Alice', task: 'Introduction' },
          { name: 'Bob', task: 'Summary'}
        ]
      }
    ],
    leftCount: 0
  },

  save: function () {
    var key1 = this.data.projectID + '-tasks'
    var key2 = this.data.projectID + '-logs'
    wx.setStorageSync(key1, this.data.tasks)
    wx.setStorageSync(key2, this.data.logs)
  },

  load: function () {
    var key1 = this.data.projectID + '-tasks'
    var key2 = this.data.projectID + '-logs'
    var tasks = wx.getStorageSync(key1)
    if (tasks) {
      var leftCount = tasks.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ tasks: tasks, leftCount: leftCount })
    }
    var logs = wx.getStorageSync(key2)
    if (logs) {
      this.setData({ logs: logs })
    }
  },
  
  onLoad: function () {
    this.load()
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    })
  },
  //onShow function for Logs 
  onShow: function () {
    var key2 = this.data.projectID + '-logs'
    var logs = wx.getStorageSync(key2)
    if (logs) {
      this.setData({ logs: logs.reverse() })
    }
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //Navigate to newTask Page
  createTask: function () {
    wx.navigateTo({
      url: '../newTask/newTask?id='+this.data.projectID
    })
  },

  chooseFile: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    })
    /*
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
      }
    })

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })*/
  },
});