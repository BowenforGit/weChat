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
        },
        file_urls: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        files: [],
        urls: [],
        showDeleteIcon: false,
        showDeleteIcon1: false,
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
            var new_files = [];
            var that = this;
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
                        new_files.push(res.data);
                    },
                    fail: function(res){
                        console.log('failed!');
                    }
                });
            }
            this.setData({ 
                uploading: false,
                files: [],
                showUpload: false,
            }); 
        },

        previewImage: function(e) {
            console.log("1", e.currentTarget.id);
            console.log("2", this.data.showDeleteIcon1);
            var that = this;
            if (!this.data.showDeleteIcon && ! this.data.showDeleteIcon1) {
                // var that = this;
                var file_id = e.currentTarget.id;
                var file_index = file_id.lastIndexOf('.');
                file_id = file_id.substring(file_index + 1);
                console.log("3", file_id);
                console.log("4", e.currentTarget);

                var urls = that.properties.file_urls.map(function(url){
                    return url.url;
                });
                console.log(urls);
                wx.previewImage({
                    current: urls[e.currentTarget.id], // 当前显示图片的http链接
                    urls: urls,
                    success: function(){
                        console.log("Yeah");
                    } // 需要预览的图片http链接列表
                });
            } else if(this.data.files.length !== 0){
                this.deleteFile(e);
            } else if(this.data.showDeleteIcon1){
                app.request({
                    url: "/project/image/"+this.properties.file_urls[e.currentTarget.id].image_id,
                    method: 'DELETE',
                    success: function(res) {
                        that.data.file_urls.splice(e.currentTarget.id, 1);
                        that.setData({
                            file_urls: that.data.file_urls
                        });
                    }
                });
            }
        },

        // getImage: function(e) {
        //     console.log('id is ' + this.properties.proid)
        //     app.request({
        //         url: '/project/document/' + this.properties.proid,
        //         method: 'GET',
        //         success: function(res) {
        //             console.log(res.data);
        //         }
        //     })
        // },
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
        },

        showDelete1: function(e) {
            this.setData({
                showDeleteIcon1: true
            });
        },
        hideDelete1: function() {
            this.setData({
                showDeleteIcon1: false
            });
        }
    }
});