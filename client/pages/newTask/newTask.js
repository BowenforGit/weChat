import { $wuxToptips } from '../../components/wux'
import WxValidate from '../../assets/plugins/WxValidate'

// pages/projectForm/projectForm.js
const Toptips = require('../../components/toptips/index');
const util = require('../../utils/util.js');
var app = getApp();
var date = new Date();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Task_Name: "Name",
        Task_Type: "Type",
        Task_Description: "Description",
        des: "Some information...",
        Deadline: "Deadline",
        Time: "Time",
        Date: "Date",
        Detailed_Allocation: "Detailed_Allocation",
        Who_Takes_Charge: 'Who_Takes_Charge',
        toall: "Assign task to each person",
        task_term: 'I would not be a freerider.',
        Create: "Create",
        Enable_Subtask: "Subtasks",
        Task_Level: "Importance",
        Choose_Member: "Responsible",
        taskName: '',
        types: ["Task", "Meeting", "Activity", "Others"],
        typeIndex: 0,
        levels: ["Low", "Medium", "High"],
        levelIndex: 0,
        switchData: {
            id: 1,
            color: '#242492',
            isOn: false
        },

        projectID: 0,

        checkboxItems: [],
        date: "2016-01-01",
        time: "23:59",
        task_info: '',

        members: [],
        memberIndex: 0,

        input: '',
        todos: ['', '', ''],
        logs: [],
        leftCount: 0,

        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },


    onLoad: function(options) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (month <= 9) { month = '0' + month; }
        if (day <= 9) { day = '0' + day; }
        //console.log(year + '-' + month + '-' + day)
        this.setData({
            date: year + '-' + month + '-' + day
        })
        this.setData({
            projectID: options.id
        });
        //console.log('project is id' + this.data.projectID)
        var arr = getCurrentPages();
        var theProject = arr[arr.length - 2];
        console.info(theProject.data);
        if (theProject.route == 'pages/project/project') {
            console.log('copy memebr ready');
            var checkbox = [];
            console.log(theProject.data.project.proMembers);
            var members = theProject.data.project.proMembers;
            for (var index = 0; index < members.length; index++) {
                checkbox.push({ name: members[index].name, value: index });
            }
            this.setData({
                checkboxItems: checkbox,
                members: theProject.data.project.proMembers
            });
            console.log(this.data.checkboxItems);
        }
    },

    onShow: function() {
        this.setLang();
    },

    taskChangeHandle: function(e) {
        this.setData({ input: e.detail.value });
    },

    addSubTask: function(e) {
        if (e.detail.value) {
            var index = e.currentTarget.dataset.id;
            var todos = this.data.todos;
            todos[index] = e.detail.value;
            this.setData({
                todos: todos
            })
        }
    },

    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData({
            memberIndex: e.detail.value
        });
        var checkboxItems = this.data.checkboxItems,
            values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    },
    bindNameChange: function(e) {
        this.setData({
            taskName: e.detail.value
        });
    },
    bindInfoChange: function(e) {
        this.setData({
            input: e.detail.value
        });
    },
    bindTypeChange: function(e) {
        console.log('picker type 发生选择改变，携带值为', e.detail.value, '实际值为' + this.data.types[e.detail.value]);
        this.setData({
            typeIndex: e.detail.value,
        })
    },
    bindLevelChange: function(e) {
        console.log('picker level 发生选择改变，携带值为', e.detail.value, '实际值为' + this.data.levels[e.detail.value]);
        this.setData({
            levelIndex: e.detail.value,
        })
    },


    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        });
    },
    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        });
    },
    bindMemberChange: function(e) {
        console.log('picker member 发生选择改变，携带值为', e.detail.value);
        console.log('jajaja');
        this.setData({
            memberIndex: e.detail.value
        });
        console.info(this.data.memberIndex);
    },
    bindSwitchChange: function(e) {
        console.log(e.detail.value);
        this.setData({
            allotDetail: e.detail.value
        });
    },

    //Customized swtich data 
    tapSwitch: function(event) {
        this.data.switchData.isOn = !this.data.switchData.isOn
        this.setData({
            switchData: this.data.switchData
        });
    },
    openToast: function(e) {
        console.info('e is', e)
        var members = [];
        console.info('memberIndex:', this.data.memberIndex);
        console.info('members:', this.data.members);

        for (var item in this.data.memberIndex) {
            members.push(this.data.members[item].open_id);
        }
        // console.info('members for this task:', members.length);

        console.info("Members:", members);

        if (this.data.taskName == '') {
            console.info('no task name yet');
            Toptips({
                duration: 1000,
                content: 'Please input task name!'
            })
            return;
        }
        if (members.length == 0) {
            console.info('no members for this task');
            Toptips({
                duration: 1000,
                content: 'No members for this task'
            })
            return;
        }
        var type = this.data.radioItems.filter(type => type.checked == true);
        console.info("Type:", type);
        var deadline = this.data.date.replace("-", "").replace("-", "") + this.data.time.replace(":", "") + "00";
        var format_request = {
            project_id: this.data.projectID,
            name: this.data.taskName,
            member_id1: members[0] || '',
            member_id2: members[1] || '',
            member_id3: members[2] || '',
            subtask1: this.data.todos[0] || '',
            subtask2: this.data.todos[1] || '',
            subtask3: this.data.todos[2] || '',
            info: this.data.input,
            task_type: this.data.types[this.data.typeIndex],
            importance: this.data.levelIndex,
            deadline: deadline
        };
        console.info("format:", format_request);
        app.request({
            url: '/task',
            method: 'post',
            data: format_request,
            success: function(res) {
                var format_task = {};
                var task = res.data;
                var members = [];
                members.push(task.member_id1, task.member_id2, task.member_id3);
                for (var i = 0; i < members.length; i++) {
                    if (members[i] === '') {
                        members.splice(i, 1);
                        i--;
                    }
                }
                format_task.taskID = task.task_id;
                format_task.taskName = task.name;
                format_task.taskType = task.task_type;
                format_task.taskTime = task.deadline.substring(8, 10) + ':' + task.deadline.substring(10, 12);
                format_task.taskEndDate = task.deadline.substring(0, 4) + '-' + task.deadline.substring(4, 6) + '-' + task.deadline.substring(6, 8);
                format_task.taskMembers = members;
                format_task.taskInfo = task.info;
                format_task.taskLevel = task.importance;
                console.info("format", format_task);
                app.globalData.new_task = format_task;
                wx.navigateBack();
            }
        });

    },


    setLang() {
        const _ = wx.T._
        this.setData({
            Task_Name: _('Task_Name'),
            Task_Type: _('Task_Type'),
            Task_Description: _('Task_Description'),
            Deadline: _('Deadline'),
            "radioItems[0].name": _('Presentation'),
            "radioItems[1].name": _('Report/Paper'),
            "radioItems[2].name": _('Data Collection'),
            "radioItems[3].name": _('Readings'),
            "radioItems[4].name": _('Others'),
            Detailed_Allocation: _('Detailed_Allocation'),
            Who_Takes_Charge: _('Who_Takes_Charge'),
            toall: _('toall'),
            task_term: _('task_term'),
            Create: _('Create'),
            des: _('des'),
            Date: _('Date'),
            Time: _('Time'),
            Enable_Subtasks: _('Enable_Subtasks'),
        })
    }
});