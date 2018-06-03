// pages/projectForm/projectForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: 'Course', value: '0' },
      { name: 'Intern', value: '1' },
      { name: 'Work', value: '2' },
      { name: 'Others', value: '3' }
    ],
    date: "2018-01-01",
    date2: "2017-05-04",
    isAgree: false
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  bindDateChange1: function (e) {
    this.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  openToast: function () {
    wx.showToast({
      title: 'Success',
      icon: 'success',
      duration: 3000
    });
  },
})