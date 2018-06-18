//index.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
    data: {
        feed: [],
        feed_length: 0,
        Create_New: 'Create New',
        Course: 'Course',
        Intern: 'Intern',
        Work: 'Work',
        Others: 'Others',
        Members: "Member(s)",
        Delete: "Delete",
        load: "Loading",
        userInfo: {},
        hasUserInfo: false,
        projects: []
    },

    ////demo slide-left
    handleChange: function() {
        console.log('显示/关闭了菜单:')
    },

    handleDelete: function() {
        console.log('点击删除了')
    },

    //事件处理函数
    bindProTap: function() {
        wx.navigateTo({
            url: '../project/project'
        });
    },

    onLoad: function() {
        console.info('loading index...');

    },

    /*
    首次加载数据应该讲project完整信息记录到global data，方便取用
    */
    load: function() {
        var that = this;
        // 首次加载, globalData尚没有数据
        if (!!app.globalData.projects) {
            app.request({
                url: "/project",
                success: function(res) {
                    wx.hideLoading();
                    if (res.statusCode !== 200) {
                        wx.showToast({
                            icon: 'info',
                            title: 'Pull to Refresh!'
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
                        for (var i = 0; i < members.length; i++) {
                            if (members[i] === '') {
                                members.splice(i, 1);
                                i--;
                            }
                        }
                        //console.info(members);
                        format.proID = project.project_id;
                        format.proName = project.name;
                        format.proInfo = project.info;
                        format.proType = project.project_type;
                        format.proStartDate = project.start_date.substring(0, 10);
                        format.proEndDate = project.end_date.substring(0, 10);
                        format.proMembers = members;
                        format.proLeader = project.leader;
                        return format;
                    });
                    that.setData({ projects: projects });
                    // 存入全局数据
                    app.globalData.projects = projects;
                    wx.hideLoading();

                }
            });
        }
        // 非首次加载
        else {
            console.log('非首次加载')
            var projects = app.globalData.projects;
            that.setData({ projects: projects });
        }
    },

    onShow: function() {
        this.setLang();
        wx.showLoading({
            title: "Loading...",
            mask: true
        });
        this.load();
    },

    // upper: function() {
    //     console.log("upper 0")
    //     wx.showNavigationBarLoading();
    //     this.refresh();
    //     console.log("upper");
    //     setTimeout(function() {
    //         wx.hideNavigationBarLoading();
    //         wx.stopPullDownRefresh();
    //     }, 2000);
    // },
    // lower: function(e) {
    //     wx.showNavigationBarLoading();
    //     var that = this;
    //     setTimeout(function() {
    //         wx.hideNavigationBarLoading();
    //         that.nextLoad();
    //     }, 1000);
    //     console.log("lower");
    // },

    // refresh: function() {
    //     wx.showToast({
    //         title: '刷新中',
    //         icon: 'loading',
    //         duration: 3000
    //     });
    //     var feed = util.getProjectsFake();
    //     console.log("refresh get projects");
    //     // var feed = feed;
    //     this.setData({
    //         'user.projects': feed,
    //         project_length: feed.length
    //     });
    //     setTimeout(function() {
    //         wx.showToast({
    //             title: '刷新成功',
    //             icon: 'success',
    //             duration: 2000
    //         });
    //     }, 3000);
    // },
    // //使用本地 fake 数据实现刷新效果
    // getData: function() {
    //     var feed = util.getData2();
    //     console.log("loaddata");
    //     var feed_data = feed.data;
    //     this.setData({
    //         feed: feed_data,
    //         feed_length: feed_data.length
    //     });
    // },
    // upper: function() {
    //     wx.showNavigationBarLoading()
    //     this.refresh();
    //     console.log("upper");
    //     setTimeout(function() {
    //         wx.hideNavigationBarLoading();
    //         wx.stopPullDownRefresh();
    //     }, 2000);
    // },
    // lower: function(e) {
    //     wx.showNavigationBarLoading();
    //     var that = this;
    //     setTimeout(function() {
    //         wx.hideNavigationBarLoading();
    //         that.nextLoad();
    //     }, 1000);
    //     console.log("lower")
    // },
    // //scroll: function (e) {
    // //  console.log("scroll")
    // //},

    // //网络请求数据, 实现首页刷新
    // refresh0: function() {
    //     var index_api = '';
    //     util.getData(index_api)
    //         .then(function(data) {
    //             //this.setData({
    //             //
    //             //});
    //             console.log(data);
    //         });
    // },

    // //使用本地 fake 数据实现刷新效果
    // getData: function() {
    //     var feed = util.getData2();
    //     console.log("loaddata");
    //     var feed_data = feed.data;
    //     this.setData({
    //         feed: feed_data,
    //         feed_length: feed_data.length
    //     });
    // },
    // refresh: function() {
    //     wx.showToast({
    //         title: '刷新中',
    //         icon: 'loading',
    //         duration: 3000
    //     });
    //     setTimeout(function() {
    //         wx.showToast({
    //             title: '刷新成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     }, 3000)

    // },


    // //使用本地 fake 数据实现继续加载效果
    // nextLoad: function() {
    //     wx.showToast({
    //         title: '加载中',
    //         icon: 'loading',
    //         duration: 4000
    //     });
    //     var next = util.getProjectsFake();
    //     console.log("continueload");
    // },

    createProject: function() {
        wx.navigateTo({
            url: '../newProject/newProject'
        });
    },


    //navigate to the project or hide the delete buttons
    toProject: function(opt) {
        wx.navigateTo({
            url: '/pages/project/project?id=' + opt.currentTarget.id
        });
    },

    onPullDownRefresh: function() {
        console.log('Invoke onPullDownRefresh')
        wx.showToast({
            title: this.data.load,
            icon: 'loading',
            duration: 1000
        });
        this.load(wx.stopPullDownRefresh());
        console.log('Invoke stopPullDownRefresh')
    },

    deletePro: function(e) {
        var that = this;
        console.log(e.currentTarget);
        console.log(app.globalData.userInfo.open_id);
        if (app.globalData.userInfo.open_id === that.data.projects[e.currentTarget.dataset.icon].proLeader) {
            //is Leader: use delete project api
            wx.showModal({
                title: 'WARING!\nDelete ' + that.data.projects[e.currentTarget.dataset.icon].proName,
                content: 'By deleting the project as the leader, this project and related tasks will not exist!',
                confirmText: "Cancel",
                cancelText: "Confirm",
                success: function(res) {
                    console.log(res);
                    if (res.confirm) {
                        console.log('用户点击主操作')
                    } else {
                        app.request({
                            url: '/project/' + e.currentTarget.dataset.id,
                            method: 'DELETE',
                            success: function(res) {
                                that.data.projects.splice(e.currentTarget.dataset.icon, 1);
                                that.setData({
                                    projects: that.data.projects
                                });
                                console.log('Delete project as leader');
                            }
                        });
                        console.log('用户点击辅助操作')
                    }
                }
            });


        } else {
            //not leader: use quit project api 

            wx.showModal({
                title: 'WARING!\nQuit ' + that.data.projects[e.currentTarget.dataset.icon].proName,
                content: 'Are you sure to quit project ' + that.data.projects[e.currentTarget.dataset.icon].proName + "?",
                confirmText: "Cancel",
                cancelText: "Confirm",
                success: function(res) {
                    console.log(res);
                    if (res.confirm) {
                        console.log('用户点击主操作')
                    } else {
                        console.log('用户点击辅助操作')
                        app.request({
                            url: '/project/quit/' + e.currentTarget.dataset.id,
                            success: function(res) {
                                that.data.projects.splice(e.currentTarget.dataset.icon, 1);
                                that.setData({
                                    projects: that.data.projects
                                });
                                console.log('quit project as member');
                            }
                        });
                    }
                }
            });


        }
    },

    setLang() {
        const _ = wx.T._
        this.setData({
            Create_New: _('Create_New'),
            Course: _('Course'),
            Intern: _('Intern'),
            Work: _('Work'),
            Others: _('Others'),
            Members: _('Member(s)'),
            Delete: _('Delete'),
            load: _('load'),
        })
    }
});