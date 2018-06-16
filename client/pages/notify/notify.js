//logs.js
var util = require('../../utils/util.js');
var app = getApp();
var date = new Date();
Page({
    data: {
        navTab: ["Todo", "Missed"],
        currentNavtab: "0",
        tasks: [],
        date: ''
    },

    /*下拉加载更多在哪里？ */
    onLoad: function() {
        var that = this;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (month <= 9) { month = '0' + month; }
        if (day <= 9) { day = '0' + day; }

        that.setData({
            date: year + '-' + month + '-' + day
        });
        console.info(that.data.date);
        if (app.globalData.tasks.taskName === undefined) {
            app.request({
                url: '/task',
                success: function(res) {
                    var tasks = res.data.map(function(task) {
                        //console.info(app.globalData.projects);
                        var pro = app.globalData.projects.filter(e => e.proID == task.project_id);
                        //console.info(pro);
                        var name;
                        if (pro[0] != undefined) {
                            name = pro[0].proName;
                        }
                        var format_task = {
                            taskID: task.task_id,
                            taskName: task.name,
                            taskType: task.task_type,
                            status: task.finish,
                            due: task.deadline.substring(5, 7) + '/' + task.deadline.substring(8, 10),
                            proName: name,
                            taskLevel: task.importance
                        };

                        return format_task;
                    });
                    that.setData({ tasks: tasks });
                    app.globalData.tasks = tasks;
                    //console.log(that.data.tasks)
                }
            });
        } else {
            that.setData({
                tasks: app.globalData.tasks
            });
        }

    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    }
})