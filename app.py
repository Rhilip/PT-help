# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from flask import Flask
from utils.database import Database
from flask_cors import CORS

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')

CORS(app)

mysql = Database(app=app, autocommit=True)
