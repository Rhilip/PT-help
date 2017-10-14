# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import time
import requests
from bs4 import BeautifulSoup

api_douban = "https://api.douban.com/v2/movie/subject/{}"
api_imdb = "http://app.imdb.com/title/maindetails?tconst={}"
api_bangumi = "https://api.bgm.tv/subject/{}?responseGroup=large"

douban_format = [
    # (key name in dict. the format of key, string format) with order
    # ("cover_img", "{}\n\n"),
    ("title", "◎译　　名　{}\n"),
    ("original_title", "◎片　　名　{}\n"),
    ("year", "◎年　　代　{}\n"),
    ("countries", "◎产　　地　{}\n"),
    ("genres", "◎类　　别　{}\n"),
    ("lang", "◎语　　言　{}\n"),
    ("pubdate", "◎上映日期　{}\n"),
    ("imdb_rate", "◎IMDb评分　{}\n"),
    ("imdb_link", "◎IMDb链接　{}\n"),
    ("douban_rate", "◎豆瓣评分　{}\n"),
    ("douban_link", "◎豆瓣链接　{}\n"),
    ("length", "◎片　　长　{}\n"),
    ("directors", "◎导　　演　{}\n"),
    ("casts", "◎主　　演　{}\n\n"),
    ("summary", "◎简　　介  \n\n　　{}\n\n"),
    ("awards", "◎获奖情况  \n\n{}"),
]

bangumi_format = [
    ("cover_img", "{}\n\n"),
    ("story", "[b]Story: [/b]\n\n{}\n\n"),
    ("staff", "[b]Staff: [/b]\n\n{}\n\n"),
    ("cast", "[b]Cast: [/b]\n\n{}\n\n"),
]

support_list = [
    ("douban", re.compile("(https?://)?movie\.douban\.com/subject/(?P<sid>\d+)/?")),
    # ("imdb", re.compile("(https?://)?www\.imdb\.com/title/(?P<sid>tt\d+)")),
    # ("3dm", re.compile("(https?://)?bbs\.3dmgame\.com/thread-(?P<sid>\d+)(-1-1\.html)?")),
    # ("steam", re.compile("(https?://)?store\.steampowered\.com/app/(?P<sid>\d+)/?")),
    ("bangumi", re.compile("(https?://)?(bgm\.tv|bangumi\.tv|chii\.in)/subject/(?P<sid>\d+)/?")),
]

headers = {
    'User-Agent':  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                   'Chrome/61.0.3163.100 Safari/537.36 '
}


class Base(object):
    @staticmethod
    def get_source(url, json=False, bs=False, **kwargs):
        err = 0
        ret = ""
        while err < 4:
            try:
                kwargs.setdefault("headers", headers)
                page = requests.get(url, **kwargs)
                page.encoding = "utf-8"
                ret = page.json() if json else (BeautifulSoup(page.text, "lxml") if bs else page.text)
            except OSError:
                err += 1
                time.sleep(0.4)
            else:
                break

        return ret


