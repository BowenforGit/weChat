// pages/projectForm/projectForm.js
const util = require('../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Task_Name: "Task Name",
        Task_Type: "Task Type",
        Task_Description: "Task Description",
        des: "Some information...",
        Deadline: "Deadline",
        Time: "Time",
        Date: "Date",
        Detailed_Allocation: "Detailed_Allocation",
        Who_Takes_Charge: 'Who_Takes_Charge',
        toall: "Assign task to each person",
        task_term: 'I would not be a freerider.',
        Create: "Create",

        taskName: '',
        types: ["Task", "Meeting", "Activity", "Others"],
        typeIndex: 0,
        switchData: {
            id: 1,
            color: '#242492',
            isOn: false
        },

        projectID: 0,
        radioItems: [
            { name: 'Presentation', value: '0' },
            { name: 'Report/Paper', value: '1' },
            { name: 'Data Collection', value: '2' },
            { name: 'Readings', value: '3' },
            { name: 'Others', value: '4' }
        ],
        checkboxItems: [],
        date: "2016-01-01",
        time: "23:59",
        task_info: '',

        members: [],
        memberIndex: 0,

        isAgree: false,
        allotDetail: false,

        input: '',
        todos: [],
        logs: [],
        leftCount: 0,

        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    save: function() {
        var key2 = this.data.projectID + '-logs';
        wx.setStorageSync(key2, this.data.logs);
    },
    load: function() {
        var key2 = this.data.projectID + '-logs';
        var logs = wx.getStorageSync(key2);
        if (logs) {
            this.setData({ logs: logs });
        }
    },
    onLoad: function(options) {
        this.load();
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


    addTodoHandle: function(e) {
        if (!this.data.input || !this.data.input.trim()) return;
        var todos = this.data.todos;
        todos.push({ name: this.data.members[this.data.memberIndex].name, task: this.data.input, completed: false });
        this.setData({
            input: '',
            todos: todos,
            leftCount: this.data.leftCount + 1,
        });
    },

    toggleTodoHandle: function(e) {
        var index = e.currentTarget.dataset.index;
        var todos = this.data.todos;
        todos[index].completed = !todos[index].completed;
        this.setData({
            todos: todos,
            leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
        });
    },

    removeTodoHandle: function(e) {
        var index = e.currentTarget.dataset.index;
        var todos = this.data.todos;
        var remove = todos.splice(index, 1)[0];
        this.setData({
            todos: todos,
            leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
        });
    },

    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
            radioItems: radioItems
        });
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
        console.info("bind success");
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
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    //Customized swtich data 
    tapSwitch: function(event) {
        this.data.switchData.isOn = !this.data.switchData.isOn
        this.setData({
            switchData: this.data.switchData
        });
    },
    openToast: function() {
        var members = [];
        console.info('memberIndex:', this.data.memberIndex);
        console.info('members:', this.data.members);
        for (var item in this.data.memberIndex) {
            members.push(this.data.members[item].open_id);
        }

        console.info("Members:", members);
        var type = this.data.radioItems.filter(type => type.checked == true);
        console.info("Type:", type);
        var deadline = this.data.date.replace("-", "").replace("-", "") + this.data.time.replace(":", "") + "00";
        var todos = this.data.todos.map(function(todo) {
            if (todo !== undefined) return todo.task;
        });
        var format_request = {
            project_id: this.data.projectID,
            name: this.data.taskName,
            member_id1: members[0] || '',
            member_id2: members[1] || '',
            member_id3: members[2] || '',
            subtask1: todos[0] || '',
            subtask2: todos[1] || '',
            subtask3: todos[2] || '',
            info: this.data.input,
            task_type: this.data.types[typeIndex],
            importance: 1,
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
                format_task.taskStartDate = task.start_date;
                format_task.taskEndDate = task.deadline.substring(0, 4) + '-' + task.deadline.substring(4, 6) + '-' + task.deadline.substring(6, 8);
                format_task.taskMembers = members;
                format_task.taskInfo = task.info;
                console.info("format", format_task);
                app.globalData.new_task = format_task;
                wx.navigateBack();
            }
        });

    },

    bindGetUserInfo: function(e) {
        this.setData({
            userInfo: e.detail.userInfo
        });
        wx.showToast({
            title: 'Success',
            icon: 'success',
            duration: 3000
        });
        //get the instance of project page 
        var arr = getCurrentPages();
        var theProject = arr[arr.length - 2];
        var logs = theProject.data.logs;
        logs.push({ timestamp: util.formatTime(new Date()), action: 'Add New Task', actionInfo: this.data.taskName, userInfo: this.data.userInfo });
        theProject.setData({
            'project.logs': logs
        });
        theProject.save();
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
        })
    }
});