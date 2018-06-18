// pages/project/task/task.js
import event from '../../utils/event.js'
const app = getApp();

Page({
    data: {
        Welcome: "welcome to DeadlineFighter.",
        may: "May the force be with you!",
        Lang:"Language",
        setting:"Setting",
        More: "More",
        github: "View in github",
        langCode: ['cn', 'en'],
        lang: ['简体中文', 'English'],
        langIndex: 1,
        userInfo:{}
    },
    onLoad: function(options) {
        this.setLang();
        this.setData({
            userInfo:app.globalData.userInfo
        })

    },
    onShow: function(){
        this.setLang();
    },
    langChange(e) {
        var index = e.detail.value
        this.setData({
          langIndex: index,
        })
    
        wx.T.setLocale(this.data.langCode[index])
        this.setLang()
        event.emit('LangChanged', this.data.langCode[index])
      },
    showThanks() {
        console.log("enter show thanks")
        wx.showModal({
            title: 'Thank you for your support!', 
            content: 'We are at: https://github.com/BowenforGit/weChat',
            showCancel: !1, 
        })
    },
    setLang() {
        const _ = wx.T._
        this.setData({
          Welcome: _('Welcome'),
          may: _('may'),
           Lang: _('Lang'),
           setting: _('setting'),
           More: _('More'),
           github: _('github'),
        })
      }
})