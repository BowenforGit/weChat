// pages/project/task/task.js
const util = require('../../utils/util.js')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        projectID: 0,
        task: {},
        members: [],
        enableButton: true,
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    save: function() {
        var key2 = this.data.projectID + '-logs'
        wx.setStorageSync(key2, this.data.logs)
    },
    load: function() {
        var key1 = this.data.projectID + '-tasks'
        var key2 = this.data.projectID + '-logs'
        var tasks = wx.getStorageSync(key1)
        var logs = wx.getStorageSync(key2)
        if (tasks) {
            for (item in tasks) {
                if (item.taskID == this.data.taskID)
                    this.setData({
                        task: item
                    })
            }
        }

        if (logs) {
            this.setData({ logs: logs })
        }
    },
    onLoad: function(options) {
        this.load()
        this.setData({
            index: options.id
        })
        console.log('task index is ' + this.data.index)

        for (var member in this.data.task.taskMembers) {
            if (member.name == userInfo.nickName)
                this.setData({
                    enableButton: true
                })
        }

    },
    onShow: function(options) {
        //get data from the project page
        var arr = getCurrentPages();
        var parent = arr[arr.length - 2];
        if (parent.route == 'pages/project/project') {
            this.setData({
                task: parent.data.tasks[this.data.index],
                projectID: parent.data.project.projectID,
                members: parent.data.project.proMembers
            })
        }

        var newarr = [];
        for (var i = 0; i < this.data.task.taskMembers.length; i++) {
            for (var j = 0; j < this.data.members.length; j++) {
                if (this.data.members[j].open_id == this.data.task.taskMembers[i])
                    newarr.push(this.data.members[j]);
            }
        }
        this.setData({
            'task.taskMembers': newarr
        })
        console.log(this.data.task)

    },
    openConfirm: function() {
        var that = this;
        wx.showModal({
            title: 'Declaration',
            content: 'By clicking the confirm button, I acknowledge that my part of the task is doned',
            confirmText: "Confirm",
            cancelText: "Cancel",
            success: function(res) {
                console.log(res);
                if (res.confirm) {
                    var arr = getCurrentPages();
                    var theProject = arr[arr.length - 2];

                    console.log('user click confirm')
                    var logs = theProject.data.project.logs
                    logs.push({ timestamp: util.formatTime(new Date()), action: 'Finish Task', actionInfo: that.data.task.taskName, userInfo: that.data.userInfo })
                    theProject.setData({
                        'project.logs': logs
                    })
                    theProject.save()
                    wx.navigateBack()
                } else {
                    console.log('user click cancel')
                }
                //change the status 
                //Make finish button disable
            }
        });
    },
    bindGetUserInfo: function(e) {
        console.log("bindinput")
        this.setData({
            userInfo: e.detail.userInfo
        })
        this.openConfirm()

    }
})