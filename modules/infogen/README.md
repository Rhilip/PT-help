
## 接口名称

PT站点用简介生成工具

### 1) 请求地址

> https://api.rhilip.info/tool/movieinfo/gen

### 2) 调用方式：HTTP get|post

### 3) 接口描述：

* 从douban、Bangumi等资源站点抓取并生成符合Pt站点规范种子信息简介

### 4) 请求参数:

#### 参数:

|字段名称       |字段说明         |类型            |必填            |说明     |
| -------------|:--------------:|:--------------:|:--------------:|:------|
| url | 资源链接 | string | N | 具体接收链接形式见下表 |
| site | 站点标识 | string | N | 资源站点，具体传入值见下表，在无url值传入时会使用 |
| sid | 资源id | string or int | N | 在对应资源站点的id值，在无url值传入时会使用 |

> 注意：你必须选择传入 `&url=....` 或 `&site=...&sid=...` 且  `&url=....` 的优先级更高，
如果两个传入类型均未发现，则会被重定向(301)到本页

#### 可接收的url列表

| 站点类型 | 站点标识 | 网址示例 |
|-------------|:---:|:--------------|
| 豆瓣 Douban | douban | https://movie.douban.com/subject/:d |
| IMDb | imdb | https://www.imdb.com/title/tt:d |
| 番组计划| bangumi | https://bgm.tv/subject/:d , http://bangumi.tv/subject/:d , http://chii.in/subject/:d |
| Steam | steam | https://steamcommunity.com/app/:d , http://store.steampowered.com/app/:d , http://store.steampowered.com/app/:d/:s |

> 注意：在`v0.4.0`之前，imdb链接会通过豆瓣查询并生成对应的豆瓣信息，而之后需要
以 `&site=douban&sid=tt\d{7,8}`的形式传入查询参数时，才会尝试从Douban查询对应IMDb号的豆瓣信息，
> 注意： `v0.6.0`之后，不再支持通过豆瓣查询并生成对应的豆瓣信息

### 5) 请求返回结果示例:

#### 共有字段

|字段名称       |字段说明         |类型            |
| -------------|:--------------:|:--------------:|
| cost | 请求开销时间 | float | 
| success | 请求成功情况 | bool |
| error | 请求错误信息 | string |
| copyright | 版权说明信息 | string |
| version | 版本信息 | string |
| img | 图片列表 | list |
| format | 以BBcode格式整理的完整可用简介 | string |


#### 豆瓣链接

```json
{
 "aka": ["全面启动(台)", "奠基", "心灵犯案", "潜行凶间(港)", "记忆迷阵", "记忆魔方"],
 "awards": "第83届奥斯卡金像奖  (2011)\n.........",
 "cast": ["莱昂纳多·迪卡普里奥 Leonardo DiCaprio",
          "约瑟夫·高登-莱维特 Joseph Gordon-Levitt",
          "艾伦·佩吉 Ellen Page",
          "汤姆·哈迪 Tom Hardy",
          "渡边谦 Ken Watanabe (I)",
          "迪利普·劳 Dileep Rao",
          "希里安·墨菲 Cillian Murphy",
          "汤姆·贝伦杰 Tom Berenger"],
 "chinese_title": "盗梦空间",
 "copyright": "Powered by @Rhilip. With Gen Version `0.2.1`",
 "director": ["克里斯托弗·诺兰 Christopher Nolan"],
 "douban_rating": "9.3/10 from 837657 users",
 "duration": "148分钟",
 "episodes": "",
 "error": null,
 "foreign_title": "Inception",
 "format": "[img]https://img3.doubanio.com/view/photo/l_ratio_poster/public/p513344864.jpg[/img]\n\n◎译    名  盗梦空间.....",
 "genre": ["剧情", "科幻", "悬疑", "冒险"],
 "imdb_id": "tt1375666",
 "imdb_link": "http://www.imdb.com/title/tt1375666",
 "imdb_rating": "8.8/10 from 1685906 users",
 "img": ["https://img3.doubanio.com/view/photo/l_ratio_poster/public/p513344864.jpg"],
 "introduction": "道姆·柯布（莱昂纳多·迪卡普里奥 Leonardo DiCaprio 饰）与同事阿瑟（约瑟夫·戈登-莱维特 Joseph.....",
 "language": ["英语", "日语", "法语"],
 "playdate": ["2010-07-16(美国)", "2010-09-01(中国大陆)"],
 "poster": "https://img3.doubanio.com/view/photo/l_ratio_poster/public/p513344864.jpg",
 "region": ["美国", "英国"],
 "success": true,
 "tags": ["科幻", "悬疑", "美国", "心理", "剧情", "经典", "哲学", "2010"],
 "this_title": ["Inception"],
 "trans_title": ["盗梦空间", "全面启动(台)", "奠基", "心灵犯案", "潜行凶间(港)", "记忆迷阵", "记忆魔方"],
 "version": "0.2.1",
 "writer": ["克里斯托弗·诺兰 Christopher Nolan"],
 "year": "2010"
}
```

