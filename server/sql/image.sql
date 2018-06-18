CREATE TABLE `image` (
 `image_id` int NOT NULL AUTO_INCREMENT,
 `project_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
 `upload_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `image_id` (`image_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='image'