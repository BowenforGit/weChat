/*
 * @Date: 2018-06-07 21:51:16 
 * @Last Modified time: 2018-06-07 21:51:16 
 * @Problems: 1. what is e.currentTarget.id; 2. how to fetch the images from the server; 
 * 3. what does files store
 */

var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js');
const app = getApp(); //获得小程序实例
const config = require('../../config.js');

Page({
  data: {
    files: [],
    tabs: ["Project", "Document", "Logs"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    logs: [],
    projectID: 1,
    proName: "CSCI 3100",
    proDes: "This is project description",
    proMembers: [{ name: 'Alice' },
    { name: 'Bob' },
    { name: 'Cindy' },
    { name: 'David' }],
    tasks: [
      {
        taskID: 1,
        taskName: 'Initial Code',
        taskType: 'Readings',
        taskInfo: 'Somethins',
        taskDate: '2016-01-01',
        taskTime: '23:59',
        allotDetail: false,
        taskMembers: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Cindy' }
        ]
      },
      {
        taskID: 2,
        taskName: 'Project Demo',
        taskType: 'Meeting',
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
        taskType: 'Submit file',
        taskInfo: 'Something about Task',
        taskDate: '2016-01-03',
        taskTime: '23:59',
        allotDetail: true,
        taskMembers: [
          { name: 'Alice', task: 'Introduction' },
          { name: 'Bob', task: 'Summary' }
        ]
      }
    ],
    leftCount: 0,

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: 'Invite some people',
      path: '/page/project/project?id=' + this.data.projectID
    };
  },

  save: function () {
    var key1 = this.data.projectID + '-tasks';
    var key2 = this.data.projectID + '-logs';
    wx.setStorageSync(key1, this.data.tasks);
    wx.setStorageSync(key2, this.data.logs);
  },

  load: function () {
    //不建议使用本地存储，因为信息总是在变化
    var key1 = this.data.projectID + '-tasks';
    var key2 = this.data.projectID + '-logs';
    var tasks = wx.getStorageSync(key1);
    if (tasks) {
      var leftCount = tasks.filter(function (item) {
        return !item.completed;
      }).length;
      this.setData({ tasks: tasks, leftCount: leftCount });
    }
    else {
      app.request({
        url: "/project/"+this.data.projectID,
        success: function(res) {
          wx.hideLoading();
  
          if (res.statusCode !== 200) {
            wx.showToast({
              icon: 'none',
              title: 'Wrong Request!'
            });
            return;
          }
          var project = res.data[0];
          var members = res.data[1];
          // formalize the task, no member information, start and end date both needed
          var tasks = res.data[2].map(function(task) {
            var format_task = {};
            format_task.taskID = task.task_id;
            format_task.taskName= task.name;
            format_task.taskType = task.type;
            format_task.taskStartDate = task.start_date;
            format_task.taskEndDate = task.end_date;
            return format_task;
          });
          
          this.setData({
              projectID: project.project_id,
              proName: project.name,
              proDes: project.info,
              proMembers: members,
              tasks: tasks
          });
        }
      });
    }
    var logs = wx.getStorageSync(key2);
    if (logs) {
      this.setData({ logs: logs });
    }
    else {
      app.request({
        url: "/project/logs/"+this.data.projectID,
        success: function(res) {
          if (res.statusCode !== 200) {
            wx.showToast({
              icon: 'none',
              title: 'Wrong Request!'
            });
            return;
          }
          
          this.setData({
            logs: res.data
          });
        }
      })
    }
  },

  onLoad: function (opt) {
    // var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.load();
    //get the project id from the router
    this.data.projectID = opt.id;
    //get project info by local storage or wx request 

    var isMember = false;
    for (var item in this.data.proMembers) {
      if (item.name == app.globalData.userInfo.nickName)
        isMember = true;
    }
    if (!isMember) {
      var members = this.data.proMembers;
      members.push({ name: app.globalData.userInfo.nickName, avatarUrl: app.globalData.userInfo.avatarUrl});
      this.setData({
        proMembers: members
      });
      console.log('Add Member ' + app.globalData.userInfo.nickName);
      var logs = this.data.logs;
      logs.push({ timestamp: util.formatTime(new Date()), action: 'Become New Member', actionInfo: '', userInfo: app.globalData.userInfo });
      this.setData({
        logs: logs
      });
      this.save();
    }


    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  //onShow function for Logs 
  onShow: function () {
    var key2 = this.data.projectID + '-logs';
    var logs = wx.getStorageSync(key2);
    if (logs) {
      this.setData({ logs: logs.reverse() });
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
      url: '../newTask/newTask?id=' + this.data.projectID
    });
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        //上传图片至服务器
        wx.uploadFile({
          header: {
            skey: wx.getStorageSync('skey')
          },
          url: config.host + '/user/image/'+this.data.projectID,
          filePath: res.tempFilePaths[0],
          name: 'image'
          // success: function(res) {
          //   getApp().request({
          //     url: '/user',
          //     method: 'patch',
          //     data: {
          //       avatar: res.data
          //     },
          //     success: function () {
          //       wx.hideLoading();
          //       getApp().globalData.userInfo.avatar = res.data;
          //       that.setData({ avatar: res.data });
          //     }
          //   });

          // }
        });

      }
    });
  },
  previewImage: function (e) {
    if (!this.data.showDeleteIcon) {
      var that = this;
      var file_id = e.currentTarget.id;
      var file_index = file_id.lastIndexOf('.');
      file_id = file_id.substring(file_index + 1);
      console.log(file_id);
      console.log(e.currentTarget);
      wx.getImageInfo({
        src: e.currentTarget.id,
        success: function (res) {
          //The file is an Image 
          console.log(res.type);
          wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
          });
        },
        fail: function () {
          wx.openDocument({
            filePath: e.currentTarget.id,
            success: function (res) {
              console.log("打开文件成功");
            },
            fail: function () {
              console.log("不支持打开该文件");
            }
          });
        }
      });
    }
    else {
      this.deleteFile(e);
    }
  },
  // onShareAppMessage: function () {
  //   return {
  //     path: 'pages/project/project?id=' + this.data.projectID,
  //     success: res => {
  //       console.log(res)
  //     }
  //   }
  // },

  // what is e.currentTarget.id?
  deleteFile: function (e) {
    console.log(e.currentTarget.id);
    this.data.files.splice(e.currentTarget.id, 1);
    this.setData({
      files: this.data.files
    });
    app.request({
      url: config.host+'/project/'+this.data.projectID,
      method: 'delete',
      success: function(res){
        var files = this.data.files;
        files.splice(res.data.url, 1);
        this.setData({files: files});
      }
    });
  },

  showDelete: function (e) {
    this.setData({
      showDeleteIcon: true
    });
  },
  hideDelete: function () {
    this.setData({
      showDeleteIcon: false
    });
  }
});