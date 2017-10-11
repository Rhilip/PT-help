
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
| token | 认证令牌 | string | Y | 由认证生成 |
| search | 查询字段 | string | N | 为空时获取当前最新列表，其他情况为搜索相关字段 |
| order | 排序类型 | string | N | 仅接收desc或asc，其他情况默认为desc |
| offset | 起始偏移量 | int | N | 默认为0 |
| limit | 获取数 | int | N | 默认为50，最大为200 |

### 5) 请求返回结果:

#### 回应报文

```json
{
  "cost": 0.0036730000000000373,       //  查询花费时间
  "error": null,                       //  错误信息(请求成功时为空，否则为具体理由)
  "quote": 24,                         //  该token剩余请求次数
  "rows": [                            //  查询字段（字典列表）
      {
          "link": "https://hdchina.org/details.php?id=275274",   // 种子链接
          "pubDate": 1505709168,                                 // 发布时间(timestamp)
          "sid": 275274,                                         // 种子序号
          "site": "HDChina",                                     // 发布站点
          "title": "The.Strain.S04.720p.HDTV.x264-Scene",        // 种子名称
          "uid": 42844                                           // 数据库记录顺序
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
  "success": true,                     // 请求状态（请求成功时为true，否则为false并在error字段中返回具体失败理由）
  "token": "<string>",                 // 返回请求token
  "total": 54286                       // 记录总条数（仅供参考）
}
```
#### error字段可能值

 > 该部分由 `module.token.get_token_record` 提供，并可能返回以下信息。
 
| 返回信息 | 字段说明 |
|-------------|:--------------|
| No token. | 请求字段中不存在token信息 |
| This token is not exist in database. | 数据库中无该token记录 |
| The quote of this token is exhaustion | 对应token使用尽配额 |
