-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-11-21 16:20:51
-- 服务器版本： 5.7.23-log
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `api`
--

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_record`
--

CREATE TABLE `ptboard_record` (
  `uid` mediumint(8) NOT NULL,
  `sid` mediumint(8) NOT NULL,
  `site` varchar(20) NOT NULL,
  `title` text NOT NULL,
  `pubDate` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_site`
--

CREATE TABLE `ptboard_site` (
  `sid` int(11) NOT NULL,
  `site` varchar(20) NOT NULL,
  `url` text NOT NULL,
  `cookies` text NOT NULL,
  `torrent_prefix` text NOT NULL,
  `torrent_suffix` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type` enum('rss','scrapy','other','none') NOT NULL DEFAULT 'rss',
  `max_id` int(11) NOT NULL DEFAULT '0',
  `count_id` int(11) NOT NULL DEFAULT '0',
  `last_update` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_token`
--

CREATE TABLE `ptboard_token` (
  `tid` int(11) NOT NULL,
  `token` text NOT NULL,
  `creat_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `useage_remain` int(11) NOT NULL DEFAULT '25'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ptboard_record`
--
ALTER TABLE `ptboard_record`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `unique_sid_in_one_site` (`sid`,`site`) USING BTREE,
  ADD KEY `pubDate` (`pubDate`),
  ADD KEY `site` (`site`);
ALTER TABLE `ptboard_record` ADD FULLTEXT KEY `title` (`title`);

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
-- 使用表AUTO_INCREMENT `ptboard_record`
--
ALTER TABLE `ptboard_record`
  MODIFY `uid` mediumint(8) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `ptboard_token`
--
ALTER TABLE `ptboard_token`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
