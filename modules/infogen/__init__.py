# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from flask import Blueprint, request, jsonify
from .gen import Gen

getinfo_blueprint = Blueprint('infogen', __name__, url_prefix="/movieinfo")


@getinfo_blueprint.route("/gen", methods=["POST"])
def gen():
    url = request.form["url"]
    _gen = Gen(url=url)
    ret = _gen.get()
    return jsonify(ret)
