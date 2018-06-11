// components/document/document.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        files: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        chooseImage: function(e) {
            var that = this;
            wx.chooseImage({
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                        files: that.data.files.concat(res.tempFilePaths)
                    });
                    //上传图片至服务器
                    var tempFilePaths = res.tempFilePaths
                        /* 上传图片接口
                        wx.uploadFile({
                          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                          filePath: tempFilePaths[0],
                          name: 'file',
                          formData: {
                            'user': 'test'
                          },
                          success: function (res) {
                            var data = res.data
                            //do something
                          }
                        }) */

                }
            })
        },
        previewImage: function(e) {
            if (!this.data.showDeleteIcon) {
                var that = this
                var file_id = e.currentTarget.id
                var file_index = file_id.lastIndexOf('.')
                file_id = file_id.substring(file_index + 1)
                console.log(file_id)
                console.log(e.currentTarget)
                wx.getImageInfo({
                    src: e.currentTarget.id,
                    success: function(res) {
                        //The file is an Image 
                        console.log(res.type)
                        wx.previewImage({
                            current: e.currentTarget.id, // 当前显示图片的http链接
                            urls: that.data.files // 需要预览的图片http链接列表
                        })
                    },
                    fail: function() {
                        wx.openDocument({
                            filePath: e.currentTarget.id,
                            success: function(res) {
                                console.log("打开文件成功")
                            },
                            fail: function() {
                                console.log("不支持打开该文件")
                            }
                        })
                    }
                })
            } else {
                this.deleteFile(e)
            }
        },


        deleteFile: function(e) {
            console.log(e.currentTarget.id)
            this.data.files.splice(e.currentTarget.id, 1)
            this.setData({
                files: this.data.files
            })
        },

        showDelete: function(e) {
            this.setData({
                showDeleteIcon: true
            })
        },
        hideDelete: function() {
            this.setData({
                showDeleteIcon: false
            })
        }
    }
})