# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

"""
这是一个用来"回溯"爬取NexusPHP构架的PT站点,并从中获取种子信息（种子序号、种子名、种子链接、发布时间）
仅作示例！！！！！！！！！！！！！

请注意：食用前请先配置好依赖并填好配置项，并将对应站点的时间类型改为“发生时间”
建议的食用顺序为：RSS >> list >>>>> id
"""

import re
import time
import feedparser
import dateutil.parser
from html import unescape
from http.cookies import SimpleCookie

import requests
import pymysql
from bs4 import BeautifulSoup

# -*- 配置
db_host = "localhost"
db_port = 3306
db_user = "user"
db_password = "password"
db_db = "db"

site_config = [
    # # 这是按照RSS源爬取的配置
    {
        "name": "NexusPHP",  # 站点名称
        "rss_url": "https://nexusphp.com/torrentrss.php",  # 站点RSS地址（如需passkey认证请带上）
        "rows": 50,  # 单次请求数
        "max_torrent": 125, # 该站点最大种子号
        "start_torrent": 0,  # 种子起始范围（仅用来限定，适用于爬取到一半进程停止的情况重爬）
        "end_torrent": 9999999,  # 种子结束范围（仅用来限定）
        "search_type": "rss",  # 回爬方式 ENUM("list", "id", "rss")
        # "enable": True  # 如果启用该方法，请取消该注释
    },
    # # 这是按照种子列表页爬取的配置（注意将站点的时间显示方式改为"发生时间"）
    {
        "name": "NexusPHP",  # 站点名称
        "page_url": "https://nexusphp.com/torrents.php?incldead=0&page={}",  # 站点包含死种的分页地址，请请将分页用{}替代
        "torrent_url": "https://nexusphp.com/details.php?id={}&hit=1",  # 站点种子页面，请将种子id用{}替代
        "start_page": 0,  # 抓取起始页
        "end_page": 2,  # 抓取结束页（请使用站点最后一页的分页号）
        "start_torrent": 0,  # 种子起始范围（仅用来限定，适用于爬取到一半进程停止的情况重爬）
        "end_torrent": 9999999,  # 种子结束范围（仅用来限定）
        "cookies": "",  # 站点Cookies
        "search_type": "list",  # 回爬方式
        # "enable": True,    # 如果启用该方法，请取消该注释
    },
    # # 这是按照种子详情页爬取的配置
    {
        "name": "NexusPHP",  # 站点名称
        "torrent_url": "https://nexusphp.com/details.php?id={}&hit=1",  # 站点种子页面，请将种子id用{}替代
        "start_torrent": 0,  # 种子起始范围
        "end_torrent": 999,  # 种子结束范围
        "title_ptn": "title>.+?(&quot;)?(?P<title>.+)(&quot;)? - Powered by NexusPHP",  # 种子页面标题信息中的主标题信息
        "cookies": "",  # 站点Cookies
        "search_type": "id",  # 回爬方式
        # "enable": True,    # 如果启用该方法，请取消该注释
    },
]



# -*- 结束配置

# 构造数据库连接池
db = pymysql.connect(host=db_host, port=db_port, user=db_user, password=db_password, db=db_db,
                     autocommit=True, charset='utf8')
cursor = db.cursor()

headers = {
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
}
feedparser.USER_AGENT = 'FlexGet/2.10.61 (www.flexget.com)'

def cookies_raw2jar(raw: str) -> dict:
    """
    Arrange Cookies from raw using SimpleCookies
    """
    cookie = SimpleCookie(raw)
    sort_cookies = {}
    for key, morsel in cookie.items():
        sort_cookies[key] = morsel.value
    return sort_cookies


def has_title(tag):
    ret = False
    if tag.name == "a" and tag.has_attr('title'):
        if re.search("^details\.php\?id=(\d+)&hit=1$", tag["href"]):
            if tag.find("b"):
                ret = True
    return ret


def string_sort(string):
    string = re.sub("[\n\r]", " ", string)
    return pymysql.escape_string(string)


insert_sql = (
    "INSERT INTO `ptboard_record` (`sid`,`site`,`title`,`link`,`pubDate`) "
    "VALUES ('{sid}','{site}', '{title}','{link}', '{pubDate}')"
)


def wrap_insert(site, sid, title, link, pubdate, t):
    try:
        cursor.execute(insert_sql.format(sid=sid, site=site, title=title, link=link, pubDate=pubdate))
    except pymysql.Error:
        pass
    else:
        print("Site: {}, ID: {}, Cost: {:.5f} s, "
              "pubDate: {}, Title: {}".format(site, sid, time.time() - t, pubdate, title))


