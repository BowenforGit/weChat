// pages/projectForm/projectForm.js
var app = getApp();
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
            proType: '',
            proInfo: '',
            proStartDate: '2016-01-01',
            proEndDate: '2016-02-01',
            proMembers: [],
        },

        isAgree: false
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
            'this.data.project.proType': this.data.types[e.detail.value]
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
            project_type: this.data.project.proType
        };

        console.info(project_detail);
        app.request({
            url: '/project',
            method: 'POST',
            data: project_detail,
            success: function(res) {
                console.info(res.data);
                wx.hideLoading();
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