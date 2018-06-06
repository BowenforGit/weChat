CREATE TABLE `logs` (
 `project_id` int NOT NULL,
 `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'name of the task',
 `item` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='logs'