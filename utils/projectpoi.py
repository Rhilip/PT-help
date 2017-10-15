# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from utils.netsource import NetBase


class ProjectPoi(NetBase):
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
        return self.post_source("https://api.ppoi.org/token/verify", json=True, data=payload)

    def user_balance(self, name, sitekey):
        payload = {"secret": self.key, "name": name, "sitekey": sitekey}
        return self.post_source("https://api.ppoi.org/user/balance", json=True, data=payload)

    def user_withdraw(self, name, sitekey, amount):
        payload = {"secret": self.key, "name": name, "sitekey": sitekey, "amount": amount}
        return self.post_source("https://api.ppoi.org/user/withdraw", json=True, data=payload)

    def stats_payout(self):
        return self.get_source("https://api.ppoi.org/stats/payout", json=True)

    def stats_site(self):
        payload = {"secret": self.key}
        return self.post_source("https://api.ppoi.org/stats/site", json=True, data=payload)
