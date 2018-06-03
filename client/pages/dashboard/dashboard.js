// pages/dashboard/dashboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      user:{
        projects:[
          {
            proID: 0,
            proName: 'Project 1',
            proType: 'Course',
            proInfo: 'This is the introduction of this project',
            proStartDate: '2016-01-01',
            proEndDate: '2017-01-01',
            proMembers:[
              {name: 'Alice'},
              {name: 'Bob'},
              {name: 'Cindy'},
              {name: 'David'}
            ]
          },
          {
            proID: 1,
            proName: 'Project 2',
            proType: 'Intern',
            proInfo: 'This is the introduction of this project',
            proStartDate: '2016-03-01',
            proEndDate: '2017-05-01',
            proMembers: [
              { name: 'Tom' },
              { name: 'Peter' },
              { name: 'Tony' },
              { name: 'Clement' }
            ]
          },
        ]
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  createProject: function () {
    wx.navigateTo({
      url: '../newProject/newProject'
    })
  },
})