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
            label: 'Invite',
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVgAAAFFCAQAAAADLT2OAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AABw8SURBVHja7Z17mBTVmcZ/ 3fQg94uwCpFBENQoF2+rgCTBqNE1RIwG0GhYDaLoGi / EGDUuusmaGGNAn7CaSLxEEEREJRoRFBFdBYmugUSERFSURKNyERhuAzO9f / TM0Mx099RXXafOd7rP + 5cP/J6q7/3qs+ muqvecRJomStKOBABpqqglnzznudi5pBtles5z9X / tRJme81w94ESZnvNcPeJEmZ7zXD3kRJme81w95kSZnvNchku6UabnPJfhkm6U6TnPZbikG2V6znMZzpEyPee5DJd0o0zPeS7DJd0o03Oey3BJN8r0nOcyXNKNMj3nuQyXSCddKNNznstwiTQmDus5z5nhkmYO6znPmeGSZg7rOc + Z4ZJmDus5z5nhkmYO6znPmeF8pstzTnE + 0 + U5pzif6fKcU5zPdHnOKc5nujznFOczXZ5ziku5UaYVriUHUElXOtGKFGmS7KaaaraxgfVsYANpI + f1XAEu5UaZMXEJDmEgAziM3vSiex2VT7v4gLW8z2reYSWbFPkoYS6RdqJMw1xHhjCUofwr7Qmrf / BHXuIVllOj3q / DXCLdwYUyDXFpjuEMzmAwLYhKn / M8zzKfjxX6LQEuke7oQpkGuCMZxSgqMaM0S5jNY3Vjq8FviXCZgVVfZqRcdy7gfA7BvGpZxH38npZO9MUJLpHu6EKZkXEnMZ7TIvwCEEQbmMlU1qnuizNcIt3BhTIj4Doxmivojx3t4ffczusK++IYVx6ZrpZcyvX0wLYWMDHn0GrvnyKu9DNdCb7Dj+mNFj3FTbyloC + OcvkHVlWZobkTuYvj0aUapjKRDU70Tx2Xb2CVlRmKO5DJnI9ObeJm7qFWdf9UcrkHVl2ZIbjvMonOaNZSLuVDtf1TyiVKcp + uHjzA19Cvan7JJGrU9U8x13RgVZYp4kZxr / LP1mwt4xJWquqfaq7UMl1teJDZDo0rDOIVzjPel5Lh9v2EVVtmQK4PTzAQFzWFa9ltrC8lxGUPrOIyA3FfZwadcFWvMpJ / GulLSXGlk + m6kqcdHlcYyrJ9Hhxr7bNlrjQyXUnu4lfkX9jODfXkFU6NtC8lyGW + EqgvsyBXwQxGURrazYU8orTPKrhE2okyC3CtmMNwSke1jGe2wj4r4VzPdLXhKU7BnPawiSo2U8VWdlJBS9rRha50MXjONDdwb0z9c45zO9O1H08beKK1h / 9jJe/zLu+wluqc9bWmF30YwFEcbyS7MIEHFPVZEedypivF44wgOtWygkUs4mW2i+r7FwZzMidzcKS1XMR0w/1zknM305VgOhcQld5gGrP4rKj6BnIu59InoopqOJunDfbPUc7dTNet3EQU+ ohpTGNVZPUN41K + xX4RVLaNr / Cmsf45yrma6RrL / RSvNfycafs8Eo2mvm5cyeURvNHwMYP50Ej / nOXczHR9iUVUUJxW8jMebbRKS5Q + 2jOB79OxyCpXMIQdRupzlHMx09WdN+lGMfqU65hOY + vR + 6jkRi4mVVStDzPGWH0Ocu5luip4kaGEVy338iM+j83H4UziS0XUC1cxxUKflXLuZbpu4wbC603G80bMPrZxMXfQIXTN1QxmhdrrETPnWqZrGIuKeMnlTq7P8dZpHD568XAR / y6sZhi7Yu2zWs6tfbo6MT30uG7iLL5vaVxhLcO4lQI / GArqi / ws1j4r5tzKdN3PWMJpGefygXUfI5gW + r7BCF5Sdz0scI0HVmmZAJzCQsLpSc5npwof / ZhHz1Ae3mcA24zXp55zZ5 + uNkwlnO5jlJJxhZUMZnkoF725JYb61HPu7NN1Q8i3on7KJaoWcf + YUwqsYlhIEzhCkQ9L3N6vBKrLpCeraY1cN / JzVT4yXHseZ1AINwv4N1U + LHCuZLruCDWuk1SOa4IqRrEihJ / Tm2QrtF + 3yDk3Ml2DeA25pnNhnhtJGvy24lX6ij29zYCs42vwETOXdKLMnyLXPMYqHtcqPuXrDUtuBteRfFuZj5g5FzJdp7IAqVZxfJ6bQJr8nsRC8X4L73AENcp8xMi5UOaNSLWD0Q6MKyzmerG3Q7lAnY8YOf2ZrgG8glTj8rzebb3dObi5nCV09xeOVugjJi6pvsyrkOphh8YVxjXaM7F5DeAshT5i4pLKy/wCZyPT37lcoY/83HrGCR3ClQp9xMQllZc5RhyFuYYqhT4KcfOYJfR4Er0V+ oiFS6ouM9kQDwmqZ3lcoY / muAlsEblMMEaljxg43RHEk4Wbwe2s + 8dSm4/muO3cLvIJ5xd4L1i/3yI43bZHI9MdvKvSR/ Pc1ByVF1I3TlfpwziXNHPYSLha4aqEm5mk0kcQbje3ibzCuSp9GOeSZg4bCfd12iLR3WxW6SMY91CjDT2b01k5VpfR4MMwpznTJVukeDt3KvURjNsj / B7bocmXAh0 + DHNJM4eNgKvgNCSaynqVPoJzs1gncjy8meNp9xuK07tP14miJH9to89XPT6Cc3u4W + AYzlDqwyinN9N1BhIt3mfRNE0 + JNzvcsbQ86mSfkp9GOT0ZrpORaJpan1IuE / yrAibT19T6sMgp3WfrrYcTXBty3q + pcuHlHtE4BqGqvVhjNOa6RokerH5yYb3B7T5kHLP5HwTIp + GqvVhjEsqLVO2DtUc222MjNvBfIHv7vRX6sMYpzXTdRzBVcNi222MkHtW4ByOUevDEJdUWuZAgutPbLbdxgi55wTOoZ9aH4Y4nWW2pxfBtch + GyPktvC + wHs / tT4McUmVZfar + 9tgWmS/jZFykjUYjlDswwinM9Ml2+vqNfttjJSTrLxVWeB/bds+ jHA6M129CK5 / kLbfxki5lQL3KSrV + jDC6cx09Sa41mhoY6TcMiQrdfdS68MIpzPTVUlwvaOhjZFym / lE4L + nWh9GOJ2ZrgMJrjUa2hgxJ7lP0FWxDwOczkxXF4LrPQ1tjJhbK / DfNcDxtPsVcDozXfsTXJs0tDFi7jOB / y4Bjqfdr4DTmOlK0obg + lRDGyPm1hNcHQMcT7tfAacx0yXbun2zhjZGzH0u8N9SsQ8DnMZMl2wz4a0a2hgxt0vgf78Ax9PuV8BpzHRJYiLkeX9Ug4 / wnHxgdfowwOnNdBUj7T6i9Kv1BVFDnMZMl + TzBdppaGPEnORb / B7FPgxwGjNd1UjUrtnjKWp3QE4ysNWKfRjgNGa6ivmE1eQjPNdZ4L9asQ8DnMZMVxpJEK9ds8dT1O6AnORJ31bFPgxwOr + yS / avOkBDGyPmDhL4 / 1yxDwOczkyX5ElP3wDHU9PugJzkbbX1in0Y4HSWKXmWfqiGNkbM9SS4PlXswwCnM9P1d4Krr4Y2Rsp1oJvA/7tqfRjhdGa6JO+DHqqhjZFyXxS4L/Qqom0fRjidmS7JwPbiIPttjJQbIHBfwwdqfRjhdGa63iO4Egyx38ZIuWMF7tfmefNCgw8jnM5M1yokMbwT7bcxUm6wwPvbin0Y4XRmumQhkSH22xghVylaleGtZo+ n3a + Q05npSoh2VDmGWtttjJA7ReAclqv1YYjTmemCPxNcFXk3WbPvQ86dKXAOb6j1YYjTmOkCWIpE5 + b5c / s + pFxr0d45nzb6earHhzFOY6YL0rwkyh0Mz7kFnQYfUm64KID5qlofxjiNma40VVTxJsHVJsc / pDp8SDnZ7uUvqfVhjNOY6cpwi5BoTLPHU9HuZrgDhJs9vaDUh0FOb6ZLtnT6GRym1IeEu5QKged / NNxL0ebDIKcx05XREjYRXAkmKPURnEsxXuAY5in1YZTTmOnKqIYFSPTvde / pa / MRnLuAHiLHTyn1YZTTmOmq1xwkasNlSn0E45JcL / K7hedV + jDMacx01esZtiDRtXRV6SMYdz5HiNz + nl0qfRjmdGa6MtrJXCTqzE9U + gjCVfATkVd4WKUP45zOTFe9piPTOPqo9NE8d5VomXz4iBdV + jDO6S7zBd5Fogp + otJHc1w3bhH5hIdordBHDJzOTFe9EvtsKx9Ew / mqQh / NcXfRXuSylkdU + oiB05np2svNEC5cBPfmWPXfvo9C3DfzvryTTwv5UKGPWDidma693HoeQ6YDuVehj / zcAfxG6BDuUegjJk5npiubuwtJXAbgHL6j0EduLsHvRHvmALzFYnU + YuN0ZrqyuTd5Gql + TX91PnJz1wtfdwGYpNBHbFyiwMeXljJPYBlSvc8JDQseafHRVKcynxZCZ39lCDXKfMTIac10ZXN / FD5AAOjNnLo3n / T4aKzDmS0eV / h5OY9r / k9YXWX2488F / tfKp99yqTIf2TqApRwi9rSCYWxV5SNmTmuma19upfh + LMAl3KXMx1515rkQ4woTy3tcc3 / CKiyTbvyVDsg1hYmqfGTUkQUMCuFmHmeq8mGBa / FfTpRJFbtFedJ6DWI / FivyAbA / Czk + hJedjCiw1LPO6xY5pzfT1Vi / YhVhNIFfqPppWcnLHBfKye2sUeTDErfvVwK1ZQIwhFdC / PQCeI7RObf4jN / HUTwjWhB + r1ZxdN7H1LqvW6Sc3kxXUy0L8RAzo9NYQi8FPkbyashxrWWcH9cM5ESZddytooU4s3Ukr3OWVR8V3MFjORf8CKLJLDFcnyNc / VcC5WU2cMcxXxSF3le / ZQLbrPjoy8xQP7QyWsGgPLuX2b4esXOaM125uDeYSHhdwp84IXYfCa5mRRHjup1v + 3Gt5xJpJ8rM4tLMD3WDq1613M9tbIzNxzH8OtQ91736Lr8zWJ9jXCLtRJn7cF14XZiAaqzN3M5Udhv3cSA/ZlyI9wWyNTXP8hp6rkesXCLdwYUyG3EDWRL650u9/sZPmckeYz66cA3X0I7itISv5rw7oOt6xMgl0h1dKLMJN5LZdX9TjD5kMvfV/ QyLsr6DuZLxRQ8rfMjxfGqkf85ymYFVX2YO7lp + SRTawIPM2Gfp9WLqa8HpjGNEkV8DMtrMUFYa65 + jXCLd0YUyc3KTsxaAK1YrmcEMPiyivgSDGc1ovhBRRbs4fZ / 1X6Pvn5NcIt3BhTJzMgmmcwFRajUvsoRX2CSqrwsncjqnibNZhbSHUTlfW9d8PWLhEmmdGx8F4yp4lLOJWrWsZhV/YSWreCfPT56DOIReHEk/jhKuORisgjHMjKF/ DnIuZLoKcRU8wAhMaiMbqWIH26lmP1rRhk4cINqJQKpaLsq5SJML18M4l3KjzLxcK / bDrPZnf8NnaKx0znVg3Lgexjk3Ml35uO48ykBKUZO4juxL48b1iIHLPbDqyszJ9Wd2ZL / J9elxxrAjVF9KmnMl09WU + yrThEuouabXOJP14r6UOKd1n67muPN5rMTHFQazlD6OXI / YOHcyXdncddxT4Odi6agvS / iyA9cjRs6lTFeGa8EdXEz5aDtjeEHx9YiZyx5YxWU2cK34reH7rvq0m8t5UOn1iJ3bO7Cqy6zjOjCTL1N + SnM1U / L8nQvXLUJO8z5djbmuPFWW4woJfpVnFwQXrlukXOYTVn2ZtOMLzOVwylmTubbRn7hw3co003UwT + VYWaDcdC + XZz3 / cuG6lWmm6xD + EHIBilLTQ4yt65UL180A50KZhzLPj2udLmQaLXDjuhnhdO / TlaQdffkD3SlGSxnKlJxra8Wt1VzHSLYWdYwLmEbK9tj4TFc + rjfzinzBZTYXshNozWjGNjw3iltbeZIZvEYVtQzgGSqLOtojXEEtmq9bmWa6Knm2yEt7GzfV / UzJnLcH53A2xxR1TJm2s5AnmM / OLL / deTrkkpv1eoirFV + 3Ms10Hciz9CG8dnMZD+Q8bw / O4ky + Yvjl70 + Yx9MsYWcOv22ZWeQTu7u5Sul1K9NMV2eeoR / htZmRLCx43jYM41SGcXQkoey92sKrLOZ5lpMo4DfJXVxZ1HkmcmuB / qkYr + g5rZmuNswtakWqDxnOWwHP244TOIHjOJbeRXzD3cVK3uR1XuOtwDeeJjCpqO / Ul + XcplTReEXP5R9Ym2WmeDjEDoF79SeG83GI87bnMA7jECrpSSUHNvOVoYq / s461rOFvrOLdRsseBTvvSKbTKrTPGkY2CYOrGq / oOZ2ZrsmMJbyey7p1VFx97elKZzrSjta0phXb2UUt2 / mcTXzGxkj8nsqjdArtdQensDR0nx3kNGa6ruS / Ca / pXMxuFT6CcofzRBEPRj5jcMO65G74LYrTl + n6BtMIt / UGwC + 4oeFpu8J25+G6M6eIH5irGcxmFT5i4JoOrN0y + /Nc6EUq0vyAyUp8SLlOPMPgkL5hAcNJq/BhnGs8sHbL7MKL9CScariYh5T4CMO15Um + FtI7TGVBw / F2Fjxvq8DccjYo6Esjacp0tWBu6Be0q / k2TyjxEZZrySwDK4WF10gWquhLI8Tq6ffhbg49rjsY4fy4QjWjcy4BZ086 + tIIsnr6LG44V4ds63a + wQI1Porh9jAm62uNbenpS5ZSZg4r5nry65Bt3cbwrIV / bfsolqtlLGkuCtmLaLVTUV8aOB37dKW4L9Tm8qU2rgC1OR + 32pCuvtRxSbunr+Nu5IRQLd3JmSU2rhlOt6z2L6ng8g0KuVdBNd / iRR1tjJRrHaobcansM12tuSfUZ0otY5inpY0GOJ2y3hf7ma6bQ76kfQWz9bTRj2tcXNLu6TmWy0K17lZ + o6mNflzj4pJWT7 + b34S6RNOz9vRW0caIOY3S0JcqapNWT / +jUIsPvcw4bW2MlNuBPmnoSxW1kLR4 + r78METr3uNbDXtnqWljTJwtKeqLzQjiFFqKW7eNEazX18ZYOFtS1ZekmcMG4L7JaSGaN7Zhu2BVbYyBsyVlfUmaOWyzXMusV62D686GW1nK2micsyV1fUmaOWyz3PfoLW7eMq7X2kbDnC0p7EvSzGGb4Tpxk7h5mzmvLlyosI1GOVtS2Rc7 + 3TdGGL/1itYq7eNBjl7aqWxLzb26TqQ74mbN4sZNtpjnbMplX1JmjlsQe6H4lzsP7nCTnssc/alri8pM4ctwHXjcnHbLmejnfZY5YJoN29D1mJ2NQXpFvQVLYyksC8pM4ctwH1f/ L7nY8y11R6LXDB9xLGi875C / 8DHVtmXuPfp6sD4wA3LaCvX2GuP8nEFDL4J5jNdwGXi7NZEPlI/XvbGVfo+s0T6+pKMO9NVIY5yv83d6screk6q4OetCXrIArLav3gzXSPFG2xMoFb9eEXNSb/jS85bvCz3L97TXyFsznwWqh8v26mDeL+ EWO9LnJmuoxkqak6am2y3R / 24Ul7jGm+mS3r / dTZrbLdH / bjWlte4xpnpas15ovbUcof99ljiolBJjmucma5zhDe05rLGfnuscFFkukp0XCEV2 + kvEjUozS81tCcEl9rn6WHbuptUtWwrEAjal0tRrKIZ14qGx7jZ9W0hWeC1 / 2wfSfLdyy2iz6mYLvNBnCxq1gu8Hcl54+f + k1tETqNXVJ + uTxVdySR + UER9VjNdo4S3w / 8novO68LQqWpVKfZYzXaNFplaxWOkYlso4aK/Pcqarl3CHlPuVjmGpjIP2+qxnus4T3V/cziyVY1gq46C9PgWZLtm+ sXP4WOEYBuXkb0VFo7IY13gyXR0YIrL2oMIxDM7JV7OJQmUyrvFkuk6mQmBtbdYi8MZsG + fiVfD6WgQ9pKX6muXi2KdLtiTRzLyPJu2Poevj2s5CdRH3OY59uoaJ7D0Wh22jXLwqvfosZ7p600Ngbw3L47Ct / tWV4CqrcY0j0yW7A / t4PLYNctXEKZOZruKVcDHTdZLI4h8iO68tzsaC7 / FmuoKrwsVMl2TD440sjey82jhzijfTJZGDma5KUezwuSafANrH0K1xdbe + 2DJdskcGz0d2Xl2cSemuz7lMl+wn14vNHi / q + uLgTCrOTJdcDma6BgnsreX9yM6rh7MlDfXtdi3TlWCgwN7LkZ1XD2dLOurLf8ckdJ / N7tPVR / Qw8LXIzquFs6VSqS8HZ3afrqNENl5r9nhR12eWs6VSqc9CpksysDv4S2Tn1cDZUqnUl4dLmTlsnY4UGPkzeyI7r30umB7mWto2HG9bwfPm5qT3rU + qu + LJ0Of9Mf9RhOOi + 5wyc9g6SbY+Xh7heW1zQVXNTnYFPG9QrnB9n4uP15grZpkP5ZmuBH0EZlaoH8Po / 7FNqfYRtV/1ma5K0Uqnbym/LCYyXZp9qBxXs5muQ0WG1qm+ LOYyXVp9qBxXs5mu3gJDG9kUYRvtc0Gl3YeycTWb6eopsFRaKxUGlXYf6sbVbKZL8gn7XoTntc0F1x7VPhSOq9lMlyTLtU7pZTGb6TLwrD0mLqicynQdJDC2TuVlsZXp0uAjinF1LNPVTWDtHYWXxVamS4ePKO4zO5Xpakl7gbV1kZ1XKxdU2n1Yvs9sznZngTH4JLLz6uSCSruPpGjZKQP1mct0tRWYqmFDZOfVyAWVdh8KbtyZy3TtL7D1Wc5vfvYvix / X3FxQGagvZcy2ZGA7ZaUN9mrvSnuFl3 / QxUlu5mXL / hhGf5 / ZQKYrZcy25CdXK1FYsRRlfwwduc9sLtNlZ2lHN6VhDINyu + 36NZfp8gMbVBrG0Jn7zOYyXX5gg0nHGDrz09LcPl2S21rlK+1jqGxc8w1sFHbsbE7hlgw8ay/tcTWZ6bKz/YNb8pkuMZcyc1iIYE/ q0tcQpgBp9hT4KZPIGuum3HpuqPuvYNftZg4ueLzmz3tCSK8RzVXKzGHxAxtEhwpzb031Qd3ABr1u5whX44lKDmS6 / MDGp + DXze / TlZeTbTfvFV6S66a9PouZLulzZ69wMvkugJ36LGW6 / FeCeFRW42oy0 + UVh / w + XZZeRPMqRsGvm9 + nqwDnFY8k1y1eOZXp8opHcSdh7dQXQ6Zrj4XmlKPKalxNZrps7LlafvL7dEVzWCvt8cqWhuvh3D5dXrak43oYyHSljI3rncxpwiVo1cDtLPimkLvcaEZhWzrGtfj6cnApY5 + uy1gW6fFc4fpjWyU8riYzXeXO2VKp1Bd7pqu8OVsqlfosZLrKmbOlUqnPSqarfDlbKpX6CnIm9 + kqT87Wg + myGNemA6t9HPRzduLtZTKujZNX + sdBP / e / 1ABpqgvex23ZcLymXA/GI5OZTNcs3i3KByyNvs8pGe65ZrlXebXI4w0WDqyp1+rn8Ly+Ppvcp8tzxXBBZe7FT5V9MblPl+fCc8Fl7j3lnQr7YnSfLs+F5YLLZKZLX1+MZ7o8F46TKt5Ml9X+mcx0eS4c1xqZ4s10We6f/stXrlxQaf+ J50ymy3PFcMFVVuNqMtPlufBccMWZ6bLfFyuZLs81z0WhkhxXk / t0eS4st4Pgast5Of88X4ink + DY2vpiONPluTjuz3blEQEdVor6Ym6fLs + V23u2sXA + 0 + UKZ0vK + uIzXW5wtqSuLz7T5QJnSwr74jNd + jlbUtkXn + nSztlTK4198Zku3ZxNqeyLuX26POf2uKKzL + b26fJcsZx9KeyLz3Rp5exLZV98pksnp0E + 0 + U5h8bVZ7o8F5jTLav985kufZw00xWvLPdP / +UrV06nrPfFZ7p0cjplvy8 + 06WS0yn7fUn7TJdOTqM09KUq/n26PNc8J8l0xSUNfamiFpLqL5/n7EtRX1IKL0u5c1t4KSeXyPqJXEuhZYaj4TYq60um6LSRw3rOc2Y4n+ nynFOcz3R5zinOZ7o85xTnM12ec4rzmS7POcX5TJfnnOJ8pstzTnH / D / 12S0apfxMZAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA2LTE2VDA0OjI4OjQ0LTA0OjAwKO0dewAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNi0xNlQwNDoyODo0NC0wNDowMFmwpccAAAAASUVORK5CYII=",
          },
          {
            label: 'See Members',
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAM3SURBVGje7VlNSBRRHP8/tU1dd7PNwkwiUqFIb5pGlJZEardIsOwi5iU6SF+XDhVBRFFJdKlbH0hdgkBIO3kptSKiEgKJWAikQrKgxLD9dZB982b2zex7b2ZZof2f/sv+vuYx8z5mGBkVYtRGzdRI1RSmWfpAYzRKI2zeTE3POorTcKtZ9KAgk+YRXEP6OoH8zNgfUDBPVnPQ5kUY1LAHgEvIC86+HDMO+UkcQpEt4EG8dWAmEAnGvtIh/Bg1LsgqPLIhZ7DSv32pw357Gvw2GzqOQn/2DKO2ay9R4JRgSODc8xegS5C6CPXYVwXeHnP7kCBzXYtJuM2ZC8bPA1q5yGfdGQ4hzHN2vTvOO1s37/azBb0A7A91WGzTEfjCr8FgckUhZ78ysycu8NuIzzh/2h0V3HRpWLkAuQC5ALkASzkAI0oeNIpUdwIu9ct0BKZ4Z3LcCPEubhrAWsVWGAQo5d070wDPebfJIIC1d35tGuAl7zpIv1p598aATUSEMF/R/+rfhvjG2Qp7aTeR91xkgyZzjXU28MKlmwesvfBhzeztvBswvn4irBU25iENHsN3ztvoIwARJrlQtwaribPmfE5iaBfGIKrIyUOcc3r8+RMKhAB3FDl9AifsMwAROgS5Ywr4RgF/1Lc9Ech2Qj6VBt0kYOewLIAAtmcaAPo9kLttyNpA7ImIUG8TdlmabKdpoDMweyIi7BCkm1wwmwVMr5qu4o4IMWoRfrpNScuFPiG+xPJ37eW4DHtVuiBXOXD9qjOHu/l63IKzRjzwD1PQZ1Fmal6DB0itYa/FFWE8k3AGUKFrXodhqXmdAncXPkm4dxUXJRAaMCERGES1cnzCVryQaAxhizeRYSemJMSbbredp1otnki0xtEgXR+Rj7aUN8IAcAGr9c25ahXuSzQ/ogXMPmRHIKuTMNmOO0Osww2J9k/sTQIiGJcA+lDs35yHKMN5iUccFYQSfE35o0tn+6UcIorjqRnIMTw/sC9DH1wWQxSj1xnAqjk0226NTIUIoRPTsgD+Py6oh4glTRmSD2WCZXDoUwIwSix2S/kFxX8SwLoHsjYCY9kOcC7LAdhTupJF/zP/AOvS/D0NTmDBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA0LTA0VDExOjQ3OjQ1KzA4OjAwI6N5UAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNC0wNFQxMTo0Nzo0NSswODowMFL+wewAAAAASUVORK5CYII=",
          },
          {
            label: 'Add Task',
            icon: "data:image/png;base64,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",
          }
        ],
        buttonClicked(index, item) {
					//invite
          index === 0 && that.onShareAppMessage();
          //see members
          index === 1 && that.kindToggle();
          //create task
          index === 2 && that.createTask();

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