CREATE TABLE `project` (
 `project_id` int NOT NULL AUTO_INCREMENT COMMENT 'unique project id'
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
 `leader` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'leader',
 `member_id1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member1',
 `member_id2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member2',
 `member_id3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member3',
 `member_id4` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member4',
 `member_id5` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'member5',
 `info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'project decription',
 `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create date',
 `end_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'end date',
 `project_type` var(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'project type',
 PRIMARY KEY (`project_id`),
 KEY `project_id` (`project_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Project'