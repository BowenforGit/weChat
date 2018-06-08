// components/authorize/authorize.js
const app = getApp();
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
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  attached: function()
  {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用userInfo 
              console.log('Authorize!')
            }
          })
        }
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
      console.log('Invoke bindGetUserInfo')
      app.globalData.userInfo = e.detail.userInfo
    }
  }
})
