//logs.js
var util = require('../../utils/util.js')
var app = getApp();
Page({
    data: {
        navTab: ["Todo", "My log", "Missed"],
        currentNavtab: "0",
        tasks: []
    },
    onLoad: function() {
        var that = this;
        app.request({
            url: '/task',
            success: function(res) {
              
                var tasks = res.data.map(function(task) {
                    var format_task = {
                        taskID: task.task_id,
                        taskName: task.name,
                        taskType: task.task_type,
                        status: task.finish,
                        due: task.deadline,
                        proName: task.project_id
                    };
                    return format_task;
                });
                
                that.setData({ tasks: tasks });
                app.globalData.tasks = tasks;
            }
        });
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    }
})