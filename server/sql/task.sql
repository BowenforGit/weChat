CREATE TABLE `task` (
 `task_id` int NOT NULL AUTO_INCREMENT COMMENT 'unique task id'
 `project_id` int NOT NULL AUTO_INCREMENT COMMENT 'unique project id which the task is belonged to'
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'name of the task',
 `member_id1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member1',
 `member_id2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member2',
 `member_id3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member3',
 `info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'task decription',
 `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
 `deadline` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'end date',
 `task_type` var(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'task type',
 `finish` tinyint(1) DEFAULT FALSE COMMENT 'status'
 FOREIGN KEY (project_id) REFERENCES project(project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Task'