// pages/project/task/task.js
const util = require('../../utils/util.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        Task_Information: "Task Information",
        Task_Name: "Task Name",
        Task_Description: "Task Description",
        Date: "Date",
        Time: 'Time',
        Task_Type: "Task Type",
        Task_Level: 'Importance',
        Progress: "Progress",
        Deadline: "Deadline",
        Finish: 'FINISH MY TASK',
        Undo: 'UNDO MY TASK',
        Responsible: "Responsible",
        index: 0,
        projectID: 0,
        task: {},
        tempTask: {},
        level: ['Low', 'Medium', 'High'],
        Task: 'Task',
        Activity: 'Activity',
        Meeting: "Meeting",
        Others: "Others",

        myCompleted: true,
    },

    // load the task data from the server
    load_online: function(cb) {
        var that = this;
        console.info("index", this.data.index);
        app.request({
            url: '/task/' + this.data.index.toString(),
            success: function(res) {
                console.info('First');
                var format_task = {};
                var task = res.data[0];
                that.setData({ tempTask: task });
                var members = res.data[1];
                var taskMembersId = [];
                // var subtasks = [];
                var taskMembers = [];
                //taskMembersId.push(task.member_id1, task.member_id2, task.member_id3);
                if (task.member_id1 !== "") taskMembersId.push(task.member_id1);
                if (task.member_id2 !== "") taskMembersId.push(task.member_id2);
                if (task.member_id3 !== "") taskMembersId.push(task.member_id3);
                // subtasks.push(task.subtask1, task.subtask2, task.subtask3);
                // subtasks.splice("", 1);
                // var i = 0;
                //console.info(taskMembersId);
                for (var i = 0; i < taskMembersId.length; i++) {
                    // console.log("i:", i);
                    // console.info(members);
                    //console.log(item); 
                    var name = members.filter(member => member.open_id === taskMembersId[i])[0].name;
                    var subtask;
                    var completed;
                    switch (i) {
                        case 0:
                            completed = task.subtask1.startsWith('_0_') ? true : false;
                            subtask = task.subtask1.replace('_0_', '');
                            break;
                        case 1:
                            completed = task.subtask2.startsWith('_0_') ? true : false;
                            subtask = task.subtask2.replace('_0_', '');
                            break;
                        case 2:
                            completed = task.subtask3.startsWith('_0_') ? true : false;
                            subtask = task.subtask3.replace('_0_', '');
                            break;
                    }
                    // console.info("Members", members);
                    // console.log(name);
                    taskMembers.push({
                        name: name,
                        task: subtask,
                        completed: completed
                    });
                }
                //  console.info("task members", taskMembers);
                format_task.taskID = task.task_id;
                format_task.taskName = task.name;
                format_task.taskType = task.task_type;
                format_task.taskInfo = task.info;
                format_task.taskDate = task.deadline.substring(0, 10);
                format_task.taskTime = task.deadline.substring(11, 19);
                format_task.taskMembers = taskMembers;
                format_task.status = task.finish;
                format_task.taskLevel = task.importance;
                format_task.proID = task.project_id;
                that.setData({
                    task: format_task
                });
                if (that.data.task !== {}) {
                    //console.info(that.data.task);
                    cb(that.data.task);
                }
                console.info("Here!", that.data.task);
            }
        });
    },

    onLoad: function(options) {
        // this.load();
        var that = this;
        this.setData({
            index: options.id
        });
        this.load_online(function() {
            console.info("Second");
            // console.log("1:", that.data.task.taskMembers);
            for (var i = 0; i < that.data.task.taskMembers.length; i++) {
                //console.info("2:",app.globalData.userInfo);
                // console.info(member.name);
                //console.info(that.data.task.taskMembers[i].name);
                //console.info(app.globalData.userIn    fo.name);
                if (that.data.task.taskMembers[i].name === app.globalData.userInfo.name) {
                    console.info("Set true~");
                    that.setData({
                        enableButton: true,
                        myCompleted: that.data.task.taskMembers[i].completed
                    });
                    break;
                }
            }
        });

    },
    onShow: function() {
        this.setLang();
        //get data from the project page
        // var arr = getCurrentPages();
        // if (arr[arr.length - 2].route == 'pages/project/project')
        // {
        //   this.setData({
        //     task: arr[arr.length - 2].data.project.tasks[this.data.index],
        //     projectID: arr[arr.length - 2].data.project.proID
        //   });
        // }
    },
    openConfirm: function() {
        var that = this;
        var theTask = app.globalData.tasks.filter(e => e.taskID == that.data.task.taskID);
        console.log('current Task is')
        console.log(theTask);
        wx.showModal({
            title: 'Declaration',
            content: 'By clicking the confirm button, I acknowledge that my part of the task is doned',
            confirmText: "Confirm",
            cancelText: "Cancel",
            success: function(res) {
                console.log(res);
                if (res.confirm) {
                    //Complete the Your own Task 
                    var temp = that.data.tempTask;
                    var tempMember = that.data.task.taskMembers;
                    for (var i = 0; i < tempMember.length; i++) {
                        if (tempMember[i].name === app.globalData.userInfo.name)
                        //If the user task is not completed
                            if (!tempMember[i].completed) {
                                tempMember[i].completed = true;
                                tempMember[i].task = '_0_' + tempMember[i].task;
                            } else {
                                tempMember[i].completed = false;
                            }
                        else {
                            if (tempMember[i].completed)
                                tempMember[i].task = '_0_' + tempMember[i].task;
                        }
                        if (i == 0) temp.subtask1 = tempMember[i].task;
                        else if (i == 1) temp.subtask2 = tempMember[i].task;
                        else if (i == 2) temp.subtask3 = tempMember[i].task;
                    }
                    that.setData({ taskMembers: tempMember });
                    console.log(that.data.taskMembers);
                    var allCompleted = true;
                    for (var i = 0; i < tempMember.length; i++)
                        allCompleted = allCompleted && tempMember[i].completed;
                    temp.finish = allCompleted;
                    //Use edit task API
                    app.request({
                            url: '/task/' + that.data.task.taskID,
                            method: 'PUT',
                            data: {
                                subtask1: temp.subtask1,
                                subtask2: temp.subtask2,
                                subtask3: temp.subtask3,
                                finish: temp.finish,
                                project_id: that.data.task.proID,
                                name: that.data.task.taskName,
                            },
                            success: function(res) {
                                console.log('edit task ' + that.data.task.taskID + ' success')
                                    //edit the change in globalData.tasks
                                app.globalData.tasks[app.globalData.tasks.findIndex(e => e.taskID == that.data.task.taskID)] = temp;

                                //upload status to project page 
                                var arr = getCurrentPages();
                                var projectPage = arr[arr.length - 1];
                                if (projectPage.route == 'pages/project/project') {
                                    console.log('projectPage.load()')
                                    projectPage.load(function() {});
                                }


                            },
                            fail: function(error) {
                                console.log(error)
                            }
                        })
                        // app.request({
                        //     url: '/task/toggle/' + that.data.task.taskID,
                        //     success: function(res) {
                        //         that.setData({
                        //             'task.status': res.data.finish
                        //         });
                        //         console.log(that.data.task.status);
                        //     }
                        // });
                        // var arr = getCurrentPages();
                        // var theProject = arr[arr.length - 2];
                    console.log('user click confirm');
                    wx.navigateBack();
                } else {
                    console.log('user click cancel');
                }

            }
        });
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
            Undo: _('Undo'),
            Responsible: _('Responsible'),
            Task_Level: _('task_level'),
            Task: _('Task'),
            Meeting: _('Meeting'),
            Activity: _('Activity'),
            Others: _('Others'),
        })
    }
});