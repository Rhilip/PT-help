# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from gen import Gen

if __name__ == '__main__':
    test_link_list = [
        # "http://jdaklvhgfad.com/adfad",  # No support link
        # "https://movie.douban.com/subject/1308452130/",  # Douban not exist
        # "https://movie.douban.com/subject/3541415/",  # Douban Normal Foreign
        # "https://movie.douban.com/subject/1297880/",  # Douban Normal Chinese
        # "http://www.imdb.com/title/tt4925292/",  # Imdb through Douban
        # "https://bgm.tv/subject/2071342495",  # Bangumi not exist
        # "https://bgm.tv/subject/207195",  # Bangumi Normal
        # "https://bgm.tv/subject/212279/",  # Bangumi Multiple characters
        # "https://www.imdb.com/title/tt0083662/",  # Fix without duration and douban rate
        # "http://store.steampowered.com/app/20650135465430/",  # Steam Not Exist
        # "http://store.steampowered.com/app/550/",  # Steam Short Link (Store)
        # "http://store.steampowered.com/app/240720/Getting_Over_It_with_Bennett_Foddy/",  # Steam Full Link
        # "https://steamcommunity.com/app/668630",  # Another Type of Steam Link (Hub)
        # "http://store.steampowered.com/app/420110",  # Steam Link With Age Check (One click type)
        # "http://store.steampowered.com/app/489830/",  # Steam Link With Age Check (Birth Choose type)
    ]

    for link in test_link_list:
        print("Test link: {}".format(link))
        gen = Gen(link).gen(_debug=True)
        if gen["success"]:
            print("Format text:\n", gen["format"])
        else:
            print("Error : {}".format(gen["error"]))
        print("--------------------")
