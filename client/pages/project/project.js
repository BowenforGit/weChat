/*
 * @Date: 2018-06-07 21:51:16 
 * @Last Modified time: 2018-06-07 21:51:16 
 * @Problems: 1. what is e.currentTarget.id; 2. how to fetch the images from the server; 
 * 3. what does files store
 */
var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js')
const app = getApp() //获得小程序实例
const config = require('../../config.js');

Page({
    data: {
        tasks: [],
        files: [],
        tabs: ["Project", "Document", "Logs"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        MemberInfos: [],
        project: {},
        projectID: 0,


        tasks_length: 0,
        logs: [],
        leftCount: 0,
        list: {
            id: 'form',
            name: 'Members',
            open: false,
            members: []
        }
    },


    save: function() {
        var key1 = this.data.project.projectID + '-tasks'
        var key2 = this.data.project.projectID + '-logs'
        wx.setStorageSync(key1, this.data.project.tasks)
        wx.setStorageSync(key2, this.data.project.logs)
    },

    load: function(cb) {
        //不建议使用本地存储，因为信息总是在变化
        var that = this;
        var key1 = this.data.projectID + '-tasks';
        var key2 = this.data.projectID + '-logs';
        var tasks = wx.getStorageSync(key1);
        if (false) {
            var leftCount = tasks.filter(function(item) {
                return !item.completed;
            }).length;
            that.setData({ tasks: tasks, leftCount: leftCount });
            console.info('Local');
        } else {
            console.info('Online');
            app.request({
                url: "/project/" + this.data.projectID,
                success: function(res) {
                    console.log('Success!');
                    wx.hideLoading();

                    if (res.statusCode !== 200) {
                        wx.showToast({
                            icon: 'warn',
                            title: 'Wrong Request!'
                        });
                        return;
                    }
                    var project = res.data[0];
                    var members = res.data[1];
                    // formalize the task, no member information, start and end date both needed
                    var tasks = res.data[2].map(function(task) {
                        var format_task = {};
                        var members = [];
                        members.push(task.member_id1, task.member_id2, task.member_id3);
                        for (var i = 0; i < members.length; i++) {
                            if (members[i] === '') {
                                members.splice(i, 1);
                                i--;
                            }
                        }
                        format_task.taskID = task.task_id;
                        format_task.taskName = task.name;
                        format_task.taskType = task.task_type;
                        format_task.taskStartDate = task.start_date.substring(0, 10);
                        format_task.taskDate = task.deadline.substring(0, 10)
                        format_task.taskTime = task.deadline.substring(11, 19)
                        format_task.taskMembers = members;
                        return format_task;
                    });

                    that.setData({
                        projectID: project.project_id,
                        'project.projectID': project.project_id,
                        'project.proName': project.name,
                        'project.proDes': project.info,
                        'project.proMembers': members,
                        tasks: tasks,
                        'this.data.project.tasks': tasks
                    });

                    console.info(that.data.project);
                    that.addMember();
                }
            });
        }
        var logs = wx.getStorageSync(key2)
        if (logs) {
            this.setData({ 'project.logs': logs })
        } else {
            app.request({
                url: "/project/logs/" + this.data.projectID,
                success: function(res) {
                    if (res.statusCode !== 200) {
                        wx.showToast({
                            icon: 'warn',
                            title: 'Wrong Request!'
                        });
                        return;
                    }

                    that.setData({
                        logs: res.data
                    });
                    console.log("logs for project " + that.data.projectID)
                    console.log(that.data.logs)
                }
            });
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

        wx.checkSession({
            success: function() {
                //session_key 未过期，并且在本生命周期一直有效
                that.setData({ projectID: opt.id })
                console.info('Before');
                that.load(); //异步出问题
                console.log('After');
                console.info(that.data.project);
            },
            fail: function() {
                // session_key 已经失效，需要重新执行登录流程
                app.checklogin(function() {
                        that.setData({ projectID: opt.id })
                        console.info('Before');
                        that.load(); //异步出问题
                        console.log('After');
                        console.info(that.data.project);
                    }) //重新登录
            }
        })


    },

    //check member 
    addMember: function() {
        console.log(this.data.project.proMembers)
        var isMember = false
        for (var i = 0; i < this.data.project.proMembers.length; i++) {
            if (this.data.project.proMembers[i].name == app.globalData.userInfo.name)
                isMember = true
        }
        if (!isMember) {
            //Invite memebr here? or in App.onshow()
            app.request({
                url: "/project/invite/" + this.data.projectID,
                method: 'POST',
                success: function(res) {
                    console.log('Invite new member');
                }
            })

            console.log('project.proMembers ')
            console.log(this.data.project.proMembers)
            var members = this.data.project.proMembers
            if (app.globalData.userInfo.name)
                members.push({ name: app.globalData.userInfo.name, avatarUrl: app.globalData.userInfo.avatar })
            this.setData({
                'project.proMembers': members
            })
            console.log('Add Member ' + app.globalData.userInfo.name)

            this.save()
        }
    },
    onPullDownRefresh: function() {
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        this.load();
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
            url: '../newTask/newTask?id=' + this.data.projectID
        })
    },

    onShareAppMessage: function() {
        return {
            path: 'pages/project/project?id=' + this.data.project.projectID,
            success: res => {
                console.log(res)
            }
        }
    },
    kindToggle: function(e) {
        this.setData({
            'list.members': this.data.project.proMembers
        })
        var id = e.currentTarget.id,
            list = this.data.list;

        if (list.id == id) {
            list.open = !list.open
        } else {
            list.open = false
        }
        this.setData({
            list: list
        });
    }
});