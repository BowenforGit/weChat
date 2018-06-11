import locales from './utils/locales'
import T from './utils/wxapp-i18n'

T.registerLocale(locales)
T.setLocale('en')
wx.T = T

var config = require('./config');
//app.js
App({
    // globalData: {
    //   userInfo: {}
    // },
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || [];
        // logs.unshift(Date.now());
        // wx.setStorageSync('logs', logs);
        console.info('loading app...');

        // wx.showLoading({
        //   title: 'Logging in...',
        //   mask: true
        // });
    },
    onShow: function() {
        this.checkLogin(function() {});
    },
    checkLogin: function(cb) {
        console.info('check login...');
        var skey = wx.getStorageSync('skey');
        console.log('skey is :' + skey);
        if (skey) {
            this.getUserInfo(cb);
        } else {
            this.login(cb);
        }
    },

    login: function(cb) {
        console.info('login...');
        var that = this;
        wx.login({
            success: function(res) {
                wx.request({
                    url: config.host + '/login',
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        var skey = res.data.skey;
                        console.info('already login, skey is', skey);
                        //如果获取不到skey，则重试
                        if (!skey) {
                            that.login(cb);
                            console.info('Wrong!');
                            return;
                        }
                        wx.setStorageSync('skey', skey);
                        that.getUserInfo(cb);
                    }
                });
            }
        });
    },

    // getUserInfo:function(cb){
    //   var that = this
    //   if(this.globalData.userInfo){
    //     typeof cb == "function" && cb(this.globalData.userInfo)
    //   }else{
    //     //调用登录接口
    //     wx.login({
    //       success: function () {
    //         wx.getUserInfo({
    //           success: function (res) {
    //             that.globalData.userInfo = res.userInfo
    //             typeof cb == "function" && cb(that.globalData.userInfo)
    //           }
    //         })
    //       }
    //     })
    //     wx.getSetting({
    //       success: res => {
    //         if (res.authSetting['scope.userInfo']) {
    //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //           wx.getUserInfo({
    //             success: res => {
    //               // 可以将 res 发送给后台解码出 unionId
    //               this.globalData.userInfo = res.userInfo
    //               console.log("userinfo is saved")
    //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //               // 所以此处加入 callback 以防止这种情况
    //               if (this.userInfoReadyCallback) {
    //                 this.userInfoReadyCallback(res)
    //               }
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }
    // },

    getUserInfo: function(cb) {
        var that = this;
        this.request({
            url: '/user',
            success: function(res) {
                // 未登录
                if (res.statusCode === 401) {
                    that.login(cb);
                } else {
                    // 未注册用户
                    if (res.statusCode === 400) {
                        console.log('Invoke registerUser')
                        that.registerUser(cb);
                    } else {
                        that.globalData.userInfo = res.data;
                        console.log(that.globalData.userInfo)
                        wx.hideLoading();
                        cb();
                    }
                }
            }
        });
    },

    registerUser: function(cb) {
        var that = this;
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo;
                console.log(userInfo)
                userInfo = {
                    name: userInfo.nickName,
                    avatar: userInfo.avatarUrl
                };
                that.request({
                    url: '/user',
                    method: 'post',
                    data: userInfo,
                    success: function(res) {
                        that.globalData.userInfo = userInfo;
                        cb();
                        wx.hideLoading();
                    }
                });
            },
            //授权失败，用默认值注册
            fail: function() {
                that.request({
                    url: '/user',
                    method: 'post',
                    data: that.globalData.userInfo,
                    success: function() {
                        cb();
                        wx.hideLoading();
                    }
                });
            }
        });
    },

    //全局历史记录写入
    writeHistory: function(todo, action, timestamp) {
        var history = wx.getStorageSync('history') || [];
        history.push({
            todo: todo ? {
                content: todo.content || '',
                tags: todo.tags || [],
                extra: todo.extra || ''
            } : null,
            action: action,
            timestamp: timestamp
        });
        wx.setStorageSync('history', history);
    },

    // seal the wx.request()
    request: function(obj) {
        var skey = wx.getStorageSync('skey');
        obj.url = config.host + obj.url;
        obj.header = {
            skey: skey,
            version: config.apiVersion
        };
        return wx.request(obj);
    },

    globalData: {
        userInfo: {},
        projects: [],
        tasks: []
    }
});