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
                icon: '../../images/log.png',
                selectedIcon: '../../images/b-log.png'
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
<<<<<<< HEAD
=======
        
>>>>>>> 281fc3e8efe7d0f6740eb94c851c01dacb500570
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
    initButton(position = 'bottomRight') {
      var that = this;
      this.setData({
        opened: !1,
      })

      this.button = $wuxButton.init('br', {
        position: position,
        buttons: [
          {
            label: 'View on Github',
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAOGSURBVGje7VhLSFVRFF1HLROtLHtmhVJmz0c/NUstoQ84KAuSauKkdJDQh2pghRAFkTQwiKIoMppFk0ALKioKggbmQEJCsAQjKIMc9Ochymqg73Pf3ed+n4PgreG+e6+1zn7nnbvPBVJI4X8Dq3iOA5Twhq1cPZ3S63mPTnCNoeSL1/OnI/EIBrgpeeKVHHElHkEPV/gXz+QVT+IRnKLyIx/kuC/5yR+jwKt8nW/xCMq8yO9NmjxJ1rqV351UeZKsciNfk3R5kiyWtIQ9ygKMeNw21pjAHPU3MZhmkk/Do4TQHzz3IBfGg4RIOq47af9BU+uOAADX8q7jZrdzEQAIFXV28vkCXWn0aYB34uIf+ZJd7OYrfomLXmRWNH+nwDbL2kCnUJJjyNjIowyKtRU8zVWGSLHAdsJKvlBs6EwPO0Dfz4QFGTdhq8gzw6sByO1u1PnN1mypIDxCe5jHLTu+A1s1PPs8d6BFE18p+32i8ZvvuQMhDeMFKXmmJnmz5/UD4H6RM0whtURM7fUjDzBds6y5kYzYHlgjMrT5M6AmcEh8sMxsoFJM9NkBAE/FaHRujhkoFxN/+TYgv1kFA6VC2mc/E+UUxsToUrMBaXQc968PitGA2YB0bOYlwUCaGM00Pw4LaTm+pvoEKQOiajEDX8XEbN8GAmJ01GzgvZgoDpKuIN8Jhs0G3oqJDb4NHBCjg6YI92gOzXQ/6pytYS03d6Bfw7Hd1/qbNPFhU0T7NkwYoVytf4mGcSx2OEQ7oMbwTMPTRU9DGXO1Xe0Q/93cpe1BHxe6lg9RD/nNq50JJ3HMeR84nx2WXGm6wqtxSWeFbyOddvMRFXfwIa3Roi+Pvxf0s5gZPC9SfBJqGzlKZ7Da1LxlSN0AsE2gaBfX/tiR/HHrFgYS0ucxg79NJOIbgkWODFjfDQE2G9JvAgwmUHRrKsEftvLb7Hew4mtDSR7A5fwQF2nW1tp9Sb1hKw8AXGAoOjkVzeUWVttUXraU/27b/ijROkOh47eBjYEipzwAWG8ovW+3dgcGKlzIAwAbtFRNHgzU6Gp0hyJUN3Tfc9zPiWWqx7UBQL1AyG2NgCEsVv36x5ZkahBZMP913MxIZxBUll8dbVajwuowqvHNk4E+hFS7onWSg3aqXpWP+tggbXFfit0t3qFWVapBJBMs422SQ7G7vSmjkGGSl1iSVOEUUphe/AMv8ctn/pO1zAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNC0wNFQxMDo0MDo0MiswODowMNlOhSIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDQtMDRUMTA6NDA6NDIrMDg6MDCoEz2eAAAAAElFTkSuQmCC",
          },
          {
            label: 'See Members',
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAM3SURBVGje7VlNSBRRHP8/tU1dd7PNwkwiUqFIb5pGlJZEardIsOwi5iU6SF+XDhVBRFFJdKlbH0hdgkBIO3kptSKiEgKJWAikQrKgxLD9dZB982b2zex7b2ZZof2f/sv+vuYx8z5mGBkVYtRGzdRI1RSmWfpAYzRKI2zeTE3POorTcKtZ9KAgk+YRXEP6OoH8zNgfUDBPVnPQ5kUY1LAHgEvIC86+HDMO+UkcQpEt4EG8dWAmEAnGvtIh/Bg1LsgqPLIhZ7DSv32pw357Gvw2GzqOQn/2DKO2ay9R4JRgSODc8xegS5C6CPXYVwXeHnP7kCBzXYtJuM2ZC8bPA1q5yGfdGQ4hzHN2vTvOO1s37/azBb0A7A91WGzTEfjCr8FgckUhZ78ysycu8NuIzzh/2h0V3HRpWLkAuQC5ALkASzkAI0oeNIpUdwIu9ct0BKZ4Z3LcCPEubhrAWsVWGAQo5d070wDPebfJIIC1d35tGuAl7zpIv1p598aATUSEMF/R/+rfhvjG2Qp7aTeR91xkgyZzjXU28MKlmwesvfBhzeztvBswvn4irBU25iENHsN3ztvoIwARJrlQtwaribPmfE5iaBfGIKrIyUOcc3r8+RMKhAB3FDl9AifsMwAROgS5Ywr4RgF/1Lc9Ech2Qj6VBt0kYOewLIAAtmcaAPo9kLttyNpA7ImIUG8TdlmabKdpoDMweyIi7BCkm1wwmwVMr5qu4o4IMWoRfrpNScuFPiG+xPJ37eW4DHtVuiBXOXD9qjOHu/l63IKzRjzwD1PQZ1Fmal6DB0itYa/FFWE8k3AGUKFrXodhqXmdAncXPkm4dxUXJRAaMCERGES1cnzCVryQaAxhizeRYSemJMSbbredp1otnki0xtEgXR+Rj7aUN8IAcAGr9c25ahXuSzQ/ogXMPmRHIKuTMNmOO0Osww2J9k/sTQIiGJcA+lDs35yHKMN5iUccFYQSfE35o0tn+6UcIorjqRnIMTw/sC9DH1wWQxSj1xnAqjk0226NTIUIoRPTsgD+Py6oh4glTRmSD2WCZXDoUwIwSix2S/kFxX8SwLoHsjYCY9kOcC7LAdhTupJF/zP/AOvS/D0NTmDBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA0LTA0VDExOjQ3OjQ1KzA4OjAwI6N5UAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNC0wNFQxMTo0Nzo0NSswODowMFL+wewAAAAASUVORK5CYII=",
          },
          {
            label: 'View on Demo',
            icon: "data:image/png;base64,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",
          }
        ],
        buttonClicked(index, item) {
          index === 0 && wx.showModal({
            title: 'Thank you for your support!',
            showCancel: !1,
          })
          //see members
          index === 1 && that.kindToggle();

          index === 2 && wx.switchTab({
            url: '/pages/index/index'
          })

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