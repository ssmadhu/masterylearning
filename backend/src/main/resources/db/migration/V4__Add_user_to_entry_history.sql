ALTER TABLE `entry_history` ADD COLUMN `user_id` bigint(20) NOT NULL;
ALTER TABLE `entry_history` ADD KEY  `FK_2arl9k3nfbxxfs0y38pl8jsyq` (`user_id`);
ALTER TABLE `entry_history` ADD CONSTRAINT `FK_2arl9k3nfbxxfs0y38pl8jsyq` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
