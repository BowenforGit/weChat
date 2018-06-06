CREATE TABLE `project` (
 `project_id` int NOT NULL AUTO_INCREMENT,
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `leader` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `member_id1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id4` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `member_id5` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT '',
 `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `end_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `project_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
 PRIMARY KEY (`project_id`),
 KEY `project_id` (`project_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Project'