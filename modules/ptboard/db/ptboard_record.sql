-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-03-10 12:39:30
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
  `uid`     MEDIUMINT(8) NOT NULL,
  `sid`     MEDIUMINT(8) NOT NULL,
  `site`    VARCHAR(20)  NOT NULL,
  `title`   TEXT         NOT NULL,
  `pubDate` INT(11)      NOT NULL
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_site`
--

CREATE TABLE `ptboard_site` (
  `sid`            INT(11)                                 NOT NULL,
  `site`           VARCHAR(20)                             NOT NULL,
  `url`            TEXT                                    NOT NULL,
  `torrent_prefix` TEXT                                    NOT NULL,
  `torrent_suffix` TEXT                                    NOT NULL,
  `status`         TINYINT(1)                              NOT NULL DEFAULT '1',
  `type`           ENUM ('rss', 'scrapy', 'other', 'none') NOT NULL DEFAULT 'rss',
  `max_id`         INT(11)                                 NOT NULL DEFAULT '0',
  `count_id`       INT(11)                                 NOT NULL DEFAULT '0',
  `last_update`    DATETIME                                         DEFAULT NULL
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_token`
--

CREATE TABLE `ptboard_token` (
  `tid`           INT(11)  NOT NULL,
  `token`         TEXT     NOT NULL,
  `creat_time`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `useage_remain` INT(11)  NOT NULL DEFAULT '25'
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
  ADD UNIQUE KEY `unique_sid_in_one_site` (`sid`, `site`) USING BTREE,
  ADD KEY `pubDate` (`pubDate`),
  ADD KEY `site` (`site`);
ALTER TABLE `ptboard_record`
  ADD FULLTEXT KEY `title` (`title`);

--
-- Indexes for table `ptboard_site`
--
ALTER TABLE `ptboard_site`
  ADD PRIMARY KEY (`sid`),
  ADD UNIQUE KEY `site` (`site`),
  ADD KEY `status` (`status`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `ptboard_token`
--
ALTER TABLE `ptboard_token`
  ADD PRIMARY KEY (`tid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `ptboard_recheck`
--
ALTER TABLE `ptboard_recheck`
  MODIFY `rid` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 487;

--
-- 使用表AUTO_INCREMENT `ptboard_record`
--
ALTER TABLE `ptboard_record`
  MODIFY `uid` MEDIUMINT(8) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 2086453;

--
-- 使用表AUTO_INCREMENT `ptboard_token`
--
ALTER TABLE `ptboard_token`
  MODIFY `tid` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 457;
COMMIT;