#### IMDb链接
```json
{
  "@type":"Movie",
  "actors":[
    {
      "name":"Tim Robbins",
      "url":"/name/nm0000209/"
    }
  ],
  "aka":[
    {
      "country":"(original title)",
      "title":"The Shawshank Redemption"
    }
  ],
  "contentRating":"R",
  "copyright":"Powered by @Rhilip",
  "creators":[
    {
      "name":"Stephen King",
      "url":"/name/nm0000175/"
    }
  ],
  "critic":213,
  "datePublished":"1994-10-14",
  "description":"The Shawshank Redemption is a movie starring Tim Robbins, Morgan Freeman, and Bob Gunton. Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  "details":{
    "Also Known As":"Rita Hayworth and Shawshank Redemption",
    "Aspect Ratio":"1.85 : 1",
    "Budget":"$25,000,000 (estimated)",
    "Color":"Color",
    "Country":"USA",
    "Cumulative Worldwide Gross":"$58,500,000",
    "Filming Locations":"St. Croix, U.S. Virgin Islands",
    "Gross USA":"$28,341,469",
    "Language":"English",
    "Official Sites":"Official Facebook",
    "Opening Weekend USA":"$727,326, 20 November 1994 , Limited Release",
    "Production Co":"Castle Rock Entertainment",
    "Release Date":"14 October 1994 (USA)",
    "Runtime":"142 min",
    "Sound Mix":"Dolby Digital | SDDS"
  },
  "directors":[
    {
      "name":"Frank Darabont",
      "url":"/name/nm0001104/"
    }
  ],
  "duration":"PT2H22M",
  "error":null,
  "format":"[img]https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg[/img]\n\nTitle: The Shawshank Redemption\nKeywords: wrongful imprisonment, escape from prison, based on the works of stephen king, prison, voice over narration\nDate Published: 1994-10-14\nIMDb Rating: 9.3/10 from 2071927 users\nIMDb Link: https://www.imdb.com/title/tt0111161/\nDirectors: Frank Darabont\nCreators: Stephen King / Frank Darabont\nActors: Tim Robbins / Morgan Freeman / Bob Gunton / William Sadler\n\nIntroduction\n    The Shawshank Redemption is a movie starring Tim Robbins, Morgan Freeman, and Bob Gunton. Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.\n",
  "genre":"Drama",
  "imdb_id":"tt0111161",
  "imdb_link":"https://www.imdb.com/title/tt0111161/",
  "imdb_rating":"9.3/10 from 2071927 users",
  "imdb_rating_average":"9.3",
  "imdb_votes":2071927,
  "img":[
    "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  ],
  "keywords":[
    "wrongful imprisonment",
    "escape from prison",
    "based on the works of stephen king",
    "prison",
    "voice over narration"
  ],
  "metascore":"80",
  "name":"The Shawshank Redemption",
  "popularity":90,
  "poster":"https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
  "release_date":[
    {
      "country":"Canada",
      "date":"10 September 1994"
    }
  ],
  "reviews":6298,
  "success":true,
  "version":"0.3.8",
  "year":"1994"
}
```


#### Bangumi链接
```json
{
    "air_date": "2010.01", 
    "alt": "http://bgm.tv/subject/3326", 
    "cast": [
        "姬路瑞希: 原田ひとみ", 
        "吉井明久: 下野紘", 
        "木下秀吉: 加藤英美里", 
        "岛田美波: 水橋かおり", 
        "坂本雄二: 鈴木達央", 
        "土屋康太: 宮田幸季", 
        "雾岛翔子: 磯村知美", 
        "木下优子: 加藤英美里", 
        "须川亮: 後藤啓介"
    ], 
    "copyright": "Powered by @Rhilip. With Gen Version `0.1.0`", 
    "cover_img": "http://lain.bgm.tv/pic/cover/l/db/a1/3326_X7oUu.jpg", 
    "error": null, 
    "format": "http://lain.bgm.tv/pic/cover/l/db/a1/3326_X7oUu.jpg\n.........(来源于 http://bgm.tv/subject/3326 )", 
    "id": "3326", 
    "img": [
        "http://lain.bgm.tv/pic/cover/l/db/a1/3326_X7oUu.jpg"
    ], 
    "staff": [
        "原作: 井上堅二", 
        "导演: 大沼心", 
        "脚本: 高山カツヒコ", 
        "分镜: ワタナベシンイチ、川口敬一郎、岩畑剛一、斉藤良成、細田直人、あおきえい、大沼心", 
        "演出: 土屋康郎、笹原嘉文、福多潤、吉本毅、斉藤良成、ワタナベシンイチ、大沼心", 
        "音乐: 虹音、松田彬人", 
        "人物原案: 葉賀ユイ", 
        "人物设定: 大島美和", 
        "系列构成: 高山カツヒコ", 
        "色彩设计: 木幡美雪", 
        "总作画监督: 大島美和、野田めぐみ", 
        "作画监督: 鈴木奈都子、森前和也、石田啓一、谷口繁則、山吉一幸、松浦里美、佐々木貴宏、野田めぐみ、竹森由加、長谷川亨雄、渡辺亜彩美", 
        "摄影监督: 中西康祐", 
        "原画: 三浦貴博、遠藤大輔、小美野雅彦、なかじまちゅうじ", 
        "剪辑: たぐまじゅん"
    ], 
    "story": "文月学园的学生的学习成绩一直十分低下，而在偶然的机会下，学园以科学和超自然能力为基础开发出了“考试召唤系统”，系统的应用在学园里掀起了一股新风潮。学园实行按成绩分班制，主人公·吉井明久自信满满地接受了考试，而迎接他的却是最差的班级·F班，这里的教室简直简陋得不像教室。为了改善现状，就要在以召唤兽来战斗的战争“试召战争”中获胜。一部新感觉战斗学园恋爱喜剧诞生了！", 
    "success": true, 
    "title": "笨蛋，测验，召唤兽"
}
```

#### error字段可能值

1. `No support link.`: 输入的链接格式不在上表支持范围内
2. `The corresponding resource does not exist.`: 资源不存在（或资源不能公开访问）
3. `Internal error, please connect @{author}, thank you.`: 内部处理错误

### 6） 接口更新历史