def backtracking_list(site):
    cookies = cookies_raw2jar(site['cookies'])
    for page in range(site['start_page'], site['end_page'] + 2):
        t0 = time.time()

        list_page = requests.get(site['page_url'].format(page), cookies=cookies, headers=headers)
        list_page.encoding = "utf-8"  # 修改编码
        list_page_bs = BeautifulSoup(list_page.text, "lxml")  # 使用BeautifulSoup库解析页面

        tid_list = list_page_bs.find_all(has_title)

        for tid_tag in tid_list:
            # tid_tag = tid_list[0]
            t1 = time.time()

            # 种子编号
            _tid = int(re.search("details\.php\?id=(?P<id>\d+)&hit=1", tid_tag["href"]).group("id"))
            if _tid in range(site['start_torrent'], site['end_torrent']):
            # 种子标题
                try:
                    _title = tid_tag["title"]
                    # title = tid_tag.parent.get_text(" | ", strip=True)
                    # title = re.sub(re.escape(" | [ | 热门 | ]"), "", title)
                except KeyError:
                    _title = tid_tag.text
                _title = string_sort(_title)

                # 种子链接
                _link = site['torrent_url'].format(_tid)

                # 种子发布时间
                _timestamp = 0
                for i in tid_tag.parent.parent.parent.parent.parent.find_all("td", class_="nowrap"):
                    try:  # ↑ 此处（parent层级）可能出错
                        pubDate_raw = time.strptime(i.get_text(" "), "%Y-%m-%d %H:%M:%S")
                    except ValueError:
                        pass
                    else:
                        _timestamp = int(time.mktime(pubDate_raw))
                        break

                wrap_insert(site=site['name'], sid=_tid, title=_title, link=_link, pubdate=_timestamp, t=t1)

        print("Pages: {p} Over, Cost: {t:.5f} s".format(p=page, t=time.time() - t0))

        time.sleep(5)


def backtracking_id(site):
    cookies = cookies_raw2jar(site['cookies'])
    for _tid in range(site['start_torrent'], site['end_torrent'] + 2):
        t0 = time.time()

        _link = site['torrent_url'].format(_tid)
        torrent_page = requests.get(_link, cookies=cookies, headers=headers)
        title_search = re.search(site['search_ptn'], torrent_page.text)

        if title_search:
            _title = pymysql.escape_string(unescape(title_search.group("title")))
            pubDate = re.search("发布于(.+?)<", torrent_page.text).group(1)
            _timestamp = time.mktime(time.strptime(pubDate, "%Y-%m-%d %H:%M:%S"))

            wrap_insert(site=site['name'], sid=_tid, title=_title, link=_link, pubdate=_timestamp, t=t0)
        else:
            print("ID: {}, Cost: {:.5f} s, No torrent.".format(_tid, time.time() - t0))

        time.sleep(2)

def backtracking_rss(site):
    for startindex in range(0, site['max_torrent'] + site['rows'], site['rows']):
        feed_data = requests.get(site["rss_url"],params={'rows': site['rows'], 'startindex': startindex})
        print(feed_data.url)
        feed = feedparser.parse(feed_data.text)
        feed_entries = feed.entries
        if feed_entries:
            for item in feed_entries:
                t0 = time.time()
                _tid = int(re.search("(id=|(torrents|t)/)(?P<id>\d+)", item.link).group("id"))

                _title = string_sort(item.title)
                if hasattr(item, "published"):
                    _timestamp = dateutil.parser.parse(item.published).timestamp()
                else:
                    if site['name'] == "CCFBits":
                        time_string_from_des = re.search("(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", item.summary)
                        time_string = time_string_from_des.group(1) + " +0000"
                        _timestamp = dateutil.parser.parse(time_string).timestamp()
                    else:
                        _timestamp = time.time()

                    # re.sub("&?passkey=[0-9a-zA-Z]{32}", "", item.link)

                wrap_insert(site=site['name'], sid=_tid, title=_title, link=item.link, pubdate=_timestamp, t=t0)
        else:
            break

if __name__ == "__main__":
    t = time.time()
    for site in site_config:
        if site.get("enable", False):
            locals()["backtracking_" + site["search_type"]](site)

    print("END AT: {}, Total Cost {:.5f} s".format(time.asctime(time.localtime(time.time())), time.time() - t))
