
## 接口名称

Pt站点高级搜索

### 1) 请求地址

> https://api.rhilip.info/tool/ptboard

### 2) 调用方式：HTTP get

### 3) 接口描述：

* 一站式搜索多数Pt站点最新的种子信息

### 4) 请求参数:

#### GET参数:
|字段名称       |字段说明         |类型            |必填            |说明     |
| -------------|:--------------:|:--------------:|:--------------:|:------|
| search | 查询字段 | string | N | 为空时获取当前最新列表，其他情况为搜索相关字段 |
| order | 排序类型 | string ("desc" or "asc") | N | 仅接收desc或asc，其他情况默认为desc |
| site | 查询站点 | string | N | 查询站点名称，留空或为`Site列表`中的值。留空时获取全部站点；多个站点联合查询请用 `,` 分割，关系为`OR` |
| no_site | 排除站点 | string | N | 排除站点名称，留空或为`Site列表`中的值。留空时不排除；多个站点联合查询请用 `,` 分割，关系为`AND` |
| start_time | 时间段开始时间 | int(timestamp) | N | 默认为0 |
| ent_time | 时间段结束时间 | int(timestamp) | N | 默认为查询时Unix时间戳 |
| offset | 起始偏移量 | int | N | 默认为0 |
| limit | 获取数 | int | N | 默认为50，最大为200 |

#### Site列表
| 站点类型 | 允许字段 |
|-------------|:--------------|
| 国内教育网站 | BYR, 6V (Not Live Update), NPU, WHU, NWSUAF6, XAUAT6, ZX, NYPT, SJTU, CUGB, ~~Antsoul~~, HUDBT|
| 国内公网站点| HDSKY, Hyperay, HDChina, HDHome, HDTime, HDU, JoyHD, CHDBits, Ourbits, OpenCD, SolaGS, TTHD, KeepFrds, TCCF, U2, CMCT, MTeam, GZTown, TTG, HDCity, CCFBits, HD4FANS|
| 国外站点| - |
| PreDB| PreDB |

### 5) 请求返回结果:

#### 回应报文示例

```json
{
  "cost": 0.0036730000000000373,
  "error": null,
  "rows": [
      {
          "link": "https://hdchina.org/details.php?id=275274",
          "pubDate": 1505709168,                          
          "sid": 275274,                              
          "site": "HDChina",                                
          "title": "The.Strain.S04.720p.HDTV.x264-Scene",   
          "uid": 42844                                     
      },
      {
          "link": "http://nanyangpt.com/details.php?id=42969",
          "pubDate": 1505706340,
          "sid": 42969,
          "site": "NYPT",
          "title": "[血族/嗜血菌株][The.Strain.S04E10.720p.HDTV.x264-FLEET][S04E10]",
          "uid": 40994
      }
  ], 
  "success": true,   
  "total": 54286    
}
```

#### 字段说明
| 返回字段 | 字段信息 |    类型    |
|-------------|:--------------|:--------------:|
| cost | 查询花费时间 | float |
| error | 错误信息(请求成功时为空，否则为具体理由，见下表) | string |
| rows | 查询具体信息（字典列表），具体见下表 | list |
| token | 返回请求token | string |
| total | 存在搜索字段时，返回受影响的条数（min{limit, total-record}），否则返回记录总条数 | int |

#### rows字段说明
| 返回字段 | 字段信息 |   类型    |
|-------------|:--------------|:--------------:|
| link | 种子链接 | string |
| pubDate | 发布时间 | timestamp |
| sid | 种子序号 | int |
| site | 发布站点 | string |
| title | 种子名称 | string |
| uid | 数据库记录顺序 | int |

#### error字段可能值

 > 该部分由 `module.token.get_token_record` 提供，并可能返回以下信息。
 
| 返回信息 | 字段说明 |
|-------------|:--------------|
| No token. | 请求字段中不存在token信息 |
| This token is not exist in database. | 数据库中无该token记录 |
| The quote of this token is exhaustion | 对应token使用尽配额 |
