# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import pymysql
from flaskext.mysql import MySQL


class Database(MySQL):
    def exec(self, sql: str, r_dict: bool = False, fetch_all: bool = False, ret_row: bool = False):
        # The style of return info (dict or tuple)
        db = self.get_db()
        cursor = db.cursor(pymysql.cursors.DictCursor) if r_dict else db.cursor()  # Cursor type
        row = cursor.execute(sql)
        data = cursor.fetchall() if fetch_all else cursor.fetchone()  # The lines of return info (one or all)

        return (row, data) if ret_row else data
