
## 接口名称

PT站点用简介生成工具

### 1) 请求地址

> https://api.rhilip.info/tool/movieinfo/gen

### 2) 调用方式：HTTP post

### 3) 接口描述：

* 从douban、Bangumi抓取并生成符合Pt站点规范种子信息简介

### 4) 请求参数:

#### POST参数:
|字段名称       |字段说明         |类型            |必填            |说明     |
| -------------|:--------------:|:--------------:|:--------------:|:------|
| url | 资源网址 | string | Y | 具体接收链接形式见下表 |

> 注：接口同时支持使用GET形式请求，参数同POST，但不建议使用

#### 可接收的url列表
| 站点类型 | 网址示例 |
|-------------|:--------------|
| 豆瓣 Douban | https://movie.douban.com/subject/:d |
| 番组计划| 	https://bgm.tv/subject/:d |
| 番组计划| 	http://bangumi.tv/subject/:d |
| 番组计划| 	http://chii.in/subject/:d |

### 5) 请求返回结果:

#### 豆瓣链接

```json
{
    "alt": "https://movie.douban.com/subject/3008672/", 
    "awards": "  第83届奥斯卡金像奖(2011)\n...........", 
    "casts": [
        "哈维尔·巴登  Javier Bardem", 
        "马里塞尔·阿尔瓦雷斯  Maricel Álvarez", 
        "布兰卡·波蒂略  Blanca Portillo", 
        "鲁文·奥昌迪亚诺  Rubén Ochandiano"
    ], 
    "copyright": "Powered by @Rhilip. With Gen Version `0.1.0`", 
    "countries": "墨西哥 / 西班牙", 
    "cover_img": "https://img3.doubanio.com/view/photo/raw/public/p553292146.jpg", 
    "directors": [
        "亚利桑德罗·冈萨雷斯·伊纳里图  Alejandro González Iñárritu"
    ], 
    "douban_link": "https://movie.douban.com/subject/3008672", 
    "douban_rate": "8/10 from 12531 users", 
    "error": null, 
    "format": "◎译  名 美错 / 最后的美丽(台) / 美丽末日(港)\n◎片  名 Biutiful.........", 
    "genres": "剧情", 
    "id": "3008672", 
    "imdb_id": "tt1164999", 
    "imdb_link": "http://www.imdb.com/title/tt1164999/", 
    "imdb_rate": "7.5/10 from 74531 users", 
    "img": [
        "https://img3.doubanio.com/view/photo/raw/public/p553292146.jpg", 
        "https://images-na.ssl-images-amazon.com/images/M/MV5BMzI4OTQ0MDQyNl5BMl5BanBnXkFtZTcwODY5MjQwNA@@._V1_.jpg"
    ], 
    "lang": "英语 / 西班牙语 / 法语 / 汉语普通话", 
    "length": "148分钟", 
    "original_title": "Biutiful", 
    "pubdate": "2010-10-15(西班牙)", 
    "success": true, 
    "summary": "乌西巴尔（哈维尔·巴登 Javier Barden ..........", 
    "title": "美错 / 最后的美丽(台) / 美丽末日(港)", 
    "year": "2010"
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

主要由上层资源站点提供，当输入的链接格式不在上表支持范围内，会抛出`No support link.`
