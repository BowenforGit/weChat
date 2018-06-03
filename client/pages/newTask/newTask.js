// pages/projectForm/projectForm.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskName:'',
    projectID: 0,
    radioItems: [
      { name: 'Presentation', value: '0' },
      { name: 'Report/Paper', value: '1' },
      { name: 'Data Collection', value: '2' },
      { name: 'Readings', value: '3' },
      { name: 'Others', value: '4'}
    ],
    checkboxItems: [
      { name: 'Alice', value: '0', checked: true },
      { name: 'Bob', value: '1' },
      { name: 'Cindy', value: '3'},
      { name: 'David', value: '4'}
    ],
    date: "2016-01-01",
    time: "23:59",

    members: ["Alice", "Bob", "Cindy", "David"],
    memberIndex: 0,

    isAgree: false,
    allotDetail: false,

    input: '',
    todos: [],
    logs:[],
    leftCount: 0,

    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  save: function () {
    var key2 = this.data.projectID + '-logs'
    wx.setStorageSync(key2, this.data.logs)
  },
  load: function () {
    var key2 = this.data.projectID + '-logs'
    var logs = wx.getStorageSync(key2)
    if (logs) {
      this.setData({ logs: logs })
    }
  },
  onLoad: function (options) {
    this.load()
    this.setData({
      projectID: options.id
    })
    //console.log('project is id' + this.data.projectID)
  },

  taskChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },


  addTodoHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    var todos = this.data.todos
    todos.push({ name: this.data.members[this.data.memberIndex], task: this.data.input, completed: false })
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
    })
  },

  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
    })
  },

  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
    })
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
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
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
  bindNameChange: function (e){
    this.setData({
      taskName: e.detail.value 
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindMemberChange: function (e) {
    console.log('picker member 发生选择改变，携带值为', e.detail.value);
    this.setData({
      memberIndex: e.detail.value
    })
  },
  bindSwitchChange:function(e)
  {
    console.log(e.detail.value)
    this.setData({
      allotDetail: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  openToast: function () {
   
  },
  bindGetUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo
    })
    wx.showToast({
      title: 'Success',
      icon: 'success',
      duration: 3000
    });
    var logs = this.data.logs
    logs.push({ timestamp: util.formatTime(new Date()), action: 'Add New Task', actionInfo: this.data.taskName, userInfo: this.data.userInfo })
    this.setData({
      logs: logs
    })
    this.save()
  }
})