//index.js

var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        projects: [{
                proID: 0,
                proName: 'Project 1',
                proType: 'Course',
                proInfo: 'This is the introduction of this project',
                proStartDate: '2016-01-01',
                proEndDate: '2017-02-01',
                  proMembers: [
                       { name: 'Alice' },
                       { name: 'Bob' },
                       { name: 'Cindy' },
                       { name: 'David' }
                     ]
            },
            {
                proID: 1,
                proName: 'Project 2',
                proType: 'Intern',
                proInfo: 'This is the introduction of this project',
                proStartDate: '2016-03-01',
                proEndDate: '2017-05-01',
                     proMembers: [
                       { name: 'Tom' },
                       { name: 'Peter' },
                       { name: 'Tony' },
                       { name: 'Clement' }
                     ]
            },
        ],
        user: {
            projects: []
        },
        projects_length: 0
    },
    //事件处理函数
    bindProTap: function() {
        wx.navigateTo({
            url: '../project/project'
        });
    },

    // onLoad: function () {
    //   console.log('onLoad');
    //   wx.getSetting({
    //     success: function (res) {
    //       if (res.authSetting['scope.userInfo']) {
    //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //         wx.getUserInfo({
    //           success: function (res) {
    //             console.log(res.userInfo);
    //             app.globalData.userInfo = res.userInfo;
    //             console.log("user Info is saved");
    //             //console.log(app.globalData.userInfo)
    //           }
    //         });
    //       }
    //     }
    //   });
    //   var that = this;
    //   //调用应用实例的方法获取全局数据
    //   this.getData();
    // },

    onLoad: function() {
        console.info('loading index...');
         var that = this;
<<<<<<< HEAD
         getApp().checkLogin(function() {
           that.load();
         });
=======
          getApp().checkLogin(function() {
            that.load();
          });
>>>>>>> 3faa1c68dc4a70c95c9617b525d600dd52055ce9
    },

    load: function() {
        var that = this;
        console.log('getApp start request')
        getApp().request({
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
              console.info(res)
                var projects = res.data.map(function(project) {
                    var format = {};
                    format.proID = project.project_id;
                    format.proName = project.name;
                    format.proType = project.type;
                    format.proStartDate = project.start_date;
                    format.proEndDate = project.end_date;
                    return format;
                });

                that.setData({ projects: projects});

            }
            // fail: function(res) {
            //     that.getData();
            // }
        });
    },
    upper: function() {
        wx.showNavigationBarLoading();
        this.refresh();
        console.log("upper");
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },
    lower: function(e) {
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
        console.log("lower");
    },
    //scroll: function (e) {
    //  console.log("scroll")
    //},
    //事件处理函数
    bindProTap: function() {
        wx.navigateTo({
            url: '../project/project'
        })
    },
<<<<<<< HEAD
 
=======
    // onLoad: function() {
    //     console.log('onLoad')
    //     wx.getSetting({
    //         success: function(res) {
    //             if (res.authSetting['scope.userInfo']) {
    //                 // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //                 wx.getUserInfo({
    //                     success: function(res) {
    //                         console.log(res.userInfo)
    //                         app.globalData.userInfo = res.userInfo
    //                         console.log("user Info is saved")
    //                             //console.log(app.globalData.userInfo)
    //                     }
    //                 })
    //             }
    //         }
    //     })
    //     var that = this
    //         //调用应用实例的方法获取全局数据
    //     this.getData();
    // },
>>>>>>> 3faa1c68dc4a70c95c9617b525d600dd52055ce9
    upper: function() {
        wx.showNavigationBarLoading()
        this.refresh();
        console.log("upper");
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },
    lower: function(e) {
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
        console.log("lower")
    },
    //scroll: function (e) {
    //  console.log("scroll")
    //},

    //网络请求数据, 实现首页刷新
    refresh0: function() {
        var index_api = '';
        util.getData(index_api)
            .then(function(data) {
                //this.setData({
                //
                //});
                console.log(data);
            });
    },

    //使用本地 fake 数据实现刷新效果
    getData: function() {
        var feed = util.getProjectsFake();
        console.log("get projects");
        console.log(feed);
        this.setData({
            'user.projects': feed,
            projects_length: feed.length
        });
    },
    refresh: function() {
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        var feed = util.getProjectsFake();
        console.log("refresh get projects");
        var feed = feed;
        this.setData({
            'user.projects': feed,
            project_length: feed.length
        });
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)

    },

    //使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 4000
        })
        var next = util.getProjectsFake();
        console.log("continueload");

        this.setData({
            'user.projects': this.data.user.projects.concat(next),
            projects_length: this.data.projects_length + next.length
        });
        setTimeout(function() {
            wx.showToast({
                title: '加载成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },
    createProject: function() {
        wx.navigateTo({
            url: '../newProject/newProject'
        })
    },

})