# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import time
import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/61.0.3163.100 Safari/537.36 '
}


class NetBase(object):
    @staticmethod
    def connect(method: str, url: str, json=False, bs=False, max_try=2, **kwargs):
        err = 0
        ret = ""
        while err < max_try:
            try:
                kwargs.setdefault("headers", headers)
                page = requests.request(method.upper(), url, **kwargs)
                page.encoding = "utf-8"
                ret = page.json() if json else (BeautifulSoup(page.text, "lxml") if bs else page.text)
            except OSError:
                err += 1
                time.sleep(0.4)
            else:
                break

        return ret

    def get_source(self, url: str, **kwargs):
        return self.connect("GET", url, **kwargs)

    def post_source(self, url: str, **kwargs):
        return self.connect("POST", url, **kwargs)