class Gen(Base):
    site = sid = url = None
    ret = {
        "success": False,
        "error": None
    }

    def __init__(self, url):
        for site, pat in support_list:
            search = pat.search(url)
            if search:
                self.sid = search.group("sid")
                self.site = site
        if not self.site:
            self.ret.update({"error": "No support link."})

    def get(self):
        if self.site == "douban":
            self._gen_douban(self.sid)
        elif self.site == "bangumi":
            self._gen_bangumi(self.sid)
        return self.ret

    def _gen_douban(self, sid):
        raw_data_json = self.get_source(api_douban.format(sid), json=True)  # 通过豆瓣公开API获取Json格式的数据
        if raw_data_json.get("msg"):
            self.ret.update({"error": raw_data_json.get("msg")})
        else:
            img_list = []  # 临时存储图片信息

            alt = raw_data_json.get("alt")  # 通过API获取豆瓣链接（而不是自拼
            raw_data_page = self.get_source(alt, bs=True)  # 获取相应页面（用来获取API中未提供的信息），并用BeautifulSoup处理

            # -*- 清洗数据 -*-
            self.ret.update({"id": sid, "alt": alt})

            # 可以从raw_json中直接（或简单处理就）转移到返回数据中的信息
            _raw_title = raw_data_json.get("title")
            _aka = raw_data_json.get("aka")
            _original_title = raw_data_json.get("original_title")

            _title = [_raw_title]
            # 排除aka中的非中文字段
            for t in _aka:
                if re.search("[\u4E00-\u9FA5]", t) and t != _original_title:
                    _title.append(t)

            self.ret.update({
                "title": " / ".join(_title),
                "original_title": _original_title,
                "year": raw_data_json.get("year"),
                "countries": " / ".join(raw_data_json.get("countries")),
                "summary": raw_data_json.get("summary").replace("\n", "\n　　"),
                "genres": " / ".join(raw_data_json.get("genres"))  # 在API中最多提供三个，会被再次获取值覆盖
            })

            # 从页面中的info面板中获取信息
            info_tag = raw_data_page.find("div", id="info")
            info_tag_str = info_tag.get_text()

            # 获取封面图（虽然没什么用）
            cover_img_tag = raw_data_page.find("img", src=re.compile("doubanio"))
            if cover_img_tag:
                # https://img1.doubanio.com/view/photo/raw/public/p494268647.jpg
                # https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p494268647.jpg
                cover_img = re.sub("^.+img(\d).+p(\d+).+$", r"https://img\1.doubanio.com/view/photo/raw/public/p\2.jpg",
                                   cover_img_tag["src"])
                img_list.append(cover_img)
                self.ret.update({"cover_img": cover_img})

            for pat, key in [("类型", "genres"), ("语言", "lang"),
                             ("上映日期", "pubdate"), ("IMDb链接", "imdb_id"), ("片长", "length")]:
                _search = re.search(pat + ": (.+)", info_tag_str)
                _up_data = ""
                if _search:
                    _up_data = _search.group(1).strip()
                self.ret.update({key: _up_data})

            _imdb_rate = _imdb_link = ""
            if self.ret.get("imdb_id"):  # 该影片在豆瓣上存在IMDb链接
                imdb_json = self.get_source(api_imdb.format(self.ret["imdb_id"]), json=True)  # 通过IMDb的API获取信息
                imdb_data = imdb_json.get("data")
                img_list.append(imdb_data.get("image").get("url"))  # 添加来自imdb的封面图
                _imdb_rate = "{}/10 from {} users".format(imdb_data.get("rating"), imdb_data.get("num_votes"))
                _imdb_link = "http://www.imdb.com/title/{}/".format(self.ret["imdb_id"])

            self.ret.update({"imdb_rate": _imdb_rate, "imdb_link": _imdb_link})

            douban_rate = db_rate_count = ""
            try:  # 获取豆瓣评分信息
                douban_rate = raw_data_json.get("rating").get("average")
                db_rate_count = raw_data_json.get("ratings_count")
            except AttributeError:  # 如果通过豆瓣API获取不到评分，则抛出Error，并从`/subject/:d/collections` 获取
                rate_text = self.get_source("https://movie.douban.com/subject/{}/collections".format(sid))
                rate_search = re.search("(\d+)人参与评价", rate_text)
                if rate_search:
                    douban_rate = rate_search.group(1)
                    db_rate_count = re.search(">(\d\.\d)</strong", rate_text).group(1)
            finally:
                self.ret.update({"douban_rate": "{}/10 from {} users".format(douban_rate, db_rate_count),
                                 "douban_link": "https://movie.douban.com/subject/{}".format(sid)
                                 })

            # TODO 获取导演信息及主演信息（此处暂用API提供的信息。主演，最多可获得4个；）
            api_douban_celebrity = "https://api.douban.com/v2/movie/celebrity/{}"
            for tp in ["directors", "casts"]:
                _temp_list = []
                for role in raw_data_json.get(tp):
                    role_id = role.get("id")
                    role_json = self.get_source(api_douban_celebrity.format(role_id), json=True)
                    role_name = role_json.get("name")
                    if role_json.get("name_en"):
                        role_name += "  " + role_json.get("name_en")
                    _temp_list.append(role_name)
                self.ret.update({tp: _temp_list})

            # 获取获奖情况
            awards_url = "https://movie.douban.com/subject/{}/awards/"
            awards_page = self.get_source(awards_url.format(sid), bs=True)
            awards = ""
            for awards_tag in awards_page.find_all("div", class_="awards"):
                _temp_awards = ""
                _temp_awards += "　　" + awards_tag.find("h2").get_text(strip=True) + "\n"
                for specific in awards_tag.find_all("ul"):
                    _temp_awards += "　　" + specific.get_text(" ", strip=True) + "\n"

                awards += _temp_awards + "\n"
            self.ret.update({"awards": awards})

            # -*- 组合数据 -*-
            descr = ""
            for key, ft in douban_format:
                data = self.ret.get(key)
                if data:
                    if isinstance(data, list):
                        _temp = data[0]
                        for d in data[1:]:
                            _temp += "\n　　　　　　" + d
                        data = _temp
                    descr += ft.format(data)
            self.ret.update({"img": img_list, "format": descr, "success": True})

    def _gen_imdb(self, sid):
        # TODO 根据tt号先在豆瓣搜索，如果有则直接使用豆瓣解析结果，如果没有，则转而从imdb上解析数据。
        pass

    def _gen_bangumi(self, sid):
        raw_data_json = self.get_source(api_bangumi.format(sid), json=True)  # 通过API获取Json格式的数据

        if raw_data_json.get("error"):
            self.ret.update({"error": raw_data_json.get("error")})
        else:
            img_list = []  # 临时存储图片信息

            alt = raw_data_json.get("url")
            raw_data_page = self.get_source(alt, bs=True)  # 获取相应页面（用来获取API中未提供的信息），并用BeautifulSoup处理

            # -*- 清洗数据 -*-
            self.ret.update({"id": sid, "alt": alt})

            # Bangumi的封面图
            cover_img = ""
            for quality in ["large", "common", "medium", "small", "grid"]:
                try:
                    cover_img = raw_data_json["images"][quality]
                except AttributeError:
                    pass
                else:
                    img_list.append(cover_img)
                    break

            air_date = re.sub("(\d{4})-(\d{2})-(\d{2})", r"\1.\2", raw_data_json.get("air_date"))

            # 可以从raw_json中直接（或经过简单处理后）转移到返回数据中的信息
            self.ret.update({"cover_img": cover_img,
                             "story": raw_data_json["summary"],
                             "title": raw_data_json.get("name_cn"),
                             "air_date": air_date
                             })

            _cast = []
            for cast in raw_data_json.get("crt"):
                cast_name = cast.get("name_cn") or cast.get("name")
                cast_actors = ""
                if cast.get("actors"):
                    cast_actors = "\, ".join([actors.get("name") for actors in cast.get("actors")])
                _cast.append("{}: {}".format(cast_name, cast_actors))
                self.ret.update({"cast": _cast})

            _staff = []
            for staff_tag in raw_data_page.find("ul", id="infobox").find_all("li")[4:4 + 15]:
                _staff.append(staff_tag.get_text())
                self.ret.update({"staff": _staff})

            descr = ""
            for key, ft in bangumi_format:
                data = self.ret.get(key)
                if data:
                    if isinstance(data, list):
                        data = "\n".join(data)
                    descr += ft.format(data)
            descr += "(来源于 {} )".format(self.ret.get("alt"))

            self.ret.update({"img": img_list, "format": descr, "success": True})


if __name__ == '__main__':
    from pprint import pprint

    douban = Gen("https://movie.douban.com/subject/3008672/").get()
    # pprint(Gen("https://movie.douban.com/subject/3008672/").get())
    print(douban.get("format"))
    # pprint(Gen("https://bgm.tv/subject/203526").get())
