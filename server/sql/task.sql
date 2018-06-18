CREATE TABLE `task` (
 `task_id` int NOT NULL AUTO_INCREMENT,
 `project_id` int NOT NULL,
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `member_id1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `subtask1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `subtask2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `subtask3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `deadline` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `task_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `importance` int NOT NULL,  
 `finish` tinyint(1) DEFAULT FALSE,
 PRIMARY KEY (`task_id`),
 KEY `task_id` (`task_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Task'