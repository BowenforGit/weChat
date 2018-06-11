//index.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    Create_New: 'Create New',
    userInfo: {},
    hasUserInfo: false,
    showDeleteIcon: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    projects: []
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
          wx.hideLoading();

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
            members.push(project.member_id1, project.member_id2, project.member_id3, project.member_id4, project.member_id5);
            //console.log(members);
            for(var i = 0; i < members.length; i++){
              if(members[i] === ''){
                members.splice(i, 1);
                i--;
              }
            }
            //console.info(members);
            format.proID = project.project_id;
            format.proName= project.name;
            format.proInfo = project.info;
            format.proType = project.project_type;
            format.proStartDate = project.start_date.substring(0,10);
            format.proEndDate = project.end_date.substring(0, 10);
            format.proMembers = members;
            format.proLeader = project.leader;
            return format;
          });

          that.setData({ projects : projects });
          // 存入全局数据
          app.globalData.projects = projects;
          wx.hideLoading();
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
    this.setLang();
    wx.showLoading({
      title: "Loading...",
      mask: true
    });
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
  },

  showDelete: function(e) {
    this.setData({
        showDeleteIcon: true
    });
  },
//navigate to the project or hide the delete buttons
  toProject: function(opt) {
      if (!this.data.showDeleteIcon) {
          console.log('navigate to' + '/pages/project/project?id=' + opt.currentTarget.id);
          wx.navigateTo({
              url: '/pages/project/project?id=' + opt.currentTarget.id
          });
      } else {
          this.setData({
              showDeleteIcon: false
          });
      }
  },

  onPullDownRefresh: function() {
    wx.showToast({
        title: '刷新中',
        icon: 'loading',
        duration: 3000
    });
    this.load(function(){});
},

  deletePro: function(e) {
    var that = this;
    console.log(app.globalData.userInfo.open_id);
    if (app.globalData.userInfo.open_id === that.data.projects[e.currentTarget.dataset.icon].proLeader)
    {
        //is Leader: use delete project api
      app.request({
        url: '/project/' + e.currentTarget.dataset.id,
        method: 'DELETE',
        success: function (res) {
          that.data.projects.splice(e.currentTarget.dataset.icon, 1);
          that.setData({
            projects: that.data.projects
          });
          console.log('Delete project as leader');
        }
      })  ;
    }
    else{
          //not leader: use quit project api 
      app.request({
        url: '/project/quit/' + e.currentTarget.dataset.id,
        success: function (res) {
          that.data.projects.splice(e.currentTarget.dataset.icon, 1);
          that.setData({
            projects: that.data.projects
          });
          console.log('quit project as member');
        }
      });
    }
  },
  setLang() {
    const _ = wx.T._
    this.setData({
     Create_New: _('Create_New'),
    })
  }
});
