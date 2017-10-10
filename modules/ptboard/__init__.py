# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
from flask import Blueprint, request, jsonify
from app import mysql
from pymysql import escape_string
from modules.token import get_token_record, token_use

ptboard_blueprint = Blueprint('ptboard', __name__)


@ptboard_blueprint.route("/ptboard")
def ptboard():
    ret = {
        "success": False,
        "error": None
    }

    t0 = time.time()
    token = request.args.get("token") or None

    ret.update(get_token_record(token))
    if ret.setdefault("success", False):
        token_quote = int(ret.setdefault("quote", 0))
        if token_quote is not 0:
            search_raw = request.args.get("search") or ""
            order_raw = request.args.get("order") or "desc"
            limit_raw = request.args.get("limit") or 50
            offset_raw = request.args.get("offset") or 0

            search = re.sub(r"[ _\-,.+]", " ", search_raw)
            search = search.split()
            search = search[:10]
            if search:
                opt = " AND ".join(["`title` LIKE '%{key}%'".format(key=escape_string(i)) for i in search])
                token_use(token)
            else:
                opt = "1=1"

            order = "desc" if order_raw not in ["desc", "asc"] else order_raw
            try:
                limit = int(limit_raw)
                if limit > 200:
                    limit = 200
            except (ValueError, TypeError):
                limit = 50
            try:
                offset = int(offset_raw)
            except (ValueError, TypeError):
                offset = 0

            sql = ("SELECT * FROM `rss_pt_site` WHERE {opt} ORDER BY `pubDate` {_da} "
                   "LIMIT {_offset}, {_limit}".format(opt=opt, _da=order.upper(), _offset=offset, _limit=limit)
                   )

            record_count, rows_data = mysql.exec(sql=sql, r_dict=True, fetch_all=True, ret_row=True)

            total_data = mysql.exec("SELECT `TABLE_ROWS` FROM `information_schema`.`TABLES` "
                                    "WHERE `TABLE_NAME`='rss_pt_site'")[0]

            ret.update({
                "success": True,
                "quote": token_quote,
                "rows": rows_data,
                "total": record_count if search else total_data
            })

    ret.update(
        {
            "cost": time.time() - t0,
        }
    )
    return jsonify(ret)
