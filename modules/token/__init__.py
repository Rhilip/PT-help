# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from flask import Blueprint, request, jsonify
from app import mysql, poi

token_blueprint = Blueprint('token', __name__, url_prefix="/token")


def get_token_record(token=None) -> dict:
    error_msg = None
    ret = {
        "success": False,
    }
    if token:
        record = mysql.exec("SELECT `useage_remain` FROM `api`.`ptboard_token` WHERE `token`='{}'".format(token))
        try:
            token_quote = int(record[0])
        except TypeError:
            token_quote = 0
            error_msg = "This token is not exist in database."
        else:
            if token_quote <= 0:
                mysql.exec("DELETE FROM `api`.`ptboard_token` WHERE `token`='{}'".format(token))
                error_msg = "The quote of this token is exhaustion"
            else:
                ret.update({"success": True})
        ret.update({"token": token, "quote": token_quote})
    else:
        error_msg = "No token."
    ret.update({"error": error_msg})
    return ret


def token_use(token=None) -> dict:
    record = get_token_record(token)
    token_quote = record.setdefault("quote", 0)

    if token_quote > 0:
        token_quote -= 1
        mysql.exec("UPDATE `api`.`ptboard_token` SET `useage_remain`={} WHERE `token`='{}'".format(token_quote, token))
        record.update({"quote": token_quote})

    return record


@token_blueprint.route("/sign")
def sign():
    ret = {}
    token = request.args.get("token") or None
    hashes = request.args.get("hashes") or None
    if token and hashes:
        token_verify = poi.token_verify(token=token, hashes=hashes)
        if token_verify["success"]:
            mysql.exec("INSERT INTO `api`.`ptboard_token` (`token`) VALUES ('{}')".format(token))
        ret.update(get_token_record(token))
    return jsonify(ret)


@token_blueprint.route("/verify")
def verify(verity_token=None):
    token = verity_token or request.args.get("token") or None
    record = get_token_record(token)
    return jsonify(record)
