// components/testServer/testServer.js
var app = getApp();
var config = require('../../config.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        getTask: function() {
            wx.request({
                url: config.host + '/task', //仅为示例，并非真实的接口地址
                data: {
                    x: '',
                    y: ''
                },
                method: 'post',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    console.log(res.data)
                }
            })
        },
        logout: function() {
            log.methods.addLog(1);
        },
        getOpenID: function() {
            var that = app

            wx.login({

                success: function(res) {
                    wx.request({
                        url: config.host + '/login',
                        data: {
                            code: res.code
                        },
                        success: function(res) {

                            var skey = res.data.skey;
                            app.globalData.skey = skey
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
            })

        }
    }
})