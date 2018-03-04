// ==UserScript==
// @name         Byrbt : Tree View
// @namespace    https://blog.rhilip.info
// @version      20180304
// @description  将种子文件列表转换为树状图表示
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @require      http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      http://cdn.bootcss.com/jstree/3.3.3/jstree.min.js
// @resource     customCSS http://cdn.bootcss.com/jstree/3.3.3/themes/default/style.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Tree%20View.user.js
// ==/UserScript==

var icons = {
    unknown: "https://share.dmhy.org/images/icon/unknown.gif",
    audio: "https://share.dmhy.org/images/icon/mp3.gif",
    video: "https://share.dmhy.org/images/icon/mp4.gif",
    image: "https://share.dmhy.org/images/icon/jpg.gif",
    text: "https://share.dmhy.org/images/icon/txt.gif",
    rar: "https://share.dmhy.org/images/icon/rar.gif"
};
var type2Icon = {
    audio: ["flac", "aac", "wav", "mp3"],
    video: ["mkv", "mka", "mp4"],
    image: ["jpg", "bmp", "jpeg", "webp"],
    text: ["txt", "log", "cue", "ass"],
    rar: ["rar", "zip", "7z"]
};
var Dictionary = (function () {
    function Dictionary() {
        this.__data__ = {};
    }

    Dictionary.prototype.add = function (key, value) {
        if (key in this.__data__)
            return;
        this.__data__[key] = value;
    };
    Dictionary.prototype.clear = function () {
        this.__data__ = {};
    };
    Dictionary.prototype.containsKey = function (key) {
        return key in this.__data__;
    };
    Dictionary.prototype.get = function (key) {
        return this.__data__[key];
    };
    Dictionary.prototype.size = function () {
        return Object.keys(this.__data__).length;
    };
    Dictionary.prototype.values = function () {
        return this.__data__;
    };
    return Dictionary;
}());
var FileSize = (function () {
    function FileSize() {
    }

    FileSize.toLength = function (size) {
        if (size === undefined)
            return -1;
        size = size.toLowerCase();
        var head = "";
        var tail = "";
        var isNumber = function (c) {
            return (c >= '0' && c <= '9') || c === '.' || c === '-';
        };
        for (var _i = 0, size_1 = size; _i < size_1.length; _i++) {
            var c = size_1[_i];
            if (isNumber(c))
                head += c;
            else
                tail += c;
        }
        var value = parseFloat(head);
        switch (tail) {
            case " byte":
                return value;
            case " bytes":
                return value;
            case " kb":
                return value * Math.pow(2, 10);
            case " mb":
                return value * Math.pow(2, 20);
            case " gb":
                return value * Math.pow(2, 30);
            case " tb":
                return value * Math.pow(2, 40);
        }
        return -1;
    };
    FileSize.format = function (length, factor, tail) {
        return (length / Math.pow(2, factor)).toFixed(3).toString() + tail;
    };
    FileSize.toSize = function (length) {
        if (length >= Math.pow(2, 40))
            return this.format(length, 40, "TiB");
        else if (length >= Math.pow(2, 30))
            return this.format(length, 30, "GiB");
        else if (length >= Math.pow(2, 20))
            return this.format(length, 20, "MiB");
        else if (length >= Math.pow(2, 10))
            return this.format(length, 10, "KiB");
        else
            return this.format(length, 0, "Bytes");
    };
    return FileSize;
}());
var TreeNode = (function () {
    function TreeNode(node) {
        this.__name__ = node;
        this.__length__ = 0;
        this.__childNode__ = new Dictionary();
    }

    TreeNode.prototype.add = function (key, value) {
        this.__childNode__.add(key, value);
        return this.__childNode__.get(key);
    };
    TreeNode.prototype.insert = function (path, size) {
        var currentNode = this;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var node = path_1[_i];
            var next = currentNode.__childNode__.get(node);
            if (!currentNode.__childNode__.containsKey(node)) {
                next = currentNode.add(node, new TreeNode(node));
                next.__pareneNode__ = currentNode;
            }
            currentNode = next;
        }
        currentNode.__length__ = FileSize.toLength(size);
        return currentNode;
    };
    TreeNode.prototype.getIcon = function (ext) {
        for (var type in type2Icon) {
            if (type2Icon[type].indexOf(ext) >= 0) {
                return icons[type];
            }
        }
        return icons.unknown;
    };
    TreeNode.prototype.toString = function () {
        return this.__name__ + "\t" + FileSize.toSize(this.__length__);
    };
    TreeNode.prototype.toObject = function () {
        var ret = {};
        ret.children = [];
        ret.length = 0;
        ret.text = this.__name__;
        ret.state = {opened: true};
        for (var key in this.__childNode__.values()) {
            var files = [];
            var value = this.__childNode__.get(key);
            if (value.__childNode__.size() === 0) {
                files.push(value);
            }
            else {
                var tmp = {};
                tmp.children = [];
                tmp.length = 0;
                var inner = value.toObject();
                for (var _i = 0, _a = inner.children; _i < _a.length; _i++) {
                    var innerNode = _a[_i];
                    tmp.children.push(innerNode);
                    tmp.length += innerNode.length;
                }
                ret.length += tmp.length;
                value.__length__ = tmp.length;
                tmp.text = value.toString();
                ret.children.push(tmp);
            }
            for (var _b = 0, files_1 = files; _b < files_1.length; _b++) {
                var file = files_1[_b];
                var ext = file.__name__.substr(file.__name__.lastIndexOf('.') + 1).toLowerCase();
                ret.length += file.__length__;
                ret.children.push({
                    icon: this.getIcon(ext),
                    text: file.toString(),
                    length: file.__length__
                });
            }
        }
        return ret;
    };
    return TreeNode;
}());

