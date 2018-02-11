-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-01-31 13:13:34
-- 服务器版本： 5.6.39-log
-- PHP Version: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `api`
--

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_recheck`
--

CREATE TABLE `ptboard_recheck` (
  `rid`   INT(11) NOT NULL,
  `sid`   INT(11) NOT NULL,
  `site`  TEXT    NOT NULL,
  `title` TEXT    NOT NULL,
  `link`  TEXT    NOT NULL
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_record`
--

CREATE TABLE `ptboard_record` (
  `uid`     INT(11)     NOT NULL,
  `sid`     INT(11)     NOT NULL,
  `site`    VARCHAR(20) NOT NULL,
  `title`   TEXT        NOT NULL,
  `link`    TEXT        NOT NULL,
  `pubDate` INT(11)     NOT NULL
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

--
-- 触发器 `ptboard_record`
--
DELIMITER $$
CREATE TRIGGER `Auto_Update_ptboard_site`
AFTER INSERT ON `ptboard_record`
FOR EACH ROW
  BEGIN
    DECLARE s VARCHAR(20);
    SET s = (SELECT `site`
             FROM `ptboard_record`
             ORDER BY `uid` DESC
             LIMIT 1);
    UPDATE `ptboard_site`
    SET `last_check_id` = (SELECT MAX(`sid`)
                           FROM `api`.`ptboard_record`
                           WHERE `site` = s), `count_id` = (SELECT COUNT(`sid`)
                                                            FROM `api`.`ptboard_record`
                                                            WHERE `site` = s)
    WHERE `site` = s;
  END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_site`
--

CREATE TABLE `ptboard_site` (
  `sid`             INT(11)                                 NOT NULL,
  `site`            TEXT                                    NOT NULL,
  `url`             TEXT                                    NOT NULL,
  `status`          TINYINT(1)                              NOT NULL DEFAULT '1',
  `type`            ENUM ('rss', 'scrapy', 'other', 'none') NOT NULL DEFAULT 'rss',
  `last_check_id`   INT(11)                                 NOT NULL DEFAULT '0',
  `count_id`        INT(11)                                 NOT NULL,
  `last_check_time` DATETIME                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ptboard_recheck`
--
ALTER TABLE `ptboard_recheck`
  ADD KEY `rid` (`rid`);

--
-- Indexes for table `ptboard_record`
--
ALTER TABLE `ptboard_record`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `unique_sid_in_one_site` (`sid`, `site`),
  ADD KEY `pubDate` (`pubDate`);
ALTER TABLE `ptboard_record`
  ADD FULLTEXT KEY `title` (`title`);

--
-- Indexes for table `ptboard_site`
--
ALTER TABLE `ptboard_site`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `status` (`status`),
  ADD KEY `type` (`type`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `ptboard_recheck`
--
ALTER TABLE `ptboard_recheck`
  MODIFY `rid` INT(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `ptboard_record`
--
ALTER TABLE `ptboard_record`
  MODIFY `uid` INT(11) NOT NULL AUTO_INCREMENT;
COMMIT;
