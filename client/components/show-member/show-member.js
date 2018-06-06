// components/show-member/show-member.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      members:{
        type: Array,
        value: [],
        observer: 'getMembers'
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo:{},
    list:
      {
        id: 'form',
        name: 'Group Members',
        open: false,
        members: []
      }
  },
  attached: function () { 
    /*var pages = getCurrentPages();
    console.log(pages.data.userInfo)
    this.setData({
      userInfo: pages.data.userInfo
    })*/
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getMembers: function(newVal)
    {
      console.log('newVal')
      console.log(newVal)

      this.setData({
        'list.members': newVal
      })

      console.log('this.data.list')
      console.log(this.data.list.members)
    },
    kindToggle: function (e) {
      var id = e.currentTarget.id, list = this.data.list;
      
        if (list.id == id) {
          list.open = !list.open
        } else {
          list.open = false
        }
      
      this.setData({
        list: list
      });
    }
  }
})