(function () {
    if (typeof GM_getResourceText !== "undefined") {
        GM_addStyle(GM_getResourceText("customCSS"));
    }
    $('head').append('<style>.jstree-node, .jstree-default .jstree-icon {background-image: url(http://cdn.bootcss.com/jstree/3.3.3/themes/default/32px.png);}</style>');


    var hidefl_btn = $("#hidefl");
    hidefl_btn.append("<a id='change_tree' href=\"javascript: void(0)\">[树状化]</a>");
    $("#filelist").after("<div id=\"jstree_demo_div\" style='background-color: aliceblue'></div>");

    var jstree_demo_div = $('#jstree_demo_div');
    $("#change_tree").click(function () {
        var change_tree_btn = $(this);
        jstree_demo_div.show();
        if (change_tree_btn.text() === "[树状化]") {
            if (jstree_demo_div.html() === "") {
                var data = new TreeNode($("a.index[href^=download]").text().match(/\[BYRBT]\.(.+)\.torrent/)[1]);
                $('#filelist > table tr:gt(0)').each(function (index) {
                    var tr = $(this);
                    var nodes = $(tr.find("td")[0]).text().split('/');
                    var size = $(tr.find("td")[1]).text();
                    data.insert(nodes, size);
                });
                jstree_demo_div.jstree({
                    core: {data: data.toObject()}
                });
            }
            $("#filelist").hide();
            change_tree_btn.text("[恢复]");
        } else {
            $("#filelist").show();
            $('#jstree_demo_div').hide();
            change_tree_btn.text("[树状化]");
        }
    });

    $("#hidefl > a:nth-child(1)").click(function () {
        $('#jstree_demo_div').hide();
    });
    $("#showfl > a:nth-child(1)").click(function () {
        $('#jstree_demo_div').show();
    });

})();

/**
 * Created by Rhilip on 9/29/2017.
 * 20170929: Test Version~ , Copy and change from https://greasyfork.org/scripts/26430-dmhy-tree-view
 */
