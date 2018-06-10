// pages/project/task/task.js
const util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index: 0,
      projectID:0,
      task: {},
      enableButton: false,
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  save: function () {
    var key2 = this.data.projectID + '-logs';
    wx.setStorageSync(key2, this.data.logs);
  },
  load: function () {
    var key1 = this.data.projectID + '-tasks';
    var key2 = this.data.projectID + '-logs';
    var tasks = wx.getStorageSync(key1);
    var logs = wx.getStorageSync(key2);
    if(tasks){
    for(var item in tasks)
    {
      if(item.taskID == this.data.taskID)
        this.setData({
          task: item
        });
    }}
    if (logs) {
      this.setData({ logs: logs });
    }
  },
  
  // load the task data from the server
  load_online: function(cb) {
    var that = this;
    console.info("index", this.data.index);
    app.request({
      url: '/task/'+this.data.index.toString(),
      success: function(res) {
       console.info('First');
        var format_task ={};
        var task = res.data[0];
        var members = res.data[1];
        var taskMembersId = [];
        // var subtasks = [];
        var taskMembers = [];
        //taskMembersId.push(task.member_id1, task.member_id2, task.member_id3);
        if(task.member_id1 !== "") taskMembersId.push(task.member_id1);
        if(task.member_id2 !== "") taskMembersId.push(task.member_id2);
        if(task.member_id3 !== "") taskMembersId.push(task.member_id3);
        // subtasks.push(task.subtask1, task.subtask2, task.subtask3);
        // subtasks.splice("", 1);
        // var i = 0;
        console.info(taskMembersId);
        for(var i = 0; i < taskMembersId.length; i++) {
          // console.log("i:", i);
          // console.info(members);
          //console.log(item); 
          var name = members.filter(member => member.open_id === taskMembersId[i])[0].name;
          // console.info("Members", members);
          // console.log(name);
           taskMembers.push({
             name: name
             //task: subtasks[i]
           });
         }
        //  console.info("task members", taskMembers);
        format_task.taskID = task.task_id;
        format_task.taskName = task.name;
        format_task.taskType = task.task_type;
        format_task.taskInfo = task.info;
        format_task.taskDate = task.start_date.substring(0,10);
        format_task.taskTime = task.deadline.substring(0,10);
        format_task.taskMembers = taskMembers;
        format_task.status = task.finish;
        that.setData({
          task: format_task
        });
        if(that.data.task !== {}){
          console.info(that.data.task);
          cb(that.data.task);

        }
        // console.info("Here!", that.data.task);
      }
    });
  },

  onLoad: function (options) {
    // this.load();
    var that = this;
    this.setData({
        index: options.id
    });
    this.load_online(function(){
      console.info("Second");
      // console.log("1:", that.data.task.taskMembers);
      for(var i = 0; i < that.data.task.taskMembers.length; i++)
      {
        //console.info("2:",app.globalData.userInfo);
          // console.info(member.name);
          console.info(that.data.task.taskMembers[i].name);
          console.info(app.globalData.userInfo.name);
        if(that.data.task.taskMembers[i].name === app.globalData.userInfo.name){
          console.info("Set true~");
          that.setData({
            enableButton: true
          });
          break;
        }
      }  
    });

    

  },
  onShow: function()
  { 
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
  openConfirm: function () {
    var that = this;
    wx.showModal({
      title: 'Declaration',
      content: 'By clicking the confirm button, I acknowledge that my part of the task is doned',
      confirmText: "Confirm",
      cancelText: "Cancel",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log("taskID:", that.data.task);
          app.request({
            url:'/task/toggle/'+that.data.task.taskID,
            success: function(res){
              that.setData({
                'task.status': res.data.finish
              });
              console.log(that.data.task.status);
            }
          });
          var arr = getCurrentPages();
          var theProject = arr[arr.length-2];

          console.log('user click confirm');    
          // var logs = theProject.data.logs;
          // logs.push({ timestamp: util.formatTime(new Date()), action: 'Finish Task', actionInfo: that.data.task.taskName, userInfo: that.data.userInfo });
          // theProject.setData({
          //   'logs': logs
          // });
          // theProject.save();
          wx.navigateBack();
        } else {
          console.log('user click cancel');
        }
        //change the status 
        //Make finish button disable
      }
    });
  },
  bindGetUserInfo: function (e) {
    console.log("bindinput");
    this.setData({
      userInfo: e.detail.userInfo
    });
    this.openConfirm();
   
  }
});