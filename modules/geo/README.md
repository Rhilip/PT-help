
## 接口名称
IPv4、IPv6通用地址反查工具

### 1) 请求地址

> https://api.rhilip.info/tool/geo?ip={ip}

### 2) 调用方式：HTTP get

### 3) 接口描述：

* 通过IP地址反查相关地址。
* 使用数据库：`ipv6wry.db(20190209)` 、 `qqwry.dat(20190305)`

### 4) 请求参数:

#### GET参数:
|字段名称       |字段说明         |类型            |必填            |备注     |
| -------------|:--------------:|:--------------:|:--------------:| ------:|
|ip|IP address|string|Y|IPv4 or IPv6|


### 5) 请求返回结果:

#### 请求成功
```
{
  "ip": "2402:f000:1:1141:211:32ff:fe6b",
  "loc": "北京市 清华大学",
  "stats": "Success"
}
```
#### 请求失败
- 请求param中没有ip字段

```
{
  "ip": null,
  "loc": null,
  "stats": "Not Find IP address."
}
```

- ip地址格式错误

```
{
  "ip": "asdfas",
  "loc": null,
  "stats": "Can't Format IP address."
}
```

