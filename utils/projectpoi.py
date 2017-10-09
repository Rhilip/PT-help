# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import requests


class ProjectPoi(object):
    key = None

    def __init__(self, app=None, key=None):
        if app is not None:
            self.app = app
            self.init_app(self.app)
        else:
            self.app = None
            self.key = key

    def init_app(self, app):
        self.app = app
        self.key = self.app.config.setdefault('PROJECTPOI_API_KEY', None)

    def token_verify(self, token, hashes):
        payload = {"secret": self.key, "token": token, "hashes": hashes}
        r = requests.post("https://api.ppoi.org/token/verify", data=payload)
        return r.json()

    def user_balance(self, name, sitekey):
        payload = {"secret": self.key, "name": name, "sitekey": sitekey}
        r = requests.post("https://api.ppoi.org/user/balance", data=payload)
        return r.json()

    def user_withdraw(self, name, sitekey, amount):
        payload = {"secret": self.key, "name": name, "sitekey": sitekey, "amount": amount}
        r = requests.post("https://api.ppoi.org/user/withdraw", data=payload)
        return r.json()

    @staticmethod
    def stats_payout():
        r = requests.get("https://api.ppoi.org/stats/payout")
        return r.json()

    def stats_site(self):
        payload = {"secret": self.key}
        r = requests.post("https://api.ppoi.org/stats/site", data=payload)
        return r.json()
