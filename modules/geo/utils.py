# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

import re
import os

dir = os.path.dirname(__file__)

v4db_path = os.path.join(dir, 'db/qqwry.dat')
v6db_path = os.path.join(dir, 'db/ipv6wry.db')

v6ptn = re.compile(r'^[0-9a-f:.]{3,51}$')
v4ptn = re.compile(r'.*((25[0-5]|2[0-4]\d|[0-1]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[0-1]?\d\d?)$')


def parseIpv4(ip):
    sep = ip.rfind(':')
    if sep >= 0:
        ip = ip[sep + 1:]
    if v4ptn.match(ip) is None:
        return -1
    v4 = 0
    for sub in ip.split('.'):
        v4 = v4 * 0x100 + int(sub)
    return v4


def parseIpv6(ip):
    if v6ptn.match(ip) is None:
        return -1
    count = ip.count(':')
    if count >= 8 or count < 2:
        return -1
    ip = ip.replace('::', '::::::::'[0:8 - count + 1], 1)
    if ip.count(':') < 6:
        return -1
    v6 = 0
    for sub in ip.split(':')[0:4]:
        if len(sub) > 4:
            return -1
        if len(sub) == 0:
            v6 = v6 * 0x10000
        else:
            v6 = v6 * 0x10000 + int(sub, 16)
    return v6


def parseIp(ip):
    ip = ip.strip()
    ip = ip.replace('*', '0')
    v4 = parseIpv4(ip)
    v6 = parseIpv6(ip)
    v2002 = v6 >> (3 * 16)
    if v2002 == 0x2002:
        v4 = (v6 >> 16) & 0xffffffff
    v2001 = v6 >> (2 * 16)
    if v2001 == 0x20010000:
        v4 = ~int(''.join(ip.split(':')[-2:]), 16)
        v4 = int(bin(((1 << 32) - 1) & v4)[2:], 2)
    return v4, v6


class IpDb(object):
    except_raw = 0x19
    osLen = ipLen = dLen = dbAddr = size = None

    def __init__(self, db_path):
        with open(db_path, 'rb') as f:
            db = f.read()
            self.db = db

        if db[0:4] != 'IPDB'.encode():
            self.type = 4
            self._init_v4db()
        else:
            self.type = 6
            self._init_v6db()

    def _init_v4db(self):
        self.osLen = 3
        self.ipLen = 4
        self.dLen = self.osLen + self.ipLen
        self.dbAddr = int.from_bytes(self.db[0:4], byteorder='little')
        endAddr = int.from_bytes(self.db[4:8], byteorder='little')
        self.size = (endAddr - self.dbAddr) // self.dLen

    def _init_v6db(self):
        self.osLen = self.db[6]  # 3
        self.ipLen = self.db[7]  # 8
        self.dLen = self.osLen + self.ipLen
        self.dbAddr = int.from_bytes(self.db[0x10: 0x18], byteorder='little')  # 50434
        self.size = int.from_bytes(self.db[8:0x10], byteorder='little')  # 140045

    def getSize(self):
        return self.size

    def getData(self, index):
        self.checkIndex(index)
        addr = self.dbAddr + index * self.dLen
        ip = int.from_bytes(self.db[addr: addr + self.ipLen], byteorder='little')
        return ip

    def checkIndex(self, index):
        if index < 0 or index >= self.getSize():
            raise Exception

    def getLoc(self, index):
        self.checkIndex(index)
        addr = self.dbAddr + index * self.dLen
        # ip = int.from_bytes(self.db[addr: addr + self.ipLen], byteorder='little')
        lAddr = int.from_bytes(self.db[addr + self.ipLen: addr + self.dLen], byteorder='little')
        # print('ip_addr: %d ip: %d lAddr:%d' % (addr, ip, lAddr))
        if self.type == 4:
            lAddr += 4
        loc = self.readLoc(lAddr, True)
        if self.type == 4:
            loc = loc.decode('cp936')
            loc = loc.replace('CZ88.NET', '')
        if self.type == 6:
            loc = loc.decode('utf-8')
        return loc

    def readRawText(self, start):
        bs = []
        if self.type == 4 and start == self.except_raw:
            return bs
        while self.db[start] != 0:
            bs += [self.db[start]]
            start += 1
        return bytes(bs)

    def readLoc(self, start, isTwoPart=False):
        jType = self.db[start]
        if jType == 1 or jType == 2:
            start += 1
            offAddr = int.from_bytes(self.db[start:start + self.osLen], byteorder='little')
            if offAddr == 0:
                return 'Unknown address'
            loc = self.readLoc(offAddr, True if jType == 1 else False)
            nAddr = start + self.osLen
        else:
            loc = self.readRawText(start)
            nAddr = start + len(loc) + 1
        if isTwoPart and jType != 1:
            partTwo = self.readLoc(nAddr)
            if loc and partTwo:
                loc += b' ' + partTwo
        return loc

    def searchIp(self, val):
        index = self.binarySearch(val)
        if index < 0:
            return "Unknown address"
        if index > self.getSize() - 2:
            index = self.getSize() - 2
        return self.getLoc(index)

    def binarySearch(self, key, lo=0, hi=None):
        if not hi:
            hi = self.getSize() - 1
        while lo <= hi:
            if hi - lo <= 1:
                if self.getData(lo) > key:
                    return -1
                elif self.getData(hi) <= key:
                    return hi
                else:
                    return lo
            mid = (lo + hi) // 2
            data = self.getData(mid)
            if data is not None and data > key:
                hi = mid - 1
            elif data is not None and data < key:
                lo = mid
            else:
                return mid
        return -1


class IpQuery(object):
    def __init__(self):
        self.v6db = IpDb(v6db_path)
        self.v4db = IpDb(v4db_path)

    def searchIp(self, ip):
        ret = ''
        err = None
        try:
            v4, v6 = parseIp(ip)
            # print('v4: %d v6: %d' % (v4, v6))
            if v6 >= 0:
                ret += self.v6db.searchIp(v6)
            if v4 >= 0:
                if ret != '':
                    ret += ' > '
                ret += self.v4db.searchIp(v4)
        except Exception as e:
            err = "Internal server error"
        return {
            "ip": ip,
            "loc": ret if ret else None,
            "stats": err or ("Can't Format IP address." if ret == '' else "Success")
        }


if __name__ == '__main__':
    ipquery = IpQuery()
    # ip = '2001:da8:200:900e:0:5efe:182.117.109.0'
    # ip = "2402:f000:1:1141:211:32ff:fe6b:2ad0"
    # ip = '2001:0:4136:e378:ffdd:cc77:358e:fcfe'
    # ip = '42.156.139.1'
    # ip = '182.117.109.0'
    # ip = '114.242.248.*'
    # ip = None
    result = ipquery.searchIp(ip)
    print(result)
