# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

"""
这是一个用来"回溯"爬取NexusPHP构架的PT站点,并从中获取种子信息（种子序号、种子名、种子链接、发布时间）
本脚本直接爬取种子列表页，属于“快速爬取”，仅适用于对原构架改动不大的站点，如需按id全部点取或不适应的话，请使用另一脚本。

请注意：食用前请先配置好依赖并填好配置项，并将对应站点的时间类型改为“发生时间”
"""

import re
import time
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
    {
        "name": "NexusPHP",  # 站点名称
        "page_url": "https://nexusphp.com/torrents.php?incldead=0&page={}",  # 站点包含死种的分页地址，请请将分页用{}替代
        "torrent_url": "https://nexusphp.com/details.php?id={}&hit=1",  # 站点种子页面，请将种子id用{}替代
        "start_page": 0,  # 抓取起始页
        "end_page": 20,  # 抓取结束页（请使用站点最后一页的分页号）
        "start_torrent": 0,  # 种子起始范围（仅用来限定，适用于爬取到一半进程停止的情况重爬）
        "end_torrent": 9999999,  # 种子结束范围（仅用来限定）
        "cookies": ""  # 站点Cookies
    },
    # 另一站点信息
]

# -*- 结束配置

# 构造数据库连接池
db = pymysql.connect(host=db_host, port=db_port, user=db_user, password=db_password, db=db_db,
                     autocommit=True, charset='utf8')
cursor = db.cursor()

headers = {
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
}

insert_sql = (
    "INSERT INTO `ptboard_record` (`sid`,`site`,`title`,`link`,`pubDate`) "
    "VALUES ('{sid}','{site}', '{title}','{link}', '{pubDate}')"
)


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


if __name__ == "__main__":
    for site in site_config:
        # 构造站点Cookies
        cookies = cookies_raw2jar(site['cookies'])

        for page in range(site['start_page'], site['end_page'] + 2):
            t0 = time.time()

            error_get = 0
            while error_get < 4:
                try:  # 获取种子列表页
                    list_page = requests.get(site['page_url'].format(page), cookies=cookies, headers=headers)
                except OSError:  # 防止站点无响应
                    error_get += 1
                    time.sleep((error_get + 1) ** 2)
                else:
                    list_page.encoding = "utf-8"  # 修改编码
                    list_page_bs = BeautifulSoup(list_page.text, "lxml")  # 使用BeautifulSoup库解析页面

                    tid_list = list_page_bs.find_all(has_title)

                    for tid_tag in tid_list:
                        # tid_tag = tid_list[0]
                        t1 = time.time()
                        tid = int(re.search("details\.php\?id=(?P<id>\d+)&hit=1", tid_tag["href"]).group("id"))  # 种子编号

                        if tid in range(site['start_torrent'], site['end_torrent']):
                            # 种子标题
                            try:
                                title = tid_tag["title"]
                                # title = tid_tag.parent.get_text(" | ", strip=True)
                                # title = re.sub(re.escape(" | [ | 热门 | ]"), "", title)
                            except KeyError:
                                title = tid_tag.text
                            title = string_sort(title)

                            # 种子链接
                            link = site['torrent_url'].format(tid)

                            # 种子发布时间
                            timestamp = 0
                            for i in tid_tag.parent.parent.parent.parent.parent.find_all("td", class_="nowrap"):
                                try:
                                    pubDate_raw = time.strptime(i.get_text(" "), "%Y-%m-%d %H:%M:%S")
                                except ValueError:
                                    pass
                                else:
                                    timestamp = int(time.mktime(pubDate_raw))
                                    break

                            sql = insert_sql.format(sid=tid, site=site['name'], title=title,
                                                    link=link, pubDate=timestamp)

                            try:
                                cursor.execute(sql)
                            except pymysql.Error:
                                pass
                            else:
                                print("Page: {}, ID: {}, Cost: {:.5f} s, "
                                      "pubDate: {}, Title: {}".format(page, tid, time.time() - t1, timestamp, title))

            print("Pages: {p} Over, Cost: {t:.5f} s".format(p=page, t=time.time() - t0))
            time.sleep(5)

    print("END AT: {}".format(time.asctime(time.localtime(time.time()))))
