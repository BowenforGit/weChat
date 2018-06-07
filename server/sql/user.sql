CREATE TABLE `user` (
 `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `avatar` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY (`open_id`),
 KEY `openid` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='user'