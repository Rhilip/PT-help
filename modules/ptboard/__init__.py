# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
from flask import Blueprint, request, jsonify
from app import mysql
from pymysql import escape_string

ptboard_blueprint = Blueprint('ptboard', __name__)

search_default = ""
site_default = ""
no_site_default = ""
order_default = "desc"
limit_default = 100
offset_default = 0
start_time_default = 0
end_time_default = "CURRENT_TIMESTAMP"


def recover_int_to_default(value, default):
    try:
        ret = int(value)
    except(ValueError, TypeError):
        ret = default
    return ret


def warp_str(string):
    return "({})".format(string)


@ptboard_blueprint.route("/ptboard")
def ptboard():
    ret = {
        "success": False,
        "error": None
    }

    t0 = time.time()

    search_raw = request.args.get("search") or search_default
    order_raw = request.args.get("order") or order_default
    site_raw = request.args.get("site") or site_default
    no_site_raw = request.args.get("no_site") or no_site_default
    limit = request.args.get("limit") or limit_default
    offset = request.args.get("offset") or offset_default
    start_time = request.args.get("start_time") or start_time_default
    end_time = request.args.get("end_time") or end_time_default

    search = re.sub(r"[ _\-,.+]", " ", search_raw)
    search = search.split()
    search = search[:10]

    search_opt = site_opt = no_site_opt = "1=1"
    if search:
        search_opt = warp_str(
            " AND ".join(["`title` LIKE '%{key}%'".format(key=escape_string(i)) for i in search])
        )

    start_time = recover_int_to_default(start_time, start_time_default)
    end_time = recover_int_to_default(end_time, end_time_default)
    time_opt = warp_str("`pubDate` BETWEEN {start} AND {end}".format(start=start_time, end=end_time))

    if site_raw:
        site = site_raw.split(",")
        site_opt = warp_str(
            " OR ".join(["`site` = '{site}'".format(site=escape_string(s)) for s in site])
        )

    if no_site_raw:
        no_site = no_site_raw.split(",")
        no_site_opt = warp_str(
            " AND ".join(["`site` != '{site}'".format(site=escape_string(s)) for s in no_site])
        )

    limit = recover_int_to_default(limit, limit_default)
    offset = recover_int_to_default(offset, offset_default)

    if limit > 200:
        limit = 200

    order = "desc" if order_raw not in ["desc", "asc"] else order_raw

    opt = " AND ".join([search_opt, time_opt, site_opt, no_site_opt])
    sql = ("SELECT * FROM `api`.`ptboard_record` WHERE {opt} ORDER BY `pubDate` {_da} "
           "LIMIT {_offset}, {_limit}".format(opt=opt, _da=order.upper(), _offset=offset, _limit=limit)
           )

    record_count, rows_data = mysql.exec(sql=sql, r_dict=True, fetch_all=True, ret_row=True)

    total_data = mysql.exec("SELECT `TABLE_ROWS` FROM `information_schema`.`TABLES` "
                            "WHERE `TABLE_NAME`='ptboard_record'")[0]

    ret.update({
        "success": True,
        # "quote": token_quote,
        "rows": rows_data,
        "total": record_count if search else total_data,
    })

    ret.update({"cost": time.time() - t0})
    return jsonify(ret)
