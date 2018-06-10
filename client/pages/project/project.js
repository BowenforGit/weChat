/*
 * @Date: 2018-06-07 21:51:16 
 * @Last Modified time: 2018-06-07 21:51:16 
 * @Problems: 1. what is e.currentTarget.id; 2. how to fetch the images from the server; 
 * 3. what does files store
 */

var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js');
const app = getApp(); //获得小程序实例
const config = require('../../config.js');

Page({
    data: {
        files: [],
        tabs: ["Project", "Logs", "Back"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        MemberInfos: [],

        project: {},
        tasks: [],
        logs: [],
        tasks_length: 0,
        projectID: 2,
        list: {
          id: 'form',
          name: 'Members',
          open: false,
          members: []
      }

  },

  goBack: function(){
    console.info("go back!");
    wx.redirectTo('/pages/index/index');
  },
  onShareAppMessage: function () {
    var title = "Invite you to join "+this.data.project.proName;
    return {
      title: title,
      path: '/pages/project/project?id=' + this.data.project.projectID,
      success: res => {
        console.log(res);
      }
    };
  },

  save: function () {
    var key1 = this.data.projectID + '-tasks';
    var key2 = this.data.projectID + '-logs';
    wx.setStorageSync(key1, this.data.tasks);
    wx.setStorageSync(key2, this.data.logs);
  },

  addMember: function() {
    console.log(this.data.project.proMembers);
    var isMember = false;
    for (var i = 0; i < this.data.project.proMembers.length; i++) {
        if (this.data.project.proMembers[i].name == app.globalData.userInfo.name){
          isMember = true;
          return;
        }
    }
    if (!isMember) {
        app.request({
            url: "/project/invite/" + this.data.projectID,
            method: 'POST',
            success: function(res) {
                console.log('Invite new member');
            }
        });

        console.log('project.proMembers ');
        console.log(this.data.project.proMembers);
        var members = this.data.project.proMembers;
        if (app.globalData.userInfo.name)
            members.push({ name: app.globalData.userInfo.name, avatarUrl: app.globalData.userInfo.avatar });
        this.setData({
            'project.proMembers': members
        });
        console.log('Add Member ' + app.globalData.userInfo.name);

        // this.save();
    }
},

  load: function (cb) {
    var that = this;
    app.request({
      url: "/project/"+this.data.projectID,
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
          members.push(task.member_id1, task.member_id2,task.member_id3);
          for(var i = 0; i < members.length; i++){
            if(members[i] ==='') {
              members.splice(i, 1);
              i--;
            }
          }
          format_task.taskID = task.task_id;
          format_task.taskName= task.name;
          format_task.taskType = task.task_type;
          format_task.taskStartDate = task.start_date.substring(0,10);
          format_task.taskEndDate = task.deadline.substring(0,10);
          format_task.taskMembers = members;
          format_task.taskInfo = task.info;
          format_task.status = task.finish;
          return format_task;
        });
        
        that.setData({
          projectID: project.project_id, 
          'project.projectID': project.project_id,
            'project.proName': project.name,
            'project.proDes': project.info,
            'project.proMembers': members,
            tasks: tasks
        });

        console.info(that.data.project);
        console.log('task!',tasks);
        that.addMember();
      }
    });
  
    app.request({
      url: "/project/logs/"+this.data.projectID,
      success: function(res) {
        if (res.statusCode !== 200) {
          wx.showToast({
            icon: 'none',
            title: 'Wrong Request!'
          });
          return;
        }
        
        var logs = res.data;
        logs = logs.map(function(log) {
          log.date = log.date.substring(0,10);
          return log;
        });
        that.setData({
          logs: logs
        });
        if(res.data !== null)
          cb(res.data);
      wx.hideLoading();        
      }
    });
  },

  onLoad: function (opt) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.showLoading({
      title: 'Loading...',
      mask: true
    });
    wx.checkSession({
      success: function() {
          //session_key 未过期，并且在本生命周期一直有效
          that.setData({ projectID: opt.id });
          console.info('Before');
          that.load(function(){}); //异步出问题
          console.log('After');
          console.info(that.data.project);
      },
      fail: function() {
          // session_key 已经失效，需要重新执行登录流程
          app.checklogin(function() {
                  that.setData({ projectID: opt.id });
                  console.info('Before');
                  that.load(function(){}); //异步出问题
                  console.log('After');
                  console.info(that.data.project);
              }); //重新登录
      }
  });

    // that.data.projectID = opt.id;
    // that.load(function(){});
  },

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
        // var feed = feed;
        this.setData({
            project: feed,
            tasks_length: feed.tasks.length
        });
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
            });
        }, 3000);

    },

    //使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 4000
        });
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
            });
        }, 3000);
    },

    onShow: function() {
        console.log("Global", app.globalData.new_task);
        console.log(app.globalData.new_task.taskName !== undefined);
        if(app.globalData.new_task.taskName !== undefined){
          var tasks = this.data.tasks;
          tasks.push(app.globalData.new_task);
          this.setData({
            tasks: tasks
          });
          app.globalData.new_task = {};
        }
    },

    tabClick: function(e) {
      // console.info(typeof e.currentTarget.id);
      if(e.currentTarget.id === '2') {
        console.info('hey');
        wx.switchTab({
          url: '../index/index',
          fail: function(err) {console.log(err);}
        }); 
        return;
      }
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
    },

    createTask: function(){
      console.info('ID=', this.data.projectID);
      wx.navigateTo({
        url: '../newTask/newTask?id='+this.data.projectID
      });
    },

    onPullDownRefresh: function() {
      wx.showToast({
          title: '刷新中',
          icon: 'loading',
          duration: 3000
      });
      this.load(function(){});
  },

  kindToggle: function(e) {
    console.info("hey!");
    this.setData({
        'list.members': this.data.project.proMembers
    });
    var id = e.currentTarget.id,
        list = this.data.list;

    if (list.id == id) {
        list.open = !list.open;
    } else {
        list.open = false;
    }
    this.setData({
        list: list
    });
}
});
