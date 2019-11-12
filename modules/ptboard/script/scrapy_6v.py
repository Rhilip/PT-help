#!/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
import random
import logging

import requests
import pymysql
from threading import Lock

from http.cookies import SimpleCookie

from pymysql import escape_string
from bs4 import BeautifulSoup

RECHECK_ALL = False

db_host = ""
db_port = 3306
db_user = ""
db_password = ""
db_db = ""

site = {
    "name": "6V",
    "torrent_url": "http://bt.neu6.edu.cn/thread-{}-1-1.html",
    "cookies": ""
}

headers = {
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
}


class Database(object):
    def __init__(self, host, port, user, password, db):
        self._commit_lock = Lock()
        self.db = pymysql.connect(host=host, port=port, user=user, password=password, db=db, charset='utf8')

    def exec(self, sql: object, args: object = None, r_dict: object = False, fetch_all: object = False) -> object:
        with self._commit_lock:
            # The style of return info (dict or tuple)
            cursor = self.db.cursor(pymysql.cursors.DictCursor) if r_dict else self.db.cursor()
            row = cursor.execute(sql, args)
            try:
                self.db.commit()
                logging.debug("Success,DDL: \"{sql}\",Affect rows: {row}".format(sql=sql, row=row))
            except pymysql.Error as err:
                logging.critical("Mysql Error: \"{err}\",DDL: \"{sql}\"".format(err=err.args, sql=sql))
                self.db.rollback()

            # The lines of return info (one or all)
            return cursor.fetchall() if fetch_all else cursor.fetchone()

    def get_max_in_table(self, table: str, column_list: list or str):
        """Find the maximum value of the table in a list of column from the database"""
        if isinstance(column_list, str):
            column_list = [column_list]
        field = ", ".join(["MAX(`{col}`)".format(col=c) for c in column_list])
        raw_result = self.exec(sql="SELECT {fi} FROM `{tb}`".format(fi=field, tb=table))
        max_num = max([i for i in raw_result if i is not None] + [0])
        logging.debug("Max number in column: {co} is {mn}".format(mn=max_num, co=column_list))
        return max_num


def cookies_raw2jar(raw: str) -> dict:
    """
    Arrange Cookies from raw using SimpleCookies
    """
    cookie = SimpleCookie(raw)
    cookies = {}
    for key, morsel in cookie.items():
        cookies[key] = morsel.value
    return cookies



db = Database(host=db_host, port=db_port, user=db_user, password=db_password, db=db_db)
cookies = cookies_raw2jar(site["cookies"])


if __name__ == "__main__":
    max_tid_in_db, = db.exec("SELECT MAX(`sid`) FROM `ptboard_record` WHERE site='6V'")

    max_tid_now = 0
    for i in [1, 2]:
        _index = requests.get("http://bt.neu6.edu.cn/plugin.php?id=neubt_resourceindex&page={}".format(i),
                              cookies=cookies, headers=headers, timeout=5)
        torrent_id_list = re.findall("href=\"thread-(\d+)-1-1.html", _index.text)
        max_tid_now = max([int(i) for i in torrent_id_list] + [max_tid_now])

    new_list = list(range(int(max_tid_in_db) + 1, max_tid_now + 1))
    
    recheck_list_db = db.exec("SELECT `sid` FROM `ptboard_recheck` WHERE site='6V' ORDER BY RAND()" + ("" if RECHECK_ALL else " LIMIT 50"),fetch_all=True)
    recheck_list = [i[0] for i in recheck_list_db]
    
    add_list = []
    
    recheck_add = 0
    for tid in new_list + recheck_list:
        _page = requests.get(site["torrent_url"].format(tid), cookies=cookies, headers=headers, timeout=5)
        _bs = BeautifulSoup(_page.text, "lxml")
        _title = _bs.title.get_text()
        print("{}: {}".format(tid, _title))
        
        if not re.search("(提示信息|我关注的)", _title):
            # 判断是不是种子类资源
            if _bs.find("img", src="static/image/filetype/torrent.gif"):
                title = _bs.find("span", id="thread_subject").get_text(strip=True)
                pubDate_raw = _bs.find("em", id=re.compile("authorposton\d+")).get_text(strip=True)
                pubDate_raw = re.search("发表于 (.+)$", pubDate_raw).group(1)
                timestamp = int(time.mktime(time.strptime(pubDate_raw, "%Y-%m-%d %H:%M")))
                db.exec(
                    ("INSERT INTO `ptboard_record` (`sid`,`site`,`title`,`pubDate`) "
                     "VALUES (%s,%s,%s, %s)"
                    ),(tid, site["name"], title, timestamp)
                )
                add_list.append(tid)
                if tid in recheck_list:
                    db.exec("DELETE FROM `ptboard_recheck` WHERE `ptboard_recheck`.`sid` = %s",(tid,))
                    
                # 下载种子给reseed用
                
            elif re.search("试种区", _title):
                if tid not in recheck_list:
                    db.exec(
                        ("INSERT INTO `ptboard_recheck` (`sid`,`site`,`title`,`link`) "
                         "VALUES (%s,%s, %s,%s)"
                        ),(tid,site["name"],_title, site['torrent_url'].format(tid))
                    )
                    recheck_add += 1
        elif tid in recheck_list:
            db.exec("DELETE FROM `ptboard_recheck` WHERE `ptboard_recheck`.`sid` = %s",(tid,))
    
    db.exec('UPDATE `ptboard_site` SET `last_check` = NOW WHERE site = %s',(site,))
    print("--------------------------------------------------")
    print("检查前六维最新种子编号：{}， 数据库记录最大种子编号： {}， 新增主题数： {}".format(max_tid_now,max_tid_in_db, max_tid_now - max_tid_in_db))
    print("检查之前记录的候选区种子列表：共{}个".format(len(recheck_list)))
    print("共添加 {} 个新种子信息".format(len(add_list)))
    new_torrent_list = [i for i in add_list if i in new_list]
    print("其中检查的新种子：共{}个 ， 新增待查： 共 {} 个".format(len(new_torrent_list), recheck_add))
    recheck_torrent_list = [i for i in add_list if i in recheck_list]
    print("其中检查的候选区种子：共{}个， ".format(len(recheck_torrent_list)))
