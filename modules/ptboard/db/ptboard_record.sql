-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-01-01 11:53:49
-- 服务器版本： 5.6.37-log
-- PHP Version: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- 表的结构 `ptboard_record`
--

CREATE TABLE `ptboard_record` (
  `uid`     INT(11) NOT NULL,
  `sid`     INT(11) NOT NULL,
  `site`    TEXT    NOT NULL,
  `title`   TEXT    NOT NULL,
  `link`    TEXT    NOT NULL,
  `pubDate` INT(11) NOT NULL
)
  ENGINE = MyISAM
  DEFAULT CHARSET = utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ptboard_record`
--
ALTER TABLE `ptboard_record`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `pubDate` (`pubDate`),
  ADD KEY `sid` (`sid`);
ALTER TABLE `ptboard_record`
  ADD FULLTEXT KEY `title` (`title`);
ALTER TABLE `ptboard_record`
  ADD FULLTEXT KEY `site` (`site`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `ptboard_record`
--
ALTER TABLE `ptboard_record`
  MODIFY `uid` INT(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
