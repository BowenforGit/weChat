// pages/projectForm/projectForm.js
const Toptips = require('../../components/toptips/index');
var app = getApp();
var date = new Date();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        types: ["Course", "Intern", "Work", "Others"],
        typeIndex: 0,
        list: {
            id: 'form',
            name: '描述',
            open: false,
            members: []
        },
        input: '',
        date: "2016-01-01",
        time: "24:00",
        switchData: {
            id: 1,
            color: '#242492',
            isOn: false
        },

        Project_Name: "Project Name",
        Project_Type: "Project Type",
        Project_Description: "Project Description",
        Period: "Period",
        Start_Date: "Start Date",
        End_Date: "End Date",
        des: "Some information of this project",
        Create: "Create",
        term: "I would be responsible for the project.",
        project: {
            proName: '',
            proType: 'Course',
            proInfo: '',
            proStartDate: '2016-01-01',
            proEndDate: '2016-02-01',
            proMembers: [],
        },

        isAgree: false
    },

  onLoad: function() {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month <= 9) { month = '0' + month; }
    if (day <= 9) { day = '0' + day; }
    //console.log(year + '-' + month + '-' + day)
    this.setData({
      "project.proStartDate": year + '-' + month + '-' + day,
      "project.proEndDate": year + '-' + month + '-' + day
    })
  },

    onShow: function() {
        this.setLang();
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
    bindTypeChange: function(e) {
        console.log('picker type 发生选择改变，携带值为', e.detail.value, '实际值为' + this.data.types[e.detail.value]);
        this.setData({
            typeIndex: e.detail.value,
            'project.proType': this.data.types[e.detail.value]
        })
    },
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    openToast: function() {
        // wx.showToast({
        //   title: 'Success',
        //   icon: 'success',
        //   duration: 3000
        // });
        

        if(this.data.project.proName=='')
        {
          console.info('no proname yet!')
          Toptips({
            duration: 1000,
            content: 'Please input project name!'
          })
          return;
        }
        if(this.data.project.proEndDate<this.data.project.proStartDate)
        {
          console.info('end < start, are u kidding?')
          Toptips({
            duration: 1000,
            content: 'End date is later than start date!'
          })
          return;
        }
        // send the request to the server
        var format_start = this.data.project.proStartDate;
        var format_end = this.data.project.proEndDate;

        var project_detail = {
            name: this.data.project.proName,
            info: this.data.project.proInfo || '',
            start_date: format_start || '',
            end_date: format_end || '',
            project_type: this.data.project.proType
        };

        console.info(project_detail);
        app.request({
            url: '/project',
            method: 'POST',
            data: project_detail,
            success: function(res) {
              wx.showLoading({
                title: '正在创建项目……',
                mask: true
              });
                console.info(res.data);
                wx.hideLoading();
                app.writeHistory(project_detail, 'create', +new Date());
                project_detail.proID = res.data[0];
                project_detail.members = [app.globalData.userInfo.open_id];
                console.log(project_detail);
                app.globalData.projects.push(project_detail);
                wx.showToast({
                    title: 'Success',
                    icon: 'success',
                    duration: 1500
                });
                wx.navigateBack();
            }
        });
    },
    setLang() {
        const _ = wx.T._
        this.setData({
            Project_Name: _('Project_Name'),
            Project_Type: _('Project_Type'),
            Project_Description: _('Project_Description'),
            Period: _('Period'),
            Start_Date: _('Start_Date'),
            End_Date: _('End_Date'),
            des: _('des'),
            Create: _('Create'),
            term: _('term'),
            "radioItems[0].name": _('Course'),
            "radioItems[1].name": _('Intern'),
            "radioItems[2].name": _('Work'),
            "radioItems[3].name": _('Others'),
        })
    }
});