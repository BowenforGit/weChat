import locales from './utils/locales'
import T from './utils/wxapp-i18n'

T.registerLocale(locales)
T.setLocale('en')
wx.T = T

var config = require('./config');
//app.js

App({

    onLaunch: function() {

        console.info('loading app...');
        //  wx.showLoading({
        //    title: 'Logging in...',
        //    mask: true
        //  });
    },

    onShow: function() {
        this.checkLogin(function() {});
    },

    checkLogin: function(cb) {
        console.info('check login...');
        var skey = wx.getStorageSync('skey');
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
                        that.registerUser(cb);
                    } else {
                        that.globalData.userInfo = res.data;
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
        tasks: [],
        new_task: {}
    }
});