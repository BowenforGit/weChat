var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js')
const app = getApp() //获得小程序实例

Page({
    data: {
        tabs: ["Project", "Document", "Logs"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        project: {},
        tasks_length: 0,
        logs: [],
        leftCount: 0,
    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: 'Invite some people',
            path: '/page/project/project?id=' + this.data.project.projectID
        }
    },

    save: function() {
        var key1 = this.data.project.projectID + '-tasks'
        var key2 = this.data.project.projectID + '-logs'
        wx.setStorageSync(key1, this.data.project.tasks)
        wx.setStorageSync(key2, this.data.project.logs)
    },

    load: function() {
        var key1 = this.data.project.projectID + '-tasks'
        var key2 = this.data.project.projectID + '-logs'
        var tasks = wx.getStorageSync(key1)
        if (this.data.project.tasks) {
            var leftCount = project.tasks.filter(function(item) {
                return !item.completed
            }).length
            this.setData({ 'project.tasks': tasks, leftCount: leftCount })
        }
        var logs = wx.getStorageSync(key2)
        if (logs) {
            this.setData({ 'project.logs': logs })
        }
    },

    onLoad: function(opt) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        this.load()
            //get the project id from the router
        this.data.project.projectID = opt.id
            //get project info by local storage or wx request 
        this.getData();
        //check if it is member 
        this.addMember();

        var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                })
            }
        })
    },

    //check member 
    addMember: function() {
        var isMember = false
        for (var i = 0 ; i < this.data.project.proMembers.length; i++) {
          if (this.data.project.proMembers[i].name == app.globalData.userInfo.name)
                isMember = true
        }
        if (!isMember) {
          console.log('project.proMembers ')
          console.log(this.data.project.proMembers)
            var members = this.data.project.proMembers
            if (app.globalData.userInfo.name)
            members.push({ name: app.globalData.userInfo.name, avatarUrl: app.globalData.userInfo.avatar})
            this.setData({
                'project.proMembers': members
            })
            console.log('Add Member ' + app.globalData.userInfo.name)
            var logs = this.data.project.logs
            logs.push({ timestamp: util.formatTime(new Date()), action: 'Become New Member', actionInfo: '', userInfo: app.globalData.userInfo })
            this.setData({
                'project.logs': logs
            })
            this.save()
        }
    },
    //get Data and refresh
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
        var feed = util.getAProjectFake();
        console.log("get a project");
        console.log(feed);
        this.setData({
            project: feed,
            tasks_length: feed.tasks.length
        });
    },
    refresh: function() {
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        var feed = util.getAProjectFake();
        console.log("refresh to get a project");
        var feed = feed;
        this.setData({
            project: feed,
            tasks_length: feed.tasks.length
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
        var next = util.getAProjectFake();
        console.log("continueload");

        this.setData({
            'project.tasks': this.data.project.tasks.concat(next),
            tasks_length: this.data.tasks_length + next.length
        });
        setTimeout(function() {
            wx.showToast({
                title: '加载成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },



    //onShow function for Logs 
    onShow: function() {
        var key2 = this.data.project.projectID + '-logs'
        var logs = wx.getStorageSync(key2)
        if (logs) {
            this.setData({ 'project.logs': logs.reverse() })
        }
    },

    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },

    //Navigate to newTask Page
    createTask: function() {
        wx.navigateTo({
            url: '../newTask/newTask?id=' + this.data.project.projectID
        })
    },

    onShareAppMessage: function() {
        return {
            path: 'pages/project/project?id=' + this.data.project.projectID,
            success: res => {
                console.log(res)
            }
        }
    }
});