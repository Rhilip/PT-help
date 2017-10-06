# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
from flask import Blueprint, request, jsonify
from app import mysql
from pymysql import escape_string

ptboard_blueprint = Blueprint('ptboard', __name__)


@ptboard_blueprint.route("/ptboard")
def ptboard():
    t0 = time.time()

    search_raw = request.args.get("search") or ""
    order_raw = request.args.get("order") or "desc"
    limit_raw = request.args.get("limit") or 50
    offset_raw = request.args.get("offset") or 0

    search = re.sub(r"[ _\-,.]", " ", search_raw)
    search = search.split()
    search = search[:10]
    if search:
        opt = " AND ".join(["`title` LIKE '%{key}%'".format(key=escape_string(i)) for i in search])
        total_data = mysql.exec("SELECT COUNT(*) FROM `rss_pt_site` WHERE {opt}".format(opt=opt))[0]
    else:
        opt = "1=1"
        total_data = mysql.exec("SELECT `TABLE_ROWS` FROM `information_schema`.`TABLES` "
                                "WHERE `TABLE_NAME`='rss_pt_site'")[0]

    order = "desc" if order_raw not in ["desc", "asc"] else order_raw
    try:
        limit = int(limit_raw)
        if limit > 200:
            limit = 200
    except ValueError or TypeError:
        limit = 50
    try:
        offset = int(offset_raw)
    except ValueError or TypeError:
        offset = 0

    sql = ("SELECT * FROM `rss_pt_site` WHERE {opt} ORDER BY `pubDate` {_da} LIMIT {_offset}, {_limit}".format(
        opt=opt, _da=order.upper(), _offset=offset, _limit=limit)
    )
    rows_data = mysql.exec(sql=sql, r_dict=True, fetch_all=True)

    return jsonify({
        "cost": time.time() - t0,
        "rows": rows_data,
        "total": total_data
    })
