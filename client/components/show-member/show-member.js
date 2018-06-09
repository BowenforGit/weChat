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
        name: 'Members',
        open: false,
        members: []
      }
  },
  methods: {
    getMembers: function(newVal)
    {
      this.setData({
        'list.members': newVal
      })
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
