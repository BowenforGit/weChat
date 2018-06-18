// components/document/document.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        proid: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        files: [],
        file_urls: [],
        showDeleteIcon: false,
        showUpload: false,
        uploading: true,
        Shared_Files: "Shared files"
    },
    attached: function() {
        const _ = wx.T._;
        this.setData({
            Shared_Files: _('Shared_Files')
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        chooseImage: function(e) {
            var that = this;
            that.setData({ uploading: true});
            wx.chooseImage({
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    if(res.tempFilePaths.length !== 0) that.setData({ showUpload: true} );
                    that.setData({
                        files: that.data.files.concat(res.tempFilePaths),
                    });
                    //上传图片至服务器
                }
            });
        },

        uploadImage: function(e) {
            var tempFilePaths = this.data.files;
            var proid = this.properties.proid;
            for(var i = 0; i < this.data.files.length; i++) {
                wx.uploadFile({
                    header: {
                        skey: wx.getStorageSync('skey')
                    },
                    url: 'https://5xjlqtmz.qcloud.la/user/image/'+proid,
                    filePath: tempFilePaths[i],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: function(res) {
                        console.log('success! ');
                    },
                    fail: function(re){
                        console.log('failed!');
                    }
                });
            } 
            this.setData({ uploading: false }); 
            this.setData({ files: []});
        },

        previewImage: function(e) {
            if (!this.data.showDeleteIcon) {
                var that = this;
                var file_id = e.currentTarget.id;
                var file_index = file_id.lastIndexOf('.');
                file_id = file_id.substring(file_index + 1);
                console.log(file_id);
                console.log(e.currentTarget);
                wx.getImageInfo({
                    src: e.currentTarget.id,
                    success: function(res) {
                        //The file is an Image 
                        console.log(res.type);
                        wx.previewImage({
                            current: e.currentTarget.id, // 当前显示图片的http链接
                            urls: that.data.files // 需要预览的图片http链接列表
                        });
                    },
                    fail: function() {
                        wx.openDocument({
                            filePath: e.currentTarget.id,
                            success: function(res) {
                                console.log("打开文件成功");
                            },
                            fail: function() {
                                console.log("不支持打开该文件");
                            }
                        });
                    }
                });
            } else {
                this.deleteFile(e);
            }
        },

        getImage: function(e) {
            console.log('id is ' + this.properties.proid);
            app.request({
                url: '/project/document/' + this.properties.proid,
                method: 'GET',
                success: function(res) {
                    console.log(res.data);
                }
            });
        },
        deleteFile: function(e) {
            console.log(e.currentTarget.id);
            this.data.files.splice(e.currentTarget.id, 1);
            this.setData({
                files: this.data.files,
            });
            if(this.data.files.length === 0) {
                this.setData({
                    showUpload: false
                });
            }
        },

        showDelete: function(e) {
            this.setData({
                showDeleteIcon: true
            });
        },
        hideDelete: function() {
            this.setData({
                showDeleteIcon: false
            });
        }
    }
});