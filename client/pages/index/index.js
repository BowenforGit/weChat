//index.js

var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        projects: [],
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



    onLoad: function() {
        console.info('loading index...');
        var that = this;

        getApp().checkLogin(function() {
            that.load();
        });

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
                    console.log(res.data)
                    var projects = res.data.map(function(project) {
                        var format = {};
                        format.proID = project.project_id;
                        format.proName = project.name;
                        format.proType = project.project_type;
                        format.proStartDate = project.start_date;
                        format.proEndDate = project.end_date;
                        return format;
                    });
                    console.log(projects)
                    that.setData({ projects: projects });

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