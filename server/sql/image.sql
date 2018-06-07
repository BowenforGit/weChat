CREATE TABLE `image` (
 `project_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
 `upload_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='image'