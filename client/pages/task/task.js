// pages/project/task/task.js
const util = require('../../utils/util.js')
const app = getApp();

Page({
    data: {
        Task_Information:"Task Information",
        Task_Name:"Task Name",
        Task_Description:"Task Description",
        Date:"Date",
        Time:'Time',
        Task_Type:"Task Type",
        Progress:"Progress",
        Deadline:"Deadline",
        Finish:'Finish My Task!',

        index: 0,
        projectID: 0,
        task: {},

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
        this.setLang();
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
        if (arr[arr.length - 2].route == 'pages/project/project') {
            this.setData({
                task: arr[arr.length - 2].data.tasks[this.data.index],
                projectID: arr[arr.length - 2].data.project.proID
            })
        }
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

    },
    setLang() {
        const _ = wx.T._
        this.setData({
            Task_Name: _('Task_Name'),
            Task_Type: _('Task_Type'),
            Task_Information: _('Task_Information'),
            Date: _('Date'),
            Time: _('Time'),
            Task_Description: _('Task_Description'),
            Deadline: _('Deadline'),
            Progress: _('Progress'),
            Finish: _('Finish'),
        })
      }
})