function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

module.exports = {
    formatTime: formatTime
};



function getData(url) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: {},
            header: {
                //'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log("success");
                resolve(res);
            },
            fail: function(res) {
                reject(res);
                console.log("failed");
            }
        });
    });
}


var db = require('../data/data_index.js');

function getData2() {
    return db.index;
}

function getProjectsFake() {
    return db.projects;
}

function getAProjectFake() {
    return db.project;
}

module.exports.getData = getData;
module.exports.getData2 = getData2;
module.exports.getProjectsFake = getProjectsFake;
module.exports.getAProjectFake = getAProjectFake;