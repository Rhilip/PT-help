# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from flask import Flask
from geo import geo_blueprint

app = Flask(__name__)
app.register_blueprint(geo_blueprint)


@app.route('/')
def hello():
    return "Hello world~"


if __name__ == '__main__':
    app.run()
