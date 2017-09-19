
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
| order | 排序类型 | string | N | 仅接收desc或asc，其他情况默认为desc |
| offset | 起始偏移量 | int | N | 默认为0 |
| limit | 获取数 | int | N | 默认为50，最大为200 |

### 5) 请求返回结果:

```
{
  "cost": 0.0036730000000000373,       //  查询花费时间
  "rows": [                            //  查询字段（字典列表）
      {
          link: "https://hdchina.org/details.php?id=275274",   // 种子链接
          pubDate: 1505709168,                                 // 发布时间(timestamp)
          sid: 275274,                                         // 种子序号
          site: "HDChina",                                     // 发布站点
          title: "The.Strain.S04.720p.HDTV.x264-Scene",        // 种子名称
          uid: 42844                                           // 数据库记录顺序
      },
      {
          link: "http://nanyangpt.com/details.php?id=42969",
          pubDate: 1505706340,
          sid: 42969,
          site: "NYPT",
          title: "[血族/嗜血菌株][The.Strain.S04E10.720p.HDTV.x264-FLEET][S04E10]",
          uid: 40994
      },
    .......
  ], 
  "total": 54286                       // 记录总条数（搜索时为具体条数，其他情况为粗略条数）
}

```
