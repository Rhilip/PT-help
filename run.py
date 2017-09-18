# ！/usr/bin/python3
# -*- coding: utf-8 -*-
# Copyright (c) 2017-2020 Rhilip <rhilipruan@gmail.com>

from app import app
from modules.geo import geo_blueprint
from modules.ptboard import ptboard_blueprint

app.register_blueprint(geo_blueprint)
app.register_blueprint(ptboard_blueprint)


@app.route('/')
def hello():
    return "Hello world~"


if __name__ == '__main__':
    app.run()
