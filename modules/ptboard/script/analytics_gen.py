# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

"""
这是一个用来根据Pt-Board生成对应分析Json的工具，你应该使用Crontab定时运行
"""

import time
import json

# -*- 配置
db_host = "localhost"
db_port = 3306
db_user = "user"
db_password = "password"
db_db = "db"
json_file = ""

try:
    from utils.config import db as mysql
except ImportError:
    import pymysql


    class Database(object):
        def __init__(self, host, port, user, password, db):
            self.db = pymysql.connect(host=host, port=port, user=user, password=password, db=db,
                                      charset='utf8', autocommit=True)

        def exec(self, sql: str, args=None, r_dict: bool = False, fetch_all: bool = False, ret_row: bool = False):
            cursor = self.db.cursor(pymysql.cursors.DictCursor) if r_dict else self.db.cursor()  # Cursor type
            row = cursor.execute(sql, args)
            data = cursor.fetchall() if fetch_all else cursor.fetchone()  # The lines of return info (one or all)

            return (row, data) if ret_row else data


    mysql = Database(host=db_host, port=db_port, user=db_user, password=db_password, db=db_db)

t0 = time.time()

ret = {"update": t0}
ret["data"] = mysql.exec('SELECT FROM_UNIXTIME(`pubDate`,"%Y-%m-%d") AS date, site, COUNT(*) AS `count`'
                         'FROM `api`.`ptboard_record` '
                         'WHERE `site` !="PreDB" '
                         'GROUP BY date, site', fetch_all=True, r_dict=True)
ret["cost"] = time.time() - t0

with open(json_file, "w") as outfile:
    json.dump(ret, outfile, ensure_ascii=False)
