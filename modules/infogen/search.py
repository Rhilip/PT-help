# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

# 暂时废弃，占用前端处理。本处意义不大。

from .gen import Base

api_douban = "http://api.douban.com/v2/movie/search?q={}"
api_bangumi = "https://api.bgm.tv/search/subject/{}?responseGroup=simple&max_results=20&start=0"


class Search(Base):
    ret = {
        "success": False,
        "error": None
    }

    def __init__(self, key, cat: str = "movie"):
        self.key = key
        self.cat = cat

    def search(self):
        if self.cat.lower() in ["movie", "series"]:
            self._search_douban()
        elif self.cat.lower() == "anime":
            self._search_bangumi()
        return self.ret

    def _search_douban(self):
        search_json = self.get_source(api_douban.format(self.key))

        if int(search_json.get("total")) != 0:
            # 从json中获取信息并转移到返回数据中
            pass
        else:
            self.ret.update({"error": "Not find."})

    def _search_bangumi(self):
        pass


if __name__ == '__main__':
    from pprint import pprint

    pprint(Search(key="疯狂前女友").search())
