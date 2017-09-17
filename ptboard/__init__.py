# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
from pymysql.cursors import DictCursor
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from app import mysql

ptboard_blueprint = Blueprint('ptboard', __name__)


@ptboard_blueprint.route("/ptboard")
@cross_origin()
def ptboard():
    search_raw = request.args.get("search")
    order_raw = request.args.get("order") or "desc"
    limit_raw = request.args.get("limit") or 50
    offset_raw = request.args.get("offset") or 0

    search = re.sub(r"[ _\-,.]", " ", search_raw)
    search = re.sub(r"\'", r"''", search)
    search = search.split()
    search = search[:10]
    if search:
        key = ["`title` LIKE '%{key}%'".format(key=i) for i in search]
        opt = " AND ".join(key)
    else:
        opt = "1=1"

    order = "desc" if order_raw not in ["desc", "asc"] else order_raw
    try:
        limit = int(limit_raw)
    except ValueError or TypeError:
        limit = 50
    try:
        offset = int(offset_raw)
    except ValueError or TypeError:
        offset = 0

    cursor = mysql.get_db().cursor(DictCursor)
    # SELECT * FROM `rss_pt_site` WHERE title LIKE "%E01%" and title LIKE "%720P%" ORDER BY `pubDate` DESC LIMIT 50, 25
    sql = "SELECT * FROM `rss_pt_site` WHERE {opt} ORDER BY `pubDate` {_da} LIMIT {_offset}, {_limit}".format(
        opt=opt, _da=order.upper(), _offset=offset, _limit=limit
    )
    row = cursor.execute(sql)
    raw_data = cursor.fetchall()

    return jsonify(raw_data)
