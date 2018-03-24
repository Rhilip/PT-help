# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import json
import requests
from bs4 import BeautifulSoup

__version__ = "0.2.2"
__author__ = "Rhilip"

douban_format = [
    # (key name in dict. the format of key, string format) with order
    ("poster", "[img]{}[/img]\n\n"),
    ("trans_title", "◎译　　名　{}\n"),
    ("this_title", "◎片　　名　{}\n"),
    ("year", "◎年　　代　{}\n"),
    ("region", "◎产　　地　{}\n"),
    ("genre", "◎类　　别　{}\n"),
    ("language", "◎语　　言　{}\n"),
    ("playdate", "◎上映日期　{}\n"),
    ("imdb_rating", "◎IMDb评分　{}\n"),
    ("imdb_link", "◎IMDb链接　{}\n"),
    ("douban_rating", "◎豆瓣评分　{}\n"),
    ("douban_link", "◎豆瓣链接　{}\n"),
    ("episodes", "◎集　　数　{}\n"),
    ("duration", "◎片　　长　{}\n"),
    ("director", "◎导　　演　{}\n"),
    ("writer", "◎编　　剧　{}\n"),
    ("cast", "◎主　　演　{}\n\n"),
    ("tags", "\n◎标　　签　{}\n"),
    ("introduction", "\n◎简　　介  \n\n　　{}\n"),
    ("awards", "\n◎获奖情况  \n\n{}\n"),
]

bangumi_format = [
    ("cover_img", "[img]{}[/img]\n\n"),
    ("story", "[b]Story: [/b]\n\n{}\n\n"),
    ("staff", "[b]Staff: [/b]\n\n{}\n\n"),
    ("cast", "[b]Cast: [/b]\n\n{}\n\n"),
]

support_list = [
    ("douban", re.compile("(https?://)?movie\.douban\.com/(subject|movie)/(?P<sid>\d+)/?")),
    ("imdb", re.compile("(https?://)?www\.imdb\.com/title/(?P<sid>tt\d+)")),
    # ("3dm", re.compile("(https?://)?bbs\.3dmgame\.com/thread-(?P<sid>\d+)(-1-1\.html)?")),
    # ("steam", re.compile("(https?://)?store\.steampowered\.com/app/(?P<sid>\d+)/?")),
    ("bangumi", re.compile("(https?://)?(bgm\.tv|bangumi\.tv|chii\.in)/subject/(?P<sid>\d+)/?")),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/61.0.3163.100 Safari/537.36 '
}


def get_page(url: str, json_=False, bs_=False, **kwargs):
    kwargs.setdefault("headers", headers)
    page = requests.get(url, **kwargs)
    page.encoding = "utf-8"
    return page.json() if json_ else (BeautifulSoup(page.text, "lxml") if bs_ else page.text)


