// pages/projectForm/projectForm.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        project: {
            proName: '',
            proType: '',
            proInfo: '',
            proStartDate: '',
            proEndDate: '',
            proMembers: [],
        },
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
    onShareAppMessage: function() {

    },
    bindNameChange: function(e) {
        this.setData({
            'project.proName': e.detail.value
        });
    },
    bindInfoChange: function(e) {
        this.setData({
            'project.proInfo': e.detail.value
        });
        
    },
    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        var index;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
            if (radioItems[i].checked)
                index = i;
        }
        this.setData({
            radioItems: radioItems,
            'project.proType': radioItems[index]
        });
    },
    bindDateChange1: function(e) {
        this.setData({
            'project.proStartDate': e.detail.value
        });
    },
    bindDateChange2: function(e) {
        this.setData({
            'project.proEndDate': e.detail.value
        });
    },
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    openToast: function () {
      // wx.showToast({
      //   title: 'Success',
      //   icon: 'success',
      //   duration: 3000
      // });
      wx.showLoading({
        title: '正在创建项目……',
        mask: true
      });
      // send the request to the server
      var format_start = this.data.project.proStartDate;
      var format_end = this.data.project.proEndDate;

      var project_detail = {
        name: this.data.project.proName,
        info: this.data.project.proInfo || '',
        start_date: format_start || '',
        end_date: format_end || '',
        project_type: this.data.project.proType.name
      };

      console.info(project_detail);
      app.request({
        url: '/project',
        method: 'POST',
        data: project_detail,
        success: function (res) {
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          app.writeHistory(project_detail, 'create', +new Date());
          var project = res.data;
          var format = {};
          format.proID = project.project_id;
          format.proInfo = project.info;
          format.proName = project.name;
          format.proType = project.project_type;
          format.proStartDate = project.start_date;
          format.proEndDate = project.end_date;
          format.members = [project.leader];
          app.globalData.projects.push(format);
          wx.showToast({
            title: 'Success',
            icon: 'success',
            duration: 1500
          });
          wx.navigateBack();
        }
      });
    },
});