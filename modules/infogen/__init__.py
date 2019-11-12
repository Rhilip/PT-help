#!/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import time

from flask import Blueprint, request, jsonify, redirect

from app import cache
from .gen import Gen

getinfo_blueprint = Blueprint('infogen', __name__, url_prefix="/movieinfo")

docs_url = "https://github.com/Rhilip/PT-help/blob/master/modules/infogen/README.md"


def get_key(key):
    ret = ""
    if request.method == "POST":
        ret = request.form[key]
    elif request.method == "GET":
        ret = request.args.get(key)
    return ret


@getinfo_blueprint.route("/gen", methods=["GET", "POST"])
def gen():
    url = get_key("url")
    if url is None:
        site = get_key('site')
        sid = get_key('sid')
        if site is not None and sid is not None:
            url = {'site': site, 'sid': sid}

    if url:
        t0 = time.time()

        @cache.memoize(timeout=86400)
        def gen_data(uri):
            return Gen(url=uri).gen()

        nocache = get_key("nocache")
        if nocache:
            cache.delete_memoized(gen_data, url)

        data = gen_data(url)
        data["cost"] = time.time() - t0
        return jsonify(data)
    else:
        return redirect(docs_url, code=301)