class Gen(object):
    site = sid = url = ret = None
    img_list = []  # 临时存储图片信息

    def __init__(self, url: str):
        self.clear()
        self.pat(url)

    def pat(self, url: str):
        for site, pat in support_list:
            search = pat.search(url)
            if search:
                self.sid = search.group("sid")
                self.site = site
        if not self.site:
            self.ret["error"] = "No support link."

    def clear(self):
        self.site = self.sid = self.url = None
        self.img_list = []  # 临时存储图片信息
        self.ret = {
            "success": False,
            "error": None,
            "copyright": "Powered by @{}".format(__author__),
            "version": __version__
        }

    def gen(self, _debug=False):
        if not self.ret.get("error"):
            try:
                getattr(self, "_gen_{}".format(self.site))()
                self.ret["img"] = self.img_list
                self.ret["success"] = True if not self.ret.get("error") else False
            except Exception as err:
                self.ret["error"] = "Internal error, please connect @{}, thank you.".format(__author__)
                if _debug:
                    raise Exception("Internal error").with_traceback(err.__traceback__)
        return self.ret

    def _gen_douban(self):
        douban_link = "https://movie.douban.com/subject/{}/".format(self.sid)
        douban_page = get_page(douban_link, bs_=True)
        data = {"douban_link": douban_link}
        if douban_page.title.text == "页面不存在":
            self.ret["error"] = "The corresponding resource does not exist."
        else:
            # 对主页面进行解析
            data["chinese_title"] = (douban_page.title.text.replace("(豆瓣)", "").strip())
            data["foreign_title"] = (douban_page.find("span", property="v:itemreviewed").text
                                     .replace(data["chinese_title"], '').strip())

            def fetch(node):
                return node.next_element.next_element.strip()

            aka_anchor = douban_page.find("span", class_="pl", text=re.compile("又名"))
            data["aka"] = sorted(fetch(aka_anchor).split(' / ')) if aka_anchor else []

            if data["foreign_title"]:
                trans_title = data["chinese_title"] + (('/' + "/".join(data["aka"])) if data["aka"] else "")
                this_title = data["foreign_title"]
            else:
                trans_title = "/".join(data["aka"]) if data["aka"] else ""
                this_title = data["chinese_title"]

            data["trans_title"] = trans_title.split("/")
            data["this_title"] = this_title.split("/")

            region_anchor = douban_page.find("span", class_="pl", text=re.compile("制片国家/地区"))
            language_anchor = douban_page.find("span", class_="pl", text=re.compile("语言"))
            episodes_anchor = douban_page.find("span", class_="pl", text=re.compile("集数"))
            duration_anchor = douban_page.find("span", class_="pl", text=re.compile("单集片长"))
            imdb_link_anchor = douban_page.find("a", text=re.compile("tt\d+"))

            data["year"] = douban_page.find("span", class_="year").text[1:-1]  # 年代
            data["region"] = fetch(region_anchor).split(" / ") if region_anchor else []  # 产地
            data["genre"] = list(map(lambda l: l.text.strip(), douban_page.find_all("span", property="v:genre")))  # 类别
            data["language"] = fetch(language_anchor).split(" / ") if language_anchor else[]  # 语言
            data["playdate"] = sorted(map(lambda l: l.text.strip(),  # 上映日期
                                          douban_page.find_all("span", property="v:initialReleaseDate")))
            data["imdb_link"] = imdb_link_anchor.attrs["href"] if imdb_link_anchor else ""  # IMDb链接
            data["imdb_id"] = imdb_link_anchor.text if imdb_link_anchor else ""  # IMDb号
            data["episodes"] = fetch(episodes_anchor) if episodes_anchor else ""  # 集数

            if duration_anchor:  # 片长
                data["duration"] = fetch(duration_anchor)
            else:
                data["duration"] = douban_page.find("span", property="v:runtime").text.strip()

            # 请求其他资源
            if data["imdb_link"]:  # 该影片在豆瓣上存在IMDb链接
                imdb_source = ("https://p.media-imdb.com/static-content/documents/v1/title/{}/ratings%3Fjsonp="
                               "imdb.rating.run:imdb.api.title.ratings/data.json".format(data["imdb_id"]))
                try:
                    imdb_jsonp = get_page(imdb_source)  # 通过IMDb的API获取信息
                    if re.search("imdb.rating.run\((.+)\)", imdb_jsonp):
                        imdb_json = json.loads(re.search("imdb.rating.run\((.+)\)", imdb_jsonp).group(1))
                        imdb_average_rating = imdb_json["resource"]["rating"]
                        imdb_votes = imdb_json["resource"]["ratingCount"]
                        if imdb_average_rating and imdb_votes:
                            data["imdb_rating"] = "{}/10 from {} users".format(imdb_average_rating, imdb_votes)
                except Exception:
                    pass

            # 获取获奖情况
            awards = ""
            awards_page = get_page("https://movie.douban.com/subject/{}/awards".format(self.sid), bs_=True)
            for awards_tag in awards_page.find_all("div", class_="awards"):
                _temp_awards = ""
                _temp_awards += "　　" + awards_tag.find("h2").get_text(strip=True) + "\n"
                for specific in awards_tag.find_all("ul"):
                    _temp_awards += "　　" + specific.get_text(" ", strip=True) + "\n"

                awards += _temp_awards + "\n"

            data["awards"] = awards

            # 豆瓣评分，简介，海报，导演，编剧，演员，标签
            douban_api_json = get_page('https://api.douban.com/v2/movie/{}'.format(self.sid), json_=True)
            douban_average_rating = douban_api_json["rating"]["average"]
            douban_votes = douban_api_json["rating"]["numRaters"]
            data["douban_rating"] = "{}/10 from {} users".format(douban_average_rating, douban_votes)
            data["introduction"] = re.sub("^None$", "暂无相关剧情介绍", douban_api_json["summary"])
            data["poster"] = poster = re.sub("s(_ratio_poster|pic)", r"l\1", douban_api_json["image"])
            self.img_list.append(poster)

            data["director"] = douban_api_json["attrs"]["director"] if "director" in douban_api_json["attrs"] else []
            data["writer"] = douban_api_json["attrs"]["writer"] if "writer" in douban_api_json["attrs"] else []
            data["cast"] = douban_api_json["attrs"]["cast"] if "cast" in douban_api_json["attrs"] else ""
            data["tags"] = list(map(lambda member: member["name"], douban_api_json["tags"]))

            # -*- 组合数据 -*-
            descr = ""
            for key, ft in douban_format:
                _data = data.get(key)
                if _data:
                    if isinstance(_data, list):
                        join_fix = " / "
                        if key == "cast":
                            join_fix = "\n　　　　　　"
                        elif key == "tags":
                            join_fix = " | "
                        _data = join_fix.join(_data)
                    descr += ft.format(_data)
            self.ret["format"] = descr

        # 将清洗的数据一并发出
        self.ret.update(data)

    def _gen_imdb(self):
        douban_imdb_api = get_page("https://api.douban.com/v2/movie/imdb/{}".format(self.sid), json_=True)
        if douban_imdb_api.get("alt"):
            # 根据tt号先在豆瓣搜索，如果有则直接使用豆瓣解析结果
            self.pat(douban_imdb_api["alt"])
            self._gen_douban()
        else:  # TODO 如果没有，则转而从imdb上解析数据。
            self.ret["error"] = "Can't find this imdb_id in Douban."

    def _gen_bangumi(self):
        api_bangumi = "https://api.bgm.tv/subject/{}?responseGroup=large"
        raw_data_json = get_page(api_bangumi.format(self.sid), json_=True)  # 通过API获取Json格式的数据

        if raw_data_json.get("error"):
            self.ret.update({"error": raw_data_json.get("error")})
        else:
            alt = raw_data_json.get("url")
            raw_data_page = get_page(alt, bs_=True)  # 获取相应页面（用来获取API中未提供的信息），并用BeautifulSoup处理

            # -*- 清洗数据 -*-
            self.ret.update({"id": self.sid, "alt": alt})

            # Bangumi的封面图
            cover_img = ""
            for quality in ["large", "common", "medium", "small", "grid"]:
                try:
                    cover_img = raw_data_json["images"][quality]
                except AttributeError:
                    pass
                else:
                    self.img_list.append(cover_img)
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
                self.ret["cast"] = _cast

            _staff = []
            for staff_tag in raw_data_page.find("ul", id="infobox").find_all("li")[4:4 + 15]:
                _staff.append(staff_tag.get_text())
                self.ret["staff"] = _staff

            descr = ""
            for key, ft in bangumi_format:
                data = self.ret.get(key)
                if data:
                    if isinstance(data, list):
                        data = "\n".join(data)
                    descr += ft.format(data)
            descr += "(来源于 {} )".format(self.ret.get("alt"))

            self.ret.update({"format": descr})


if __name__ == '__main__':
    from pprint import pprint

    pprint(Gen("https://movie.douban.com/subject/10563794/").gen(_debug=True))

    # pprint(Gen("http://jdaklvhgfad.com/adfad").gen())  # No support link
    # pprint(Gen("https://movie.douban.com/subject/1308452130/").gen())  # Douban not exist
    # pprint(Gen("https://movie.douban.com/subject/3541415/").gen(_debug=True))  # Douban Normal Foreign
    # pprint(Gen("https://movie.douban.com/subject/1297880/").gen(_debug=True))  # Douban Normal Chinese
    # pprint(Gen("http://www.imdb.com/title/tt4925292/").gen(_debug=True))  # Imdb through Douban
    # pprint(Gen("https://bgm.tv/subject/2071342495").gen())  # Bangumi not exist
    # pprint(Gen("https://bgm.tv/subject/207195").gen(_debug=True))  # Bangumi Normal
