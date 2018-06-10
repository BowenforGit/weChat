//index.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    projects: [
      {
        proID: 0,
        proName: 'Project 1',
        proType: 'Course',
        proInfo: 'This is the introduction of this project',
        proStartDate: '2016-01-01',
        proEndDate: '2017-01-01',
        proMembers: []
        // proMembers: [
        //   { name: 'Alice' },
        //   { name: 'Bob' },
        //   { name: 'Cindy' },
        //   { name: 'David' }
        // ]
      },
      {
        proID: 1,
        proName: 'Project 2',
        proType: 'Intern',
        proInfo: 'This is the introduction of this project',
        proStartDate: '2016-03-01',
        proEndDate: '2017-05-01',
        proMembers: []
        // proMembers: [
        //   { name: 'Tom' },
        //   { name: 'Peter' },
        //   { name: 'Tony' },
        //   { name: 'Clement' }
        // ]
      },
    ]
  },
  //事件处理函数
  bindProTap: function() {
    wx.navigateTo({
      url: '../project/project'
    });
  },
  
  onLoad: function() {
    console.info('loading index...');
    /* uncomment this part when the login function is fixed */
    // var that = this;
    // getApp().checkLogin(function() {
    //   that.load();
    // });
      // app.checkLogin(function(){});
  },

  /*
  首次加载数据应该讲project完整信息记录到global data，方便取用
  */
  load: function() {
    var that = this;
    // 首次加载, globalData尚没有数据
    if(!!app.globalData.projects) {
      app.request({
        url: "/project",
        success: function(res) {
          // wx.hideLoading();

          if (res.statusCode !== 200) {
            wx.showToast({
              icon: 'none',
              title: 'Wrong Request!'
            });
            return;
          }

          // formalize each data
          var projects = res.data.map(function(project) {
            var format = {};
            var members = [];
            members.push(project.leader);
            members.push(project.members_id1, project.members_id2, project.members_id3, project.members_id4, project.members_id5);
            members.splice('', 1);
            format.proID = project.project_id;
            format.proName= project.name;
            format.proInfo = project.info;
            format.proType = project.project_type;
            format.proStartDate = project.start_date;
            format.proEndDate = project.end_date;
            format.proMembers = members;
            return format;
          });

          that.setData({ projects : projects });
          // 存入全局数据
          app.globalData.projects = projects;
        }
      });
    }
    // 非首次加载
    else {
      var projects = app.globalData.projects;
      that.setData({ projects : projects});
    }
  },

  onShow: function(){
    this.load();
  },

  upper: function () {
    wx.showNavigationBarLoading();
    this.refresh();
    console.log("upper");
    setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    console.log("lower");
  },

    refresh: function() {
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        var feed = util.getProjectsFake();
        console.log("refresh get projects");
        // var feed = feed;
        this.setData({
            'user.projects': feed,
            project_length: feed.length
        });
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
            });
        }, 3000);
    },
  //使用本地 fake 数据实现刷新效果
  getData: function(){
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
  },

    //使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 4000
        });
        var next = util.getProjectsFake();
        console.log("continueload");
    },
  createProject: function () {
    wx.navigateTo({
      url: '../newProject/newProject'
    });
  }
});
