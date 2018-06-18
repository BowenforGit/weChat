module.exports = {

}

//sample data for getUserInfo API

//sample data for a project 
var project = {
    logs: [],
    proID: 1,
    proName: "CSCI 3100",
    proDes: "This is project description",
    proMembers: [{ name: 'Alice' },
        { name: 'Bob' },
        { name: 'Cindy' },
        { name: 'David' }
    ],
    tasks: [{
            taskID: 1,
            taskName: 'Initial Code',
            taskType: 'Readings',
            taskInfo: 'Somethins',
            taskDate: '2016-01-01',
            taskTime: '23:59',
            allotDetail: false,
            taskMembers: [
                { name: 'Alice', status: true },
                { name: 'Bob', status: false },
                { name: 'Cindy', status: true }
            ]
        },
        {
            taskID: 2,
            taskName: 'Project Demo',
            taskType: 'Meeting',
            taskInfo: 'Something about Task',
            taskDate: '2016-01-02',
            taskTime: '09:00',
            allotDetail: false,
            taskMembers: [
                { name: 'Alice', status: false },
            ]
        },
        {
            taskID: 3,
            taskName: 'Project Report',
            taskType: 'Submit file',
            taskInfo: 'Something about Task',
            taskDate: '2016-01-03',
            taskTime: '23:59',
            allotDetail: true,
            taskMembers: [
                { name: 'Alice', task: 'Introduction', status: true },
                { name: 'Bob', task: 'Summary', status: false }
            ]
        }
    ],
}


//sample data for projects list 
var projects = [{
        proID: 0,
        proName: 'Project 1',
        proType: 'Course',
        proInfo: 'This is the introduction of this project',
        proStartDate: '2016-01-01',
        proEndDate: '2017-01-01',
        proMembers: [
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Cindy' },
            { name: 'David' }
        ]
    },
    {
        proID: 1,
        proName: 'Project 2',
        proType: 'Intern',
        proInfo: 'This is the introduction of this project',
        proStartDate: '2016-03-01',
        proEndDate: '2017-05-01',
        proMembers: [
            { name: 'Tom' },
            { name: 'Peter' },
            { name: 'Tony' },
            { name: 'Clement' }
        ]
    }
];







var index = {
    "id": 1,
    "data": [{
            "project_id": 1,
            "task_id": 3,
            "feed_source_id": 23,
            "feed_source_txt": "Intern",
            "project": "Add new function",
            "task_ctnt": "We want to add such such function",
            "good_num": "112",
            "comment_num": "18"
        },
        {
            "project_id": 2,
            "task_id": 25,
            "feed_source_id": 24,
            "feed_source_txt": "Study",
            "project": "CSCI 6666 Project",
            "task_ctnt": "This is a blah blah project",
            "good_num": "112",
            "comment_num": "18"
        }
    ]

}

module.exports.index = index;
module.exports.projects = projects;
module.exports.project = project;