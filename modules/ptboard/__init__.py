# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
from flask import Blueprint, request, jsonify
from app import mysql, app, cache
from pymysql import escape_string

ptboard_blueprint = Blueprint('ptboard', __name__)

search_default = app.config.get("PTBOARD_SEARCH", "")
site_default = app.config.get("PTBOARD_SITE", "")
no_site_default = app.config.get("PTBOARD_NO_SITE", "")
order_default = app.config.get("PTBOARD_ORDER", "desc")
limit_default = app.config.get("PTBOARD_LIMIT", 100)
offset_default = app.config.get("PTBOARD_OFFSET", 0)
start_time_default = app.config.get("PTBOARD_START_TIME", 0)
end_time_default = app.config.get("PTBOARD_END_TIME", "CURRENT_TIMESTAMP")

predb_prefix = "https://trace.corrupt-net.org/?q="


def recover_int_to_default(value, default):
    try:
        ret = int(value)
    except(ValueError, TypeError):
        ret = default
    return ret


def warp_str(string):
    return "({})".format(string)


@ptboard_blueprint.route("/ptboard", methods=["GET"])
def ptboard():
    t0 = time.time()

    ret = {
        "success": False,
        "error": None
    }

    token = request.args.get("token") or ""

    @cache.memoize(timeout=86400)
    def token_valid(token_):
        if len(token_) != 32:
            return False

        row, data = mysql.exec("SELECT * FROM `api`.`ptboard_token` WHERE token = %s", token_, ret_row=True)

        if row > 0:
            return True
        else:
            return False

    if not token_valid(token):
        ret["error"] = "Token is not exist."
        return jsonify(ret)

    mysql.exec('UPDATE `api`.`ptboard_token` set `useage_count` = `useage_count` + 1 WHERE token = %s', (token,))

    # 1. Get user requests
    search_raw = request.args.get("search") or search_default
    order_raw = request.args.get("order") or order_default
    site_raw = request.args.get("site") or site_default
    no_site_raw = request.args.get("no_site") or no_site_default
    limit = request.args.get("limit") or limit_default
    offset = request.args.get("offset") or offset_default
    start_time = request.args.get("start_time") or start_time_default
    end_time = request.args.get("end_time") or end_time_default

    # 2. Clean user requests
    search = re.sub(r"[ _\-,.+]", " ", search_raw)
    search = search.split()
    search = list(filter(lambda l: len(l) > 1, search))  # Remove those too short letter
    search = search[:10]

    search_opt = site_opt = no_site_opt = "1=1"
    if search:
        search_opt = warp_str(" AND ".join(map(lambda i: "title LIKE '%{}%'".format(escape_string(i)), search)))

    start_time = recover_int_to_default(start_time, start_time_default)
    end_time = recover_int_to_default(end_time, end_time_default)
    time_opt = warp_str("ptboard_record.pubDate BETWEEN {start} AND {end}".format(start=start_time, end=end_time))

    @cache.cached(timeout=86400)
    def get_site_list():
        return [i[0] for i in mysql.exec("SELECT `site` FROM `api`.`ptboard_site`", fetch_all=True)]

    site_list = get_site_list()
    site = list(filter(lambda i: i in site_list, site_raw.split(",")))
    no_site = list(filter(lambda i: i in site_list, no_site_raw.split(",")))

    if site:
        site_opt = warp_str(" OR ".join(["ptboard_record.site = '{site}'".format(site=s) for s in site]))
    if no_site:
        no_site_opt = warp_str(" AND ".join(["ptboard_record.site != '{site}'".format(site=s) for s in no_site]))

    limit = recover_int_to_default(limit, limit_default)
    offset = recover_int_to_default(offset, offset_default)

    if limit > 200:
        limit = 200

    order = "desc" if order_raw.lower() not in ["desc", "asc"] else order_raw

    # 3. Get response data from Database
    opt = " AND ".join([time_opt, site_opt, no_site_opt, search_opt])
    sql = ("SELECT ptboard_record.sid, ptboard_site.site, ptboard_record.title, "
           "concat(ptboard_site.torrent_prefix,ptboard_record.sid, ptboard_site.torrent_suffix) AS link, "
           "ptboard_record.pubDate FROM api.ptboard_record "
           "INNER JOIN api.ptboard_site ON api.ptboard_site.site = api.ptboard_record.site "
           "WHERE {opt} ORDER BY `pubDate` {_da} "
           "LIMIT {_offset}, {_limit}".format(opt=opt, _da=order.upper(), _offset=offset, _limit=limit)
           )
    record_count, rows_data = mysql.exec(sql=sql, r_dict=True, fetch_all=True, ret_row=True)

    # 4. Sort Response data
    if app.config.get("DEBUG"):
        ret["sql"] = sql

    def fix_predb(d: dict):
        if d["site"] == "PreDB":
            d["link"] = predb_prefix + d["title"].split(" | ")[1]
        return d

    ret.update({
        "success": True,
        "rows": list(map(fix_predb, rows_data)),
        "total": record_count if search else mysql.exec("SELECT count(*) FROM `api`.`ptboard_record`")[0],
    })

    ret["cost"] = time.time() - t0
    return jsonify(ret)
