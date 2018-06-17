 /*
  * @Date: 2018-06-07 21:51:16 
  * @Last Modified time: 2018-06-07 21:51:16 
  * @Problems: 1. what is e.currentTarget.id; 2. how to fetch the images from the server; 
  * 3. what does files store
  */
 import { $wuxButton } from '../../components/wux'

 var sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置
 const util = require('../../utils/util.js');
 const app = getApp(); //获得小程序实例
 const config = require('../../config.js');

 Page({
     data: {
         index: 3,
         opened: !1,
         Add: 'Add',
         Members: "Members",
         Tasks: "Tasks",
         files: [],
         tabs: [{
                 icon: '../../images/allread.png',
                 selectedIcon: '../../images/b-allread.png'
             },
             {
                 icon: '../../images/icon/binder.png',
                 selectedIcon: '../../images/icon/binder-blue.png'
             }
         ],
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

     goBack: function() {
         console.info("go back!");
         wx.redirectTo('/pages/index/index');
     },
     onShareAppMessage: function() {
         var title = "Invite you to join " + this.data.project.proName;
         return {
             title: title,
             path: '/pages/project/project?id=' + this.data.project.projectID,
             success: res => {
                 console.log(res);
             }
         };
     },

     save: function() {
         var key1 = this.data.projectID + '-tasks';
         var key2 = this.data.projectID + '-logs';
         wx.setStorageSync(key1, this.data.tasks);
         wx.setStorageSync(key2, this.data.logs);
     },

     addMember: function() {
         console.log(this.data.project.proMembers);
         var isMember = false;
         for (var i = 0; i < this.data.project.proMembers.length; i++) {
             if (this.data.project.proMembers[i].name == app.globalData.userInfo.name) {
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

     load: function(cb) {
         var that = this;
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
                     format_task.taskEndDate = task.deadline.substring(0, 10);
                     format_task.taskMembers = members;
                     format_task.taskInfo = task.info;
                     format_task.status = task.finish;
                     return format_task;
                 });
                 tasks.sort(function(a, b) {
                     return a.taskEndDate > b.taskEndDate ? 1 : -1;
                 })
                 that.setData({
                     projectID: project.project_id,
                     'project.projectID': project.project_id,
                     'project.proName': project.name,
                     'project.proDes': project.info,
                     'project.proMembers': members,
                     tasks: tasks
                 });

                 console.info(that.data.project);
                 console.log('task!', tasks);
                 that.addMember();
             }
         });

         app.request({
             url: "/project/logs/" + this.data.projectID,
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
                     log.time = log.date.substring(11, 19);
                     log.date = log.date.substring(0, 10);
                     return log;
                 });
                 that.setData({
                     logs: logs
                 });
                 if (res.data !== null)
                     cb(res.data);
                 wx.hideLoading();
             }
         });
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
         wx.showLoading({
             title: 'Loading...',
             mask: true
         });
         wx.checkSession({
             success: function() {
                 //session_key 未过期，并且在本生命周期一直有效
                 that.setData({ projectID: opt.id });
                 console.info('Before');
                 that.load(function() {}); //异步出问题
                 console.log('After');
                 console.info(that.data.project);
             },
             fail: function() {
                 // session_key 已经失效，需要重新执行登录流程
                 app.checklogin(function() {
                     that.setData({ projectID: opt.id });
                     console.info('Before');
                     that.load(function() {}); //异步出问题
                     console.log('After');
                     console.info(that.data.project);
                 }); //重新登录
             }
         });
         this.initButton();
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
         this.setLang();
         console.log("Global", app.globalData.new_task);
         if (app.globalData.new_task && app.globalData.new_task.taskName !== undefined) {
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
         if (e.currentTarget.id === '2') {
             console.info('hey');
             wx.switchTab({
                 url: '../index/index',
                 fail: function(err) { console.log(err); }
             });
             return;
         }
         this.setData({
             sliderOffset: e.currentTarget.offsetLeft,
             activeIndex: e.currentTarget.id
         });
     },

     createTask: function() {
         console.info('ID=', this.data.projectID);
         wx.navigateTo({
             url: '../newTask/newTask?id=' + this.data.projectID
         });
     },

     onPullDownRefresh: function() {
         wx.showToast({
             title: '刷新中',
             icon: 'loading',
             duration: 3000
         });
         this.load(function() {});
     },

     kindToggle: function() {
         console.info("hey!");
         this.setData({
             'list.members': this.data.project.proMembers
         });

         this.setData({
             'list.open': !this.data.list.open
         });
     },
     setLang() {
         const _ = wx.T._
         this.setData({
             Members: _('Members'),
             Add: _('Add'),
             Tasks: _('Tasks'),
         })
     },


     testShare: function() {
         wx.showShareMenu({
             withShareTicket: true,
             success: function() {
                 console.log("share success")
             },
             fail: function() {
                 console.log("share failed")
             }
         });
     },
     initButton(position = 'bottomRight') {
         var that = this;
         this.setData({
             opened: !1,
         })

         this.button = $wuxButton.init('br', {
             position: position,
             buttons: [{
                     label: 'See Members',
                     icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAM3SURBVGje7VlNSBRRHP8/tU1dd7PNwkwiUqFIb5pGlJZEardIsOwi5iU6SF+XDhVBRFFJdKlbH0hdgkBIO3kptSKiEgKJWAikQrKgxLD9dZB982b2zex7b2ZZof2f/sv+vuYx8z5mGBkVYtRGzdRI1RSmWfpAYzRKI2zeTE3POorTcKtZ9KAgk+YRXEP6OoH8zNgfUDBPVnPQ5kUY1LAHgEvIC86+HDMO+UkcQpEt4EG8dWAmEAnGvtIh/Bg1LsgqPLIhZ7DSv32pw357Gvw2GzqOQn/2DKO2ay9R4JRgSODc8xegS5C6CPXYVwXeHnP7kCBzXYtJuM2ZC8bPA1q5yGfdGQ4hzHN2vTvOO1s37/azBb0A7A91WGzTEfjCr8FgckUhZ78ysycu8NuIzzh/2h0V3HRpWLkAuQC5ALkASzkAI0oeNIpUdwIu9ct0BKZ4Z3LcCPEubhrAWsVWGAQo5d070wDPebfJIIC1d35tGuAl7zpIv1p598aATUSEMF/R/+rfhvjG2Qp7aTeR91xkgyZzjXU28MKlmwesvfBhzeztvBswvn4irBU25iENHsN3ztvoIwARJrlQtwaribPmfE5iaBfGIKrIyUOcc3r8+RMKhAB3FDl9AifsMwAROgS5Ywr4RgF/1Lc9Ech2Qj6VBt0kYOewLIAAtmcaAPo9kLttyNpA7ImIUG8TdlmabKdpoDMweyIi7BCkm1wwmwVMr5qu4o4IMWoRfrpNScuFPiG+xPJ37eW4DHtVuiBXOXD9qjOHu/l63IKzRjzwD1PQZ1Fmal6DB0itYa/FFWE8k3AGUKFrXodhqXmdAncXPkm4dxUXJRAaMCERGES1cnzCVryQaAxhizeRYSemJMSbbredp1otnki0xtEgXR+Rj7aUN8IAcAGr9c25ahXuSzQ/ogXMPmRHIKuTMNmOO0Osww2J9k/sTQIiGJcA+lDs35yHKMN5iUccFYQSfE35o0tn+6UcIorjqRnIMTw/sC9DH1wWQxSj1xnAqjk0226NTIUIoRPTsgD+Py6oh4glTRmSD2WCZXDoUwIwSix2S/kFxX8SwLoHsjYCY9kOcC7LAdhTupJF/zP/AOvS/D0NTmDBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA0LTA0VDExOjQ3OjQ1KzA4OjAwI6N5UAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNC0wNFQxMTo0Nzo0NSswODowMFL+wewAAAAASUVORK5CYII=",
                 },
                 {
                     label: 'Add Task',
                     icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAQAAAAHUWYVAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAmuSURBVHja7Z17kBTVFYd/s8uCu4hsIoqSFZEFDLgKLiqs4CogMUBCFCr4CEZFZRUpCqIG4gsfoCEqlkLxKAiBBI1aUAiFBgOFEtSoiOArwcKAoKBm4ypCQNdH+4dN27vM7PTj3nNOz5yv/7k7c7vvvefb7p6e6Xs65UCRRAF3B5SGqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhqBBhNOPuACtt0At1+Cd3N/zks5ABWAMA2Iqe2MvdmYPk7yHrPFcH0BmvoCV3dw6Sr0KGYJXvry54ESXcXfqO/BTyC6xs9EoF1uMw7m4B+SlkGJ5I82ol1qIFd9fyUcgILM3wThWeRnPu7uWbkF/hsSbePRsrUcTbwfwSchkWZ6kxEMt4LwXySciVWBig1hA8jkK+TuaPkGswP2DNC/AIn5J8ETIWs0PUHoGFXJHJDyETMCPkGiMxDymOruaDkBsxPcJaozCbQ0nuC7kJf4i4Zg0eYlDi5PYy2YnH/dQ95g6Y3WVKTB2O4zi/p+1zbh+yvjSwjYm4i7LLhbdTtkbNOhShOvZWquFgHVWXc1sIsBYt0Sf2VvqhHs/RdDgXhaQwF7XY5f61GqXoHXubA7AfL5D0nv3Ea3opcBY4juM4p3mvpJyZBk7ujjOeov/c4TO9FDqLvQD28CmZa0TJdSokrI7HGwTwZJ+SPxlRUqNCgi/NnGWHBPAk790C374Th1EqJNhS5DyZNoA/9mo03n+i8msVkn1p7qzOGMDOPiVPGFEy2N5IUjmR+70F/t7kBWA5trmlZliBQbHb240f2RpKLggpxtqsVxon4F23VIS/YUDsNq19C5z877JK8HyAC7/tOM4tfYnBWB+zzZvtDSfpe0hLvISTAtYt867eW2AdekVu86+4FF/bGlCyhbTCRnQOUb8dPnBLxXgep0ZqcxFG4Rt7Q0qykNZ4He1DrnMMPnJLJXg58L71PfNRY1NHkoWUYgvahl7LQVvUuuXDsQmdQq09C2NhOWBJPan/ENsi6ABS2Ikj3fI+VGJniHUftK8jqXtIG+yIMZ/jM3TAJ265Nd4OKPY+3EgxtCQKORq7Y95ZWIvO2OOWS7EdpVnXuAc30QwueYesY/BR7Bs9j8KbaOWWP0U5DmSpfyeVjuQJ+f6DazzKsBmHu+U6tG/yuuJWTKYbYLKEHOdd2sWnI172zkP/Q7uM9SZhCuUQkyTk+FCfibLTFS+g2C3/F8emrXM9ptEOMjlCOnpfD5qjO9Z5Uz0/TPMN7rhIdwXHIilCOuE/VrZ7OlZ7Uz13N7ruHxP6nnkDJEPIidhqbdt98ZQ31fM9dPBeHx1qRokxkiCkG7ZY3X5/LPemeu5AOQDgCszjGaz8C8MKvEHQygoMx1duuRN6Z50cag3pQrpjM1FLS3GhvV85giP7kFVJpgMYjr9IiIaALmTkDGwkbe9iLOAesmQhVXiJvM0l3IOWm8Csb+wbEcIzqEHKJiZk7iHnMOgYKEGHTCED8Ax5m/29/HLMyBNyHkNoqhn+BTIgTcgQhgNHH4YDZEZkCRl6SOo9+/QmmqoWEElChmE5eZunM3y4bhI5QjKn3rPHqXiFe9iNkSLkkiZT79nhFMIvZgIjQ8hleJi8TZpvkUMjQUiw1Htm6Yq3uIedHn4hNYFT75mji+WfvGLALWQs5pC3WW7xB+HY8AoJn3ovPid48w1FwikkWuq9eLS3cDORUfiERE+9F50yvMc23oBwCZmMqeRttjN4I6o1eH6gmmJzHmtaHBzrTWYTDcceMo1cx+domwwd9EJSmI7fErf5Gcq8eYXioRWSwkOYQDzCWnTAx8RtxoDyHJLCHIwmHt/7qPAmryUCuj2kAH8k17EN3ZKlg05IIf6MK4jH9m90l/N8wqDQHLIK8QhGEI/sNZyJ/cRtGoBiD2mGJeQ6NqAqiToohBRhOc4nHtVzqM461VkotoU0x1MYTDymtTgXnxO3aQy7QlpgNc4lHtEqDMIXxG0axKaQYjxrIBV+OFZgKOqJ2zSKvU9ZJViPSuLRLMVF3sS0hGJLSJjUe6awmnqPCjuHrFbYRK5jEUYmX4cdIa3xZqhMiCaYbzcTIh3mhZRiS+hMiHGZhdG5ocPGtOg6/IB4DA9igv3Ue1SY30Oi58ONxn0Ynzs6bAjZiq6E/b+HJhMiHeaE9PfyoW8h+4RFmHqPCnPnkI3YgGu9g8fJeN1632+lzfVGhLEnX9Q7jjPD93cPI0/qyMxE9meWWFlMbajADZP/2bE9Ler4DXfgpAsp9kLlf3ZsL0s6xnGHTb6QNr5w3eV7/UwLOq7lDloShHRqELLbfO+cZVjH1dwhS4aQqkZh+53vvX4GdVzOHTDbi6nrkMZZb+/GDV75GQw01MqlDLMRiTEl5NCvE+/FeK+8xsCT0YCL+TIh0mFKSMc0rz2A67zyKvw8Zgu/xKNUQeHElJAT0746EzVeeWWsm4EukJDtjQRDJ6NdGU/D/mfHDo94Kv8Z96mWbjGzmVST4fQ/O/aiCDp+yh2k5AkpyhLSS3x1R4bUMZA7REkUckTWsI7w1b48hI5+3AFKppCyAKEd5qt/VUAd1dzhoV/MfMo6MkCdpRjqledjTIA1+uAfPB90ODEjJNiD55b7bruejXFZagtLvUeFGSFlAes9iZ945Rm4voma4lLvUWFGSIfANZ/2Pct8OiZlqFUpL/UeFWaEhLlPcQ3O9srTcEuaGt2xiTconJgR0i1U7WfR1ytPxR2N3q0guD1CMGbuOgm/kSq86JWn+m7m6So31xsNJoQURpqTcQY2eOV73V9PukjO9UaDCSEl+H+k9Xri1YO9wEyMQbnsXG80mBBydORMOz3wGncApGHipF4aec3NqOAOgDRMCDkqxrpvkN6anQBMCGkXa+1/cYdAFiYmfQadL7UX72A7dmAXPkAtPsan2If9SZ5TbgMTQsob/FWHd/AuduJ9fIha1GEP9uIAvsDXEa5W8hATn7JOQz32YB8OoD7ps8T5kf7o1byDO/e70ggVIgwVIgwVIgwVIgwT1yHj0IZ7GEK4Lf4mTHzsfRQXckdCCKn4m9BDljBUiDBUiDBUiDBUiDBUiDD0215h6B4iDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUiDBUijG8Bf5dGBYrwN+8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDYtMTZUMDQ6MTg6NTMtMDQ6MDC4AkVqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTA2LTE2VDA0OjE4OjUzLTA0OjAwyV/91gAAAABJRU5ErkJggg==",
                 }
             ],
             buttonClicked(index, item) {
                 //see members
                 index === 0 && that.kindToggle();
                 //create task
                 index === 1 && that.createTask();
                 //index === 1 && that.testShare();
                 return true
             },
             callback(vm, opened) {
                 vm.setData({
                     opened,
                 })
             },
         })
     }
 });