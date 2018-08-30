# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import pymysql

from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')


class Database(MySQL):
    def exec(self, sql: str, args=None, r_dict: bool = False, fetch_all: bool = False, ret_row: bool = False):
        db = self.get_db()
        cursor = db.cursor(pymysql.cursors.DictCursor) if r_dict else db.cursor()  # Cursor type
        row = cursor.execute(sql, args)
        data = cursor.fetchall() if fetch_all else cursor.fetchone()  # The lines of return info (one or all)

        return (row, data) if ret_row else data


mysql = Database(app=app, autocommit=True)
cache = Cache(app)

CORS(app)
