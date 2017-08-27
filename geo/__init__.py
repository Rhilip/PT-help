# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from flask import Blueprint, request, jsonify
from geo.utils import IpQuery

geo_blueprint = Blueprint('geo', __name__)

no_args_waring = """
    <h1>IP转地址</h1>
    根据IP地址查询所在的地理位置<br>
    使用方法:/geo?ip={ip}，返回json格式报文<br>
    """


@geo_blueprint.route("/geo")
def geo():
    if not request.args:
        return no_args_waring
    else:
        ip = request.args.get("ip")

        ret_dict = {
            "stats": "Fail",
            "ip": ip,
            "loc": "Not Find IP address." if ip is None else None
        }

        ret_dict.update(IpQuery().searchIp(ip))

        return jsonify(ret_dict)
