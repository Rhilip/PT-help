# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

# import json

# from pymysql import escape_string
from flask import Blueprint, request, jsonify

# from app import mysql
from .gen import Gen
# from .search import Search

getinfo_blueprint = Blueprint('infogen', __name__, url_prefix="/movieinfo")


@getinfo_blueprint.route("/gen", methods=["POST"])
def gen():
    url = request.form["url"]

    ret = {}
    _gen = Gen(url=url)
    """
    row, data = mysql.exec(
        "SELECT * FROM `api`.`gen_info` WHERE `site`='{}' AND `sid`='{}'".format(_gen.site, _gen.sid),
        r_dict=True, ret_row=True
    )

    if int(row) == 0:
        data = _gen.get()
        mysql.exec("INSERT INTO `api`.`gen_info` (`site`, `sid`, `data`)"
                   " VALUES ('{}', '{}', '{}')".format(_gen.site, _gen.sid, escape_string(json.dumps(data))))
    else:
        data_str = data.get("data")
        data = json.loads(data_str)
    """

    data = _gen.get()
    ret.update(data)
    return jsonify(ret)

"""
@getinfo_blueprint.route("/search", methods=["GET", "POST"])
def search():
    cat = key = ""
    if request.method == "POST":
        cat = request.form['cat']
        key = request.form['key']
    elif request.method == "GET":
        cat = request.args.get("cat")
        key = request.args.get("key")

    ret = {
        "success": False,
        "error": None
    }
    if key:
        _search = Search(key=key, cat=cat)
        ret.update(_search.search())
    else:
        ret.update({"error": "Not find `key` in requests."})
"""