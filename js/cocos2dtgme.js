var cc = cc || {};
cc._tmp = cc._tmp || {};
cc._LogInfos = {};
_p = window;
_p = Object.prototype;
delete window._p;
cc.newElement = function(a) {
    return document.createElement(a)
};
cc._addEventListener = function(a, b, c, d) {
    a.addEventListener(b, c, d)
};
cc._isNodeJs = "undefined" !== typeof require && require("fs");
cc.each = function(a, b, c) {
    if (a)
        if (a instanceof Array)
            for (var d = 0, e = a.length; d < e && !1 !== b.call(c, a[d], d); d++);
        else
            for (d in a)
                if (!1 === b.call(c, a[d], d)) break
};
cc.isCrossOrigin = function(a) {
    if (!a) return cc.log("invalid URL"), !1;
    var b = a.indexOf("://");
    if (-1 == b) return !1;
    b = a.indexOf("/", b + 3);
    return (-1 == b ? a : a.substring(0, b)) != location.origin
};
cc.async = {
    _counterFunc: function(a) {
        var b = this.counter;
        if (!b.err) {
            var c = b.length,
                d = b.results,
                e = b.option,
                f = e.cb,
                g = e.cbTarget,
                h = e.trigger,
                e = e.triggerTarget;
            if (a) {
                if (b.err = a, f) return f.call(g, a)
            } else {
                var k = Array.apply(null, arguments).slice(1),
                    m = k.length;
                0 == m ? k = null : 1 == m && (k = k[0]);
                d[this.index] = k;
                b.count--;
                h && h.call(e, k, c - b.count, c);
                0 == b.count && f && f.apply(g, [null, d])
            }
        }
    },
    _emptyFunc: function() {},
    parallel: function(a, b, c) {
        var d = cc.async;
        if (void 0 !== c) "function" == typeof b && (b = {
            trigger: b
        }), b.cb = c || b.cb;
        else if (void 0 !==
            b) "function" == typeof b && (b = {
            cb: b
        });
        else if (void 0 !== a) b = {};
        else throw "arguments error!";
        var e = (c = a instanceof Array) ? a.length : Object.keys(a).length;
        if (0 == e) b.cb && b.cb.call(b.cbTarget, null);
        else {
            var f = {
                length: e,
                count: e,
                option: b,
                results: c ? [] : {}
            };
            cc.each(a, function(a, c) {
                if (f.err) return !1;
                var e = !b.cb && !b.trigger ? d._emptyFunc : d._counterFunc.bind({
                    counter: f,
                    index: c
                });
                a(e, c)
            })
        }
    },
    map: function(a, b, c) {
        var d = this,
            e = arguments.length;
        "function" == typeof b && (b = {
            iterator: b
        });
        if (3 === e) b.cb = c || b.cb;
        else if (2 > e) throw "arguments error!";
        "function" == typeof b && (b = {
            iterator: b
        });
        if (void 0 !== c) b.cb = c || b.cb;
        else if (void 0 === a) throw "arguments error!";
        var f = (e = a instanceof Array) ? a.length : Object.keys(a).length;
        if (0 === f) b.cb && b.cb.call(b.cbTarget, null);
        else {
            var g = {
                length: f,
                count: f,
                option: b,
                results: e ? [] : {}
            };
            cc.each(a, function(a, c) {
                if (g.err) return !1;
                var e = !b.cb ? d._emptyFunc : d._counterFunc.bind({
                    counter: g,
                    index: c
                });
                b.iterator.call(b.iteratorTarget, a, c, e)
            })
        }
    }
};
cc.path = {
    join: function() {
        for (var a = arguments.length, b = "", c = 0; c < a; c++) b = (b + ("" == b ? "" : "/") + arguments[c]).replace(/(\/|\\\\)$/, "");
        return b
    },
    extname: function(a) {
        return (a = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(a)) ? a[1] : null
    },
    mainFileName: function(a) {
        if (a) {
            var b = a.lastIndexOf(".");
            if (-1 !== b) return a.substring(0, b)
        }
        return a
    },
    basename: function(a, b) {
        var c = a.indexOf("?");
        0 < c && (a = a.substring(0, c));
        c = /(\/|\\\\)([^(\/|\\\\)]+)$/g.exec(a.replace(/(\/|\\\\)$/, ""));
        if (!c) return null;
        c = c[2];
        return b && a.substring(a.length -
            b.length).toLowerCase() == b.toLowerCase() ? c.substring(0, c.length - b.length) : c
    },
    dirname: function(a) {
        return a.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, "$2")
    },
    changeExtname: function(a, b) {
        b = b || "";
        var c = a.indexOf("?"),
            d = "";
        0 < c && (d = a.substring(c), a = a.substring(0, c));
        c = a.lastIndexOf(".");
        return 0 > c ? a + b + d : a.substring(0, c) + b + d
    },
    changeBasename: function(a, b, c) {
        if (0 == b.indexOf(".")) return this.changeExtname(a, b);
        var d = a.indexOf("?"),
            e = "";
        c = c ? this.extname(a) : "";
        0 < d && (e = a.substring(d), a = a.substring(0, d));
        d = a.lastIndexOf("/");
        return a.substring(0, 0 >= d ? 0 : d + 1) + b + c + e
    }
};
cc.loader = {
    _jsCache: {},
    _register: {},
    _langPathCache: {},
    _aliases: {},
    resPath: "",
    audioPath: "",
    cache: {},
    getXMLHttpRequest: function() {
        return window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP")
    },
    _getArgs4Js: function(a) {
        var b = a[0],
            c = a[1],
            d = a[2],
            e = ["", null, null];
        if (1 === a.length) e[1] = b instanceof Array ? b : [b];
        else if (2 === a.length) "function" == typeof c ? (e[1] = b instanceof Array ? b : [b], e[2] = c) : (e[0] = b || "", e[1] = c instanceof Array ? c : [c]);
        else if (3 === a.length) e[0] = b || "", e[1] = c instanceof
        Array ? c : [c], e[2] = d;
        else throw "arguments error to load js!";
        return e
    },
    loadJs: function(a, b, c) {
        var d = this,
            e = d._jsCache,
            f = d._getArgs4Js(arguments); - 1 < navigator.userAgent.indexOf("Trident/5") ? d._loadJs4Dependency(f[0], f[1], 0, f[2]) : cc.async.map(f[1], function(a, b, c) {
            a = cc.path.join(f[0], a);
            if (e[a]) return c(null);
            d._createScript(a, !1, c)
        }, f[2])
    },
    loadJsWithImg: function(a, b, c) {
        var d = this._loadJsImg(),
            e = this._getArgs4Js(arguments);
        this.loadJs(e[0], e[1], function(a) {
            if (a) throw a;
            d.parentNode.removeChild(d);
            if (e[2]) e[2]()
        })
    },
    _createScript: function(a, b, c) {
        var d = document,
            e = cc.newElement("script");
        e.async = b;
        e.src = a;
        this._jsCache[a] = !0;
        cc._addEventListener(e, "load", function() {
            this.removeEventListener("load", arguments.callee, !1);
            c()
        }, !1);
        cc._addEventListener(e, "error", function() {
            c("Load " + a + " failed!")
        }, !1);
        d.body.appendChild(e)
    },
    _loadJs4Dependency: function(a, b, c, d) {
        if (c >= b.length) d && d();
        else {
            var e = this;
            e._createScript(cc.path.join(a, b[c]), !1, function(f) {
                if (f) return d(f);
                e._loadJs4Dependency(a, b, c + 1, d)
            })
        }
    },
    _loadJsImg: function() {
        var a =
            document,
            b = a.getElementById("cocos2d_loadJsImg");
        if (!b) {
            b = cc.newElement("img");
            cc._loadingImage && (b.src = cc._loadingImage);
            a = a.getElementById(cc.game.config.id);
            a.style.backgroundColor = "black";
            a.parentNode.appendChild(b);
            var c = getComputedStyle ? getComputedStyle(a) : a.currentStyle;
            c || (c = {
                width: a.width,
                height: a.height
            });
            b.style.left = a.offsetLeft + (parseFloat(c.width) - b.width) / 2 + "px";
            b.style.top = a.offsetTop + (parseFloat(c.height) - b.height) / 2 + "px";
            b.style.position = "absolute"
        }
        return b
    },
    loadTxt: function(a, b) {
        if (cc._isNodeJs) require("fs").readFile(a,
            function(a, c) {
                a ? b(a) : b(null, c.toString())
            });
        else {
            var c = this.getXMLHttpRequest(),
                d = "load " + a + " failed!";
            c.open("GET", a, !0);
            /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? (c.setRequestHeader("Accept-Charset", "utf-8"), c.onreadystatechange = function() {
                4 == c.readyState && 200 == c.status ? b(null, c.responseText) : b(d);
            }) : (c.overrideMimeType && c.overrideMimeType("text/plain; charset\x3dutf-8"), c.onload = function() {
                  4 == c.readyState && 200 == c.status ? b(null, c.responseText) : b(d);
            });
            c.send(null)
            if (a == "res/games.plist")
            {
                c.responseText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>again.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{334,564},{270,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{270,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{270,80}<\/string>\r\n            <\/dict>\r\n            <key>bar.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,843},{95,12}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,2},{95,12}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{97,16}<\/string>\r\n            <\/dict>\r\n            <key>gameintro.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{560,531}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{2,2},{560,531}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{564,543}<\/string>\r\n            <\/dict>\r\n            <key>more.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,780},{544,78}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,4},{544,78}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{554,92}<\/string>\r\n            <\/dict>\r\n            <key>over.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{535,2},{546,509}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,6}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,5},{546,509}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{548,531}<\/string>\r\n            <\/dict>\r\n            <key>quan.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,564},{277,248}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{277,248}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{277,248}<\/string>\r\n            <\/dict>\r\n            <key>return.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,687},{543,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{543,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{543,91}<\/string>\r\n            <\/dict>\r\n            <key>share.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{252,564},{270,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{270,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{270,80}<\/string>\r\n            <\/dict>\r\n            <key>start.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,564},{560,121}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{2,5},{560,121}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{564,139}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>games.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1046,860}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:5c6410601704681fd2816b7822597df3:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>games.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
            }
            else if (a == "res/blood.plist")
            {
                c.responseText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>blood0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{734,305},{69,23}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-113,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{7,86},{69,23}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{734,2},{301,179}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,1},{301,179}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{551,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{551,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{368,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{311,311},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{185,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,311},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>blood.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{915,494}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:19b53424333b8d5ef13d12efe9b55b7b:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>blood.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
            }
            else if (a == "res/light.plist")
            {
                c.responseText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>l10001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,641},{45,44}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{80,88},{45,44}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{881,572},{123,156}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{24,22},{123,156}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{822,236},{177,198}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-9,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,1},{177,198}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{822,415},{155,176}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{16,12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,2},{155,176}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l20001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{567,578},{62,58}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,18},{62,58}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{575,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{495,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{415,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{335,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{655,883},{64,68}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{14,2},{64,68}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,688},{4,4}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,43},{4,4}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>ta0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{721,830},{125,172}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{16,-32}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{131,113},{125,172}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{895,730},{139,118}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-46}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{112,154},{139,118}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{805,2},{173,232}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{21,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{112,33},{173,232}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{662,578},{217,250}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{18,23}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{87,19},{217,250}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{567,294},{253,282}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{13,26}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{64,0},{253,282}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{544,2},{259,290}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,19}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{52,3},{259,290}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,353},{283,286}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{25,6},{283,286}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{294,2},{313,248}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{20,44},{313,248}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,698},{331,266}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{16,24},{331,266}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0010.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{349,290}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-2,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,30},{349,290}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0011.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,353},{343,278}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,40},{343,278}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0012.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{335,641},{325,240}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-8,-40}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{7,87},{325,240}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>light.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1022,966}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:4ea06de969664e304dea68a255325c93:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>light.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
            }
            else if (a == "res/roles.plist")
            {
                c.responseText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>npc10001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,2},{82,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{82,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{923,360},{86,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,29},{86,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{538,406},{88,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{3,-10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,29},{88,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,2},{82,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{82,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{923,287},{86,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,-13}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{18,32},{86,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{922,433},{86,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{86,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{628,402},{68,75}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,22},{68,75}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,384},{70,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{8,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,26},{70,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{469,406},{74,67}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{9,-9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,30},{74,67}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{628,402},{68,75}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,22},{68,75}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,456},{70,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{12,-4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,24},{70,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,456},{70,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{12,-4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,24},{70,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,406},{74,67}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{11,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,29},{74,67}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{884,681},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{743,478},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{845,287},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{884,681},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{495,697},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{1,1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,6},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,697},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,5}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,2},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{921,504},{82,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,6},{82,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{918,597},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{834,556},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{19,1},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{743,556},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,3},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>role0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{592,644},{117,97}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{41,60},{117,97}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{197,251},{229,201}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{229,201}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,2},{223,211}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,-1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{3,4},{223,211}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{247,195}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,18},{247,195}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,251},{239,193}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{3,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{9,17},{239,193}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{193,492},{231,203}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,7},{231,203}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,482},{213,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{14,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,0},{213,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{199,2},{229,197}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,1},{229,197}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,492},{233,189}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-9,12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,2},{233,189}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0010.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,2},{153,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,55},{153,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0011.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,2},{153,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,55},{153,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0012.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,190},{111,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{44,53},{111,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0013.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,190},{111,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{44,53},{111,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0014.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,2},{85,99}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{76,55},{85,99}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0015.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,2},{85,99}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{76,55},{85,99}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0016.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,95},{115,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{30,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{98,55},{115,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0017.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,95},{115,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{30,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{98,55},{115,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0018.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{752,236},{139,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{36,55},{139,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0019.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{752,236},{139,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{36,55},{139,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0020.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{669,236},{151,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,65},{151,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0021.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{669,236},{151,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,65},{151,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0022.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{660,479},{159,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-25,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,65},{159,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0023.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{660,479},{159,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-25,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,65},{159,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0024.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{708,89},{145,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,57},{145,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0025.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{708,89},{145,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,57},{145,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0026.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{799,95},{137,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,53},{137,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0027.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{799,95},{137,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,53},{137,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0028.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,89},{133,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,51},{133,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0029.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,89},{133,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,51},{133,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0030.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{691,640},{133,107}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,13}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{46,42},{133,107}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0031.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{691,640},{133,107}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,13}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{46,42},{133,107}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0032.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{588,227},{173,79}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-18,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,67},{173,79}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0033.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{588,227},{173,79}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-18,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,67},{173,79}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0034.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{497,227},{177,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,57},{177,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0035.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{497,227},{177,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,57},{177,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0036.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,227},{177,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,51},{177,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0037.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,227},{177,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,51},{177,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0038.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,389},{149,87}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-28,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,65},{149,87}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0039.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,389},{149,87}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-28,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,65},{149,87}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0040.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0041.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n\t\t\t<key>role0042.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>roles.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1011,775}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:c0821d95be4e9be0bf09b9b14ae48e4e:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>roles.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
            }
//                c.responseText = cc.loader._loadTxtSync(a);
        }
    },
    _loadTxtSync: function(a) {
        if (cc._isNodeJs) return require("fs").readFileSync(a).toString();
        var b = this.getXMLHttpRequest();
        b.open("GET", a, !1);
        /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? b.setRequestHeader("Accept-Charset", "utf-8") : b.overrideMimeType && b.overrideMimeType("text/plain; charset\x3dutf-8");
        b.send(null);
        return 4 == !b.readyState || 200 != b.status ? null : b.responseText
    },
    loadJson: function(a, b) {
        this.loadTxt(a, function(c, d) {
            try {
                c ? b(c) : b(null, JSON.parse(d))
            } catch (e) {
                throw "load json [" + a + "] failed : " + e;
            }
        })
    },
    _checkIsImageURL: function(a) {
        return null != /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(a)
    },
    loadImg: function(a, b, c) {
        var d = !0;
        void 0 !== c ? d = null == b.isCrossOrigin ? d : b.isCrossOrigin : void 0 !== b && (c = b);
        var e = new Image;
        d && "file://" != location.origin && (e.crossOrigin = "Anonymous");
        cc._addEventListener(e, "load", function() {
            this.removeEventListener("load", arguments.callee, !1);
            this.removeEventListener("error", arguments.callee, !1);
            c && c(null, e)
        });
        cc._addEventListener(e, "error", function() {
            this.removeEventListener("error", arguments.callee, !1);
            c && c("load image failed")
        });
        e.src = a;
        return e
    },
    _loadResIterator: function(a,
        b, c) {
        var d = this,
            e = null,
            f = a.type;
        f ? (f = "." + f.toLowerCase(), e = a.src ? a.src : a.name + f) : (e = a, f = cc.path.extname(e));
        if (b = d.cache[e]) return c(null, b);
        b = d._register[f.toLowerCase()];
        if (!b) return cc.error("loader for [" + f + "] not exists!"), c();
        f = b.getBasePath ? b.getBasePath() : d.resPath;
        f = d.getUrl(f, e);
        b.load(f, e, a, function(a, b) {
            a ? (cc.log(a), d.cache[e] = null, delete d.cache[e], c()) : (d.cache[e] = b, c(null, b))
        })
    },
    getUrl: function(a, b) {
        var c = this._langPathCache,
            d = cc.path;
        if (void 0 !== a && void 0 === b) {
            b = a;
            var e = d.extname(b),
                e = e ? e.toLowerCase() : "";
            a = (e = this._register[e]) ? e.getBasePath ? e.getBasePath() : this.resPath : this.resPath
        }
        b = cc.path.join(a || "", b);
        if (b.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
            if (c[b]) return c[b];
            d = d.extname(b) || "";
            b = c[b] = b.substring(0, b.length - d.length) + "_" + cc.sys.language + d
        }
        return b
    },
    load: function(a, b, c) {
        if (void 0 !== c) "function" == typeof b && (b = {
            trigger: b
        });
        else if (void 0 !== b) "function" == typeof b && (c = b, b = {});
        else if (void 0 !== a) b = {};
        else throw "arguments error!";
        b.cb = function(a, b) {
            a && cc.log(a);
            c && c(b)
        };
        a instanceof
        Array || (a = [a]);
        b.iterator = this._loadResIterator;
        b.iteratorTarget = this;
        cc.async.map(a, b)
    },
    _handleAliases: function(a, b) {
        var c = this._aliases,
            d = [],
            e;
        for (e in a) {
            var f = a[e];
            c[e] = f;
            d.push(f)
        }
        this.load(d, b)
    },
    loadAliases: function(a, b) {
        var c = this,
            d = c.getRes(a);
        d ? c._handleAliases(d.filenames, b) : c.load(a, function(a) {
            c._handleAliases(a[0].filenames, b)
        })
    },
    register: function(a, b) {
        if (a && b) {
            if ("string" == typeof a) return this._register[a.trim().toLowerCase()] = b;
            for (var c = 0, d = a.length; c < d; c++) this._register["." + a[c].trim().toLowerCase()] =
                b
        }
    },
    getRes: function(a) {
        return this.cache[a] || this.cache[this._aliases[a]]
    },
    release: function(a) {
        var b = this.cache,
            c = this._aliases;
        delete b[a];
        delete b[c[a]];
        delete c[a]
    },
    releaseAll: function() {
        var a = this.cache,
            b = this._aliases,
            c;
        for (c in a) delete a[c];
        for (c in b) delete b[c]
    }
};
(function() {
    var a = window,
        b, c;
    "undefined" !== typeof document.hidden ? (b = "hidden", c = "visibilitychange") : "undefined" !== typeof document.mozHidden ? (b = "mozHidden", c = "mozvisibilitychange") : "undefined" !== typeof document.msHidden ? (b = "msHidden", c = "msvisibilitychange") : "undefined" !== typeof document.webkitHidden && (b = "webkitHidden", c = "webkitvisibilitychange");
    var d = function() {
            cc.eventManager && cc.game._eventHide && cc.eventManager.dispatchEvent(cc.game._eventHide)
        },
        e = function() {
            cc.eventManager && cc.game._eventShow &&
                cc.eventManager.dispatchEvent(cc.game._eventShow)
        };
    b ? cc._addEventListener(document, c, function() {
        document[b] ? d() : e()
    }, !1) : (cc._addEventListener(a, "blur", d, !1), cc._addEventListener(a, "focus", e, !1));
    "onpageshow" in window && "onpagehide" in window && (cc._addEventListener(a, "pagehide", d, !1), cc._addEventListener(a, "pageshow", e, !1));
    c = a = null
})();
cc.log = cc.warn = cc.error = cc.assert = function() {};
cc.create3DContext = function(a, b) {
    for (var c = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], d = null, e = 0; e < c.length; ++e) {
        try {
            d = a.getContext(c[e], b)
        } catch (f) {}
        if (d) break
    }
    return d
};
cc._initSys = function(a, b) {
    cc._RENDER_TYPE_CANVAS = 0;
    cc._RENDER_TYPE_WEBGL = 1;
    var c = cc.sys = {};
    c.LANGUAGE_ENGLISH = "en";
    c.LANGUAGE_CHINESE = "zh";
    c.LANGUAGE_FRENCH = "fr";
    c.LANGUAGE_ITALIAN = "it";
    c.LANGUAGE_GERMAN = "de";
    c.LANGUAGE_SPANISH = "es";
    c.LANGUAGE_RUSSIAN = "ru";
    c.LANGUAGE_KOREAN = "ko";
    c.LANGUAGE_JAPANESE = "ja";
    c.LANGUAGE_HUNGARIAN = "hu";
    c.LANGUAGE_PORTUGUESE = "pt";
    c.LANGUAGE_ARABIC = "ar";
    c.LANGUAGE_NORWEGIAN = "no";
    c.LANGUAGE_POLISH = "pl";
    c.OS_WINDOWS = "Windows";
    c.OS_IOS = "iOS";
    c.OS_OSX = "OS X";
    c.OS_UNIX = "UNIX";
    c.OS_LINUX = "Linux";
    c.OS_ANDROID = "Android";
    c.OS_UNKNOWN = "Unknown";
    c.BROWSER_TYPE_WECHAT = "wechat";
    c.BROWSER_TYPE_ANDROID = "androidbrowser";
    c.BROWSER_TYPE_IE = "ie";
    c.BROWSER_TYPE_QQ = "qqbrowser";
    c.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
    c.BROWSER_TYPE_UC = "ucbrowser";
    c.BROWSER_TYPE_360 = "360browser";
    c.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
    c.BROWSER_TYPE_BAIDU = "baidubrowser";
    c.BROWSER_TYPE_MAXTHON = "maxthon";
    c.BROWSER_TYPE_OPERA = "opera";
    c.BROWSER_TYPE_MIUI = "miuibrowser";
    c.BROWSER_TYPE_FIREFOX = "firefox";
    c.BROWSER_TYPE_SAFARI =
        "safari";
    c.BROWSER_TYPE_CHROME = "chrome";
    c.BROWSER_TYPE_UNKNOWN = "unknown";
    c.isNative = !1;
    var d = [c.BROWSER_TYPE_BAIDU, c.BROWSER_TYPE_OPERA, c.BROWSER_TYPE_FIREFOX, c.BROWSER_TYPE_CHROME, c.BROWSER_TYPE_SAFARI],
        e = [c.BROWSER_TYPE_BAIDU, c.BROWSER_TYPE_OPERA, c.BROWSER_TYPE_FIREFOX, c.BROWSER_TYPE_CHROME, c.BROWSER_TYPE_SAFARI, c.BROWSER_TYPE_UC, c.BROWSER_TYPE_QQ, c.BROWSER_TYPE_MOBILE_QQ, c.BROWSER_TYPE_IE],
        f = window,
        g = f.navigator,
        h = document.documentElement,
        k = g.userAgent.toLowerCase();
    c.isMobile = -1 != k.indexOf("mobile") ||
        -1 != k.indexOf("android");
    var m = g.language,
        m = (m = m ? m : g.browserLanguage) ? m.split("-")[0] : c.LANGUAGE_ENGLISH;
    c.language = m;
    var m = c.BROWSER_TYPE_UNKNOWN,
        n = k.match(/micromessenger|qqbrowser|mqqbrowser|ucbrowser|360browser|baiduboxapp|baidubrowser|maxthon|trident|opera|miuibrowser|firefox/i) || k.match(/chrome|safari/i);
    n && 0 < n.length && (m = n[0].toLowerCase(), "micromessenger" == m ? m = c.BROWSER_TYPE_WECHAT : "safari" === m && k.match(/android.*applewebkit/) ? m = c.BROWSER_TYPE_ANDROID : "trident" == m && (m = c.BROWSER_TYPE_IE));
    c.browserType = m;
    c._supportMultipleAudio = -1 < e.indexOf(c.browserType);
    e = parseInt(a[b.renderMode]);
    m = cc._RENDER_TYPE_WEBGL;
    n = cc.newElement("Canvas");
    cc._supportRender = !0;
    d = -1 == d.indexOf(c.browserType);
    if (1 === e || 0 === e && (c.isMobile || d)) m = cc._RENDER_TYPE_CANVAS;
    if (m == cc._RENDER_TYPE_WEBGL && (!f.WebGLRenderingContext || !cc.create3DContext(n, {
            stencil: !0,
            preserveDrawingBuffer: !0
        }))) 0 == e ? m = cc._RENDER_TYPE_CANVAS : cc._supportRender = !1;
    if (m == cc._RENDER_TYPE_CANVAS) try {
        n.getContext("2d")
    } catch (q) {
        cc._supportRender = !1
    }
    cc._renderType = m;
    try {
        c._supportWebAudio = !!new(f.AudioContext || f.webkitAudioContext || f.mozAudioContext)
    } catch (s) {
        c._supportWebAudio = !1
    }
    try {
        var r = c.localStorage = f.localStorage;
        r.setItem("storage", "");
        r.removeItem("storage");
        r = null
    } catch (u) {
        ("SECURITY_ERR" === u.name || "QuotaExceededError" === u.name) && cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option"), c.localStorage = function() {}
    }
    r = c.capabilities = {
        canvas: !0
    };
    cc._renderType == cc._RENDER_TYPE_WEBGL && (r.opengl = !0);
    void 0 !== h.ontouchstart || g.msPointerEnabled ? r.touches = !0 : void 0 !== h.onmouseup && (r.mouse = !0);
    void 0 !== h.onkeyup && (r.keyboard = !0);
    if (f.DeviceMotionEvent || f.DeviceOrientationEvent) r.accelerometer = !0;
    f = k.match(/(iPad|iPhone|iPod)/i) ? !0 : !1;
    k = k.match(/android/i) || g.platform.match(/android/i) ? !0 : !1;
    h = c.OS_UNKNOWN; - 1 != g.appVersion.indexOf("Win") ? h = c.OS_WINDOWS : f ? h = c.OS_IOS : -1 != g.appVersion.indexOf("Mac") ? h = c.OS_OSX : -1 != g.appVersion.indexOf("X11") ? h = c.OS_UNIX : -1 != g.appVersion.indexOf("Linux") ? h = c.OS_LINUX :
        k && (h = c.OS_ANDROID);
    c.os = h;
    c.garbageCollect = function() {};
    c.dumpRoot = function() {};
    c.restartVM = function() {};
    c.dump = function() {
        var a;
        a = "" + ("isMobile : " + this.isMobile + "\r\n");
        a += "language : " + this.language + "\r\n";
        a += "browserType : " + this.browserType + "\r\n";
        a += "capabilities : " + JSON.stringify(this.capabilities) + "\r\n";
        a += "os : " + this.os + "\r\n";
        cc.log(a)
    }
};
cc.ORIENTATION_PORTRAIT = 0;
cc.ORIENTATION_PORTRAIT_UPSIDE_DOWN = 1;
cc.ORIENTATION_LANDSCAPE_LEFT = 2;
cc.ORIENTATION_LANDSCAPE_RIGHT = 3;
cc._drawingUtil = null;
cc._renderContext = null;
cc._canvas = null;
cc._gameDiv = null;
cc._rendererInitialized = !1;
cc._setupCalled = !1;
cc._setup = function(a, b, c) {
    if (!cc._setupCalled) {
        cc._setupCalled = !0;
        var d = window;
        d.requestAnimFrame = d.requestAnimationFrame || d.webkitRequestAnimationFrame || d.mozRequestAnimationFrame || d.oRequestAnimationFrame || d.msRequestAnimationFrame;
        var e = cc.$(a) || cc.$("#" + a),
            f;
        "CANVAS" == e.tagName ? (b = b || e.width, c = c || e.height, f = cc.container = cc.newElement("DIV"), a = cc._canvas = e, a.parentNode.insertBefore(f, a), a.appendTo(f), f.setAttribute("id", "Cocos2dGameContainer")) : ("DIV" != e.tagName && cc.log("Warning: target element is not a DIV or CANVAS"),
            b = b || e.clientWidth, c = c || e.clientHeight, f = cc.container = e, a = cc._canvas = cc.$(cc.newElement("CANVAS")), e.appendChild(a));
        a.addClass("gameCanvas");
        a.setAttribute("width", b || 480);
        a.setAttribute("height", c || 320);
        a.setAttribute("tabindex", 99);
        a.style.outline = "none";
        e = f.style;
        e.width = (b || 480) + "px";
        e.height = (c || 320) + "px";
        e.margin = "0 auto";
        e.position = "relative";
        e.overflow = "hidden";
        f.top = "100%";
        cc._renderType == cc._RENDER_TYPE_WEBGL && (cc._renderContext = cc.webglContext = cc.create3DContext(a, {
            stencil: !0,
            preserveDrawingBuffer: !0,
            antialias: !cc.sys.isMobile,
            alpha: !1
        }));
        cc._renderContext ? (d.gl = cc._renderContext, cc._drawingUtil = new cc.DrawingPrimitiveWebGL(cc._renderContext), cc._rendererInitialized = !0, cc.textureCache._initializingRenderer(), cc.shaderCache._init()) : (cc._renderContext = a.getContext("2d"), cc._mainRenderContextBackup = cc._renderContext, cc._renderContext.translate(0, a.height), cc._drawingUtil = cc.DrawingPrimitiveCanvas ? new cc.DrawingPrimitiveCanvas(cc._renderContext) : null);
        cc._gameDiv = f;
        cc.log(cc.ENGINE_VERSION);
        cc._setContextMenuEnable(!1);
        cc.sys.isMobile && (b = cc.newElement("style"), b.type = "text/css", document.body.appendChild(b), b.textContent = "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;-webkit-tap-highlight-color:rgba(0,0,0,0);}");
        cc.view = cc.EGLView._getInstance();
        cc.inputManager.registerSystemEvent(cc._canvas);
        cc.director = cc.Director._getInstance();
        cc.director.setOpenGLView && cc.director.setOpenGLView(cc.view);
        cc.winSize = cc.director.getWinSize();
        cc.saxParser = new cc.SAXParser;
        cc.plistParser = new cc.PlistParser
    }
};
cc._checkWebGLRenderMode = function() {
    if (cc._renderType !== cc._RENDER_TYPE_WEBGL) throw "This feature supports WebGL render mode only.";
};
cc._isContextMenuEnable = !1;
cc._setContextMenuEnable = function(a) {
    cc._isContextMenuEnable = a;
    cc._canvas.oncontextmenu = function() {
        if (!cc._isContextMenuEnable) return !1
    }
};
cc.game = {
    DEBUG_MODE_NONE: 0,
    DEBUG_MODE_INFO: 1,
    DEBUG_MODE_WARN: 2,
    DEBUG_MODE_ERROR: 3,
    DEBUG_MODE_INFO_FOR_WEB_PAGE: 4,
    DEBUG_MODE_WARN_FOR_WEB_PAGE: 5,
    DEBUG_MODE_ERROR_FOR_WEB_PAGE: 6,
    EVENT_HIDE: "game_on_hide",
    EVENT_SHOW: "game_on_show",
    _eventHide: null,
    _eventShow: null,
    _onBeforeStartArr: [],
    CONFIG_KEY: {
        engineDir: "engineDir",
        dependencies: "dependencies",
        debugMode: "debugMode",
        showFPS: "showFPS",
        frameRate: "frameRate",
        id: "id",
        renderMode: "renderMode",
        jsList: "jsList",
        classReleaseMode: "classReleaseMode"
    },
    _prepareCalled: !0,
    _prepared: !0,
    _paused: !0,
    _intervalId: null,
    config: null,
    onStart: null,
    onStop: null,
    setFrameRate: function(a) {
        this.config[this.CONFIG_KEY.frameRate] = a;
        this._intervalId && clearInterval(this._intervalId);
        this._paused = !0;
        this._runMainLoop()
    },
    _runMainLoop: function() {
        var a = this,
            b, c = a.config,
            d = a.CONFIG_KEY,
            e = window,
            f = c[d.frameRate],
            g = cc.director;
        g.setDisplayStats(c[d.showFPS]);
        e.requestAnimFrame && 60 == f ? (b = function() {
            a._paused || (g.mainLoop(), e.requestAnimFrame(b))
        }, e.requestAnimFrame(b)) : (b = function() {
                g.mainLoop()
            },
            a._intervalId = setInterval(b, 1E3 / f));
        a._paused = !1
    },
    run: function(a) {
        var b = this,
            c = function() {
                a && (b.config[b.CONFIG_KEY.id] = a);
                b._prepareCalled ? cc._supportRender && (b._checkPrepare = setInterval(function() {
                    b._prepared && (cc._setup(b.config[b.CONFIG_KEY.id]), b._runMainLoop(), b._eventHide = b._eventHide || new cc.EventCustom(b.EVENT_HIDE), b._eventHide.setUserData(b), b._eventShow = b._eventShow || new cc.EventCustom(b.EVENT_SHOW), b._eventShow.setUserData(b), b.onStart(), clearInterval(b._checkPrepare))
                }, 10)) : b.prepare(function() {
                    cc._supportRender &&
                        (cc._setup(b.config[b.CONFIG_KEY.id]), b._runMainLoop(), b._eventHide = b._eventHide || new cc.EventCustom(b.EVENT_HIDE), b._eventHide.setUserData(b), b._eventShow = b._eventShow || new cc.EventCustom(b.EVENT_SHOW), b._eventShow.setUserData(b), b.onStart())
                })
            };
        document.body ? c() : cc._addEventListener(window, "load", function() {
            this.removeEventListener("load", arguments.callee, !1);
            c()
        }, !1)
    },
    _initConfig: function() {
        var a = this.CONFIG_KEY,
            b = function(b) {
                b[a.engineDir] = b[a.engineDir] || "frameworks/cocos2d-html5";
                null == b[a.debugMode] &&
                    (b[a.debugMode] = 0);
                b[a.frameRate] = b[a.frameRate] || 60;
                null == b[a.renderMode] && (b[a.renderMode] = 1);
                return b
            };
        if (document.ccConfig) this.config = b(document.ccConfig);
        else try {
            for (var c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
                var e = c[d].getAttribute("cocos");
                if ("" == e || e) break
            }
            var f, g, h;
            if (d < c.length) {
                if (f = c[d].src) h = /(.*)\//.exec(f)[0], cc.loader.resPath = h, f = cc.path.join(h, "project.json");
                    g = cc.loader._loadTxtSync(f)
            }
            g || (g = cc.loader._loadTxtSync("project.json"));
            var k = JSON.parse(g);
            this.config =
                b(k || {})
        } catch (m) {
            cc.log("Failed to read or parse project.json"), this.config = b({})
        }
        cc._initSys(this.config, a)
    },
    _jsAddedCache: {},
    _getJsListOfModule: function(a, b, c) {
        var d = this._jsAddedCache;
        if (d[b]) return null;
        c = c || "";
        var e = [],
            f = a[b];
        if (!f) throw "can not find module [" + b + "]";
        b = cc.path;
        for (var g = 0, h = f.length; g < h; g++) {
            var k = f[g];
            if (!d[k]) {
                var m = b.extname(k);
                m ? ".js" == m.toLowerCase() && e.push(b.join(c, k)) : (m = this._getJsListOfModule(a, k, c)) && (e = e.concat(m));
                d[k] = 1
            }
        }
        return e
    },
    prepare: function(a) {
        var b = this,
            c = b.config,
            d = b.CONFIG_KEY,
            e = c[d.engineDir],
            f = cc.loader;
        if (cc._supportRender) {
            b._prepareCalled = !0;
            var g = c[d.jsList] || [];
            cc.Class ? f.loadJsWithImg("", g, function(c) {
                if (c) throw c;
                b._prepared = !0;
                a && a()
            }) : (d = cc.path.join(e, "moduleConfig.json"), f.loadJson(d, function(d, f) {
                if (d) throw d;
                var m = c.modules || [],
                    n = f.module,
                    q = [];
                cc._renderType == cc._RENDER_TYPE_WEBGL ? m.splice(0, 0, "shaders") : 0 > m.indexOf("core") && m.splice(0, 0, "core");
                for (var s = 0, r = m.length; s < r; s++) {
                    var u = b._getJsListOfModule(n, m[s], e);
                    u && (q = q.concat(u))
                }
                q =
                    q.concat(g);
                cc.loader.loadJsWithImg(q, function(c) {
                    if (c) throw c;
                    b._prepared = !0;
                    a && a()
                })
            }))
        } else cc.error("Can not support render!")
    }
};
cc.game._initConfig();
cc.loader.loadBinary = function(a, b) {
    var c = this,
        d = this.getXMLHttpRequest(),
        e = "load " + a + " failed!";
    d.open("GET", a, !0);
    /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? (d.setRequestHeader("Accept-Charset", "x-user-defined"), d.onreadystatechange = function() {
        if (4 == d.readyState && 200 == d.status) {
            var a = cc._convertResponseBodyToText(d.responseBody);
            b(null, c._str2Uint8Array(a))
        } else b(e)
    }) : (d.overrideMimeType && d.overrideMimeType("text/plain; charset\x3dx-user-defined"), d.onload = function() {
        4 ==
            d.readyState && 200 == d.status ? b(null, c._str2Uint8Array(d.responseText)) : b(e)
    });
    d.send(null)
};
cc.loader._str2Uint8Array = function(a) {
    if (!a) return null;
    for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++) b[c] = a.charCodeAt(c) & 255;
    return b
};
cc.loader.loadBinarySync = function(a) {
    var b = this.getXMLHttpRequest(),
        c = "load " + a + " failed!";
    b.open("GET", a, !1);
    a = null;
    if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
        b.setRequestHeader("Accept-Charset", "x-user-defined");
        b.send(null);
        if (200 != b.status) return cc.log(c), null;
        (b = cc._convertResponseBodyToText(b.responseBody)) && (a = this._str2Uint8Array(b))
    } else {
        b.overrideMimeType && b.overrideMimeType("text/plain; charset\x3dx-user-defined");
        b.send(null);
        if (200 != b.status) return cc.log(c),
            null;
        a = this._str2Uint8Array(b.responseText)
    }
    return a
};
var Uint8Array = Uint8Array || Array;
if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
    var IEBinaryToArray_ByteStr_Script = '\x3c!-- IEBinaryToArray_ByteStr --\x3e\r\nFunction IEBinaryToArray_ByteStr(Binary)\r\n   IEBinaryToArray_ByteStr \x3d CStr(Binary)\r\nEnd Function\r\nFunction IEBinaryToArray_ByteStr_Last(Binary)\r\n   Dim lastIndex\r\n   lastIndex \x3d LenB(Binary)\r\n   if lastIndex mod 2 Then\r\n       IEBinaryToArray_ByteStr_Last \x3d Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n   Else\r\n       IEBinaryToArray_ByteStr_Last \x3d ""\r\n   End If\r\nEnd Function\r\n',
        myVBScript =
        cc.newElement("script");
    myVBScript.type = "text/vbscript";
    myVBScript.textContent = IEBinaryToArray_ByteStr_Script;
    document.body.appendChild(myVBScript);
    cc._convertResponseBodyToText = function(a) {
        for (var b = {}, c = 0; 256 > c; c++)
            for (var d = 0; 256 > d; d++) b[String.fromCharCode(c + 256 * d)] = String.fromCharCode(c) + String.fromCharCode(d);
        c = IEBinaryToArray_ByteStr(a);
        a = IEBinaryToArray_ByteStr_Last(a);
        return c.replace(/[\s\S]/g, function(a) {
            return b[a]
        }) + a
    }
};
var cc = cc || {},
    ClassManager = {
        id: 0 | 998 * Math.random(),
        instanceId: 0 | 998 * Math.random(),
        compileSuper: function(a, b, c) {
            a = a.toString();
            var d = a.indexOf("("),
                e = a.indexOf(")"),
                d = a.substring(d + 1, e),
                d = d.trim(),
                e = a.indexOf("{"),
                f = a.lastIndexOf("}");
            for (a = a.substring(e + 1, f); - 1 != a.indexOf("this._super");) {
                var e = a.indexOf("this._super"),
                    f = a.indexOf("(", e),
                    g = a.indexOf(")", f),
                    g = a.substring(f + 1, g),
                    g = (g = g.trim()) ? "," : "";
                a = a.substring(0, e) + "ClassManager[" + c + "]." + b + ".call(this" + g + a.substring(f + 1)
            }
            return Function(d, a)
        },
        getNewID: function() {
            return this.id++
        },
        getNewInstanceId: function() {
            return this.instanceId++
        }
    };
ClassManager.compileSuper.ClassManager = ClassManager;
(function() {
    var a = /\b_super\b/,
        b = cc.game.config[cc.game.CONFIG_KEY.classReleaseMode];
    b && console.log("release Mode");
    cc.Class = function() {};
    cc.Class.extend = function(c) {
        function d() {
            this.__instanceId = ClassManager.getNewInstanceId();
            this.ctor && this.ctor.apply(this, arguments)
        }
        var e = this.prototype,
            f = Object.create(e),
            g = ClassManager.getNewID();
        ClassManager[g] = e;
        var h = {
            writable: !0,
            enumerable: !1,
            configurable: !0
        };
        f.__instanceId = null;
        d.id = g;
        h.value = g;
        Object.defineProperty(f, "__pid", h);
        d.prototype = f;
        h.value = d;
        Object.defineProperty(d.prototype, "constructor", h);
        this.__getters__ && (d.__getters__ = cc.clone(this.__getters__));
        this.__setters__ && (d.__setters__ = cc.clone(this.__setters__));
        for (var k = 0, m = arguments.length; k < m; ++k) {
            var n = arguments[k],
                q;
            for (q in n) {
                var s = "function" === typeof n[q],
                    r = "function" === typeof e[q],
                    u = a.test(n[q]);
                b && s && r && u ? (h.value = ClassManager.compileSuper(n[q], q, g), Object.defineProperty(f, q, h)) : s && r && u ? (h.value = function(a, b) {
                    return function() {
                        var c = this._super;
                        this._super = e[a];
                        var d = b.apply(this,
                            arguments);
                        this._super = c;
                        return d
                    }
                }(q, n[q]), Object.defineProperty(f, q, h)) : s ? (h.value = n[q], Object.defineProperty(f, q, h)) : f[q] = n[q];
                if (s) {
                    var t, v;
                    if (this.__getters__ && this.__getters__[q]) {
                        var s = this.__getters__[q],
                            w;
                        for (w in this.__setters__)
                            if (this.__setters__[w] == s) {
                                v = w;
                                break
                            }
                        cc.defineGetterSetter(f, s, n[q], n[v] ? n[v] : f[v], q, v)
                    }
                    if (this.__setters__ && this.__setters__[q]) {
                        s = this.__setters__[q];
                        for (w in this.__getters__)
                            if (this.__getters__[w] == s) {
                                t = w;
                                break
                            }
                        cc.defineGetterSetter(f, s, n[t] ? n[t] : f[t], n[q],
                            t, q)
                    }
                }
            }
        }
        d.extend = cc.Class.extend;
        d.implement = function(a) {
            for (var b in a) f[b] = a[b]
        };
        return d
    };
    Function.prototype.bind = Function.prototype.bind || function(a) {
        var b = this;
        return function() {
            var e = Array.prototype.slice.call(arguments);
            return b.apply(a || null, e)
        }
    }
})();
cc.defineGetterSetter = function(a, b, c, d, e, f) {
    if (a.__defineGetter__) c && a.__defineGetter__(b, c), d && a.__defineSetter__(b, d);
    else if (Object.defineProperty) {
        var g = {
            enumerable: !1,
            configurable: !0
        };
        c && (g.get = c);
        d && (g.set = d);
        Object.defineProperty(a, b, g)
    } else throw Error("browser does not support getters");
    if (!e && !f)
        for (var g = null != c, h = void 0 != d, k = Object.getOwnPropertyNames(a), m = 0; m < k.length; m++) {
            var n = k[m];
            if (!((a.__lookupGetter__ ? a.__lookupGetter__(n) : Object.getOwnPropertyDescriptor(a, n)) || "function" !== typeof a[n])) {
                var q =
                    a[n];
                if (g && q === c && (e = n, !h || f)) break;
                if (h && q === d && (f = n, !g || e)) break
            }
        }
    a = a.constructor;
    e && (a.__getters__ || (a.__getters__ = {}), a.__getters__[e] = b);
    f && (a.__setters__ || (a.__setters__ = {}), a.__setters__[f] = b)
};
cc.clone = function(a) {
    var b = a.constructor ? new a.constructor : {},
        c;
    for (c in a) {
        var d = a[c];
        b[c] = "object" == typeof d && d && !(d instanceof cc.Node) && !(d instanceof HTMLElement) ? cc.clone(d) : d
    }
    return b
};
cc = cc || {};
cc._tmp = cc._tmp || {};
cc.associateWithNative = function(a, b) {};
cc.KEY = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    Delete: 46,
    "0": 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    num0: 96,
    num1: 97,
    num2: 98,
    num3: 99,
    num4: 100,
    num5: 101,
    num6: 102,
    num7: 103,
    num8: 104,
    num9: 105,
    "*": 106,
    "+": 107,
    "-": 109,
    numdel: 110,
    "/": 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    ",": 186,
    equal: 187,
    "\x3d": 187,
    ";": 188,
    comma: 188,
    dash: 189,
    ".": 190,
    period: 190,
    forwardslash: 191,
    grave: 192,
    "[": 219,
    openbracket: 219,
    "]": 221,
    closebracket: 221,
    backslash: 220,
    quote: 222,
    space: 32
};
cc.FMT_JPG = 0;
cc.FMT_PNG = 1;
cc.FMT_TIFF = 2;
cc.FMT_RAWDATA = 3;
cc.FMT_WEBP = 4;
cc.FMT_UNKNOWN = 5;
cc.getImageFormatByData = function(a) {
    return 8 < a.length && 137 == a[0] && 80 == a[1] && 78 == a[2] && 71 == a[3] && 13 == a[4] && 10 == a[5] && 26 == a[6] && 10 == a[7] ? cc.FMT_PNG : 2 < a.length && (73 == a[0] && 73 == a[1] || 77 == a[0] && 77 == a[1] || 255 == a[0] && 216 == a[1]) ? cc.FMT_TIFF : cc.FMT_UNKNOWN
};
cc.inherits = function(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
};
cc.base = function(a, b, c) {
    var d = arguments.callee.caller;
    if (d.superClass_) return ret = d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
        if (g.prototype[b] === d) f = !0;
        else if (f) return g.prototype[b].apply(a, e);
    if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
    throw Error("cc.base called from a method of one name to a method of a different name");
};
cc.Point = function(a, b) {
    this.x = a || 0;
    this.y = b || 0
};
cc.p = function(a, b) {
    return void 0 == a ? {
        x: 0,
        y: 0
    } : void 0 == b ? {
        x: a.x,
        y: a.y
    } : {
        x: a,
        y: b
    }
};
cc.pointEqualToPoint = function(a, b) {
    return a && b && a.x === b.x && a.y === b.y
};
cc.Size = function(a, b) {
    this.width = a || 0;
    this.height = b || 0
};
cc.size = function(a, b) {
    return void 0 === a ? {
        width: 0,
        height: 0
    } : void 0 === b ? {
        width: a.width,
        height: a.height
    } : {
        width: a,
        height: b
    }
};
cc.sizeEqualToSize = function(a, b) {
    return a && b && a.width == b.width && a.height == b.height
};
cc.Rect = function(a, b, c, d) {
    this.x = a || 0;
    this.y = b || 0;
    this.width = c || 0;
    this.height = d || 0
};
cc.rect = function(a, b, c, d) {
    return void 0 === a ? {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    } : void 0 === b ? {
        x: a.x,
        y: a.y,
        width: a.width,
        height: a.height
    } : {
        x: a,
        y: b,
        width: c,
        height: d
    }
};
cc.rectEqualToRect = function(a, b) {
    return a && b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
};
cc._rectEqualToZero = function(a) {
    return a && 0 === a.x && 0 === a.y && 0 === a.width && 0 === a.height
};
cc.rectContainsRect = function(a, b) {
    return !a || !b ? !1 : !(a.x >= b.x || a.y >= b.y || a.x + a.width <= b.x + b.width || a.y + a.height <= b.y + b.height)
};
cc.rectGetMaxX = function(a) {
    return a.x + a.width
};
cc.rectGetMidX = function(a) {
    return a.x + a.width / 2
};
cc.rectGetMinX = function(a) {
    return a.x
};
cc.rectGetMaxY = function(a) {
    return a.y + a.height
};
cc.rectGetMidY = function(a) {
    return a.y + a.height / 2
};
cc.rectGetMinY = function(a) {
    return a.y
};
cc.rectContainsPoint = function(a, b) {
    return b.x >= cc.rectGetMinX(a) && b.x <= cc.rectGetMaxX(a) && b.y >= cc.rectGetMinY(a) && b.y <= cc.rectGetMaxY(a)
};
cc.rectIntersectsRect = function(a, b) {
    var c = a.y + a.height,
        d = b.x + b.width,
        e = b.y + b.height;
    return !(a.x + a.width < b.x || d < a.x || c < b.y || e < a.y)
};
cc.rectOverlapsRect = function(a, b) {
    return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y)
};
cc.rectUnion = function(a, b) {
    var c = cc.rect(0, 0, 0, 0);
    c.x = Math.min(a.x, b.x);
    c.y = Math.min(a.y, b.y);
    c.width = Math.max(a.x + a.width, b.x + b.width) - c.x;
    c.height = Math.max(a.y + a.height, b.y + b.height) - c.y;
    return c
};
cc.rectIntersection = function(a, b) {
    var c = cc.rect(Math.max(cc.rectGetMinX(a), cc.rectGetMinX(b)), Math.max(cc.rectGetMinY(a), cc.rectGetMinY(b)), 0, 0);
    c.width = Math.min(cc.rectGetMaxX(a), cc.rectGetMaxX(b)) - cc.rectGetMinX(c);
    c.height = Math.min(cc.rectGetMaxY(a), cc.rectGetMaxY(b)) - cc.rectGetMinY(c);
    return c
};
cc._tmp.PrototypeColor = function() {
    var a = cc.color;
    a._getWhite = function() {
        return a(255, 255, 255)
    };
    a._getYellow = function() {
        return a(255, 255, 0)
    };
    a._getBlue = function() {
        return a(0, 0, 255)
    };
    a._getGreen = function() {
        return a(0, 255, 0)
    };
    a._getRed = function() {
        return a(255, 0, 0)
    };
    a._getMagenta = function() {
        return a(255, 0, 255)
    };
    a._getBlack = function() {
        return a(0, 0, 0)
    };
    a._getOrange = function() {
        return a(255, 127, 0)
    };
    a._getGray = function() {
        return a(166, 166, 166)
    };
    cc.defineGetterSetter(a, "WHITE", a._getWhite);
    cc.defineGetterSetter(a,
        "YELLOW", a._getYellow);
    cc.defineGetterSetter(a, "BLUE", a._getBlue);
    cc.defineGetterSetter(a, "GREEN", a._getGreen);
    cc.defineGetterSetter(a, "RED", a._getRed);
    cc.defineGetterSetter(a, "MAGENTA", a._getMagenta);
    cc.defineGetterSetter(a, "BLACK", a._getBlack);
    cc.defineGetterSetter(a, "ORANGE", a._getOrange);
    cc.defineGetterSetter(a, "GRAY", a._getGray)
};
cc.SAXParser = cc.Class.extend({
    _parser: null,
    _isSupportDOMParser: null,
    ctor: function() {
        window.DOMParser ? (this._isSupportDOMParser = !0, this._parser = new DOMParser) : this._isSupportDOMParser = !1
    },
    parse: function(a) {
        return this._parseXML(a)
    },
    _parseXML: function(a) {
        var b;
        this._isSupportDOMParser ? b = this._parser.parseFromString(a, "text/xml") : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a));
        return b
    }
});
cc.PlistParser = cc.SAXParser.extend({
    parse: function(a) {
        a = this._parseXML(a).documentElement;
                                     a.tagName = "plist";
        if ("plist" != a.tagName) throw "Not a plist file!";
        for (var b = null, c = 0, d = a.childNodes.length; c < d && !(b = a.childNodes[c], 1 == b.nodeType); c++);
        return this._parseNode(b)
    },
    _parseNode: function(a) {
        var b = null,
            c = a.tagName;
        if ("dict" == c) b = this._parseDict(a);
        else if ("array" == c) b = this._parseArray(a);
        else if ("string" == c)
            if (1 == a.childNodes.length) b = a.firstChild.nodeValue;
            else {
                b = "";
                for (c = 0; c < a.childNodes.length; c++) b += a.childNodes[c].nodeValue
            } else "false" ==
            c ? b = !1 : "true" == c ? b = !0 : "real" == c ? b = parseFloat(a.firstChild.nodeValue) : "integer" == c && (b = parseInt(a.firstChild.nodeValue, 10));
        return b
    },
    _parseArray: function(a) {
        for (var b = [], c = 0, d = a.childNodes.length; c < d; c++) {
            var e = a.childNodes[c];
            1 == e.nodeType && b.push(this._parseNode(e))
        }
        return b
    },
    _parseDict: function(a) {
        for (var b = {}, c = null, d = 0, e = a.childNodes.length; d < e; d++) {
            var f = a.childNodes[d];
            1 == f.nodeType && ("key" == f.tagName ? c = f.firstChild.nodeValue : b[c] = this._parseNode(f))
        }
        return b
    }
});
cc._txtLoader = {
    load: function(a, b, c, d) {
        cc.loader.loadTxt(a, d)
    }
};
cc.loader.register(["txt", "xml", "vsh", "fsh", "atlas"], cc._txtLoader);
cc._jsonLoader = {
    load: function(a, b, c, d) {
        cc.loader.loadJson(a, d)
    }
};
cc.loader.register(["json", "ExportJson"], cc._jsonLoader);
cc._imgLoader = {
    load: function(a, b, c, d) {
        cc.loader.cache[b] = cc.loader.loadImg(a, function(a, c) {
            if (a) return d(a);
            cc.textureCache.handleLoadedTexture(b);
            d(null, c)
        })
    }
};
cc.loader.register("png jpg bmp jpeg gif ico".split(" "), cc._imgLoader);
cc._serverImgLoader = {
    load: function(a, b, c, d) {
        cc.loader.cache[b] = cc.loader.loadImg(c.src, function(a, c) {
            if (a) return d(a);
            cc.textureCache.handleLoadedTexture(b);
            d(null, c)
        })
    }
};
cc.loader.register(["serverImg"], cc._serverImgLoader);
cc._plistLoader = {
    load: function(a, b, c, d) {
        
        if (a == "res/games.plist")
        {
            b = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>again.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{334,564},{270,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{270,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{270,80}<\/string>\r\n            <\/dict>\r\n            <key>bar.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,843},{95,12}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,2},{95,12}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{97,16}<\/string>\r\n            <\/dict>\r\n            <key>gameintro.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{560,531}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{2,2},{560,531}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{564,543}<\/string>\r\n            <\/dict>\r\n            <key>more.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,780},{544,78}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,4},{544,78}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{554,92}<\/string>\r\n            <\/dict>\r\n            <key>over.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{535,2},{546,509}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,6}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,5},{546,509}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{548,531}<\/string>\r\n            <\/dict>\r\n            <key>quan.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,564},{277,248}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{277,248}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{277,248}<\/string>\r\n            <\/dict>\r\n            <key>return.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,687},{543,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{543,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{543,91}<\/string>\r\n            <\/dict>\r\n            <key>share.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{252,564},{270,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{270,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{270,80}<\/string>\r\n            <\/dict>\r\n            <key>start.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{416,564},{560,121}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{2,5},{560,121}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{564,139}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>games.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1046,860}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:5c6410601704681fd2816b7822597df3:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>games.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
        }
        else if (a == "res/blood.plist")
        {
            b = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>blood0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{734,305},{69,23}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-113,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{7,86},{69,23}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{734,2},{301,179}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,1},{301,179}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{551,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{551,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{368,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{311,311},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{185,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,311},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n            <key>blood0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{307,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,0},{307,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{309,181}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>blood.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{915,494}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:19b53424333b8d5ef13d12efe9b55b7b:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>blood.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
        }
        else if (a == "res/light.plist")
        {
            b = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>l10001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,641},{45,44}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{80,88},{45,44}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{881,572},{123,156}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{24,22},{123,156}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{822,236},{177,198}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-9,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,1},{177,198}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l10004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{822,415},{155,176}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{16,12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,2},{155,176}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{197,204}<\/string>\r\n            <\/dict>\r\n            <key>l20001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{567,578},{62,58}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,18},{62,58}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{575,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{495,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{415,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{335,883},{78,80}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{78,80}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{655,883},{64,68}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{14,2},{64,68}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>l20007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,688},{4,4}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,43},{4,4}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{78,80}<\/string>\r\n            <\/dict>\r\n            <key>ta0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{721,830},{125,172}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{16,-32}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{131,113},{125,172}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{895,730},{139,118}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-46}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{112,154},{139,118}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{805,2},{173,232}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{21,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{112,33},{173,232}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{662,578},{217,250}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{18,23}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{87,19},{217,250}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{567,294},{253,282}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{13,26}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{64,0},{253,282}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{544,2},{259,290}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,19}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{52,3},{259,290}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{282,353},{283,286}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{25,6},{283,286}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{294,2},{313,248}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{20,44},{313,248}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,698},{331,266}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{16,24},{331,266}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0010.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{349,290}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-2,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,30},{349,290}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0011.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,353},{343,278}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{5,40},{343,278}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n            <key>ta0012.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{335,641},{325,240}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-8,-40}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{7,87},{325,240}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{355,334}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>light.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1022,966}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:4ea06de969664e304dea68a255325c93:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>light.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
        }
        else if (a == "res/roles.plist")
        {
            b = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<!DOCTYPE plist PUBLIC \"-\/\/Apple Computer\/\/DTD PLIST 1.0\/\/EN\" \"http:\/\/www.apple.com\/DTDs\/PropertyList-1.0.dtd\">\r\n<plist version=\"1.0\">\r\n    <dict>\r\n        <key>frames<\/key>\r\n        <dict>\r\n            <key>npc10001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,2},{82,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{82,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{923,360},{86,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,29},{86,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{538,406},{88,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{3,-10}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,29},{88,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,2},{82,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{82,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{923,287},{86,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,-13}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{18,32},{86,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc10006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{922,433},{86,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,-11}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{15,31},{86,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{628,402},{68,75}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,22},{68,75}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,384},{70,71}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{8,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,26},{70,71}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{469,406},{74,67}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{9,-9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,30},{74,67}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{628,402},{68,75}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{26,22},{68,75}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,456},{70,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{12,-4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,24},{70,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{849,456},{70,69}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{12,-4}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,24},{70,69}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc20007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,406},{74,67}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{11,-8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,29},{74,67}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{884,681},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{743,478},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{845,287},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{884,681},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-5,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{11,0},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{495,697},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{1,1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,6},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc30006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,697},{76,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-3,5}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,2},{76,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{921,504},{82,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,6},{82,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{918,597},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{0,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{834,556},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{6,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{19,1},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{743,556},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{4,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,3},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>npc40007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,681},{82,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{12,8},{82,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{108,109}<\/string>\r\n            <\/dict>\r\n            <key>role0001.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{592,644},{117,97}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{41,60},{117,97}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0002.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{197,251},{229,201}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,0},{229,201}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0003.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,2},{223,211}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-11,-1}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{3,4},{223,211}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0004.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,2},{247,195}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-1,-7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{1,18},{247,195}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0005.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,251},{239,193}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{3,-5}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{9,17},{239,193}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0006.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{193,492},{231,203}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{7,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{17,7},{231,203}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0007.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{398,482},{213,181}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{14,18}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,0},{213,181}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0008.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{199,2},{229,197}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{2,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{13,1},{229,197}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0009.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{2,492},{233,189}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-9,12}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{0,2},{233,189}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0010.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,2},{153,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,55},{153,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0011.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{800,2},{153,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{27,55},{153,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0012.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,190},{111,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{44,53},{111,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0013.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,190},{111,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{44,53},{111,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0014.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,2},{85,99}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{76,55},{85,99}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0015.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,2},{85,99}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-7,4}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{76,55},{85,99}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0016.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,95},{115,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{30,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{98,55},{115,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0017.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{894,95},{115,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{30,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{98,55},{115,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0018.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{752,236},{139,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{36,55},{139,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0019.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{752,236},{139,91}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,8}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{36,55},{139,91}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0020.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{669,236},{151,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,65},{151,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0021.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{669,236},{151,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{28,65},{151,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0022.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{660,479},{159,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-25,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,65},{159,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0023.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{660,479},{159,81}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-25,3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,65},{159,81}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0024.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{708,89},{145,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,57},{145,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0025.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{708,89},{145,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-22,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{31,57},{145,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0026.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{799,95},{137,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,53},{137,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0027.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{799,95},{137,93}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-20,9}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{37,53},{137,93}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0028.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,89},{133,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,51},{133,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0029.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{611,89},{133,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-26,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{33,51},{133,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0030.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{691,640},{133,107}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,13}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{46,42},{133,107}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0031.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{691,640},{133,107}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-13,13}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{46,42},{133,107}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0032.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{588,227},{173,79}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-18,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,67},{173,79}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0033.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{588,227},{173,79}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-18,2}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{21,67},{173,79}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0034.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{497,227},{177,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,57},{177,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0035.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{497,227},{177,89}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,7}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,57},{177,89}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0036.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,227},{177,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,51},{177,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0037.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{400,227},{177,95}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-15,10}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{22,51},{177,95}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0038.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,389},{149,87}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-28,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,65},{149,87}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0039.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{698,389},{149,87}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-28,0}<\/string>\r\n                <key>rotated<\/key>\r\n                <false\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,65},{149,87}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0040.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n            <key>role0041.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n\t\t\t<key>role0042.png<\/key>\r\n            <dict>\r\n                <key>frame<\/key>\r\n                <string>{{581,479},{163,77}}<\/string>\r\n                <key>offset<\/key>\r\n                <string>{-21,-3}<\/string>\r\n                <key>rotated<\/key>\r\n                <true\/>\r\n                <key>sourceColorRect<\/key>\r\n                <string>{{23,73},{163,77}}<\/string>\r\n                <key>sourceSize<\/key>\r\n                <string>{251,217}<\/string>\r\n            <\/dict>\r\n        <\/dict>\r\n        <key>metadata<\/key>\r\n        <dict>\r\n            <key>format<\/key>\r\n            <integer>2<\/integer>\r\n            <key>realTextureFileName<\/key>\r\n            <string>roles.png<\/string>\r\n            <key>size<\/key>\r\n            <string>{1011,775}<\/string>\r\n            <key>smartupdate<\/key>\r\n            <string>$TexturePacker:SmartUpdate:c0821d95be4e9be0bf09b9b14ae48e4e:1\/1$<\/string>\r\n            <key>textureFileName<\/key>\r\n            <string>roles.png<\/string>\r\n        <\/dict>\r\n    <\/dict>\r\n<\/plist>\r\n";
        }

//        cc.loader.loadTxt(a, function(a, b) {
//            if (a) return d(a);
            d(null, cc.plistParser.parse(b))
//        })
    }
};
cc.loader.register(["plist"], cc._plistLoader);
cc._fontLoader = {
    TYPE: {
        ".eot": "embedded-opentype",
        ".ttf": "truetype",
        ".woff": "woff",
        ".svg": "svg"
    },
    _loadFont: function(a, b, c) {
        var d = document,
            e = cc.path,
            f = this.TYPE,
            g = cc.newElement("style");
        g.type = "text/css";
        d.body.appendChild(g);
        var h = "@font-face { font-family:" + a + "; src:";
        if (b instanceof Array)
            for (var k = 0, m = b.length; k < m; k++) c = e.extname(b[k]).toLowerCase(), h += "url('" + b[k] + "') format('" + f[c] + "')", h += k == m - 1 ? ";" : ",";
        else h += "url('" + b + "') format('" + f[c] + "');";
        g.textContent += h + "};";
        b = cc.newElement("div");
        c =
            b.style;
        c.fontFamily = a;
        b.innerHTML = ".";
        c.position = "absolute";
        c.left = "-100px";
        c.top = "-100px";
        d.body.appendChild(b)
    },
    load: function(a, b, c, d) {
        b = c.type;
        a = c.name;
        b = c.srcs;
        "string" == typeof c ? (b = cc.path.extname(c), a = cc.path.basename(c, b), this._loadFont(a, c, b)) : this._loadFont(a, b);
        d(null, !0)
    }
};
cc.loader.register(["font", "eot", "ttf", "woff", "svg"], cc._fontLoader);
cc._binaryLoader = {
    load: function(a, b, c, d) {
        cc.loader.loadBinary(a, d)
    }
};
window.CocosEngine = cc.ENGINE_VERSION = "Cocos2d-html5-v3.0 beta";
cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 0;
cc.DIRECTOR_STATS_POSITION = cc.p(0, 0);
cc.DIRECTOR_FPS_INTERVAL = 0.5;
cc.COCOSNODE_RENDER_SUBPIXEL = 1;
cc.SPRITEBATCHNODE_RENDER_SUBPIXEL = 1;
cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA = 0;
cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP = 0;
cc.TEXTURE_ATLAS_USE_VAO = 0;
cc.TEXTURE_NPOT_SUPPORT = 0;
cc.RETINA_DISPLAY_SUPPORT = 1;
cc.RETINA_DISPLAY_FILENAME_SUFFIX = "-hd";
cc.USE_LA88_LABELS = 1;
cc.SPRITE_DEBUG_DRAW = 0;
cc.SPRITEBATCHNODE_DEBUG_DRAW = 0;
cc.LABELBMFONT_DEBUG_DRAW = 0;
cc.LABELATLAS_DEBUG_DRAW = 0;
cc.IS_RETINA_DISPLAY_SUPPORTED = 1;
cc.DEFAULT_ENGINE = cc.ENGINE_VERSION + "-canvas";
cc.ENABLE_STACKABLE_ACTIONS = 1;
cc.ENABLE_GL_STATE_CACHE = 1;
cc.$ = function(a) {
    var b = this == cc ? document : this;
    if (a = a instanceof HTMLElement ? a : b.querySelector(a)) a.find = a.find || cc.$, a.hasClass = a.hasClass || function(a) {
            return this.className.match(RegExp("(\\s|^)" + a + "(\\s|$)"))
        }, a.addClass = a.addClass || function(a) {
            this.hasClass(a) || (this.className && (this.className += " "), this.className += a);
            return this
        }, a.removeClass = a.removeClass || function(a) {
            this.hasClass(a) && (this.className = this.className.replace(a, ""));
            return this
        }, a.remove = a.remove || function() {
            this.parentNode &&
                this.parentNode.removeChild(this);
            return this
        }, a.appendTo = a.appendTo || function(a) {
            a.appendChild(this);
            return this
        }, a.prependTo = a.prependTo || function(a) {
            a.childNodes[0] ? a.insertBefore(this, a.childNodes[0]) : a.appendChild(this);
            return this
        }, a.transforms = a.transforms || function() {
            this.style[cc.$.trans] = cc.$.translate(this.position) + cc.$.rotate(this.rotation) + cc.$.scale(this.scale) + cc.$.skew(this.skew);
            return this
        }, a.position = a.position || {
            x: 0,
            y: 0
        }, a.rotation = a.rotation || 0, a.scale = a.scale || {
            x: 1,
            y: 1
        }, a.skew =
        a.skew || {
            x: 0,
            y: 0
        }, a.translates = function(a, b) {
            this.position.x = a;
            this.position.y = b;
            this.transforms();
            return this
        }, a.rotate = function(a) {
            this.rotation = a;
            this.transforms();
            return this
        }, a.resize = function(a, b) {
            this.scale.x = a;
            this.scale.y = b;
            this.transforms();
            return this
        }, a.setSkew = function(a, b) {
            this.skew.x = a;
            this.skew.y = b;
            this.transforms();
            return this
        };
    return a
};
switch (cc.sys.browserType) {
    case cc.sys.BROWSER_TYPE_FIREFOX:
        cc.$.pfx = "Moz";
        cc.$.hd = !0;
        break;
    case cc.sys.BROWSER_TYPE_CHROME:
    case cc.sys.BROWSER_TYPE_SAFARI:
        cc.$.pfx = "webkit";
        cc.$.hd = !0;
        break;
    case cc.sys.BROWSER_TYPE_OPERA:
        cc.$.pfx = "O";
        cc.$.hd = !1;
        break;
    case cc.sys.BROWSER_TYPE_IE:
        cc.$.pfx = "ms";
        cc.$.hd = !1;
        break;
    default:
        cc.$.pfx = "webkit", cc.$.hd = !0
}
cc.$.trans = cc.$.pfx + "Transform";
cc.$.translate = cc.$.hd ? function(a) {
    return "translate3d(" + a.x + "px, " + a.y + "px, 0) "
} : function(a) {
    return "translate(" + a.x + "px, " + a.y + "px) "
};
cc.$.rotate = cc.$.hd ? function(a) {
    return "rotateZ(" + a + "deg) "
} : function(a) {
    return "rotate(" + a + "deg) "
};
cc.$.scale = function(a) {
    return "scale(" + a.x + ", " + a.y + ") "
};
cc.$.skew = function(a) {
    return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)"
};
cc.$new = function(a) {
    return cc.$(document.createElement(a))
};
cc.$.findpos = function(a) {
    var b = 0,
        c = 0;
    do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent);
    return {
        x: b,
        y: c
    }
};
cc.INVALID_INDEX = -1;
cc.PI = Math.PI;
cc.FLT_MAX = parseFloat("3.402823466e+38F");
cc.FLT_MIN = parseFloat("1.175494351e-38F");
cc.RAD = cc.PI / 180;
cc.DEG = 180 / cc.PI;
cc.UINT_MAX = 4294967295;
cc.swap = function(a, b, c) {
    if ("object" == typeof c && "undefined" != typeof c.x && "undefined" != typeof c.y) {
        var d = c[a];
        c[a] = c[b];
        c[b] = d
    } else cc.log(cc._LogInfos.swap)
};
cc.lerp = function(a, b, c) {
    return a + (b - a) * c
};
cc.rand = function() {
    return 16777215 * Math.random()
};
cc.randomMinus1To1 = function() {
    return 2 * (Math.random() - 0.5)
};
cc.random0To1 = Math.random;
cc.degreesToRadians = function(a) {
    return a * cc.RAD
};
cc.radiansToDegrees = function(a) {
    return a * cc.DEG
};
cc.radiansToDegress = function(a) {
    cc.log(cc._LogInfos.radiansToDegress);
    return a * cc.DEG
};
cc.REPEAT_FOREVER = Number.MAX_VALUE - 1;
cc.BLEND_SRC = cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA ? 1 : 770;
cc.BLEND_DST = 771;
cc.nodeDrawSetup = function(a) {
    a._shaderProgram && (a._shaderProgram.use(), a._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4())
};
cc.enableDefaultGLStates = function() {};
cc.disableDefaultGLStates = function() {};
cc.incrementGLDraws = function(a) {
    cc.g_NumberOfDraws += a
};
cc.FLT_EPSILON = 1.192092896E-7;
cc.contentScaleFactor = cc.IS_RETINA_DISPLAY_SUPPORTED ? function() {
    return cc.director.getContentScaleFactor()
} : function() {
    return 1
};
cc.pointPointsToPixels = function(a) {
    var b = cc.contentScaleFactor();
    return cc.p(a.x * b, a.y * b)
};
cc.pointPixelsToPoints = function(a) {
    var b = cc.contentScaleFactor();
    return cc.p(a.x / b, a.y / b)
};
cc._pointPixelsToPointsOut = function(a, b) {
    var c = cc.contentScaleFactor();
    b.x = a.x / c;
    b.y = a.y / c
};
cc.sizePointsToPixels = function(a) {
    var b = cc.contentScaleFactor();
    return cc.size(a.width * b, a.height * b)
};
cc.sizePixelsToPoints = function(a) {
    var b = cc.contentScaleFactor();
    return cc.size(a.width / b, a.height / b)
};
cc._sizePixelsToPointsOut = function(a, b) {
    var c = cc.contentScaleFactor();
    b.width = a.width / c;
    b.height = a.height / c
};
cc.rectPixelsToPoints = cc.IS_RETINA_DISPLAY_SUPPORTED ? function(a) {
    var b = cc.contentScaleFactor();
    return cc.rect(a.x / b, a.y / b, a.width / b, a.height / b)
} : function(a) {
    return a
};
cc.rectPointsToPixels = cc.IS_RETINA_DISPLAY_SUPPORTED ? function(a) {
    var b = cc.contentScaleFactor();
    return cc.rect(a.x * b, a.y * b, a.width * b, a.height * b)
} : function(a) {
    return a
};
cc.ONE = 1;
cc.ZERO = 0;
cc.SRC_ALPHA = 770;
cc.SRC_ALPHA_SATURATE = 776;
cc.SRC_COLOR = 768;
cc.DST_ALPHA = 772;
cc.DST_COLOR = 774;
cc.ONE_MINUS_SRC_ALPHA = 771;
cc.ONE_MINUS_SRC_COLOR = 769;
cc.ONE_MINUS_DST_ALPHA = 773;
cc.ONE_MINUS_DST_COLOR = 775;
cc.ONE_MINUS_CONSTANT_ALPHA = 32772;
cc.ONE_MINUS_CONSTANT_COLOR = 32770;
cc.checkGLErrorDebug = function() {
    if (cc.renderMode == cc._RENDER_TYPE_WEBGL) {
        var a = cc._renderContext.getError();
        a && cc.log(CC._localZOrder.checkGLErrorDebug, a)
    }
};
cc.DEVICE_ORIENTATION_PORTRAIT = 0;
cc.DEVICE_ORIENTATION_LANDSCAPE_LEFT = 1;
cc.DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2;
cc.DEVICE_ORIENTATION_LANDSCAPE_RIGHT = 3;
cc.DEVICE_MAX_ORIENTATIONS = 2;
cc.VERTEX_ATTRIB_FLAG_NONE = 0;
cc.VERTEX_ATTRIB_FLAG_POSITION = 1;
cc.VERTEX_ATTRIB_FLAG_COLOR = 2;
cc.VERTEX_ATTRIB_FLAG_TEX_COORDS = 4;
cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX = cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS;
cc.GL_ALL = 0;
cc.VERTEX_ATTRIB_POSITION = 0;
cc.VERTEX_ATTRIB_COLOR = 1;
cc.VERTEX_ATTRIB_TEX_COORDS = 2;
cc.VERTEX_ATTRIB_MAX = 3;
cc.UNIFORM_PMATRIX = 0;
cc.UNIFORM_MVMATRIX = 1;
cc.UNIFORM_MVPMATRIX = 2;
cc.UNIFORM_TIME = 3;
cc.UNIFORM_SINTIME = 4;
cc.UNIFORM_COSTIME = 5;
cc.UNIFORM_RANDOM01 = 6;
cc.UNIFORM_SAMPLER = 7;
cc.UNIFORM_MAX = 8;
cc.SHADER_POSITION_TEXTURECOLOR = "ShaderPositionTextureColor";
cc.SHADER_POSITION_TEXTURECOLORALPHATEST = "ShaderPositionTextureColorAlphaTest";
cc.SHADER_POSITION_COLOR = "ShaderPositionColor";
cc.SHADER_POSITION_TEXTURE = "ShaderPositionTexture";
cc.SHADER_POSITION_TEXTURE_UCOLOR = "ShaderPositionTexture_uColor";
cc.SHADER_POSITION_TEXTUREA8COLOR = "ShaderPositionTextureA8Color";
cc.SHADER_POSITION_UCOLOR = "ShaderPosition_uColor";
cc.SHADER_POSITION_LENGTHTEXTURECOLOR = "ShaderPositionLengthTextureColor";
cc.UNIFORM_PMATRIX_S = "CC_PMatrix";
cc.UNIFORM_MVMATRIX_S = "CC_MVMatrix";
cc.UNIFORM_MVPMATRIX_S = "CC_MVPMatrix";
cc.UNIFORM_TIME_S = "CC_Time";
cc.UNIFORM_SINTIME_S = "CC_SinTime";
cc.UNIFORM_COSTIME_S = "CC_CosTime";
cc.UNIFORM_RANDOM01_S = "CC_Random01";
cc.UNIFORM_SAMPLER_S = "CC_Texture0";
cc.UNIFORM_ALPHA_TEST_VALUE_S = "CC_alpha_value";
cc.ATTRIBUTE_NAME_COLOR = "a_color";
cc.ATTRIBUTE_NAME_POSITION = "a_position";
cc.ATTRIBUTE_NAME_TEX_COORD = "a_texCoord";
cc.ITEM_SIZE = 32;
cc.CURRENT_ITEM = 3233828865;
cc.ZOOM_ACTION_TAG = 3233828866;
cc.NORMAL_TAG = 8801;
cc.SELECTED_TAG = 8802;
cc.DISABLE_TAG = 8803;
cc.Color = function(a, b, c, d) {
    this.r = a || 0;
    this.g = b || 0;
    this.b = c || 0;
    this.a = d || 255
};
cc.color = function(a, b, c, d) {
    return void 0 === a ? {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    } : "string" === typeof a ? cc.hexToColor(a) : "object" === typeof a ? {
        r: a.r,
        g: a.g,
        b: a.b,
        a: a.a || 255
    } : {
        r: a,
        g: b,
        b: c,
        a: d || 255
    }
};
cc.colorEqual = function(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b
};
cc.Acceleration = function(a, b, c, d) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
    this.timestamp = d || 0
};
cc.Vertex2F = function(a, b) {
    this.x = a || 0;
    this.y = b || 0
};
cc.vertex2 = function(a, b) {
    return new cc.Vertex2F(a, b)
};
cc.Vertex3F = function(a, b, c) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0
};
cc.vertex3 = function(a, b, c) {
    return new cc.Vertex3F(a, b, c)
};
cc.Tex2F = function(a, b) {
    this.u = a || 0;
    this.v = b || 0
};
cc.tex2 = function(a, b) {
    return new cc.Tex2F(a, b)
};
cc.BlendFunc = function(a, b) {
    this.src = a;
    this.dst = b
};
cc.blendFuncDisable = function() {
    return new cc.BlendFunc(cc.ONE, cc.ZERO)
};
cc.hexToColor = function(a) {
    a = a.replace(/^#?/, "0x");
    a = parseInt(a);
    return cc.color(a >> 16, (a >> 8) % 256, a % 256)
};
cc.colorToHex = function(a) {
    var b = a.r.toString(16),
        c = a.g.toString(16),
        d = a.b.toString(16);
    return "#" + (16 > a.r ? "0" + b : b) + (16 > a.g ? "0" + c : c) + (16 > a.b ? "0" + d : d)
};
cc.TEXT_ALIGNMENT_LEFT = 0;
cc.TEXT_ALIGNMENT_CENTER = 1;
cc.TEXT_ALIGNMENT_RIGHT = 2;
cc.VERTICAL_TEXT_ALIGNMENT_TOP = 0;
cc.VERTICAL_TEXT_ALIGNMENT_CENTER = 1;
cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM = 2;
cc._Dictionary = cc.Class.extend({
    _keyMapTb: null,
    _valueMapTb: null,
    __currId: 0,
    ctor: function() {
        this._keyMapTb = {};
        this._valueMapTb = {};
        this.__currId = 2 << (0 | 10 * Math.random())
    },
    __getKey: function() {
        this.__currId++;
        return "key_" + this.__currId
    },
    setObject: function(a, b) {
        if (null != b) {
            var c = this.__getKey();
            this._keyMapTb[c] = b;
            this._valueMapTb[c] = a
        }
    },
    objectForKey: function(a) {
        if (null == a) return null;
        var b = this._keyMapTb,
            c;
        for (c in b)
            if (b[c] === a) return this._valueMapTb[c];
        return null
    },
    valueForKey: function(a) {
        return this.objectForKey(a)
    },
    removeObjectForKey: function(a) {
        if (null != a) {
            var b = this._keyMapTb,
                c;
            for (c in b)
                if (b[c] === a) {
                    delete this._valueMapTb[c];
                    delete b[c];
                    break
                }
        }
    },
    removeObjectsForKeys: function(a) {
        if (null != a)
            for (var b = 0; b < a.length; b++) this.removeObjectForKey(a[b])
    },
    allKeys: function() {
        var a = [],
            b = this._keyMapTb,
            c;
        for (c in b) a.push(b[c]);
        return a
    },
    removeAllObjects: function() {
        this._keyMapTb = {};
        this._valueMapTb = {}
    },
    count: function() {
        return this.allKeys().length
    }
});
cc.FontDefinition = function() {
    this.fontName = "Arial";
    this.fontSize = 12;
    this.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    this.fillStyle = cc.color(255, 255, 255, 255);
    this.boundingHeight = this.boundingWidth = 0;
    this.strokeEnabled = !1;
    this.strokeStyle = cc.color(255, 255, 255, 255);
    this.lineWidth = 1;
    this.shadowEnabled = !1;
    this.shadowBlur = this.shadowOffsetY = this.shadowOffsetX = 0;
    this.shadowOpacity = 1
};
cc._renderType === cc._RENDER_TYPE_WEBGL && (cc.assert("function" === typeof cc._tmp.WebGLColor, cc._LogInfos.MissingFile, "CCTypesWebGL.js"), cc._tmp.WebGLColor(), delete cc._tmp.WebGLColor);
cc.assert("function" === typeof cc._tmp.PrototypeColor, cc._LogInfos.MissingFile, "CCTypesPropertyDefine.js");
cc._tmp.PrototypeColor();
delete cc._tmp.PrototypeColor;
cc.Touches = [];
cc.TouchesIntergerDict = {};
cc.EGLView = cc.Class.extend({
    _delegate: null,
    _frameSize: null,
    _designResolutionSize: null,
    _originalDesignResolutionSize: null,
    _viewPortRect: null,
    _visibleRect: null,
    _retinaEnabled: !1,
    _autoFullScreen: !0,
    _devicePixelRatio: 1,
    _viewName: "",
    _resizeCallback: null,
    _scaleX: 1,
    _originalScaleX: 1,
    _scaleY: 1,
    _originalScaleY: 1,
    _indexBitsUsed: 0,
    _maxTouches: 5,
    _resolutionPolicy: null,
    _rpExactFit: null,
    _rpShowAll: null,
    _rpNoBorder: null,
    _rpFixedHeight: null,
    _rpFixedWidth: null,
    _initialized: !1,
    _captured: !1,
    _wnd: null,
    _hDC: null,
    _hRC: null,
    _supportTouch: !1,
    _contentTranslateLeftTop: null,
    _frame: null,
    _frameZoomFactor: 1,
    __resizeWithBrowserSize: !1,
    _isAdjustViewPort: !0,
    ctor: function() {
        var a = document,
            b = cc.ContainerStrategy,
            c = cc.ContentStrategy;
        this._frame = cc.container.parentNode === a.body ? a.documentElement : cc.container.parentNode;
        this._frameSize = cc.size(0, 0);
        this._initFrameSize();
        var a = cc._canvas.width,
            d = cc._canvas.height;
        this._designResolutionSize = cc.size(a, d);
        this._originalDesignResolutionSize = cc.size(a, d);
        this._viewPortRect = cc.rect(0, 0,
            a, d);
        this._visibleRect = cc.rect(0, 0, a, d);
        this._contentTranslateLeftTop = {
            left: 0,
            top: 0
        };
        this._viewName = "Cocos2dHTML5";
        a = cc.sys;
        this.enableRetina(a.os == a.OS_IOS || a.os == a.OS_OSX);
        cc.visibleRect && cc.visibleRect.init(this._visibleRect);
        this._rpExactFit = new cc.ResolutionPolicy(b.EQUAL_TO_FRAME, c.EXACT_FIT);
        this._rpShowAll = new cc.ResolutionPolicy(b.PROPORTION_TO_FRAME, c.SHOW_ALL);
        this._rpNoBorder = new cc.ResolutionPolicy(b.EQUAL_TO_FRAME, c.NO_BORDER);
        this._rpFixedHeight = new cc.ResolutionPolicy(b.EQUAL_TO_FRAME,
            c.FIXED_HEIGHT);
        this._rpFixedWidth = new cc.ResolutionPolicy(b.EQUAL_TO_FRAME, c.FIXED_WIDTH);
        this._hDC = cc._canvas;
        this._hRC = cc._renderContext
    },
    _resizeEvent: function() {
        var a = this._originalDesignResolutionSize.width,
            b = this._originalDesignResolutionSize.height;
        this._resizeCallback && (this._initFrameSize(), this._resizeCallback.call());
        0 < a && this.setDesignResolutionSize(a, b, this._resolutionPolicy)
    },
    resizeWithBrowserSize: function(a) {
        a ? this.__resizeWithBrowserSize || (this.__resizeWithBrowserSize = !0, a = this._resizeEvent.bind(this),
            cc._addEventListener(window, "resize", a, !1)) : this.__resizeWithBrowserSize && (this.__resizeWithBrowserSize = !0, a = this._resizeEvent.bind(this), window.removeEventListener("resize", a, !1))
    },
    setResizeCallback: function(a) {
        if ("function" == typeof a || null == a) this._resizeCallback = a
    },
    _initFrameSize: function() {
        var a = this._frameSize;
        a.width = this._frame.clientWidth;
        a.height = this._frame.clientHeight
    },
    _adjustSizeKeepCanvasSize: function() {
        var a = this._originalDesignResolutionSize.width,
            b = this._originalDesignResolutionSize.height;
        0 < a && this.setDesignResolutionSize(a, b, this._resolutionPolicy)
    },
    _setViewPortMeta: function(a, b) {
        if (this._isAdjustViewPort) {
            var c = {
                    "user-scalable": "no",
                    "maximum-scale": "1.0",
                    width: "device-width"
                },
                d = document.getElementsByName("viewport"),
                e;
            0 == d.length ? (d = cc.newElement("meta"), d.name = "viewport", d.content = "", document.head.appendChild(d)) : d = d[0];
            e = d.content;
            for (var f in c) RegExp(f).test(e) || (e += ("" == e ? "" : ",") + f + "\x3d" + c[f]);
            d.content = e
        }
    },
    _setScaleXYForRenderTexture: function() {
        var a = cc.contentScaleFactor();
        this._scaleY = this._scaleX = a
    },
    _resetScale: function() {
        this._scaleX = this._originalScaleX;
        this._scaleY = this._originalScaleY
    },
    _adjustSizeToBrowser: function() {},
    initialize: function() {
        this._initialized = !0
    },
    adjustViewPort: function(a) {
        this._isAdjustViewPort = a
    },
    enableRetina: function(a) {
        this._retinaEnabled = a ? !0 : !1
    },
    isRetinaEnabled: function() {
        return this._retinaEnabled
    },
    enableAutoFullScreen: function(a) {
        this._autoFullScreen = a ? !0 : !1
    },
    isAutoFullScreenEnabled: function() {
        return this._autoFullScreen
    },
    end: function() {},
    isOpenGLReady: function() {
        return null != this._hDC && null != this._hRC
    },
    setFrameZoomFactor: function(a) {
        this._frameZoomFactor = a;
        this.centerWindow();
        cc.director.setProjection(cc.director.getProjection())
    },
    swapBuffers: function() {},
    setIMEKeyboardState: function(a) {},
    setContentTranslateLeftTop: function(a, b) {
        this._contentTranslateLeftTop = {
            left: a,
            top: b
        }
    },
    getContentTranslateLeftTop: function() {
        return this._contentTranslateLeftTop
    },
    getFrameSize: function() {
        return cc.size(this._frameSize.width, this._frameSize.height)
    },
    setFrameSize: function(a, b) {
        this._frameSize.width = a;
        this._frameSize.height = b;
        this._frame.style.width = a + "px";
        this._frame.style.height = b + "px";
        this._resizeEvent();
        cc.director.setProjection(cc.director.getProjection())
    },
    centerWindow: function() {},
    getVisibleSize: function() {
        return cc.size(this._visibleRect.width, this._visibleRect.height)
    },
    getVisibleOrigin: function() {
        return cc.p(this._visibleRect.x, this._visibleRect.y)
    },
    canSetContentScaleFactor: function() {
        return !0
    },
    getResolutionPolicy: function() {
        return this._resolutionPolicy
    },
    setResolutionPolicy: function(a) {
        if (a instanceof cc.ResolutionPolicy) this._resolutionPolicy = a;
        else {
            var b = cc.ResolutionPolicy;
            a === b.EXACT_FIT && (this._resolutionPolicy = this._rpExactFit);
            a === b.SHOW_ALL && (this._resolutionPolicy = this._rpShowAll);
            a === b.NO_BORDER && (this._resolutionPolicy = this._rpNoBorder);
            a === b.FIXED_HEIGHT && (this._resolutionPolicy = this._rpFixedHeight);
            a === b.FIXED_WIDTH && (this._resolutionPolicy = this._rpFixedWidth)
        }
    },
    setDesignResolutionSize: function(a, b, c) {
        if (isNaN(a) || 0 == a || isNaN(b) || 0 ==
            b) cc.log(cc._LogInfos.EGLView_setDesignResolutionSize);
        else {
            this.setResolutionPolicy(c);
            var d = this._resolutionPolicy;
            if (d) {
                d.preApply(this);
                var e = this._frameSize.width,
                    f = this._frameSize.height;
                cc.sys.isMobile && this._setViewPortMeta(this._frameSize.width, this._frameSize.height);
                this._initFrameSize();
                c == this._resolutionPolicy && a == this._originalDesignResolutionSize.width && b == this._originalDesignResolutionSize.height && e == this._frameSize.width && f == this._frameSize.height || (this._designResolutionSize = cc.size(a,
                        b), this._originalDesignResolutionSize = cc.size(a, b), a = d.apply(this, this._designResolutionSize), a.scale && 2 == a.scale.length && (this._scaleX = a.scale[0], this._scaleY = a.scale[1]), a.viewport && (a = this._viewPortRect = a.viewport, b = this._visibleRect, b.width = cc._canvas.width / this._scaleX, b.height = cc._canvas.height / this._scaleY, b.x = -a.x / this._scaleX, b.y = -a.y / this._scaleY), a = cc.director, cc.winSize.width = a._winSizeInPoints.width = this._visibleRect.width, cc.winSize.height = a._winSizeInPoints.height = this._visibleRect.height,
                    d.postApply(this), cc._renderType == cc._RENDER_TYPE_WEBGL && (a._createStatsLabel(), a.setGLDefaultValues()), this._originalScaleX = this._scaleX, this._originalScaleY = this._scaleY, cc.DOM && cc.DOM._resetEGLViewDiv(), cc.visibleRect && cc.visibleRect.init(this._visibleRect))
            } else cc.log(cc._LogInfos.EGLView_setDesignResolutionSize_2)
        }
    },
    getDesignResolutionSize: function() {
        return cc.size(this._designResolutionSize.width, this._designResolutionSize.height)
    },
    setViewPortInPoints: function(a, b, c, d) {
        var e = this._frameZoomFactor,
            f = this._scaleX,
            g = this._scaleY;
        cc._renderContext.viewport(a * f * e + this._viewPortRect.x * e, b * g * e + this._viewPortRect.y * e, c * f * e, d * g * e)
    },
    setScissorInPoints: function(a, b, c, d) {
        var e = this._frameZoomFactor,
            f = this._scaleX,
            g = this._scaleY;
        cc._renderContext.scissor(a * f * e + this._viewPortRect.x * e, b * g * e + this._viewPortRect.y * e, c * f * e, d * g * e)
    },
    isScissorEnabled: function() {
        var a = cc._renderContext;
        return a.isEnabled(a.SCISSOR_TEST)
    },
    getScissorRect: function() {
        var a = cc._renderContext,
            b = this._scaleX,
            c = this._scaleY,
            a = a.getParameter(a.SCISSOR_BOX);
        return cc.rect((a[0] - this._viewPortRect.x) / b, (a[1] - this._viewPortRect.y) / c, a[2] / b, a[3] / c)
    },
    setViewName: function(a) {
        null != a && 0 < a.length && (this._viewName = a)
    },
    getViewName: function() {
        return this._viewName
    },
    getViewPortRect: function() {
        return this._viewPortRect
    },
    getScaleX: function() {
        return this._scaleX
    },
    getScaleY: function() {
        return this._scaleY
    },
    getDevicePixelRatio: function() {
        return this._devicePixelRatio
    },
    convertToLocationInView: function(a, b, c) {
        return {
            x: this._devicePixelRatio * (a - c.left),
            y: this._devicePixelRatio *
                (c.top + c.height - b)
        }
    },
    _convertMouseToLocationInView: function(a, b) {
        var c = this._viewPortRect;
        a.x = (this._devicePixelRatio * (a.x - b.left) - c.x) / this._scaleX;
        a.y = (this._devicePixelRatio * (b.top + b.height - a.y) - c.y) / this._scaleY
    },
    _convertTouchesWithScale: function(a) {
        for (var b = this._viewPortRect, c = this._scaleX, d = this._scaleY, e, f, g, h = 0; h < a.length; h++) e = a[h], f = e._point, g = e._prevPoint, e._setPoint((f.x - b.x) / c, (f.y - b.y) / d), e._setPrevPoint((g.x - b.x) / c, (g.y - b.y) / d)
    }
});
cc.EGLView._getInstance = function() {
    this._instance || (this._instance = this._instance || new cc.EGLView, this._instance.initialize());
    return this._instance
};
cc.ContainerStrategy = cc.Class.extend({
    preApply: function(a) {},
    apply: function(a, b) {},
    postApply: function(a) {},
    _setupContainer: function(a, b, c) {
        var d = cc._canvas,
            e = cc.container;
        e.style.width = d.style.width = b + "px";
        e.style.height = d.style.height = c + "px";
        e = a._devicePixelRatio = 1;
        a.isRetinaEnabled() && (e = a._devicePixelRatio = window.devicePixelRatio || 1);
        d.width = b * e;
        d.height = c * e;
        a = document.body;
        var f;
        if (a && (f = a.style)) f.paddingTop = f.paddingTop || "0px", f.paddingRight = f.paddingRight || "0px", f.paddingBottom = f.paddingBottom ||
            "0px", f.paddingLeft = f.paddingLeft || "0px", f.borderTop = f.borderTop || "0px", f.borderRight = f.borderRight || "0px", f.borderBottom = f.borderBottom || "0px", f.borderLeft = f.borderLeft || "0px", f.marginTop = f.marginTop || "0px", f.marginRight = f.marginRight || "0px", f.marginBottom = f.marginBottom || "0px", f.marginLeft = f.marginLeft || "0px"
    },
    _fixContainer: function() {
        document.body.insertBefore(cc.container, document.body.firstChild);
        var a = document.body.style;
        a.width = window.innerWidth + "px";
        a.height = window.innerHeight + "px";
        a.overflow =
            "hidden";
        a = cc.container.style;
        a.position = "fixed";
        a.left = a.top = "0px";
        document.body.scrollTop = 0
    }
});
cc.ContentStrategy = cc.Class.extend({
    _result: {
        scale: [1, 1],
        viewport: null
    },
    _buildResult: function(a, b, c, d, e, f) {
        2 > Math.abs(a - c) && (c = a);
        2 > Math.abs(b - d) && (d = b);
        a = cc.rect(Math.round((a - c) / 2), Math.round((b - d) / 2), c, d);
        cc._renderType == cc._RENDER_TYPE_CANVAS && cc._renderContext.translate(a.x, a.y + d);
        this._result.scale = [e, f];
        this._result.viewport = a;
        return this._result
    },
    preApply: function(a) {},
    apply: function(a, b) {
        return {
            scale: [1, 1]
        }
    },
    postApply: function(a) {}
});
(function() {
    var a = cc.ContainerStrategy.extend({
            apply: function(a) {
                this._setupContainer(a, a._frameSize.width, a._frameSize.height)
            }
        }),
        b = cc.ContainerStrategy.extend({
            apply: function(a, b) {
                var c = a._frameSize.width,
                    d = a._frameSize.height,
                    e = cc.container.style,
                    n = b.width,
                    q = b.height,
                    s = c / n,
                    r = d / q,
                    u, t;
                s < r ? (u = c, t = q * s) : (u = n * r, t = d);
                n = Math.round((c - u) / 2);
                t = Math.round((d - t) / 2);
                this._setupContainer(a, c - 2 * n, d - 2 * t);
                e.marginLeft = n + "px";
                e.marginRight = n + "px";
                e.marginTop = t + "px";
                e.marginBottom = t + "px"
            }
        });
    a.extend({
        preApply: function(a) {
            this._super(a);
            a._frame = document.documentElement
        },
        apply: function(a) {
            this._super(a);
            this._fixContainer()
        }
    });
    b.extend({
        preApply: function(a) {
            this._super(a);
            a._frame = document.documentElement
        },
        apply: function(a, b) {
            this._super(a, b);
            this._fixContainer()
        }
    });
    var c = cc.ContainerStrategy.extend({
        apply: function(a) {
            this._setupContainer(a, cc._canvas.width, cc._canvas.height)
        }
    });
    cc.ContainerStrategy.EQUAL_TO_FRAME = new a;
    cc.ContainerStrategy.PROPORTION_TO_FRAME = new b;
    cc.ContainerStrategy.ORIGINAL_CONTAINER = new c;
    var a = cc.ContentStrategy.extend({
            apply: function(a,
                b) {
                var c = cc._canvas.width,
                    d = cc._canvas.height;
                return this._buildResult(c, d, c, d, c / b.width, d / b.height)
            }
        }),
        b = cc.ContentStrategy.extend({
            apply: function(a, b) {
                var c = cc._canvas.width,
                    d = cc._canvas.height,
                    e = b.width,
                    n = b.height,
                    q = c / e,
                    s = d / n,
                    r = 0,
                    u, t;
                q < s ? (r = q, u = c, t = n * r) : (r = s, u = e * r, t = d);
                return this._buildResult(c, d, u, t, r, r)
            }
        }),
        c = cc.ContentStrategy.extend({
            apply: function(a, b) {
                var c = cc._canvas.width,
                    d = cc._canvas.height,
                    e = b.width,
                    n = b.height,
                    q = c / e,
                    s = d / n,
                    r, u, t;
                q < s ? (r = s, u = e * r, t = d) : (r = q, u = c, t = n * r);
                return this._buildResult(c,
                    d, u, t, r, r)
            }
        }),
        d = cc.ContentStrategy.extend({
            apply: function(a, b) {
                var c = cc._canvas.width,
                    d = cc._canvas.height,
                    e = d / b.height;
                return this._buildResult(c, d, c, d, e, e)
            },
            postApply: function(a) {
                cc.director._winSizeInPoints = a.getVisibleSize()
            }
        }),
        e = cc.ContentStrategy.extend({
            apply: function(a, b) {
                var c = cc._canvas.width,
                    d = cc._canvas.height,
                    e = c / b.width;
                return this._buildResult(c, d, c, d, e, e)
            },
            postApply: function(a) {
                cc.director._winSizeInPoints = a.getVisibleSize()
            }
        });
    cc.ContentStrategy.EXACT_FIT = new a;
    cc.ContentStrategy.SHOW_ALL =
        new b;
    cc.ContentStrategy.NO_BORDER = new c;
    cc.ContentStrategy.FIXED_HEIGHT = new d;
    cc.ContentStrategy.FIXED_WIDTH = new e
})();
cc.ResolutionPolicy = cc.Class.extend({
    _containerStrategy: null,
    _contentStrategy: null,
    ctor: function(a, b) {
        this.setContainerStrategy(a);
        this.setContentStrategy(b)
    },
    preApply: function(a) {
        this._containerStrategy.preApply(a);
        this._contentStrategy.preApply(a)
    },
    apply: function(a, b) {
        this._containerStrategy.apply(a, b);
        return this._contentStrategy.apply(a, b)
    },
    postApply: function(a) {
        this._containerStrategy.postApply(a);
        this._contentStrategy.postApply(a)
    },
    setContainerStrategy: function(a) {
        a instanceof cc.ContainerStrategy &&
            (this._containerStrategy = a)
    },
    setContentStrategy: function(a) {
        a instanceof cc.ContentStrategy && (this._contentStrategy = a)
    }
});
cc.ResolutionPolicy.EXACT_FIT = 0;
cc.ResolutionPolicy.NO_BORDER = 1;
cc.ResolutionPolicy.SHOW_ALL = 2;
cc.ResolutionPolicy.FIXED_HEIGHT = 3;
cc.ResolutionPolicy.FIXED_WIDTH = 4;
cc.ResolutionPolicy.UNKNOWN = 5;
cc.screen = {
    _supportsFullScreen: !1,
    _preOnFullScreenChange: null,
    _touchEvent: "",
    _fn: null,
    _fnMap: [
        ["requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenEnabled", "fullscreenElement"],
        ["requestFullScreen", "exitFullScreen", "fullScreenchange", "fullScreenEnabled", "fullScreenElement"],
        ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement"],
        ["mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen",
            "mozFullScreenElement"
        ],
        ["msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "msFullscreenEnabled", "msFullscreenElement"]
    ],
    init: function() {
        this._fn = {};
        var a, b, c = this._fnMap,
            d;
        a = 0;
        for (l = c.length; a < l; a++)
            if ((b = c[a]) && b[1] in document) {
                a = 0;
                for (d = b.length; a < d; a++) this._fn[c[0][a]] = b[a];
                break
            }
        this._supportsFullScreen = void 0 != this._fn.requestFullscreen;
        this._touchEvent = "ontouchstart" in window ? "touchstart" : "mousedown"
    },
    fullScreen: function() {
        return this._supportsFullScreen && document[this._fn.fullscreenEnabled]
    },
    requestFullScreen: function(a, b) {
        if (this._supportsFullScreen) {
            a = a || document.documentElement;
            a[this._fn.requestFullscreen]();
            if (b) {
                var c = this._fn.fullscreenchange;
                this._preOnFullScreenChange && document.removeEventListener(c, this._preOnFullScreenChange);
                this._preOnFullScreenChange = b;
                cc._addEventListener(document, c, b, !1)
            }
            return a[this._fn.requestFullscreen]()
        }
    },
    exitFullScreen: function() {
        return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : !0
    },
    autoFullScreen: function(a, b) {
        function c() {
            e.requestFullScreen(a,
                b);
            d.removeEventListener(e._touchEvent, c)
        }
        a = a || document.body;
        var d = cc._canvas || a,
            e = this;
        this.requestFullScreen(a, b);
        cc._addEventListener(d, this._touchEvent, c)
    }
};
cc.screen.init();
cc.visibleRect = {
    topLeft: cc.p(0, 0),
    topRight: cc.p(0, 0),
    top: cc.p(0, 0),
    bottomLeft: cc.p(0, 0),
    bottomRight: cc.p(0, 0),
    bottom: cc.p(0, 0),
    center: cc.p(0, 0),
    left: cc.p(0, 0),
    right: cc.p(0, 0),
    width: 0,
    height: 0,
    init: function(a) {
        var b = this.width = a.width,
            c = this.height = a.height,
            d = a.x;
        a = a.y;
        var e = a + c,
            f = d + b;
        this.topLeft.x = d;
        this.topLeft.y = e;
        this.topRight.x = f;
        this.topRight.y = e;
        this.top.x = d + b / 2;
        this.top.y = e;
        this.bottomLeft.x = d;
        this.bottomLeft.y = a;
        this.bottomRight.x = f;
        this.bottomRight.y = a;
        this.bottom.x = d + b / 2;
        this.bottom.y =
            a;
        this.center.x = d + b / 2;
        this.center.y = a + c / 2;
        this.left.x = d;
        this.left.y = a + c / 2;
        this.right.x = f;
        this.right.y = a + c / 2
    }
};
cc.UIInterfaceOrientationLandscapeLeft = -90;
cc.UIInterfaceOrientationLandscapeRight = 90;
cc.UIInterfaceOrientationPortraitUpsideDown = 180;
cc.UIInterfaceOrientationPortrait = 0;
cc.inputManager = {
    _mousePressed: !1,
    _isRegisterEvent: !1,
    _preTouchPoint: cc.p(0, 0),
    _prevMousePoint: cc.p(0, 0),
    _preTouchPool: [],
    _preTouchPoolPointer: 0,
    _touches: [],
    _touchesIntegerDict: {},
    _indexBitsUsed: 0,
    _maxTouches: 5,
    _accelEnabled: !1,
    _accelInterval: 1 / 30,
    _accelMinus: 1,
    _accelCurTime: 0,
    _acceleration: null,
    _accelDeviceEvent: null,
    _getUnUsedIndex: function() {
        for (var a = this._indexBitsUsed, b = 0; b < this._maxTouches; b++) {
            if (!(a & 1)) return this._indexBitsUsed |= 1 << b, b;
            a >>= 1
        }
        return -1
    },
    _removeUsedIndexBit: function(a) {
        0 > a ||
            a >= this._maxTouches || (a = ~(1 << a), this._indexBitsUsed &= a)
    },
    _glView: null,
    handleTouchesBegin: function(a) {
        for (var b, c, d, e = [], f = this._touchesIntegerDict, g = 0, h = a.length; g < h; g++) b = a[g], d = b.getID(), c = f[d], null == c && (c = this._getUnUsedIndex(), -1 == c ? cc.log(cc._LogInfos.inputManager_handleTouchesBegin, c) : (b = this._touches[c] = b, f[d] = c, e.push(b)));
        0 < e.length && (this._glView._convertTouchesWithScale(e), a = new cc.EventTouch(e), a._eventCode = cc.EventTouch.EventCode.BEGAN, cc.eventManager.dispatchEvent(a))
    },
    handleTouchesMove: function(a) {
        for (var b,
                c, d = [], e = this._touches, f = 0, g = a.length; f < g; f++) b = a[f], c = b.getID(), c = this._touchesIntegerDict[c], null != c && e[c] && (e[c]._setPoint(b._point), e[c]._setPrevPoint(b._prevPoint), d.push(e[c]));
        0 < d.length && (this._glView._convertTouchesWithScale(d), a = new cc.EventTouch(d), a._eventCode = cc.EventTouch.EventCode.MOVED, cc.eventManager.dispatchEvent(a))
    },
    handleTouchesEnd: function(a) {
        a = this.getSetOfTouchesEndOrCancel(a);
        0 < a.length && (this._glView._convertTouchesWithScale(a), a = new cc.EventTouch(a), a._eventCode = cc.EventTouch.EventCode.ENDED,
            cc.eventManager.dispatchEvent(a))
    },
    handleTouchesCancel: function(a) {
        a = this.getSetOfTouchesEndOrCancel(a);
        0 < a.length && (this._glView._convertTouchesWithScale(a), a = new cc.EventTouch(a), a._eventCode = cc.EventTouch.EventCode.CANCELLED, cc.eventManager.dispatchEvent(a))
    },
    getSetOfTouchesEndOrCancel: function(a) {
        for (var b, c, d, e = [], f = this._touches, g = this._touchesIntegerDict, h = 0, k = a.length; h < k; h++) b = a[h], d = b.getID(), c = g[d], null != c && f[c] && (f[c]._setPoint(b._point), f[c]._setPrevPoint(b._prevPoint), e.push(f[c]), this._removeUsedIndexBit(c),
            delete g[d]);
        return e
    },
    getHTMLElementPosition: function(a) {
        var b = document.documentElement,
            c = window,
            d = null,
            d = "function" === typeof a.getBoundingClientRect ? a.getBoundingClientRect() : a instanceof HTMLCanvasElement ? {
                left: 0,
                top: 0,
                width: a.width,
                height: a.height
            } : {
                left: 0,
                top: 0,
                width: parseInt(a.style.width),
                height: parseInt(a.style.height)
            };
        return {
            left: d.left + c.pageXOffset - b.clientLeft,
            top: d.top + c.pageYOffset - b.clientTop,
            width: d.width,
            height: d.height
        }
    },
    getPreTouch: function(a) {
        for (var b = null, c = this._preTouchPool,
                d = a.getId(), e = c.length - 1; 0 <= e; e--)
            if (c[e].getId() == d) {
                b = c[e];
                break
            }
        b || (b = a);
        return b
    },
    setPreTouch: function(a) {
        for (var b = !1, c = this._preTouchPool, d = a.getId(), e = c.length - 1; 0 <= e; e--)
            if (c[e].getId() == d) {
                c[e] = a;
                b = !0;
                break
            }
        b || (50 >= c.length ? c.push(a) : (c[this._preTouchPoolPointer] = a, this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50))
    },
    getTouchByXY: function(a, b, c) {
        var d = this._preTouchPoint;
        a = this._glView.convertToLocationInView(a, b, c);
        b = new cc.Touch(a.x, a.y);
        b._setPrevPoint(d.x, d.y);
        d.x = a.x;
        d.y = a.y;
        return b
    },
    getMouseEvent: function(a, b, c) {
        var d = this._prevMousePoint;
        this._glView._convertMouseToLocationInView(a, b);
        b = new cc.EventMouse(c);
        b.setLocation(a.x, a.y);
        b._setPrevCursor(d.x, d.y);
        d.x = a.x;
        d.y = a.y;
        return b
    },
    getPointByEvent: function(a, b) {
        if (null != a.pageX) return {
            x: a.pageX,
            y: a.pageY
        };
        b.left -= document.body.scrollLeft;
        b.top -= document.body.scrollTop;
        return {
            x: a.clientX,
            y: a.clientY
        }
    },
    getTouchesByEvent: function(a, b) {
        for (var c = [], d = this._glView, e, f, g = this._preTouchPoint, h = a.changedTouches.length, k = 0; k <
            h; k++)
            if (e = a.changedTouches[k]) {
                var m;
                m = cc.sys.BROWSER_TYPE_FIREFOX === cc.sys.browserType ? d.convertToLocationInView(e.pageX, e.pageY, b) : d.convertToLocationInView(e.clientX, e.clientY, b);
                null != e.identifier ? (e = new cc.Touch(m.x, m.y, e.identifier), f = this.getPreTouch(e).getLocation(), e._setPrevPoint(f.x, f.y), this.setPreTouch(e)) : (e = new cc.Touch(m.x, m.y), e._setPrevPoint(g.x, g.y));
                g.x = m.x;
                g.y = m.y;
                c.push(e)
            }
        return c
    },
    registerSystemEvent: function(a) {
        if (!this._isRegisterEvent) {
            var b = this._glView = cc.view,
                c = this,
                d = "touches" in cc.sys.capabilities;
            "mouse" in cc.sys.capabilities && (cc._addEventListener(window, "mousedown", function() {
                c._mousePressed = !0
            }, !1), cc._addEventListener(window, "mouseup", function(b) {
                var e = c._mousePressed;
                c._mousePressed = !1;
                if (e) {
                    var e = c.getHTMLElementPosition(a),
                        f = c.getPointByEvent(b, e);
                    cc.rectContainsPoint(new cc.Rect(e.left, e.top, e.width, e.height), f) || (d || c.handleTouchesEnd([c.getTouchByXY(f.x, f.y, e)]), e = c.getMouseEvent(f, e, cc.EventMouse.UP), e.setButton(b.button), cc.eventManager.dispatchEvent(e))
                }
            }, !1), cc._addEventListener(a, "mousedown", function(b) {
                c._mousePressed = !0;
                var e = c.getHTMLElementPosition(a),
                    f = c.getPointByEvent(b, e);
                d || c.handleTouchesBegin([c.getTouchByXY(f.x, f.y, e)]);
                e = c.getMouseEvent(f, e, cc.EventMouse.DOWN);
                e.setButton(b.button);
                cc.eventManager.dispatchEvent(e);
                b.stopPropagation();
                b.preventDefault();
                a.focus()
            }, !1), cc._addEventListener(a, "mouseup", function(b) {
                c._mousePressed = !1;
                var e = c.getHTMLElementPosition(a),
                    f = c.getPointByEvent(b, e);
                d || c.handleTouchesEnd([c.getTouchByXY(f.x, f.y,
                    e)]);
                e = c.getMouseEvent(f, e, cc.EventMouse.UP);
                e.setButton(b.button);
                cc.eventManager.dispatchEvent(e);
                b.stopPropagation();
                b.preventDefault()
            }, !1), cc._addEventListener(a, "mousemove", function(b) {
                var e = c.getHTMLElementPosition(a),
                    f = c.getPointByEvent(b, e);
                d || c.handleTouchesMove([c.getTouchByXY(f.x, f.y, e)]);
                e = c.getMouseEvent(f, e, cc.EventMouse.MOVE);
                c._mousePressed ? e.setButton(b.button) : e.setButton(null);
                cc.eventManager.dispatchEvent(e);
                b.stopPropagation();
                b.preventDefault()
            }, !1), cc._addEventListener(a, "mousewheel",
                function(b) {
                    var d = c.getHTMLElementPosition(a),
                        e = c.getPointByEvent(b, d),
                        d = c.getMouseEvent(e, d, cc.EventMouse.SCROLL);
                    d.setButton(b.button);
                    d.setScrollData(0, b.wheelDelta);
                    cc.eventManager.dispatchEvent(d);
                    b.stopPropagation();
                    b.preventDefault()
                }, !1), cc._addEventListener(a, "DOMMouseScroll", function(b) {
                var d = c.getHTMLElementPosition(a),
                    e = c.getPointByEvent(b, d),
                    d = c.getMouseEvent(e, d, cc.EventMouse.SCROLL);
                d.setButton(b.button);
                d.setScrollData(0, -120 * b.detail);
                cc.eventManager.dispatchEvent(d);
                b.stopPropagation();
                b.preventDefault()
            }, !1));
            if (window.navigator.msPointerEnabled) {
                var e = {
                        MSPointerDown: c.handleTouchesBegin,
                        MSPointerMove: c.handleTouchesMove,
                        MSPointerUp: c.handleTouchesEnd,
                        MSPointerCancel: c.handleTouchesCancel
                    },
                    f;
                for (f in e)(function(b, d) {
                    cc._addEventListener(a, b, function(b) {
                        var e = c.getHTMLElementPosition(a);
                        e.left -= document.documentElement.scrollLeft;
                        e.top -= document.documentElement.scrollTop;
                        d.call(c, [c.getTouchByXY(b.clientX, b.clientY, e)]);
                        b.stopPropagation();
                        b.preventDefault()
                    }, !1)
                })(f, e[f])
            }
            d &&
                (cc._addEventListener(a, "touchstart", function(b) {
                    if (b.changedTouches) {
                        var d = c.getHTMLElementPosition(a);
                        d.left -= document.body.scrollLeft;
                        d.top -= document.body.scrollTop;
                        c.handleTouchesBegin(c.getTouchesByEvent(b, d));
                        b.stopPropagation();
                        b.preventDefault();
                        a.focus()
                    }
                }, !1), cc._addEventListener(a, "touchmove", function(b) {
                    if (b.changedTouches) {
                        var d = c.getHTMLElementPosition(a);
                        d.left -= document.body.scrollLeft;
                        d.top -= document.body.scrollTop;
                        c.handleTouchesMove(c.getTouchesByEvent(b, d));
                        b.stopPropagation();
                        b.preventDefault()
                    }
                }, !1), cc._addEventListener(a, "touchend", function(b) {
                    if (b.changedTouches) {
                        var d = c.getHTMLElementPosition(a);
                        d.left -= document.body.scrollLeft;
                        d.top -= document.body.scrollTop;
                        c.handleTouchesEnd(c.getTouchesByEvent(b, d));
                        b.stopPropagation();
                        b.preventDefault()
                    }
                }, !1), cc._addEventListener(a, "touchcancel", function(d) {
                    if (d.changedTouches) {
                        var e = c.getHTMLElementPosition(a);
                        e.left -= document.body.scrollLeft;
                        e.top -= document.body.scrollTop;
                        b.handleTouchesCancel(c.getTouchesByEvent(d, e));
                        d.stopPropagation();
                        d.preventDefault()
                    }
                }, !1));
            this._registerKeyboardEvent();
            this._registerAccelerometerEvent();
            this._isRegisterEvent = !0
        }
    },
    _registerKeyboardEvent: function() {},
    _registerAccelerometerEvent: function() {},
    update: function(a) {
        this._accelCurTime > this._accelInterval && (this._accelCurTime -= this._accelInterval, cc.eventManager.dispatchEvent(new cc.EventAcceleration(this._acceleration)));
        this._accelCurTime += a
    }
};
var _p = cc.inputManager;
_p.setAccelerometerEnabled = function(a) {
    this._accelEnabled !== a && (this._accelEnabled = a, a = cc.director.getScheduler(), this._accelEnabled ? (this._accelCurTime = 0, a.scheduleUpdateForTarget(this)) : (this._accelCurTime = 0, a.unscheduleUpdateForTarget(this)))
};
_p.setAccelerometerInterval = function(a) {
    this._accelInterval !== a && (this._accelInterval = a)
};
_p._registerKeyboardEvent = function() {
    cc._addEventListener(cc._canvas, "keydown", function(a) {
        cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode, !0));
        a.stopPropagation();
        a.preventDefault()
    }, !1);
    cc._addEventListener(cc._canvas, "keyup", function(a) {
        cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode, !1));
        a.stopPropagation();
        a.preventDefault()
    }, !1)
};
_p._registerAccelerometerEvent = function() {
    var a = window;
    this._acceleration = new cc.Acceleration;
    this._accelDeviceEvent = a.DeviceMotionEvent || a.DeviceOrientationEvent;
    cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ && (this._accelDeviceEvent = window.DeviceOrientationEvent);
    var b = this._accelDeviceEvent == a.DeviceMotionEvent ? "devicemotion" : "deviceorientation",
        c = navigator.userAgent;
    if (/Android/.test(c) || /Adr/.test(c) && cc.sys.browserType == cc.BROWSER_TYPE_UC) this._minus = -1;
    cc._addEventListener(a, b, this.didAccelerate.bind(this), !1)
};
_p.didAccelerate = function(a) {
    var b = window;
    if (this._accelEnabled) {
        var c = this._acceleration;
        if (this._accelDeviceEvent == window.DeviceMotionEvent) {
            var d = a.accelerationIncludingGravity;
            c.x = 0.1 * this._accelMinus * d.x;
            c.y = 0.1 * this._accelMinus * d.y;
            c.z = 0.1 * d.z
        } else c.x = 0.981 * (a.gamma / 90), c.y = 0.981 * -(a.beta / 90), c.z = 0.981 * (a.alpha / 90);
        c.timestamp = a.timeStamp || Date.now();
        a = c.x;
        b.orientation === cc.UIInterfaceOrientationLandscapeRight ? (c.x = -c.y, c.y = a) : b.orientation === cc.UIInterfaceOrientationLandscapeLeft ? (c.x = c.y,
            c.y = -a) : b.orientation === cc.UIInterfaceOrientationPortraitUpsideDown && (c.x = -c.x, c.y = -c.y)
    }
};
delete _p;
cc.AffineTransform = function(a, b, c, d, e, f) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = e;
    this.ty = f
};
cc.AffineTransformMake = function(a, b, c, d, e, f) {
    return {
        a: a,
        b: b,
        c: c,
        d: d,
        tx: e,
        ty: f
    }
};
cc.PointApplyAffineTransform = function(a, b) {
    return {
        x: b.a * a.x + b.c * a.y + b.tx,
        y: b.b * a.x + b.d * a.y + b.ty
    }
};
cc._PointApplyAffineTransform = function(a, b, c) {
    return {
        x: c.a * a + c.c * b + c.tx,
        y: c.b * a + c.d * b + c.ty
    }
};
cc.SizeApplyAffineTransform = function(a, b) {
    return {
        width: b.a * a.width + b.c * a.height,
        height: b.b * a.width + b.d * a.height
    }
};
cc.AffineTransformMakeIdentity = function() {
    return {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0
    }
};
cc.AffineTransformIdentity = function() {
    return {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0
    }
};
cc.RectApplyAffineTransform = function(a, b) {
    var c = cc.rectGetMinY(a),
        d = cc.rectGetMinX(a),
        e = cc.rectGetMaxX(a),
        f = cc.rectGetMaxY(a),
        g = cc._PointApplyAffineTransform(d, c, b),
        c = cc._PointApplyAffineTransform(e, c, b),
        d = cc._PointApplyAffineTransform(d, f, b),
        h = cc._PointApplyAffineTransform(e, f, b),
        e = Math.min(g.x, c.x, d.x, h.x),
        f = Math.max(g.x, c.x, d.x, h.x),
        k = Math.min(g.y, c.y, d.y, h.y),
        g = Math.max(g.y, c.y, d.y, h.y);
    return cc.rect(e, k, f - e, g - k)
};
cc._RectApplyAffineTransformIn = function(a, b) {
    var c = cc.rectGetMinY(a),
        d = cc.rectGetMinX(a),
        e = cc.rectGetMaxX(a),
        f = cc.rectGetMaxY(a),
        g = cc._PointApplyAffineTransform(d, c, b),
        c = cc._PointApplyAffineTransform(e, c, b),
        d = cc._PointApplyAffineTransform(d, f, b),
        h = cc._PointApplyAffineTransform(e, f, b),
        e = Math.min(g.x, c.x, d.x, h.x),
        f = Math.max(g.x, c.x, d.x, h.x),
        k = Math.min(g.y, c.y, d.y, h.y),
        g = Math.max(g.y, c.y, d.y, h.y);
    a.x = e;
    a.y = k;
    a.width = f - e;
    a.height = g - k;
    return a
};
cc.AffineTransformTranslate = function(a, b, c) {
    return {
        a: a.a,
        b: a.b,
        c: a.c,
        d: a.d,
        tx: a.tx + a.a * b + a.c * c,
        ty: a.ty + a.b * b + a.d * c
    }
};
cc.AffineTransformScale = function(a, b, c) {
    return {
        a: a.a * b,
        b: a.b * b,
        c: a.c * c,
        d: a.d * c,
        tx: a.tx,
        ty: a.ty
    }
};
cc.AffineTransformRotate = function(a, b) {
    var c = Math.sin(b),
        d = Math.cos(b);
    return {
        a: a.a * d + a.c * c,
        b: a.b * d + a.d * c,
        c: a.c * d - a.a * c,
        d: a.d * d - a.b * c,
        tx: a.tx,
        ty: a.ty
    }
};
cc.AffineTransformConcat = function(a, b) {
    return {
        a: a.a * b.a + a.b * b.c,
        b: a.a * b.b + a.b * b.d,
        c: a.c * b.a + a.d * b.c,
        d: a.c * b.b + a.d * b.d,
        tx: a.tx * b.a + a.ty * b.c + b.tx,
        ty: a.tx * b.b + a.ty * b.d + b.ty
    }
};
cc.AffineTransformEqualToTransform = function(a, b) {
    return a.a === b.a && a.b === b.b && a.c === b.c && a.d === b.d && a.tx === b.tx && a.ty === b.ty
};
cc.AffineTransformInvert = function(a) {
    var b = 1 / (a.a * a.d - a.b * a.c);
    return {
        a: b * a.d,
        b: -b * a.b,
        c: -b * a.c,
        d: b * a.a,
        tx: b * (a.c * a.ty - a.d * a.tx),
        ty: b * (a.b * a.tx - a.a * a.ty)
    }
};
cc.POINT_EPSILON = parseFloat("1.192092896e-07F");
cc.pNeg = function(a) {
    return cc.p(-a.x, -a.y)
};
cc.pAdd = function(a, b) {
    return cc.p(a.x + b.x, a.y + b.y)
};
cc.pSub = function(a, b) {
    return cc.p(a.x - b.x, a.y - b.y)
};
cc.pMult = function(a, b) {
    return cc.p(a.x * b, a.y * b)
};
cc.pMidpoint = function(a, b) {
    return cc.pMult(cc.pAdd(a, b), 0.5)
};
cc.pDot = function(a, b) {
    return a.x * b.x + a.y * b.y
};
cc.pCross = function(a, b) {
    return a.x * b.y - a.y * b.x
};
cc.pPerp = function(a) {
    return cc.p(-a.y, a.x)
};
cc.pRPerp = function(a) {
    return cc.p(a.y, -a.x)
};
cc.pProject = function(a, b) {
    return cc.pMult(b, cc.pDot(a, b) / cc.pDot(b, b))
};
cc.pRotate = function(a, b) {
    return cc.p(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x)
};
cc.pUnrotate = function(a, b) {
    return cc.p(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y)
};
cc.pLengthSQ = function(a) {
    return cc.pDot(a, a)
};
cc.pDistanceSQ = function(a, b) {
    return cc.pLengthSQ(cc.pSub(a, b))
};
cc.pLength = function(a) {
    return Math.sqrt(cc.pLengthSQ(a))
};
cc.pDistance = function(a, b) {
    return cc.pLength(cc.pSub(a, b))
};
cc.pNormalize = function(a) {
    return cc.pMult(a, 1 / cc.pLength(a))
};
cc.pForAngle = function(a) {
    return cc.p(Math.cos(a), Math.sin(a))
};
cc.pToAngle = function(a) {
    return Math.atan2(a.y, a.x)
};
cc.clampf = function(a, b, c) {
    if (b > c) {
        var d = b;
        b = c;
        c = d
    }
    return a < b ? b : a < c ? a : c
};
cc.pClamp = function(a, b, c) {
    return cc.p(cc.clampf(a.x, b.x, c.x), cc.clampf(a.y, b.y, c.y))
};
cc.pFromSize = function(a) {
    return cc.p(a.width, a.height)
};
cc.pCompOp = function(a, b) {
    return cc.p(b(a.x), b(a.y))
};
cc.pLerp = function(a, b, c) {
    return cc.pAdd(cc.pMult(a, 1 - c), cc.pMult(b, c))
};
cc.pFuzzyEqual = function(a, b, c) {
    return a.x - c <= b.x && b.x <= a.x + c && a.y - c <= b.y && b.y <= a.y + c ? !0 : !1
};
cc.pCompMult = function(a, b) {
    return cc.p(a.x * b.x, a.y * b.y)
};
cc.pAngleSigned = function(a, b) {
    var c = cc.pNormalize(a),
        d = cc.pNormalize(b),
        c = Math.atan2(c.x * d.y - c.y * d.x, cc.pDot(c, d));
    return Math.abs(c) < cc.POINT_EPSILON ? 0 : c
};
cc.pAngle = function(a, b) {
    var c = Math.acos(cc.pDot(cc.pNormalize(a), cc.pNormalize(b)));
    return Math.abs(c) < cc.POINT_EPSILON ? 0 : c
};
cc.pRotateByAngle = function(a, b, c) {
    a = cc.pSub(a, b);
    var d = Math.cos(c);
    c = Math.sin(c);
    var e = a.x;
    a.x = e * d - a.y * c + b.x;
    a.y = e * c + a.y * d + b.y;
    return a
};
cc.pLineIntersect = function(a, b, c, d, e) {
    if (a.x == b.x && a.y == b.y || c.x == d.x && c.y == d.y) return !1;
    var f = b.x - a.x;
    b = b.y - a.y;
    var g = d.x - c.x;
    d = d.y - c.y;
    var h = a.x - c.x;
    a = a.y - c.y;
    c = d * f - g * b;
    e.x = g * a - d * h;
    e.y = f * a - b * h;
    if (0 == c) return 0 == e.x || 0 == e.y ? !0 : !1;
    e.x /= c;
    e.y /= c;
    return !0
};
cc.pSegmentIntersect = function(a, b, c, d) {
    var e = cc.p(0, 0);
    return cc.pLineIntersect(a, b, c, d, e) && 0 <= e.x && 1 >= e.x && 0 <= e.y && 1 >= e.y ? !0 : !1
};
cc.pIntersectPoint = function(a, b, c, d) {
    var e = cc.p(0, 0);
    return cc.pLineIntersect(a, b, c, d, e) ? (c = cc.p(0, 0), c.x = a.x + e.x * (b.x - a.x), c.y = a.y + e.x * (b.y - a.y), c) : cc.p(0, 0)
};
cc.pSameAs = function(a, b) {
    return null != a && null != b ? a.x == b.x && a.y == b.y : !1
};
cc.pZeroIn = function(a) {
    a.x = 0;
    a.y = 0
};
cc.pIn = function(a, b) {
    a.x = b.x;
    a.y = b.y
};
cc.pMultIn = function(a, b) {
    a.x *= b;
    a.y *= b
};
cc.pSubIn = function(a, b) {
    a.x -= b.x;
    a.y -= b.y
};
cc.pAddIn = function(a, b) {
    a.x += b.x;
    a.y += b.y
};
cc.pNormalizeIn = function(a) {
    cc.pMultIn(a, 1 / Math.sqrt(a.x * a.x + a.y * a.y))
};
cc.vertexLineToPolygon = function(a, b, c, d, e) {
    e += d;
    if (!(1 >= e)) {
        b *= 0.5;
        for (var f, g = e - 1, h = d; h < e; h++) {
            f = 2 * h;
            var k = cc.p(a[2 * h], a[2 * h + 1]),
                m;
            if (0 === h) m = cc.pPerp(cc.pNormalize(cc.pSub(k, cc.p(a[2 * (h + 1)], a[2 * (h + 1) + 1]))));
            else if (h === g) m = cc.pPerp(cc.pNormalize(cc.pSub(cc.p(a[2 * (h - 1)], a[2 * (h - 1) + 1]), k)));
            else {
                m = cc.p(a[2 * (h - 1)], a[2 * (h - 1) + 1]);
                var n = cc.p(a[2 * (h + 1)], a[2 * (h + 1) + 1]),
                    q = cc.pNormalize(cc.pSub(n, k)),
                    s = cc.pNormalize(cc.pSub(m, k)),
                    r = Math.acos(cc.pDot(q, s));
                m = r < cc.degreesToRadians(70) ? cc.pPerp(cc.pNormalize(cc.pMidpoint(q,
                    s))) : r < cc.degreesToRadians(170) ? cc.pNormalize(cc.pMidpoint(q, s)) : cc.pPerp(cc.pNormalize(cc.pSub(n, m)))
            }
            m = cc.pMult(m, b);
            c[2 * f] = k.x + m.x;
            c[2 * f + 1] = k.y + m.y;
            c[2 * (f + 1)] = k.x - m.x;
            c[2 * (f + 1) + 1] = k.y - m.y
        }
        for (h = 0 == d ? 0 : d - 1; h < g; h++) {
            f = 2 * h;
            a = f + 2;
            b = cc.vertex2(c[2 * f], c[2 * f + 1]);
            e = cc.vertex2(c[2 * (f + 1)], c[2 * (f + 1) + 1]);
            f = cc.vertex2(c[2 * a], c[2 * a]);
            d = cc.vertex2(c[2 * (a + 1)], c[2 * (a + 1) + 1]);
            b = !cc.vertexLineIntersect(b.x, b.y, d.x, d.y, e.x, e.y, f.x, f.y);
            if (!b.isSuccess && (0 > b.value || 1 < b.value)) b.isSuccess = !0;
            b.isSuccess && (c[2 * a] = d.x,
                c[2 * a + 1] = d.y, c[2 * (a + 1)] = f.x, c[2 * (a + 1) + 1] = f.y)
        }
    }
};
cc.vertexLineIntersect = function(a, b, c, d, e, f, g, h) {
    if (a == c && b == d || e == g && f == h) return {
        isSuccess: !1,
        value: 0
    };
    c -= a;
    d -= b;
    e -= a;
    f -= b;
    g -= a;
    h -= b;
    a = Math.sqrt(c * c + d * d);
    c /= a;
    d /= a;
    b = e * c + f * d;
    f = f * c - e * d;
    e = b;
    b = g * c + h * d;
    h = h * c - g * d;
    g = b;
    return f == h ? {
        isSuccess: !1,
        value: 0
    } : {
        isSuccess: !0,
        value: (g + (e - g) * h / (h - f)) / a
    }
};
cc.vertexListIsClockwise = function(a) {
    for (var b = 0, c = a.length; b < c; b++) {
        var d = a[(b + 1) % c],
            e = a[(b + 2) % c];
        if (0 < cc.pCross(cc.pSub(d, a[b]), cc.pSub(e, d))) return !1
    }
    return !0
};
cc.CGAffineToGL = function(a, b) {
    b[2] = b[3] = b[6] = b[7] = b[8] = b[9] = b[11] = b[14] = 0;
    b[10] = b[15] = 1;
    b[0] = a.a;
    b[4] = a.c;
    b[12] = a.tx;
    b[1] = a.b;
    b[5] = a.d;
    b[13] = a.ty
};
cc.GLToCGAffine = function(a, b) {
    b.a = a[0];
    b.c = a[4];
    b.tx = a[12];
    b.b = a[1];
    b.d = a[5];
    b.ty = a[13]
};
cc.Touch = cc.Class.extend({
    _point: null,
    _prevPoint: null,
    _id: 0,
    _startPointCaptured: !1,
    _startPoint: null,
    ctor: function(a, b, c) {
        this._point = cc.p(a || 0, b || 0);
        this._id = c || 0
    },
    getLocation: function() {
        return {
            x: this._point.x,
            y: this._point.y
        }
    },
    getLocationX: function() {
        return this._point.x
    },
    getLocationY: function() {
        return this._point.y
    },
    getPreviousLocation: function() {
        return {
            x: this._prevPoint.x,
            y: this._prevPoint.y
        }
    },
    getStartLocation: function() {
        return {
            x: this._startPoint.x,
            y: this._startPoint.y
        }
    },
    getDelta: function() {
        return cc.pSub(this._point,
            this._prevPoint)
    },
    getLocationInView: function() {
        return {
            x: this._point.x,
            y: this._point.y
        }
    },
    getPreviousLocationInView: function() {
        return {
            x: this._prevPoint.x,
            y: this._prevPoint.y
        }
    },
    getStartLocationInView: function() {
        return {
            x: this._startPoint.x,
            y: this._startPoint.y
        }
    },
    getID: function() {
        return this._id
    },
    getId: function() {
        return this._id
    },
    setTouchInfo: function(a, b, c) {
        this._prevPoint = this._point;
        this._point = cc.p(b || 0, c || 0);
        this._id = a;
        this._startPointCaptured || (this._startPoint = cc.p(this._point), this._startPointCaptured = !0)
    },
    _setPoint: function(a, b) {
        void 0 === b ? (this._point.x = a.x, this._point.y = a.y) : (this._point.x = a, this._point.y = b)
    },
    _setPrevPoint: function(a, b) {
        this._prevPoint = void 0 === b ? cc.p(a.x, a.y) : cc.p(a || 0, b || 0)
    }
});
cc.Event = cc.Class.extend({
    _type: 0,
    _isStopped: !1,
    _currentTarget: null,
    _setCurrentTarget: function(a) {
        this._currentTarget = a
    },
    ctor: function(a) {
        this._type = a
    },
    getType: function() {
        return this._type
    },
    stopPropagation: function() {
        this._isStopped = !0
    },
    isStopped: function() {
        return this._isStopped
    },
    getCurrentTarget: function() {
        return this._currentTarget
    }
});
cc.Event.TOUCH = 0;
cc.Event.KEYBOARD = 1;
cc.Event.ACCELERATION = 2;
cc.Event.MOUSE = 3;
cc.Event.CUSTOM = 4;
cc.EventCustom = cc.Event.extend({
    _eventName: null,
    _userData: null,
    ctor: function(a) {
        cc.Event.prototype.ctor.call(this, cc.Event.CUSTOM);
        this._eventName = a
    },
    setUserData: function(a) {
        this._userData = a
    },
    getUserData: function() {
        return this._userData
    },
    getEventName: function() {
        return this._eventName
    }
});
cc.EventMouse = cc.Event.extend({
    _eventType: 0,
    _button: 0,
    _x: 0,
    _y: 0,
    _prevX: 0,
    _prevY: 0,
    _scrollX: 0,
    _scrollY: 0,
    ctor: function(a) {
        cc.Event.prototype.ctor.call(this, cc.Event.MOUSE);
        this._eventType = a
    },
    setScrollData: function(a, b) {
        this._scrollX = a;
        this._scrollY = b
    },
    getScrollX: function() {
        return this._scrollX
    },
    getScrollY: function() {
        return this._scrollY
    },
    setLocation: function(a, b) {
        this._x = a;
        this._y = b
    },
    getLocation: function() {
        return {
            x: this._x,
            y: this._y
        }
    },
    getLocationInView: function() {
        return {
            x: this._x,
            y: cc.view._designResolutionSize.height -
                this._y
        }
    },
    _setPrevCursor: function(a, b) {
        this._prevX = a;
        this._prevY = b
    },
    getDelta: function() {
        return {
            x: this._x - this._prevX,
            y: this._y - this._prevY
        }
    },
    getDeltaX: function() {
        return this._x - this._prevX
    },
    getDeltaY: function() {
        return this._y - this._prevY
    },
    setButton: function(a) {
        this._button = a
    },
    getButton: function() {
        return this._button
    },
    getLocationX: function() {
        return this._x
    },
    getLocationY: function() {
        return this._y
    }
});
cc.EventMouse.NONE = 0;
cc.EventMouse.DOWN = 1;
cc.EventMouse.UP = 2;
cc.EventMouse.MOVE = 3;
cc.EventMouse.SCROLL = 4;
cc.EventMouse.BUTTON_LEFT = 0;
cc.EventMouse.BUTTON_RIGHT = 2;
cc.EventMouse.BUTTON_MIDDLE = 1;
cc.EventMouse.BUTTON_4 = 3;
cc.EventMouse.BUTTON_5 = 4;
cc.EventMouse.BUTTON_6 = 5;
cc.EventMouse.BUTTON_7 = 6;
cc.EventMouse.BUTTON_8 = 7;
cc.EventTouch = cc.Event.extend({
    _eventCode: 0,
    _touches: null,
    ctor: function(a) {
        cc.Event.prototype.ctor.call(this, cc.Event.TOUCH);
        this._touches = a || []
    },
    getEventCode: function() {
        return this._eventCode
    },
    getTouches: function() {
        return this._touches
    },
    _setEventCode: function(a) {
        this._eventCode = a
    },
    _setTouches: function(a) {
        this._touches = a
    }
});
cc.EventTouch.MAX_TOUCHES = 5;
cc.EventTouch.EventCode = {
    BEGAN: 0,
    MOVED: 1,
    ENDED: 2,
    CANCELLED: 3
};
cc.EventListener = cc.Class.extend({
    _onEvent: null,
    _type: 0,
    _listenerID: null,
    _registered: !1,
    _fixedPriority: 0,
    _node: null,
    _paused: !1,
    _isEnabled: !0,
    ctor: function(a, b, c) {
        this._onEvent = c;
        this._type = a || 0;
        this._listenerID = b || ""
    },
    _setPaused: function(a) {
        this._paused = a
    },
    _isPaused: function() {
        return this._paused
    },
    _setRegistered: function(a) {
        this._registered = a
    },
    _isRegistered: function() {
        return this._registered
    },
    _getType: function() {
        return this._type
    },
    _getListenerID: function() {
        return this._listenerID
    },
    _setFixedPriority: function(a) {
        this._fixedPriority =
            a
    },
    _getFixedPriority: function() {
        return this._fixedPriority
    },
    _setSceneGraphPriority: function(a) {
        this._node = a
    },
    _getSceneGraphPriority: function() {
        return this._node
    },
    checkAvailable: function() {
        return null != this._onEvent
    },
    clone: function() {
        return null
    },
    setEnabled: function(a) {
        this._isEnabled = a
    },
    isEnabled: function() {
        return this._isEnabled
    },
    retain: function() {},
    release: function() {}
});
cc.EventListener.UNKNOWN = 0;
cc.EventListener.TOUCH_ONE_BY_ONE = 1;
cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
cc.EventListener.KEYBOARD = 3;
cc.EventListener.MOUSE = 4;
cc.EventListener.ACCELERATION = 5;
cc.EventListener.CUSTOM = 6;
cc._EventListenerCustom = cc.EventListener.extend({
    _onCustomEvent: null,
    ctor: function(a, b) {
        this._onCustomEvent = b;
        var c = this;
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.CUSTOM, a, function(a) {
            null != c._onCustomEvent && c._onCustomEvent(a)
        })
    },
    checkAvailable: function() {
        return cc.EventListener.prototype.checkAvailable.call(this) && null != this._onCustomEvent
    },
    clone: function() {
        return new cc._EventListenerCustom(this._listenerID, this._onCustomEvent)
    }
});
cc._EventListenerCustom.create = function(a, b) {
    return new cc._EventListenerCustom(a, b)
};
cc._EventListenerMouse = cc.EventListener.extend({
    onMouseDown: null,
    onMouseUp: null,
    onMouseMove: null,
    onMouseScroll: null,
    ctor: function() {
        var a = this;
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.MOUSE, cc._EventListenerMouse.LISTENER_ID, function(b) {
            var c = cc.EventMouse;
            switch (b._eventType) {
                case c.DOWN:
                    if (a.onMouseDown) a.onMouseDown(b);
                    break;
                case c.UP:
                    if (a.onMouseUp) a.onMouseUp(b);
                    break;
                case c.MOVE:
                    if (a.onMouseMove) a.onMouseMove(b);
                    break;
                case c.SCROLL:
                    if (a.onMouseScroll) a.onMouseScroll(b)
            }
        })
    },
    clone: function() {
        var a = new cc._EventListenerMouse;
        a.onMouseDown = this.onMouseDown;
        a.onMouseUp = this.onMouseUp;
        a.onMouseMove = this.onMouseMove;
        a.onMouseScroll = this.onMouseScroll;
        return a
    },
    checkAvailable: function() {
        return !0
    }
});
cc._EventListenerMouse.LISTENER_ID = "__cc_mouse";
cc._EventListenerMouse.create = function() {
    return new cc._EventListenerMouse
};
cc._EventListenerTouchOneByOne = cc.EventListener.extend({
    _claimedTouches: null,
    swallowTouches: !1,
    onTouchBegan: null,
    onTouchMoved: null,
    onTouchEnded: null,
    onTouchCancelled: null,
    ctor: function() {
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, cc._EventListenerTouchOneByOne.LISTENER_ID, null);
        this._claimedTouches = []
    },
    setSwallowTouches: function(a) {
        this.swallowTouches = a
    },
    clone: function() {
        var a = new cc._EventListenerTouchOneByOne;
        a.onTouchBegan = this.onTouchBegan;
        a.onTouchMoved = this.onTouchMoved;
        a.onTouchEnded = this.onTouchEnded;
        a.onTouchCancelled = this.onTouchCancelled;
        a.swallowTouches = this.swallowTouches;
        return a
    },
    checkAvailable: function() {
        return !this.onTouchBegan ? (cc.log(cc._LogInfos._EventListenerTouchOneByOne_checkAvailable), !1) : !0
    }
});
cc._EventListenerTouchOneByOne.LISTENER_ID = "__cc_touch_one_by_one";
cc._EventListenerTouchOneByOne.create = function() {
    return new cc._EventListenerTouchOneByOne
};
cc._EventListenerTouchAllAtOnce = cc.EventListener.extend({
    onTouchesBegan: null,
    onTouchesMoved: null,
    onTouchesEnded: null,
    onTouchesCancelled: null,
    ctor: function() {
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, cc._EventListenerTouchAllAtOnce.LISTENER_ID, null)
    },
    clone: function() {
        var a = new cc._EventListenerTouchAllAtOnce;
        a.onTouchesBegan = this.onTouchesBegan;
        a.onTouchesMoved = this.onTouchesMoved;
        a.onTouchesEnded = this.onTouchesEnded;
        a.onTouchesCancelled = this.onTouchesCancelled;
        return a
    },
    checkAvailable: function() {
        return null == this.onTouchesBegan && null == this.onTouchesMoved && null == this.onTouchesEnded && null == this.onTouchesCancelled ? (cc.log(cc._LogInfos._EventListenerTouchAllAtOnce_checkAvailable), !1) : !0
    }
});
cc._EventListenerTouchAllAtOnce.LISTENER_ID = "__cc_touch_all_at_once";
cc._EventListenerTouchAllAtOnce.create = function() {
    return new cc._EventListenerTouchAllAtOnce
};
cc.EventListener.create = function(a) {
    cc.assert(a && a.event, cc._LogInfos.EventListener_create);
    var b = a.event;
    delete a.event;
    var c = null;
    b === cc.EventListener.TOUCH_ONE_BY_ONE ? c = new cc._EventListenerTouchOneByOne : b === cc.EventListener.TOUCH_ALL_AT_ONCE ? c = new cc._EventListenerTouchAllAtOnce : b === cc.EventListener.MOUSE ? c = new cc._EventListenerMouse : b === cc.EventListener.CUSTOM ? (c = new cc._EventListenerCustom(a.eventName, a.callback), delete a.eventName, delete a.callback) : b === cc.EventListener.KEYBOARD ? c = new cc._EventListenerKeyboard :
        b === cc.EventListener.ACCELERATION && (c = new cc._EventListenerAcceleration(a.callback), delete a.callback);
    for (var d in a) c[d] = a[d];
    return c
};
cc.copyArray = function(a) {
    var b, c = a.length,
        d = Array(c);
    for (b = 0; b < c; b += 1) d[b] = a[b];
    return d
};
cc._EventListenerVector = cc.Class.extend({
    _fixedListeners: null,
    _sceneGraphListeners: null,
    gt0Index: 0,
    ctor: function() {
        this._fixedListeners = [];
        this._sceneGraphListeners = []
    },
    size: function() {
        return this._fixedListeners.length + this._sceneGraphListeners.length
    },
    empty: function() {
        return 0 === this._fixedListeners.length && 0 === this._sceneGraphListeners.length
    },
    push: function(a) {
        0 == a._getFixedPriority() ? this._sceneGraphListeners.push(a) : this._fixedListeners.push(a)
    },
    clearSceneGraphListeners: function() {
        this._sceneGraphListeners.length =
            0
    },
    clearFixedListeners: function() {
        this._fixedListeners.length = 0
    },
    clear: function() {
        this._sceneGraphListeners.length = 0;
        this._fixedListeners.length = 0
    },
    getFixedPriorityListeners: function() {
        return this._fixedListeners
    },
    getSceneGraphPriorityListeners: function() {
        return this._sceneGraphListeners
    }
});
cc.__getListenerID = function(a) {
    var b = cc.Event,
        c = a.getType();
    if (c === b.ACCELERATION) return cc._EventListenerAcceleration.LISTENER_ID;
    if (c === b.CUSTOM) return a.getEventName();
    if (c === b.KEYBOARD) return cc._EventListenerKeyboard.LISTENER_ID;
    if (c === b.MOUSE) return cc._EventListenerMouse.LISTENER_ID;
    c === b.TOUCH && cc.log(cc._LogInfos.__getListenerID);
    return ""
};
cc.eventManager = {
    DIRTY_NONE: 0,
    DIRTY_FIXED_PRIORITY: 1,
    DIRTY_SCENE_GRAPH_PRIORITY: 2,
    DIRTY_ALL: 3,
    _listenersMap: {},
    _priorityDirtyFlagMap: {},
    _nodeListenersMap: {},
    _nodePriorityMap: {},
    _globalZOrderNodeMap: {},
    _toAddedListeners: [],
    _dirtyNodes: [],
    _inDispatch: 0,
    _isEnabled: !1,
    _nodePriorityIndex: 0,
    _internalCustomListenerIDs: [cc.game.EVENT_HIDE, cc.game.EVENT_SHOW],
    _setDirtyForNode: function(a) {
        null != this._nodeListenersMap[a.__instanceId] && this._dirtyNodes.push(a);
        a = a.getChildren();
        for (var b = 0, c = a.length; b < c; b++) this._setDirtyForNode(a[b])
    },
    pauseTarget: function(a, b) {
        var c = this._nodeListenersMap[a.__instanceId],
            d, e;
        if (c) {
            d = 0;
            for (e = c.length; d < e; d++) c[d]._setPaused(!0)
        }
        if (!0 === b) {
            c = a.getChildren();
            d = 0;
            for (e = c.length; d < e; d++) this.pauseTarget(c[d], !0)
        }
    },
    resumeTarget: function(a, b) {
        var c = this._nodeListenersMap[a.__instanceId],
            d, e;
        if (c) {
            d = 0;
            for (e = c.length; d < e; d++) c[d]._setPaused(!1)
        }
        this._setDirtyForNode(a);
        if (!0 === b) {
            c = a.getChildren();
            d = 0;
            for (e = c.length; d < e; d++) this.resumeTarget(c[d], !0)
        }
    },
    _addListener: function(a) {
        0 === this._inDispatch ? this._forceAddEventListener(a) :
            this._toAddedListeners.push(a)
    },
    _forceAddEventListener: function(a) {
        var b = a._getListenerID(),
            c = this._listenersMap[b];
        c || (c = new cc._EventListenerVector, this._listenersMap[b] = c);
        c.push(a);
        0 == a._getFixedPriority() ? (this._setDirty(b, this.DIRTY_SCENE_GRAPH_PRIORITY), b = a._getSceneGraphPriority(), null == b && cc.log(cc._LogInfos.eventManager__forceAddEventListener), this._associateNodeAndEventListener(b, a), b.isRunning() && this.resumeTarget(b)) : this._setDirty(b, this.DIRTY_FIXED_PRIORITY)
    },
    _getListeners: function(a) {
        return this._listenersMap[a]
    },
    _updateDirtyFlagForSceneGraph: function() {
        if (0 != this._dirtyNodes.length) {
            for (var a = this._dirtyNodes, b, c, d = this._nodeListenersMap, e = 0, f = a.length; e < f; e++)
                if (b = d[a[e].__instanceId])
                    for (var g = 0, h = b.length; g < h; g++)(c = b[g]) && this._setDirty(c._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
            this._dirtyNodes.length = 0
        }
    },
    _removeAllListenersInVector: function(a) {
        if (a)
            for (var b, c = 0; c < a.length;) b = a[c], b._setRegistered(!1), null != b._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(b._getSceneGraphPriority(),
                b), b._setSceneGraphPriority(null)), 0 === this._inDispatch ? cc.arrayRemoveObject(a, b) : ++c
    },
    _removeListenersForListenerID: function(a) {
        var b = this._listenersMap[a];
        if (b) {
            var c = b.getFixedPriorityListeners(),
                d = b.getSceneGraphPriorityListeners();
            this._removeAllListenersInVector(d);
            this._removeAllListenersInVector(c);
            delete this._priorityDirtyFlagMap[a];
            this._inDispatch || (b.clear(), delete this._listenersMap[a])
        }
        c = this._toAddedListeners;
        for (b = 0; b < c.length;)(d = c[b]) && d._getListenerID() == a ? cc.arrayRemoveObject(c,
            d) : ++b
    },
    _sortEventListeners: function(a) {
        var b = this.DIRTY_NONE,
            c = this._priorityDirtyFlagMap;
        c[a] && (b = c[a]);
        b != this.DIRTY_NONE && (c[a] = this.DIRTY_NONE, b & this.DIRTY_FIXED_PRIORITY && this._sortListenersOfFixedPriority(a), b & this.DIRTY_SCENE_GRAPH_PRIORITY && ((b = cc.director.getRunningScene()) ? this._sortListenersOfSceneGraphPriority(a, b) : c[a] = this.DIRTY_SCENE_GRAPH_PRIORITY))
    },
    _sortListenersOfSceneGraphPriority: function(a, b) {
        var c = this._getListeners(a);
        if (c) {
            var d = c.getSceneGraphPriorityListeners();
            d && 0 !==
                d.length && (this._nodePriorityIndex = 0, this._nodePriorityMap = {}, this._visitTarget(b, !0), c.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes))
        }
    },
    _sortEventListenersOfSceneGraphPriorityDes: function(a, b) {
        var c = cc.eventManager._nodePriorityMap;
        return c[b._getSceneGraphPriority().__instanceId] - c[a._getSceneGraphPriority().__instanceId]
    },
    _sortListenersOfFixedPriority: function(a) {
        if (a = this._listenersMap[a]) {
            var b = a.getFixedPriorityListeners();
            if (b && 0 !== b.length) {
                b.sort(this._sortListenersOfFixedPriorityAsc);
                for (var c = 0, d = b.length; c < d && !(0 <= b[c]._getFixedPriority());) ++c;
                a.gt0Index = c
            }
        }
    },
    _sortListenersOfFixedPriorityAsc: function(a, b) {
        return a._getFixedPriority() - b._getFixedPriority()
    },
    _onUpdateListeners: function(a) {
        if (a = this._listenersMap[a]) {
            var b = a.getFixedPriorityListeners(),
                c = a.getSceneGraphPriorityListeners(),
                d, e;
            if (c)
                for (d = 0; d < c.length;) e = c[d], e._isRegistered() ? ++d : cc.arrayRemoveObject(c, e);
            if (b)
                for (d = 0; d < b.length;) e = b[d], e._isRegistered() ? ++d : cc.arrayRemoveObject(b, e);
            c && 0 === c.length && a.clearSceneGraphListeners();
            b && 0 === b.length && a.clearFixedListeners()
        }
    },
    _updateListeners: function(a) {
        var b = this._inDispatch;
        cc.assert(0 < b, cc._LogInfos.EventManager__updateListeners);
        a.getType() == cc.Event.TOUCH ? (this._onUpdateListeners(cc._EventListenerTouchOneByOne.LISTENER_ID), this._onUpdateListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID)) : this._onUpdateListeners(cc.__getListenerID(a));
        if (!(1 < b)) {
            cc.assert(1 == b, cc._LogInfos.EventManager__updateListeners_2);
            a = this._listenersMap;
            var b = this._priorityDirtyFlagMap,
                c;
            for (c in a) a[c].empty() &&
                (delete b[c], delete a[c]);
            c = this._toAddedListeners;
            if (0 !== c.length) {
                a = 0;
                for (b = c.length; a < b; a++) this._forceAddEventListener(c[a]);
                this._toAddedListeners.length = 0
            }
        }
    },
    _onTouchEventCallback: function(a, b) {
        if (!a._isRegistered) return !1;
        var c = b.event,
            d = b.selTouch;
        c._setCurrentTarget(a._node);
        var e = !1,
            f, g = c.getEventCode(),
            h = cc.EventTouch.EventCode;
        if (g == h.BEGAN) a.onTouchBegan && (e = a.onTouchBegan(d, c)) && a._registered && a._claimedTouches.push(d);
        else if (0 < a._claimedTouches.length && -1 != (f = a._claimedTouches.indexOf(d)))
            if (e = !0, g === h.MOVED && a.onTouchMoved) a.onTouchMoved(d, c);
            else if (g === h.ENDED) {
            if (a.onTouchEnded) a.onTouchEnded(d, c);
            a._registered && a._claimedTouches.splice(f, 1)
        } else if (g === h.CANCELLED) {
            if (a.onTouchCancelled) a.onTouchCancelled(d, c);
            a._registered && a._claimedTouches.splice(f, 1)
        }
        return c.isStopped() ? (cc.eventManager._updateListeners(c), !0) : e && a._registered && a.swallowTouches ? (b.needsMutableSet && b.touches.splice(d, 1), !0) : !1
    },
    _dispatchTouchEvent: function(a) {
        this._sortEventListeners(cc._EventListenerTouchOneByOne.LISTENER_ID);
        this._sortEventListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID);
        var b = this._getListeners(cc._EventListenerTouchOneByOne.LISTENER_ID),
            c = this._getListeners(cc._EventListenerTouchAllAtOnce.LISTENER_ID);
        if (!(null == b && null == c)) {
            var d = a.getTouches(),
                e = cc.copyArray(d),
                f = {
                    event: a,
                    needsMutableSet: b && c,
                    touches: e,
                    selTouch: null
                };
            if (b)
                for (var g = 0; g < d.length; g++)
                    if (f.selTouch = d[g], this._dispatchEventToListeners(b, this._onTouchEventCallback, f), a.isStopped()) return;
            if (c && 0 < e.length && (this._dispatchEventToListeners(c,
                    this._onTouchesEventCallback, {
                        event: a,
                        touches: e
                    }), a.isStopped())) return;
            this._updateListeners(a)
        }
    },
    _onTouchesEventCallback: function(a, b) {
        if (!a._registered) return !1;
        var c = cc.EventTouch.EventCode,
            d = b.event,
            e = b.touches,
            f = d.getEventCode();
        d._setCurrentTarget(a._node);
        if (f == c.BEGAN && a.onTouchesBegan) a.onTouchesBegan(e, d);
        else if (f == c.MOVED && a.onTouchesMoved) a.onTouchesMoved(e, d);
        else if (f == c.ENDED && a.onTouchesEnded) a.onTouchesEnded(e, d);
        else if (f == c.CANCELLED && a.onTouchesCancelled) a.onTouchesCancelled(e,
            d);
        return d.isStopped() ? (cc.eventManager._updateListeners(d), !0) : !1
    },
    _associateNodeAndEventListener: function(a, b) {
        var c = this._nodeListenersMap[a.__instanceId];
        c || (c = [], this._nodeListenersMap[a.__instanceId] = c);
        c.push(b)
    },
    _dissociateNodeAndEventListener: function(a, b) {
        var c = this._nodeListenersMap[a.__instanceId];
        c && (cc.arrayRemoveObject(c, b), 0 === c.length && delete this._nodeListenersMap[a.__instanceId])
    },
    _dispatchEventToListeners: function(a, b, c) {
        var d = !1,
            e = a.getFixedPriorityListeners(),
            f = a.getSceneGraphPriorityListeners(),
            g = 0,
            h;
        if (e && 0 !== e.length)
            for (; g < a.gt0Index; ++g)
                if (h = e[g], h.isEnabled() && !h._isPaused() && h._isRegistered() && b(h, c)) {
                    d = !0;
                    break
                }
        if (f && !d)
            for (a = 0; a < f.length; a++)
                if (h = f[a], h.isEnabled() && !h._isPaused() && h._isRegistered() && b(h, c)) {
                    d = !0;
                    break
                }
        if (e && !d)
            for (; g < e.length && !(h = e[g], h.isEnabled() && !h._isPaused() && h._isRegistered() && b(h, c)); ++g);
    },
    _setDirty: function(a, b) {
        var c = this._priorityDirtyFlagMap;
        c[a] = null == c[a] ? b : b | c[a]
    },
    _visitTarget: function(a, b) {
        var c = a.getChildren(),
            d = 0,
            e = c.length,
            f = this._globalZOrderNodeMap,
            g = this._nodeListenersMap;
        if (0 < e) {
            for (var h; d < e; d++)
                if ((h = c[d]) && 0 > h.getLocalZOrder()) this._visitTarget(h, !1);
                else break;
            null != g[a.__instanceId] && (f[a.getGlobalZOrder()] || (f[a.getGlobalZOrder()] = []), f[a.getGlobalZOrder()].push(a.__instanceId));
            for (; d < e; d++)(h = c[d]) && this._visitTarget(h, !1)
        } else null != g[a.__instanceId] && (f[a.getGlobalZOrder()] || (f[a.getGlobalZOrder()] = []), f[a.getGlobalZOrder()].push(a.__instanceId));
        if (b) {
            var c = [],
                k;
            for (k in f) c.push(k);
            c.sort(this._sortNumberAsc);
            k = c.length;
            h = this._nodePriorityMap;
            for (d = 0; d < k; d++) {
                e = f[c[d]];
                for (g = 0; g < e.length; g++) h[e[g]] = ++this._nodePriorityIndex
            }
            this._globalZOrderNodeMap = {}
        }
    },
    _sortNumberAsc: function(a, b) {
        return a - b
    },
    addListener: function(a, b) {
        cc.assert(a && b, cc._LogInfos.eventManager_addListener_2);
        if (a instanceof cc.EventListener) {
            if (a._isRegistered()) {
                cc.log(cc._LogInfos.eventManager_addListener_4);
                return
            }
        } else cc.assert("number" !== typeof b, cc._LogInfos.eventManager_addListener_3), a = cc.EventListener.create(a);
        a.checkAvailable() && ("number" == typeof b ? 0 == b ? cc.log(cc._LogInfos.eventManager_addListener) :
            (a._setSceneGraphPriority(null), a._setFixedPriority(b), a._setRegistered(!0), a._setPaused(!1), this._addListener(a)) : (a._setSceneGraphPriority(b), a._setFixedPriority(0), a._setRegistered(!0), this._addListener(a)))
    },
    addCustomListener: function(a, b) {
        var c = cc._EventListenerCustom.create(a, b);
        this.addListener(c, 1);
        return c
    },
    removeListener: function(a) {
        if (null != a) {
            var b, c = this._listenersMap,
                d;
            for (d in c) {
                var e = c[d],
                    f = e.getFixedPriorityListeners();
                b = e.getSceneGraphPriorityListeners();
                (b = this._removeListenerInVector(b,
                    a)) ? this._setDirty(a._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY): (b = this._removeListenerInVector(f, a)) && this._setDirty(a._getListenerID(), this.DIRTY_FIXED_PRIORITY);
                e.empty() && (delete this._priorityDirtyFlagMap[a._getListenerID()], delete c[d]);
                if (b) break
            }
            if (!b) {
                c = this._toAddedListeners;
                d = 0;
                for (e = c.length; d < e; d++)
                    if (f = c[d], f == a) {
                        cc.arrayRemoveObject(c, f);
                        break
                    }
            }
        }
    },
    _removeListenerInVector: function(a, b) {
        if (null == a) return !1;
        for (var c = 0, d = a.length; c < d; c++) {
            var e = a[c];
            if (e == b) return e._setRegistered(!1),
                null != e._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(e._getSceneGraphPriority(), e), e._setSceneGraphPriority(null)), 0 == this._inDispatch && cc.arrayRemoveObject(a, e), !0
        }
        return !1
    },
    removeListeners: function(a, b) {
        if (a instanceof cc.Node) {
            delete this._nodePriorityMap[a.__instanceId];
            cc.arrayRemoveObject(this._dirtyNodes, a);
            var c = this._nodeListenersMap[a.__instanceId];
            if (c) {
                for (var d = cc.copyArray(c), c = 0; c < d.length; c++) this.removeListener(d[c]);
                d.length = 0;
                d = this._toAddedListeners;
                for (c = 0; c <
                    d.length;) {
                    var e = d[c];
                    e._getSceneGraphPriority() == a ? (e._setSceneGraphPriority(null), e._setRegistered(!1), d.splice(c, 1)) : ++c
                }
                if (!0 === b) {
                    d = a.getChildren();
                    c = 0;
                    for (e = d.length; c < e; c++) this.removeListeners(d[c], !0)
                }
            }
        } else a == cc.EventListener.TOUCH_ONE_BY_ONE ? this._removeListenersForListenerID(cc._EventListenerTouchOneByOne.LISTENER_ID) : a == cc.EventListener.TOUCH_ALL_AT_ONCE ? this._removeListenersForListenerID(cc._EventListenerTouchAllAtOnce.LISTENER_ID) : a == cc.EventListener.MOUSE ? this._removeListenersForListenerID(cc._EventListenerMouse.LISTENER_ID) :
            a == cc.EventListener.ACCELERATION ? this._removeListenersForListenerID(cc._EventListenerAcceleration.LISTENER_ID) : a == cc.EventListener.KEYBOARD ? this._removeListenersForListenerID(cc._EventListenerKeyboard.LISTENER_ID) : cc.log(cc._LogInfos.eventManager_removeListeners)
    },
    removeCustomListeners: function(a) {
        this._removeListenersForListenerID(a)
    },
    removeAllListeners: function() {
        var a = this._listenersMap,
            b = this._internalCustomListenerIDs,
            c;
        for (c in a) - 1 === b.indexOf(c) && this._removeListenersForListenerID(c)
    },
    setPriority: function(a,
        b) {
        if (null != a) {
            var c = this._listenersMap,
                d;
            for (d in c) {
                var e = c[d].getFixedPriorityListeners();
                if (e && -1 != e.indexOf(a)) {
                    null != a._getSceneGraphPriority() && cc.log(cc._LogInfos.eventManager_setPriority);
                    a._getFixedPriority() !== b && (a._setFixedPriority(b), this._setDirty(a._getListenerID(), this.DIRTY_FIXED_PRIORITY));
                    break
                }
            }
        }
    },
    setEnabled: function(a) {
        this._isEnabled = a
    },
    isEnabled: function() {
        return this._isEnabled
    },
    dispatchEvent: function(a) {
        if (this._isEnabled) {
            this._updateDirtyFlagForSceneGraph();
            this._inDispatch++;
            if (!a || !a.getType) throw "event is undefined";
            if (a.getType() == cc.Event.TOUCH) this._dispatchTouchEvent(a);
            else {
                var b = cc.__getListenerID(a);
                this._sortEventListeners(b);
                b = this._listenersMap[b];
                null != b && this._dispatchEventToListeners(b, this._onListenerCallback, a);
                this._updateListeners(a)
            }
            this._inDispatch--
        }
    },
    _onListenerCallback: function(a, b) {
        b._setCurrentTarget(a._getSceneGraphPriority());
        a._onEvent(b);
        return b.isStopped()
    },
    dispatchCustomEvent: function(a, b) {
        var c = new cc.EventCustom(a);
        c.setUserData(b);
        this.dispatchEvent(c)
    }
};
cc.EventAcceleration = cc.Event.extend({
    _acc: null,
    ctor: function(a) {
        cc.Event.prototype.ctor.call(this, cc.Event.ACCELERATION);
        this._acc = a
    }
});
cc.EventKeyboard = cc.Event.extend({
    _keyCode: 0,
    _isPressed: !1,
    ctor: function(a, b) {
        cc.Event.prototype.ctor.call(this, cc.Event.KEYBOARD);
        this._keyCode = a;
        this._isPressed = b
    }
});
cc._EventListenerAcceleration = cc.EventListener.extend({
    _onAccelerationEvent: null,
    ctor: function(a) {
        this._onAccelerationEvent = a;
        var b = this;
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.ACCELERATION, cc._EventListenerAcceleration.LISTENER_ID, function(a) {
            b._onAccelerationEvent(a._acc, a)
        })
    },
    checkAvailable: function() {
        cc.assert(this._onAccelerationEvent, cc._LogInfos._EventListenerAcceleration_checkAvailable);
        return !0
    },
    clone: function() {
        return new cc._EventListenerAcceleration(this._onAccelerationEvent)
    }
});
cc._EventListenerAcceleration.LISTENER_ID = "__cc_acceleration";
cc._EventListenerAcceleration.create = function(a) {
    return new cc._EventListenerAcceleration(a)
};
cc._EventListenerKeyboard = cc.EventListener.extend({
    onKeyPressed: null,
    onKeyReleased: null,
    ctor: function() {
        var a = this;
        cc.EventListener.prototype.ctor.call(this, cc.EventListener.KEYBOARD, cc._EventListenerKeyboard.LISTENER_ID, function(b) {
            if (b._isPressed) {
                if (a.onKeyPressed) a.onKeyPressed(b._keyCode, b)
            } else if (a.onKeyReleased) a.onKeyReleased(b._keyCode, b)
        })
    },
    clone: function() {
        var a = new cc._EventListenerKeyboard;
        a.onKeyPressed = this.onKeyPressed;
        a.onKeyReleased = this.onKeyReleased;
        return a
    },
    checkAvailable: function() {
        return null ==
            this.onKeyPressed && null == this.onKeyReleased ? (cc.log(cc._LogInfos._EventListenerKeyboard_checkAvailable), !1) : !0
    }
});
cc._EventListenerKeyboard.LISTENER_ID = "__cc_keyboard";
cc._EventListenerKeyboard.create = function() {
    return new cc._EventListenerKeyboard
};
cc._tmp.PrototypeCCNode = function() {
    var a = cc.Node.prototype;
    cc.defineGetterSetter(a, "x", a.getPositionX, a.setPositionX);
    cc.defineGetterSetter(a, "y", a.getPositionY, a.setPositionY);
    cc.defineGetterSetter(a, "width", a._getWidth, a._setWidth);
    cc.defineGetterSetter(a, "height", a._getHeight, a._setHeight);
    cc.defineGetterSetter(a, "anchorX", a._getAnchorX, a._setAnchorX);
    cc.defineGetterSetter(a, "anchorY", a._getAnchorY, a._setAnchorY);
    cc.defineGetterSetter(a, "skewX", a.getSkewX, a.setSkewX);
    cc.defineGetterSetter(a, "skewY",
        a.getSkewY, a.setSkewY);
    cc.defineGetterSetter(a, "zIndex", a.getLocalZOrder, a.setLocalZOrder);
    cc.defineGetterSetter(a, "vertexZ", a.getVertexZ, a.setVertexZ);
    cc.defineGetterSetter(a, "rotation", a.getRotation, a.setRotation);
    cc.defineGetterSetter(a, "rotationX", a.getRotationX, a.setRotationX);
    cc.defineGetterSetter(a, "rotationY", a.getRotationY, a.setRotationY);
    cc.defineGetterSetter(a, "scale", a.getScale, a.setScale);
    cc.defineGetterSetter(a, "scaleX", a.getScaleX, a.setScaleX);
    cc.defineGetterSetter(a, "scaleY", a.getScaleY,
        a.setScaleY);
    cc.defineGetterSetter(a, "children", a.getChildren);
    cc.defineGetterSetter(a, "childrenCount", a.getChildrenCount);
    cc.defineGetterSetter(a, "parent", a.getParent, a.setParent);
    cc.defineGetterSetter(a, "visible", a.isVisible, a.setVisible);
    cc.defineGetterSetter(a, "running", a.isRunning);
    cc.defineGetterSetter(a, "ignoreAnchor", a.isIgnoreAnchorPointForPosition, a.ignoreAnchorPointForPosition);
    cc.defineGetterSetter(a, "actionManager", a.getActionManager, a.setActionManager);
    cc.defineGetterSetter(a, "scheduler",
        a.getScheduler, a.setScheduler);
    cc.defineGetterSetter(a, "shaderProgram", a.getShaderProgram, a.setShaderProgram);
    cc.defineGetterSetter(a, "glServerState", a.getGLServerState, a.setGLServerState)
};
cc._tmp.PrototypeCCNodeRGBA = function() {
    var a = cc.NodeRGBA.prototype;
    cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity);
    cc.defineGetterSetter(a, "opacityModifyRGB", a.isOpacityModifyRGB, a.setOpacityModifyRGB);
    cc.defineGetterSetter(a, "cascadeOpacity", a.isCascadeOpacityEnabled, a.setCascadeOpacityEnabled);
    cc.defineGetterSetter(a, "color", a.getColor, a.setColor);
    cc.defineGetterSetter(a, "cascadeColor", a.isCascadeColorEnabled, a.setCascadeColorEnabled)
};
cc.NODE_TAG_INVALID = -1;
cc.s_globalOrderOfArrival = 1;
cc.Node = cc.Class.extend({
    _localZOrder: 0,
    _globalZOrder: 0,
    _vertexZ: 0,
    _rotationX: 0,
    _rotationY: 0,
    _scaleX: 1,
    _scaleY: 1,
    _position: null,
    _skewX: 0,
    _skewY: 0,
    _children: null,
    _visible: !0,
    _anchorPoint: null,
    _anchorPointInPoints: null,
    _contentSize: null,
    _running: !1,
    _parent: null,
    _ignoreAnchorPointForPosition: !1,
    tag: cc.NODE_TAG_INVALID,
    userData: null,
    userObject: null,
    _transformDirty: !0,
    _inverseDirty: !0,
    _cacheDirty: !0,
    _cachedParent: null,
    _transformGLDirty: null,
    _transform: null,
    _inverse: null,
    _reorderChildDirty: !1,
    _shaderProgram: null,
    arrivalOrder: 0,
    _actionManager: null,
    _scheduler: null,
    _eventDispatcher: null,
    _initializedNode: !1,
    _additionalTransformDirty: !1,
    _additionalTransform: null,
    _componentContainer: null,
    _isTransitionFinished: !1,
    _rotationRadiansX: 0,
    _rotationRadiansY: 0,
    _className: "Node",
    _showNode: !1,
    _initNode: function() {
        this._anchorPoint = cc.p(0, 0);
        this._anchorPointInPoints = cc.p(0, 0);
        this._contentSize = cc.size(0, 0);
        this._position = cc.p(0, 0);
        this._children = [];
        this._transform = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            tx: 0,
            ty: 0
        };
        var a = cc.director;
        this._actionManager =
            a.getActionManager();
        this._scheduler = a.getScheduler();
        this._initializedNode = !0;
        this._additionalTransform = cc.AffineTransformMakeIdentity();
        cc.ComponentContainer && (this._componentContainer = new cc.ComponentContainer(this))
    },
    init: function() {
        !1 === this._initializedNode && this._initNode();
        return !0
    },
    _arrayMakeObjectsPerformSelector: function(a, b) {
        if (a && 0 !== a.length) {
            var c, d = a.length,
                e;
            c = cc.Node.StateCallbackType;
            switch (b) {
                case c.onEnter:
                    for (c = 0; c < d; c++)
                        if (e = a[c]) e.onEnter();
                    break;
                case c.onExit:
                    for (c = 0; c < d; c++)
                        if (e =
                            a[c]) e.onExit();
                    break;
                case c.onEnterTransitionDidFinish:
                    for (c = 0; c < d; c++)
                        if (e = a[c]) e.onEnterTransitionDidFinish();
                    break;
                case c.cleanup:
                    for (c = 0; c < d; c++)(e = a[c]) && e.cleanup();
                    break;
                case c.updateTransform:
                    for (c = 0; c < d; c++)(e = a[c]) && e.updateTransform();
                    break;
                case c.onExitTransitionDidStart:
                    for (c = 0; c < d; c++)
                        if (e = a[c]) e.onExitTransitionDidStart();
                    break;
                case c.sortAllChildren:
                    for (c = 0; c < d; c++)(e = a[c]) && e.sortAllChildren();
                    break;
                default:
                    cc.assert(0, cc._LogInfos.Node__arrayMakeObjectsPerformSelector)
            }
        }
    },
    setNodeDirty: null,
    attr: function(a) {
        for (var b in a) this[b] = a[b]
    },
    getSkewX: function() {
        return this._skewX
    },
    setSkewX: function(a) {
        this._skewX = a;
        this.setNodeDirty()
    },
    getSkewY: function() {
        return this._skewY
    },
    setSkewY: function(a) {
        this._skewY = a;
        this.setNodeDirty()
    },
    setLocalZOrder: function(a) {
        this._localZOrder = a;
        this._parent && this._parent.reorderChild(this, a);
        cc.eventManager._setDirtyForNode(this)
    },
    _setLocalZOrder: function(a) {
        this._localZOrder = a
    },
    getLocalZOrder: function() {
        return this._localZOrder
    },
    getZOrder: function() {
        cc.log(cc._LogInfos.Node_getZOrder);
        return this.getLocalZOrder()
    },
    setZOrder: function(a) {
        cc.log(cc._LogInfos.Node_setZOrder);
        this.setLocalZOrder(a)
    },
    setGlobalZOrder: function(a) {
        this._globalZOrder != a && (this._globalZOrder = a, cc.eventManager._setDirtyForNode(this))
    },
    getGlobalZOrder: function() {
        return this._globalZOrder
    },
    getVertexZ: function() {
        return this._vertexZ
    },
    setVertexZ: function(a) {
        this._vertexZ = a
    },
    getRotation: function() {
        this._rotationX !== this._rotationY && cc.log(cc._LogInfos.Node_getRotation);
        return this._rotationX
    },
    setRotation: function(a) {
        this._rotationX =
            this._rotationY = a;
        this._rotationRadiansX = 0.017453292519943295 * this._rotationX;
        this._rotationRadiansY = 0.017453292519943295 * this._rotationY;
        this.setNodeDirty()
    },
    getRotationX: function() {
        return this._rotationX
    },
    setRotationX: function(a) {
        this._rotationX = a;
        this._rotationRadiansX = 0.017453292519943295 * this._rotationX;
        this.setNodeDirty()
    },
    getRotationY: function() {
        return this._rotationY
    },
    setRotationY: function(a) {
        this._rotationY = a;
        this._rotationRadiansY = 0.017453292519943295 * this._rotationY;
        this.setNodeDirty()
    },
    getScale: function() {
        this._scaleX !== this._scaleY && cc.log(cc._LogInfos.Node_getScale);
        return this._scaleX
    },
    setScale: function(a, b) {
        this._scaleX = a;
        this._scaleY = b || 0 === b ? b : a;
        this.setNodeDirty()
    },
    getScaleX: function() {
        return this._scaleX
    },
    setScaleX: function(a) {
        this._scaleX = a;
        this.setNodeDirty()
    },
    getScaleY: function() {
        return this._scaleY
    },
    setScaleY: function(a) {
        this._scaleY = a;
        this.setNodeDirty()
    },
    setPosition: function(a, b) {
        var c = this._position;
        void 0 === b ? (c.x = a.x, c.y = a.y) : (c.x = a, c.y = b);
        this.setNodeDirty()
    },
    getPosition: function() {
        return cc.p(this._position)
    },
    getPositionX: function() {
        return this._position.x
    },
    setPositionX: function(a) {
        this._position.x = a;
        this.setNodeDirty()
    },
    getPositionY: function() {
        return this._position.y
    },
    setPositionY: function(a) {
        this._position.y = a;
        this.setNodeDirty()
    },
    getChildrenCount: function() {
        return this._children.length
    },
    getChildren: function() {
        return this._children
    },
    isVisible: function() {
        return this._visible
    },
    setVisible: function(a) {
        this._visible = a;
        this.setNodeDirty()
    },
    getAnchorPoint: function() {
        return this._anchorPoint
    },
    setAnchorPoint: function(a, b) {
        var c = this._anchorPoint;
        if (void 0 === b) {
            if (a.x === c.x && a.y === c.y) return;
            c.x = a.x;
            c.y = a.y
        } else {
            if (a === c.x && b === c.y) return;
            c.x = a;
            c.y = b
        }
        var d = this._anchorPointInPoints,
            e = this._contentSize;
        d.x = e.width * c.x;
        d.y = e.height * c.y;
        this.setNodeDirty()
    },
    _getAnchor: function() {
        return this._anchorPoint
    },
    _setAnchor: function(a) {
        var b = a.x;
        a = a.y;
        this._anchorPoint.x !== b && (this._anchorPoint.x = b, this._anchorPointInPoints.x = this._contentSize.width * b);
        this._anchorPoint.y !== a && (this._anchorPoint.y =
            a, this._anchorPointInPoints.y = this._contentSize.height * a);
        this.setNodeDirty()
    },
    _getAnchorX: function() {
        return this._anchorPoint.x
    },
    _setAnchorX: function(a) {
        this._anchorPoint.x !== a && (this._anchorPoint.x = a, this._anchorPointInPoints.x = this._contentSize.width * a, this.setNodeDirty())
    },
    _getAnchorY: function() {
        return this._anchorPoint.y
    },
    _setAnchorY: function(a) {
        this._anchorPoint.y !== a && (this._anchorPoint.y = a, this._anchorPointInPoints.y = this._contentSize.height * a, this.setNodeDirty())
    },
    getAnchorPointInPoints: function() {
        return this._anchorPointInPoints
    },
    _getWidth: function() {
        return this._contentSize.width
    },
    _setWidth: function(a) {
        this._contentSize.width = a;
        this._anchorPointInPoints.x = a * this._anchorPoint.x;
        this.setNodeDirty()
    },
    _getHeight: function() {
        return this._contentSize.height
    },
    _setHeight: function(a) {
        this._contentSize.height = a;
        this._anchorPointInPoints.y = a * this._anchorPoint.y;
        this.setNodeDirty()
    },
    getContentSize: function() {
        return this._contentSize
    },
    setContentSize: function(a, b) {
        var c = this._contentSize;
        if (void 0 === b) {
            if (a.width === c.width && a.height ===
                c.height) return;
            c.width = a.width;
            c.height = a.height
        } else {
            if (a === c.width && b === c.height) return;
            c.width = a;
            c.height = b
        }
        var d = this._anchorPointInPoints,
            e = this._anchorPoint;
        d.x = c.width * e.x;
        d.y = c.height * e.y;
        this.setNodeDirty()
    },
    isRunning: function() {
        return this._running
    },
    getParent: function() {
        return this._parent
    },
    setParent: function(a) {
        this._parent = a
    },
    isIgnoreAnchorPointForPosition: function() {
        return this._ignoreAnchorPointForPosition
    },
    ignoreAnchorPointForPosition: function(a) {
        a != this._ignoreAnchorPointForPosition &&
            (this._ignoreAnchorPointForPosition = a, this.setNodeDirty())
    },
    getTag: function() {
        return this.tag
    },
    setTag: function(a) {
        this.tag = a
    },
    getUserData: function() {
        return this.userData
    },
    setUserData: function(a) {
        this.userData = a
    },
    getUserObject: function() {
        return this.userObject
    },
    setUserObject: function(a) {
        this.userObject != a && (this.userObject = a)
    },
    getOrderOfArrival: function() {
        return this.arrivalOrder
    },
    setOrderOfArrival: function(a) {
        this.arrivalOrder = a
    },
    getActionManager: function() {
        this._actionManager || (this._actionManager =
            cc.director.getActionManager());
        return this._actionManager
    },
    setActionManager: function(a) {
        this._actionManager != a && (this.stopAllActions(), this._actionManager = a)
    },
    getScheduler: function() {
        this._scheduler || (this._scheduler = cc.director.getScheduler());
        return this._scheduler
    },
    setScheduler: function(a) {
        this._scheduler != a && (this.unscheduleAllCallbacks(), this._scheduler = a)
    },
    getBoundingBox: function() {
        var a = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        return cc._RectApplyAffineTransformIn(a, this.nodeToParentTransform())
    },
    cleanup: function() {
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        cc.eventManager.removeListeners(this);
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.cleanup)
    },
    getChildByTag: function(a) {
        var b = this._children;
        if (null != b)
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (d && d.tag == a) return d
            }
        return null
    },
    addChild: function(a, b, c) {
        cc.assert(a, cc._LogInfos.Node_addChild_3);
        if (a === this) cc.log(cc._LogInfos.Node_addChild);
        else if (null !== a._parent) cc.log(cc._LogInfos.Node_addChild_2);
        else if (b = null != b ? b : a._localZOrder, a.tag = null != c ? c : a.tag, this._insertChild(a, b), a._parent = this, this._cachedParent && (a._cachedParent = this._cachedParent), this._running && (a.onEnter(), this._isTransitionFinished)) a.onEnterTransitionDidFinish()
    },
    removeFromParent: function(a) {
        this._parent && (null == a && (a = !0), this._parent.removeChild(this, a))
    },
    removeFromParentAndCleanup: function(a) {
        cc.log(cc._LogInfos.Node_removeFromParentAndCleanup);
        this.removeFromParent(a)
    },
    removeChild: function(a, b) {
        0 !== this._children.length &&
            (null == b && (b = !0), -1 < this._children.indexOf(a) && this._detachChild(a, b), this.setNodeDirty())
    },
    removeChildByTag: function(a, b) {
        a === cc.NODE_TAG_INVALID && cc.log(cc._LogInfos.Node_removeChildByTag);
        var c = this.getChildByTag(a);
        null == c ? cc.log(cc._LogInfos.Node_removeChildByTag_2, a) : this.removeChild(c, b)
    },
    removeAllChildrenWithCleanup: function(a) {
        cc.log(cc._LogInfos.Node_removeAllChildrenWithCleanup);
        this.removeAllChildren(a)
    },
    removeAllChildren: function(a) {
        var b = this._children;
        if (null != b) {
            null == a && (a = !0);
            for (var c =
                    0; c < b.length; c++) {
                var d = b[c];
                d && (this._running && (d.onExitTransitionDidStart(), d.onExit()), a && d.cleanup(), d.parent = null)
            }
            this._children.length = 0
        }
    },
    _detachChild: function(a, b) {
        this._running && (a.onExitTransitionDidStart(), a.onExit());
        b && a.cleanup();
        a.parent = null;
        cc.arrayRemoveObject(this._children, a)
    },
    _insertChild: function(a, b) {
        this._reorderChildDirty = !0;
        this._children.push(a);
        a._setLocalZOrder(b)
    },
    reorderChild: function(a, b) {
        cc.assert(a, cc._LogInfos.Node_reorderChild);
        this._reorderChildDirty = !0;
        a.arrivalOrder =
            cc.s_globalOrderOfArrival;
        cc.s_globalOrderOfArrival++;
        a._setLocalZOrder(b);
        this.setNodeDirty()
    },
    sortAllChildren: function() {
        if (this._reorderChildDirty) {
            var a = this._children,
                b = a.length,
                c, d, e;
            for (c = 1; c < b; c++) {
                e = a[c];
                for (d = c - 1; 0 <= d;) {
                    if (e._localZOrder < a[d]._localZOrder) a[d + 1] = a[d];
                    else if (e._localZOrder === a[d]._localZOrder && e.arrivalOrder < a[d].arrivalOrder) a[d + 1] = a[d];
                    else break;
                    d--
                }
                a[d + 1] = e
            }
            this._reorderChildDirty = !1
        }
    },
    draw: function(a) {},
    transformAncestors: function() {
        null != this._parent && (this._parent.transformAncestors(),
            this._parent.transform())
    },
    onEnter: function() {
        this._isTransitionFinished = !1;
        this._running = !0;
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onEnter);
        this.resume()
    },
    onEnterTransitionDidFinish: function() {
        this._isTransitionFinished = !0;
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onEnterTransitionDidFinish)
    },
    onExitTransitionDidStart: function() {
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onExitTransitionDidStart)
    },
    onExit: function() {
        this._running = !1;
        this.pause();
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.onExit);
        this._componentContainer && this._componentContainer.removeAll()
    },
    runAction: function(a) {
        cc.assert(a, cc._LogInfos.Node_runAction);
        this.actionManager.addAction(a, this, !this._running);
        return a
    },
    stopAllActions: function() {
        this.actionManager && this.actionManager.removeAllActionsFromTarget(this)
    },
    stopAction: function(a) {
        this.actionManager.removeAction(a)
    },
    stopActionByTag: function(a) {
        a ===
            cc.ACTION_TAG_INVALID ? cc.log(cc._LogInfos.Node_stopActionByTag) : this.actionManager.removeActionByTag(a, this)
    },
    getActionByTag: function(a) {
        return a === cc.ACTION_TAG_INVALID ? (cc.log(cc._LogInfos.Node_getActionByTag), null) : this.actionManager.getActionByTag(a, this)
    },
    getNumberOfRunningActions: function() {
        return this.actionManager.numberOfRunningActionsInTarget(this)
    },
    scheduleUpdate: function() {
        this.scheduleUpdateWithPriority(0)
    },
    scheduleUpdateWithPriority: function(a) {
        this.scheduler.scheduleUpdateForTarget(this,
            a, !this._running)
    },
    unscheduleUpdate: function() {
        this.scheduler.unscheduleUpdateForTarget(this)
    },
    schedule: function(a, b, c, d) {
        b = b || 0;
        cc.assert(a, cc._LogInfos.Node_schedule);
        cc.assert(0 <= b, cc._LogInfos.Node_schedule_2);
        c = null == c ? cc.REPEAT_FOREVER : c;
        this.scheduler.scheduleCallbackForTarget(this, a, b, c, d || 0, !this._running)
    },
    scheduleOnce: function(a, b) {
        this.schedule(a, 0, 0, b)
    },
    unschedule: function(a) {
        a && this.scheduler.unscheduleCallbackForTarget(this, a)
    },
    unscheduleAllCallbacks: function() {
        this.scheduler.unscheduleAllCallbacksForTarget(this)
    },
    resumeSchedulerAndActions: function() {
        cc.log(cc._LogInfos.Node_resumeSchedulerAndActions);
        this.resume()
    },
    resume: function() {
        this.scheduler.resumeTarget(this);
        this.actionManager && this.actionManager.resumeTarget(this);
        cc.eventManager.resumeTarget(this)
    },
    pauseSchedulerAndActions: function() {
        cc.log(cc._LogInfos.Node_pauseSchedulerAndActions);
        this.pause()
    },
    pause: function() {
        this.scheduler.pauseTarget(this);
        this.actionManager && this.actionManager.pauseTarget(this);
        cc.eventManager.pauseTarget(this)
    },
    setAdditionalTransform: function(a) {
        this._additionalTransform =
            a;
        this._additionalTransformDirty = this._transformDirty = !0
    },
    parentToNodeTransform: function() {
        this._inverseDirty && (this._inverse = cc.AffineTransformInvert(this.nodeToParentTransform()), this._inverseDirty = !1);
        return this._inverse
    },
    nodeToWorldTransform: function() {
        for (var a = this.nodeToParentTransform(), b = this._parent; null != b; b = b.parent) a = cc.AffineTransformConcat(a, b.nodeToParentTransform());
        return a
    },
    worldToNodeTransform: function() {
        return cc.AffineTransformInvert(this.nodeToWorldTransform())
    },
    convertToNodeSpace: function(a) {
        return cc.PointApplyAffineTransform(a,
            this.worldToNodeTransform())
    },
    convertToWorldSpace: function(a) {
        return cc.PointApplyAffineTransform(a, this.nodeToWorldTransform())
    },
    convertToNodeSpaceAR: function(a) {
        return cc.pSub(this.convertToNodeSpace(a), this._anchorPointInPoints)
    },
    convertToWorldSpaceAR: function(a) {
        a = cc.pAdd(a, this._anchorPointInPoints);
        return this.convertToWorldSpace(a)
    },
    _convertToWindowSpace: function(a) {
        a = this.convertToWorldSpace(a);
        return cc.director.convertToUI(a)
    },
    convertTouchToNodeSpace: function(a) {
        a = a.getLocation();
        return this.convertToNodeSpace(a)
    },
    convertTouchToNodeSpaceAR: function(a) {
        a = a.getLocation();
        a = cc.director.convertToGL(a);
        return this.convertToNodeSpaceAR(a)
    },
    update: function(a) {
        this._componentContainer && !this._componentContainer.isEmpty() && this._componentContainer.visit(a)
    },
    updateTransform: function() {
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.updateTransform)
    },
    retain: function() {},
    release: function() {},
    getComponent: function(a) {
        return this._componentContainer.getComponent(a)
    },
    addComponent: function(a) {
        this._componentContainer.add(a)
    },
    removeComponent: function(a) {
        return this._componentContainer.remove(a)
    },
    removeAllComponents: function() {
        this._componentContainer.removeAll()
    },
    grid: null,
    ctor: null,
    visit: null,
    transform: null,
    nodeToParentTransform: null,
    _setNodeDirtyForCache: function() {
        if (!1 === this._cacheDirty) {
            this._cacheDirty = !0;
            var a = this._cachedParent;
            a && a != this && a._setNodeDirtyForCache()
        }
    },
    _setCachedParent: function(a) {
        if (this._cachedParent != a) {
            this._cachedParent = a;
            for (var b = this._children, c = 0, d = b.length; c < d; c++) b[c]._setCachedParent(a)
        }
    },
    getCamera: function() {
        this._camera || (this._camera = new cc.Camera);
        return this._camera
    },
    getGrid: function() {
        return this.grid
    },
    setGrid: function(a) {
        this.grid = a
    },
    getShaderProgram: function() {
        return this._shaderProgram
    },
    setShaderProgram: function(a) {
        this._shaderProgram = a
    },
    getGLServerState: function() {
        return this._glServerState
    },
    setGLServerState: function(a) {
        this._glServerState = a
    },
    getBoundingBoxToWorld: function() {
        var a = cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
            b = this.nodeToWorldTransform(),
            a = cc.RectApplyAffineTransform(a, this.nodeToWorldTransform());
        if (!this._children) return a;
        for (var c = this._children, d = 0; d < c.length; d++) {
            var e = c[d];
            e && e._visible && (e = e._getBoundingBoxToCurrentNode(b)) && (a = cc.rectUnion(a, e))
        }
        return a
    },
    _getBoundingBoxToCurrentNode: function(a) {
        var b = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        a = null == a ? this.nodeToParentTransform() : cc.AffineTransformConcat(this.nodeToParentTransform(), a);
        b = cc.RectApplyAffineTransform(b, a);
        if (!this._children) return b;
        for (var c =
                this._children, d = 0; d < c.length; d++) {
            var e = c[d];
            e && e._visible && (e = e._getBoundingBoxToCurrentNode(a)) && (b = cc.rectUnion(b, e))
        }
        return b
    },
    _nodeToParentTransformForWebGL: function() {
        if (this._transformDirty) {
            var a = this._position.x,
                b = this._position.y,
                c = this._anchorPointInPoints.x,
                d = -c,
                e = this._anchorPointInPoints.y,
                f = -e,
                g = this._scaleX,
                h = this._scaleY;
            this._ignoreAnchorPointForPosition && (a += c, b += e);
            var k = 1,
                m = 0,
                n = 1,
                q = 0;
            if (0 !== this._rotationX || 0 !== this._rotationY) k = Math.cos(-this._rotationRadiansX), m = Math.sin(-this._rotationRadiansX),
                n = Math.cos(-this._rotationRadiansY), q = Math.sin(-this._rotationRadiansY);
            var s = this._skewX || this._skewY;
            if (!s && (0 !== c || 0 !== e)) a += n * d * g + -m * f * h, b += q * d * g + k * f * h;
            var r = this._transform;
            r.a = n * g;
            r.b = q * g;
            r.c = -m * h;
            r.d = k * h;
            r.tx = a;
            r.ty = b;
            if (s && (r = cc.AffineTransformConcat({
                    a: 1,
                    b: Math.tan(cc.degreesToRadians(this._skewY)),
                    c: Math.tan(cc.degreesToRadians(this._skewX)),
                    d: 1,
                    tx: 0,
                    ty: 0
                }, r), 0 !== c || 0 !== e)) r = cc.AffineTransformTranslate(r, d, f);
            this._additionalTransformDirty && (r = cc.AffineTransformConcat(r, this._additionalTransform),
                this._additionalTransformDirty = !1);
            this._transform = r;
            this._transformDirty = !1
        }
        return this._transform
    }
});
cc.Node.create = function() {
    return new cc.Node
};
cc.Node.StateCallbackType = {
    onEnter: 1,
    onExit: 2,
    cleanup: 3,
    onEnterTransitionDidFinish: 4,
    updateTransform: 5,
    onExitTransitionDidStart: 6,
    sortAllChildren: 7
};
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.Node.prototype, _p.ctor = function() {
    this._initNode()
}, _p.setNodeDirty = function() {
    this._setNodeDirtyForCache();
    !1 === this._transformDirty && (this._transformDirty = this._inverseDirty = !0)
}, _p.visit = function(a) {
    if (this._visible) {
        a = a || cc._renderContext;
        var b, c = this._children,
            d;
        a.save();
        this.transform(a);
        var e = c.length;
        if (0 < e) {
            this.sortAllChildren();
            for (b = 0; b < e; b++)
                if (d = c[b], 0 > d._localZOrder) d.visit(a);
                else break;
            for (this.draw(a); b < e; b++) c[b].visit(a)
        } else this.draw(a);
        this._cacheDirty = !1;
        this.arrivalOrder = 0;
        a.restore()
    }
}, _p.transform = function(a) {
    a = a || cc._renderContext;
    var b = cc.view,
        c = this.nodeToParentTransform();
    a.transform(c.a, c.c, c.b, c.d, c.tx * b.getScaleX(), -c.ty * b.getScaleY())
}, _p.nodeToParentTransform = function() {
    if (this._transformDirty) {
        var a = this._transform;
        a.tx = this._position.x;
        a.ty = this._position.y;
        var b = 1,
            c = 0;
        this._rotationX && (b = Math.cos(this._rotationRadiansX), c = Math.sin(this._rotationRadiansX));
        a.a = a.d = b;
        a.b = -c;
        a.c = c;
        var d = this._scaleX,
            e = this._scaleY,
            f = this._anchorPointInPoints.x,
            g = this._anchorPointInPoints.y,
            h = 1E-6 > d && -1E-6 < d ? 1E-6 : d,
            k = 1E-6 > e && -1E-6 < e ? 1E-6 : e;
        if (this._skewX || this._skewY) {
            var m = Math.tan(-this._skewX * Math.PI / 180),
                n = Math.tan(-this._skewY * Math.PI / 180);
            Infinity === m && (m = 99999999);
            Infinity === n && (n = 99999999);
            var q = g * m * h,
                s = f * n * k;
            a.a = b + -c * n;
            a.b = b * m + -c;
            a.c = c + b * n;
            a.d = c * m + b;
            a.tx += b * q + -c * s;
            a.ty += c * q + b * s
        }
        if (1 !== d || 1 !== e) a.a *= h, a.c *= h, a.b *= k, a.d *= k;
        a.tx += b * -f * h + -c * g * k;
        a.ty -= c * -f * h + b * g * k;
        this._ignoreAnchorPointForPosition && (a.tx += f, a.ty += g);
        this._additionalTransformDirty &&
            (this._transform = cc.AffineTransformConcat(a, this._additionalTransform), this._additionalTransformDirty = !1);
        this._transformDirty = !1
    }
    return this._transform
}, _p = null) : (cc.assert("function" === typeof cc._tmp.WebGLCCNode, cc._LogInfos.MissingFile, "BaseNodesWebGL.js"), cc._tmp.WebGLCCNode(), delete cc._tmp.WebGLCCNode);
cc.assert("function" === typeof cc._tmp.PrototypeCCNode, cc._LogInfos.MissingFile, "BaseNodesPropertyDefine.js");
cc._tmp.PrototypeCCNode();
delete cc._tmp.PrototypeCCNode;
cc.NodeRGBA = cc.Node.extend({
    RGBAProtocol: !0,
    _displayedOpacity: 255,
    _realOpacity: 255,
    _displayedColor: null,
    _realColor: null,
    _cascadeColorEnabled: !1,
    _cascadeOpacityEnabled: !1,
    ctor: function() {
        cc.Node.prototype.ctor.call(this);
        this._realOpacity = this._displayedOpacity = 255;
        this._displayedColor = cc.color(255, 255, 255, 255);
        this._realColor = cc.color(255, 255, 255, 255);
        this._cascadeOpacityEnabled = this._cascadeColorEnabled = !1
    },
    getOpacity: function() {
        return this._realOpacity
    },
    getDisplayedOpacity: function() {
        return this._displayedOpacity
    },
    setOpacity: function(a) {
        this._displayedOpacity = this._realOpacity = a;
        var b = 255,
            c = this._parent;
        c && (c.RGBAProtocol && c.cascadeOpacity) && (b = c.getDisplayedOpacity());
        this.updateDisplayedOpacity(b);
        this._displayedColor.a = this._realColor.a = a
    },
    updateDisplayedOpacity: function(a) {
        this._displayedOpacity = this._realOpacity * a / 255;
        if (this._cascadeOpacityEnabled) {
            a = this._children;
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                c && c.RGBAProtocol && c.updateDisplayedOpacity(this._displayedOpacity)
            }
        }
    },
    isCascadeOpacityEnabled: function() {
        return this._cascadeOpacityEnabled
    },
    setCascadeOpacityEnabled: function(a) {
        this._cascadeOpacityEnabled !== a && ((this._cascadeOpacityEnabled = a) ? this._enableCascadeOpacity() : this._disableCascadeOpacity())
    },
    _enableCascadeOpacity: function() {
        var a = 255,
            b = this._parent;
        b && (b.RGBAProtocol && b.cascadeOpacity) && (a = b.getDisplayedOpacity());
        this.updateDisplayedOpacity(a)
    },
    _disableCascadeOpacity: function() {
        this._displayedOpacity = this._realOpacity;
        for (var a = this._children, b = 0; b < a.length; b++) {
            var c = a[b];
            c && c.RGBAProtocol && c.updateDisplayedOpacity(255)
        }
    },
    getColor: function() {
        var a = this._realColor;
        return cc.color(a.r, a.g, a.b, a.a)
    },
    getDisplayedColor: function() {
        var a = this._displayedColor;
        return cc.color(a.r, a.g, a.b, a.a)
    },
    setColor: function(a) {
        var b = this._displayedColor,
            c = this._realColor;
        b.r = c.r = a.r;
        b.g = c.g = a.g;
        b.b = c.b = a.b;
        b = (b = this._parent) && b.RGBAProtocol && b.cascadeColor ? b.getDisplayedColor() : cc.color.WHITE;
        this.updateDisplayedColor(b);
        void 0 !== a.a && !a.a_undefined && this.setOpacity(a.a)
    },
    updateDisplayedColor: function(a) {
        var b = this._displayedColor,
            c = this._realColor;
        b.r = 0 | c.r * a.r / 255;
        b.g = 0 | c.g * a.g / 255;
        b.b = 0 | c.b * a.b / 255;
        if (this._cascadeColorEnabled) {
            a = this._children;
            for (c = 0; c < a.length; c++) {
                var d = a[c];
                d && d.RGBAProtocol && d.updateDisplayedColor(b)
            }
        }
    },
    isCascadeColorEnabled: function() {
        return this._cascadeColorEnabled
    },
    setCascadeColorEnabled: function(a) {
        this._cascadeColorEnabled !== a && ((this._cascadeColorEnabled = a) ? this._enableCascadeColor() : this._disableCascadeColor())
    },
    _enableCascadeColor: function() {
        var a;
        a = (a = this._parent) && a.RGBAProtocol && a.cascadeColor ? a.getDisplayedColor() :
            cc.color.WHITE;
        this.updateDisplayedColor(a)
    },
    _disableCascadeColor: function() {
        var a = this._displayedColor,
            b = this._realColor;
        a.r = b.r;
        a.g = b.g;
        a.b = b.b;
        for (var a = this._children, b = cc.color.WHITE, c = 0; c < a.length; c++) {
            var d = a[c];
            d && d.RGBAProtocol && d.updateDisplayedColor(b)
        }
    },
    addChild: function(a, b, c) {
        cc.Node.prototype.addChild.call(this, a, b, c);
        this._cascadeColorEnabled && this._enableCascadeColor();
        this._cascadeOpacityEnabled && this._enableCascadeOpacity()
    },
    setOpacityModifyRGB: function(a) {},
    isOpacityModifyRGB: function() {
        return !1
    }
});
cc.NodeRGBA.create = function() {
    var a = new cc.NodeRGBA;
    a.init();
    return a
};
cc.assert("function" === typeof cc._tmp.PrototypeCCNodeRGBA, cc._LogInfos.MissingFile, "BaseNodesPropertyDefine.js");
cc._tmp.PrototypeCCNodeRGBA();
delete cc._tmp.PrototypeCCNodeRGBA;
cc.Node.ON_ENTER = 0;
cc.Node.ON_EXIT = 1;
cc.Node.ON_ENTER_TRANSITION_DID_FINISH = 2;
cc.Node.ON_EXIT_TRANSITOIN_DID_START = 3;
cc.Node.ON_CLEAN_UP = 4;
cc.AtlasNode = cc.NodeRGBA.extend({
    textureAtlas: null,
    quadsToDraw: 0,
    RGBAProtocol: !0,
    _itemsPerRow: 0,
    _itemsPerColumn: 0,
    _itemWidth: 0,
    _itemHeight: 0,
    _colorUnmodified: null,
    _opacityModifyRGB: !1,
    _blendFunc: null,
    _ignoreContentScaleFactor: !1,
    _className: "AtlasNode",
    ctor: function(a, b, c, d) {
        cc.NodeRGBA.prototype.ctor.call(this);
        this._colorUnmodified = cc.color.WHITE;
        this._blendFunc = {
            src: cc.BLEND_SRC,
            dst: cc.BLEND_DST
        };
        this._ignoreContentScaleFactor = !1;
        void 0 !== d && this.initWithTileFile(a, b, c, d)
    },
    updateAtlasValues: function() {
        cc.log(cc._LogInfos.AtlasNode_updateAtlasValues)
    },
    getColor: function() {
        return this._opacityModifyRGB ? this._colorUnmodified : cc.NodeRGBA.prototype.getColor.call(this)
    },
    setOpacityModifyRGB: function(a) {
        var b = this.color;
        this._opacityModifyRGB = a;
        this.color = b
    },
    isOpacityModifyRGB: function() {
        return this._opacityModifyRGB
    },
    getBlendFunc: function() {
        return this._blendFunc
    },
    setBlendFunc: function(a, b) {
        this._blendFunc = void 0 === b ? a : {
            src: a,
            dst: b
        }
    },
    setTextureAtlas: function(a) {
        this.textureAtlas = a
    },
    getTextureAtlas: function() {
        return this.textureAtlas
    },
    getQuadsToDraw: function() {
        return this.quadsToDraw
    },
    setQuadsToDraw: function(a) {
        this.quadsToDraw = a
    },
    _textureForCanvas: null,
    _originalTexture: null,
    _uniformColor: null,
    _colorF32Array: null,
    initWithTileFile: function(a, b, c, d) {
        if (!a) throw "cc.AtlasNode.initWithTileFile(): title should not be null";
        a = cc.textureCache.addImage(a);
        return this.initWithTexture(a, b, c, d)
    },
    initWithTexture: null,
    _initWithTextureForCanvas: function(a, b, c, d) {
        this._itemWidth = b;
        this._itemHeight = c;
        this._opacityModifyRGB = !0;
        this._originalTexture = a;
        if (!this._originalTexture) return cc.log(cc._LogInfos.AtlasNode__initWithTexture), !1;
        this._textureForCanvas = this._originalTexture;
        this._calculateMaxItems();
        this.quadsToDraw = d;
        return !0
    },
    _initWithTextureForWebGL: function(a, b, c, d) {
        this._itemWidth = b;
        this._itemHeight = c;
        this._colorUnmodified = cc.color.WHITE;
        this._opacityModifyRGB = !0;
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;
        b = this._realColor;
        this._colorF32Array = new Float32Array([b.r / 255, b.g / 255, b.b / 255, this._realOpacity / 255]);
        this.textureAtlas = new cc.TextureAtlas;
        this.textureAtlas.initWithTexture(a, d);
        if (!this.textureAtlas) return cc.log(cc._LogInfos.AtlasNode__initWithTexture), !1;
        this._updateBlendFunc();
        this._updateOpacityModifyRGB();
        this._calculateMaxItems();
        this.quadsToDraw = d;
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE_UCOLOR);
        this._uniformColor = cc._renderContext.getUniformLocation(this.shaderProgram.getProgram(), "u_color");
        return !0
    },
    draw: null,
    _drawForWebGL: function(a) {
        a = a || cc._renderContext;
        cc.nodeDrawSetup(this);
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        a.uniform4fv(this._uniformColor, this._colorF32Array);
        this.textureAtlas.drawNumberOfQuads(this.quadsToDraw,
            0)
    },
    setColor: null,
    _setColorForCanvas: function(a) {
        var b = this._realColor;
        if (!(b.r == a.r && b.g == a.g && b.b == a.b)) {
            b = cc.color(a.r, a.g, a.b);
            this._colorUnmodified = a;
            if (this._opacityModifyRGB) {
                var c = this._displayedOpacity;
                b.r = b.r * c / 255;
                b.g = b.g * c / 255;
                b.b = b.b * c / 255
            }
            cc.NodeRGBA.prototype.setColor.call(this, a);
            if (this.texture && (a = this._originalTexture.getHtmlElementObj()))
                if (b = cc.textureCache.getTextureColors(a)) c = cc.rect(0, 0, a.width, a.height), a = cc.generateTintImage(a, b, this._realColor, c), b = new cc.Texture2D, b.initWithElement(a),
                    b.handleLoadedTexture(), this.texture = b
        }
    },
    _setColorForWebGL: function(a) {
        var b = cc.color(a.r, a.g, a.b);
        this._colorUnmodified = a;
        var c = this._displayedOpacity;
        this._opacityModifyRGB && (b.r = b.r * c / 255, b.g = b.g * c / 255, b.b = b.b * c / 255);
        cc.NodeRGBA.prototype.setColor.call(this, a);
        a = this._displayedColor;
        this._colorF32Array = new Float32Array([a.r / 255, a.g / 255, a.b / 255, c / 255])
    },
    setOpacity: function(a) {},
    _setOpacityForCanvas: function(a) {
        cc.NodeRGBA.prototype.setOpacity.call(this, a);
        this._opacityModifyRGB && (this.color = this._colorUnmodified)
    },
    _setOpacityForWebGL: function(a) {
        cc.NodeRGBA.prototype.setOpacity.call(this, a);
        this._opacityModifyRGB ? this.color = this._colorUnmodified : (a = this._displayedColor, this._colorF32Array = new Float32Array([a.r / 255, a.g / 255, a.b / 255, this._displayedOpacity / 255]))
    },
    getTexture: null,
    _getTextureForCanvas: function() {
        return this._textureForCanvas
    },
    _getTextureForWebGL: function() {
        return this.textureAtlas.texture
    },
    setTexture: null,
    _setTextureForCanvas: function(a) {
        this._textureForCanvas = a
    },
    _setTextureForWebGL: function(a) {
        this.textureAtlas.texture =
            a;
        this._updateBlendFunc();
        this._updateOpacityModifyRGB()
    },
    _calculateMaxItems: null,
    _calculateMaxItemsForCanvas: function() {
        var a = this.texture.getContentSize();
        this._itemsPerColumn = 0 | a.height / this._itemHeight;
        this._itemsPerRow = 0 | a.width / this._itemWidth
    },
    _calculateMaxItemsForWebGL: function() {
        var a = this.texture,
            b = a.getContentSize();
        this._ignoreContentScaleFactor && (b = a.getContentSizeInPixels());
        this._itemsPerColumn = 0 | b.height / this._itemHeight;
        this._itemsPerRow = 0 | b.width / this._itemWidth
    },
    _updateBlendFunc: function() {
        this.textureAtlas.texture.hasPremultipliedAlpha() ||
            (this._blendFunc.src = cc.SRC_ALPHA, this._blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA)
    },
    _updateOpacityModifyRGB: function() {
        this._opacityModifyRGB = this.textureAtlas.texture.hasPremultipliedAlpha()
    },
    _setIgnoreContentScaleFactor: function(a) {
        this._ignoreContentScaleFactor = a
    }
});
_p = cc.AtlasNode.prototype;
cc._renderType === cc._RENDER_TYPE_WEBGL ? (_p.initWithTexture = _p._initWithTextureForWebGL, _p.draw = _p._drawForWebGL, _p.setColor = _p._setColorForWebGL, _p.setOpacity = _p._setOpacityForWebGL, _p.getTexture = _p._getTextureForWebGL, _p.setTexture = _p._setTextureForWebGL, _p._calculateMaxItems = _p._calculateMaxItemsForWebGL) : (_p.initWithTexture = _p._initWithTextureForCanvas, _p.draw = cc.Node.prototype.draw, _p.setColor = _p._setColorForCanvas, _p.setOpacity = _p._setOpacityForCanvas, _p.getTexture = _p._getTextureForCanvas, _p.setTexture =
    _p._setTextureForCanvas, _p._calculateMaxItems = _p._calculateMaxItemsForCanvas);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
cc.defineGetterSetter(_p, "color", _p.getColor, _p.setColor);
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.AtlasNode.create = function(a, b, c, d) {
    return new cc.AtlasNode(a, b, c, d)
};
cc._tmp.PrototypeTexture2D = function() {
    var a = cc.Texture2D;
    a.PVRImagesHavePremultipliedAlpha = function(a) {
        cc.PVRHaveAlphaPremultiplied_ = a
    };
    a.PIXEL_FORMAT_RGBA8888 = 2;
    a.PIXEL_FORMAT_RGB888 = 3;
    a.PIXEL_FORMAT_RGB565 = 4;
    a.PIXEL_FORMAT_A8 = 5;
    a.PIXEL_FORMAT_I8 = 6;
    a.PIXEL_FORMAT_AI88 = 7;
    a.PIXEL_FORMAT_RGBA4444 = 8;
    a.PIXEL_FORMAT_RGB5A1 = 7;
    a.PIXEL_FORMAT_PVRTC4 = 9;
    a.PIXEL_FORMAT_PVRTC2 = 10;
    a.PIXEL_FORMAT_DEFAULT = a.PIXEL_FORMAT_RGBA8888;
    var b = cc.Texture2D._M = {};
    b[a.PIXEL_FORMAT_RGBA8888] = "RGBA8888";
    b[a.PIXEL_FORMAT_RGB888] =
        "RGB888";
    b[a.PIXEL_FORMAT_RGB565] = "RGB565";
    b[a.PIXEL_FORMAT_A8] = "A8";
    b[a.PIXEL_FORMAT_I8] = "I8";
    b[a.PIXEL_FORMAT_AI88] = "AI88";
    b[a.PIXEL_FORMAT_RGBA4444] = "RGBA4444";
    b[a.PIXEL_FORMAT_RGB5A1] = "RGB5A1";
    b[a.PIXEL_FORMAT_PVRTC4] = "PVRTC4";
    b[a.PIXEL_FORMAT_PVRTC2] = "PVRTC2";
    b = cc.Texture2D._B = {};
    b[a.PIXEL_FORMAT_RGBA8888] = 32;
    b[a.PIXEL_FORMAT_RGB888] = 24;
    b[a.PIXEL_FORMAT_RGB565] = 16;
    b[a.PIXEL_FORMAT_A8] = 8;
    b[a.PIXEL_FORMAT_I8] = 8;
    b[a.PIXEL_FORMAT_AI88] = 16;
    b[a.PIXEL_FORMAT_RGBA4444] = 16;
    b[a.PIXEL_FORMAT_RGB5A1] = 16;
    b[a.PIXEL_FORMAT_PVRTC4] = 4;
    b[a.PIXEL_FORMAT_PVRTC2] = 3;
    b = cc.Texture2D.prototype;
    cc.defineGetterSetter(b, "name", b.getName);
    cc.defineGetterSetter(b, "pixelFormat", b.getPixelFormat);
    cc.defineGetterSetter(b, "pixelsWidth", b.getPixelsWide);
    cc.defineGetterSetter(b, "pixelsHeight", b.getPixelsHigh);
    cc.defineGetterSetter(b, "width", b._getWidth);
    cc.defineGetterSetter(b, "height", b._getHeight);
    a.defaultPixelFormat = a.PIXEL_FORMAT_DEFAULT
};
cc._tmp.PrototypeTextureAtlas = function() {
    var a = cc.TextureAtlas.prototype;
    cc.defineGetterSetter(a, "totalQuads", a.getTotalQuads);
    cc.defineGetterSetter(a, "capacity", a.getCapacity);
    cc.defineGetterSetter(a, "quads", a.getQuads, a.setQuads)
};
cc.ALIGN_CENTER = 51;
cc.ALIGN_TOP = 19;
cc.ALIGN_TOP_RIGHT = 18;
cc.ALIGN_RIGHT = 50;
cc.ALIGN_BOTTOM_RIGHT = 34;
cc.ALIGN_BOTTOM = 35;
cc.ALIGN_BOTTOM_LEFT = 33;
cc.ALIGN_LEFT = 49;
cc.ALIGN_TOP_LEFT = 17;
cc.PVRHaveAlphaPremultiplied_ = !1;
cc._renderType === cc._RENDER_TYPE_CANVAS ? cc.Texture2D = cc.Class.extend({
    _contentSize: null,
    _isLoaded: !1,
    _htmlElementObj: null,
    _loadedEventListeners: null,
    url: null,
    ctor: function() {
        this._contentSize = cc.size(0, 0);
        this._isLoaded = !1;
        this._htmlElementObj = null
    },
    getPixelsWide: function() {
        return this._contentSize.width
    },
    getPixelsHigh: function() {
        return this._contentSize.height
    },
    getContentSize: function() {
        var a = cc.contentScaleFactor();
        return cc.size(this._contentSize.width / a, this._contentSize.height / a)
    },
    _getWidth: function() {
        return this._contentSize.width /
            cc.contentScaleFactor()
    },
    _getHeight: function() {
        return this._contentSize.height / cc.contentScaleFactor()
    },
    getContentSizeInPixels: function() {
        return this._contentSize
    },
    initWithElement: function(a) {
        a && (this._htmlElementObj = a)
    },
    getHtmlElementObj: function() {
        return this._htmlElementObj
    },
    isLoaded: function() {
        return this._isLoaded
    },
    handleLoadedTexture: function() {
        if (!this._isLoaded) {
            if (!this._htmlElementObj) {
                var a = cc.loader.getRes(this.url);
                if (!a) return;
                this.initWithElement(a)
            }
            this._isLoaded = !0;
            a = this._htmlElementObj;
            this._contentSize.width = a.width;
            this._contentSize.height = a.height;
            this._callLoadedEventCallbacks()
        }
    },
    description: function() {
        return "\x3ccc.Texture2D | width \x3d " + this._contentSize.width + " height " + this._contentSize.height + "\x3e"
    },
    initWithData: function(a, b, c, d, e) {
        return !1
    },
    initWithImage: function(a) {
        return !1
    },
    initWithString: function(a, b, c, d, e, f) {
        return !1
    },
    releaseTexture: function() {},
    getName: function() {
        return null
    },
    getMaxS: function() {
        return 1
    },
    setMaxS: function(a) {},
    getMaxT: function() {
        return 1
    },
    setMaxT: function(a) {},
    getPixelFormat: function() {
        return null
    },
    getShaderProgram: function() {
        return null
    },
    setShaderProgram: function(a) {},
    hasPremultipliedAlpha: function() {
        return !1
    },
    hasMipmaps: function() {
        return !1
    },
    releaseData: function(a) {},
    keepData: function(a, b) {
        return a
    },
    drawAtPoint: function(a) {},
    drawInRect: function(a) {},
    initWithETCFile: function(a) {
        cc.log(cc._LogInfos.Texture2D_initWithETCFile);
        return !1
    },
    initWithPVRFile: function(a) {
        cc.log(cc._LogInfos.Texture2D_initWithPVRFile);
        return !1
    },
    initWithPVRTCData: function(a, b, c, d,
        e, f) {
        cc.log(cc._LogInfos.Texture2D_initWithPVRTCData);
        return !1
    },
    setTexParameters: function(a) {},
    setAntiAliasTexParameters: function() {},
    setAliasTexParameters: function() {},
    generateMipmap: function() {},
    stringForFormat: function() {
        return ""
    },
    bitsPerPixelForFormat: function(a) {
        return -1
    },
    addLoadedEventListener: function(a, b) {
        this._loadedEventListeners || (this._loadedEventListeners = []);
        this._loadedEventListeners.push({
            eventCallback: a,
            eventTarget: b
        })
    },
    removeLoadedEventListener: function(a) {
        if (this._loadedEventListeners)
            for (var b =
                    this._loadedEventListeners, c = 0; c < b.length; c++) b[c].eventTarget == a && b.splice(c, 1)
    },
    _callLoadedEventCallbacks: function() {
        if (this._loadedEventListeners) {
            for (var a = this._loadedEventListeners, b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                d.eventCallback.call(d.eventTarget, this)
            }
            a.length = 0
        }
    }
}) : (cc.assert("function" === typeof cc._tmp.WebGLTexture2D, cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTexture2D(), delete cc._tmp.WebGLTexture2D);
cc.assert("function" === typeof cc._tmp.PrototypeTexture2D, cc._LogInfos.MissingFile, "TexturesPropertyDefine.js");
cc._tmp.PrototypeTexture2D();
delete cc._tmp.PrototypeTexture2D;
cc.textureCache = {
    _textures: {},
    _textureColorsCache: {},
    _textureKeySeq: 0 | 1E3 * Math.random(),
    _loadedTexturesBefore: {},
    _initializingRenderer: function() {
        var a, b = this._loadedTexturesBefore,
            c = this._textures;
        for (a in b) {
            var d = b[a];
            d.handleLoadedTexture();
            c[a] = d
        }
        this._loadedTexturesBefore = {}
    },
    addPVRTCImage: function(a) {
        cc.log(cc._LogInfos.textureCache_addPVRTCImage)
    },
    addETCImage: function(a) {
        cc.log(cc._LogInfos.textureCache_addETCImage)
    },
    description: function() {
        return "\x3cTextureCache | Number of textures \x3d " +
            this._textures.length + "\x3e"
    },
    textureForKey: function(a) {
        return this._textures[a] || this._textures[cc.loader._aliases[a]]
    },
    getKeyByTexture: function(a) {
        for (var b in this._textures)
            if (this._textures[b] == a) return b;
        return null
    },
    _generalTextureKey: function() {
        this._textureKeySeq++;
        return "_textureKey_" + this._textureKeySeq
    },
    getTextureColors: function(a) {
        var b = this.getKeyByTexture(a);
        b || (b = a instanceof HTMLImageElement ? a.src : this._generalTextureKey());
        this._textureColorsCache[b] || (this._textureColorsCache[b] =
            cc.generateTextureCacheForColor(a));
        return this._textureColorsCache[b]
    },
    addPVRImage: function(a) {
        cc.log(cc._LogInfos.textureCache_addPVRImage)
    },
    removeAllTextures: function() {
        var a = this._textures,
            b;
        for (b in a) a[b] && a[b].releaseTexture();
        this._textures = {}
    },
    removeTexture: function(a) {
        if (a) {
            var b = this._textures,
                c;
            for (c in b) b[c] == a && (b[c].releaseTexture(), delete b[c])
        }
    },
    removeTextureForKey: function(a) {
        null != a && this._textures[a] && delete this._textures[a]
    },
    cacheImage: function(a, b) {
        if (b instanceof cc.Texture2D) this._textures[a] =
            b;
        else {
            var c = new cc.Texture2D;
            c.initWithElement(b);
            c.handleLoadedTexture();
            this._textures[a] = c
        }
    },
    addUIImage: function(a, b) {
        cc.assert(a, cc._LogInfos.textureCache_addUIImage_2);
        if (b && this._textures[b]) return this._textures[b];
        var c = new cc.Texture2D;
        c.initWithImage(a);
        null != b && null != c ? this._textures[b] = c : cc.log(cc._LogInfos.textureCache_addUIImage);
        return c
    },
    dumpCachedTextureInfo: function() {
        var a = 0,
            b = 0,
            c = this._textures,
            d;
        for (d in c) {
            var e = c[d];
            a++;
            e.getHtmlElementObj() instanceof HTMLImageElement ? cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo,
                d, e.getHtmlElementObj().src, e.pixelsWidth, e.pixelsHeight) : cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_2, d, e.pixelsWidth, e.pixelsHeight);
            b += 4 * e.pixelsWidth * e.pixelsHeight
        }
        c = this._textureColorsCache;
        for (d in c) {
            var e = c[d],
                f;
            for (f in e) {
                var g = e[f];
                a++;
                cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_2, d, g.width, g.height);
                b += 4 * g.width * g.height
            }
        }
        cc.log(cc._LogInfos.textureCache_dumpCachedTextureInfo_3, a, b / 1024, (b / 1048576).toFixed(2))
    },
    _clear: function() {
        this._textures = {};
        this._textureColorsCache = {};
        this._textureKeySeq = 0 | 1E3 * Math.random();
        this._loadedTexturesBefore = {}
    }
};
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.textureCache, _p.handleLoadedTexture = function(a) {
    var b = this._textures,
        c = b[a];
    c || (c = b[a] = new cc.Texture2D, c.url = a);
    c.handleLoadedTexture()
}, _p.addImage = function(a, b, c) {
    cc.assert(a, cc._LogInfos.Texture2D_addImage);
    var d = this._textures,
        e = d[a] || d[cc.loader._aliases[a]];
    if (e) return b && b.call(c), e;
    e = d[a] = new cc.Texture2D;
    e.url = a;
    cc.loader.getRes(a) ? e.handleLoadedTexture() : cc.loader._checkIsImageURL(a) ? cc.loader.load(a, function(a) {
            b && b.call(c)
        }) : cc.loader.cache[a] =
        cc.loader.loadImg(a, function(c, d) {
            if (c) return b ? b(c) : c;
            cc.textureCache.handleLoadedTexture(a);
            b && b(null, d)
        });
    return e
}, _p = null) : (cc.assert("function" === typeof cc._tmp.WebGLTextureCache, cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTextureCache(), delete cc._tmp.WebGLTextureCache);
cc.TextureAtlas = cc.Class.extend({
    dirty: !1,
    texture: null,
    _indices: null,
    _buffersVBO: null,
    _capacity: 0,
    _quads: null,
    _quadsArrayBuffer: null,
    _quadsWebBuffer: null,
    _quadsReader: null,
    ctor: function(a, b) {
        this._buffersVBO = [];
        "string" == typeof a ? this.initWithFile(a, b) : a instanceof cc.Texture2D && this.initWithTexture(a, b)
    },
    getTotalQuads: function() {
        return this._totalQuads
    },
    getCapacity: function() {
        return this._capacity
    },
    getTexture: function() {
        return this.texture
    },
    setTexture: function(a) {
        this.texture = a
    },
    setDirty: function(a) {
        this.dirty =
            a
    },
    isDirty: function() {
        return this.dirty
    },
    getQuads: function() {
        return this._quads
    },
    setQuads: function(a) {
        this._quads = a
    },
    _copyQuadsToTextureAtlas: function(a, b) {
        if (a)
            for (var c = 0; c < a.length; c++) this._setQuadToArray(a[c], b + c)
    },
    _setQuadToArray: function(a, b) {
        var c = this._quads;
        c[b] ? (c[b].bl = a.bl, c[b].br = a.br, c[b].tl = a.tl, c[b].tr = a.tr) : c[b] = new cc.V3F_C4B_T2F_Quad(a.tl, a.bl, a.tr, a.br, this._quadsArrayBuffer, b * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT)
    },
    description: function() {
        return "\x3ccc.TextureAtlas | totalQuads \x3d" +
            this._totalQuads + "\x3e"
    },
    _setupIndices: function() {
        if (0 !== this._capacity)
            for (var a = this._indices, b = this._capacity, c = 0; c < b; c++) cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP ? (a[6 * c + 0] = 4 * c + 0, a[6 * c + 1] = 4 * c + 0, a[6 * c + 2] = 4 * c + 2, a[6 * c + 3] = 4 * c + 1, a[6 * c + 4] = 4 * c + 3, a[6 * c + 5] = 4 * c + 3) : (a[6 * c + 0] = 4 * c + 0, a[6 * c + 1] = 4 * c + 1, a[6 * c + 2] = 4 * c + 2, a[6 * c + 3] = 4 * c + 3, a[6 * c + 4] = 4 * c + 2, a[6 * c + 5] = 4 * c + 1)
    },
    _setupVBO: function() {
        var a = cc._renderContext;
        this._buffersVBO[0] = a.createBuffer();
        this._buffersVBO[1] = a.createBuffer();
        this._quadsWebBuffer = a.createBuffer();
        this._mapBuffers()
    },
    _mapBuffers: function() {
        var a = cc._renderContext;
        a.bindBuffer(a.ARRAY_BUFFER, this._quadsWebBuffer);
        a.bufferData(a.ARRAY_BUFFER, this._quadsArrayBuffer, a.DYNAMIC_DRAW);
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, this._indices, a.STATIC_DRAW)
    },
    initWithFile: function(a, b) {
        var c = cc.textureCache.addImage(a);
        if (c) return this.initWithTexture(c, b);
        cc.log(cc._LogInfos.TextureAtlas_initWithFile, a);
        return !1
    },
    initWithTexture: function(a, b) {
        cc.assert(a,
            cc._LogInfos.TextureAtlas_initWithTexture);
        this._capacity = b |= 0;
        this._totalQuads = 0;
        this.texture = a;
        this._quads = [];
        this._indices = new Uint16Array(6 * b);
        var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._quadsArrayBuffer = new ArrayBuffer(c * b);
        this._quadsReader = new Uint8Array(this._quadsArrayBuffer);
        if ((!this._quads || !this._indices) && 0 < b) return !1;
        for (var d = this._quads, e = 0; e < b; e++) d[e] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, e * c);
        this._setupIndices();
        this._setupVBO();
        return this.dirty = !0
    },
    updateQuad: function(a, b) {
        cc.assert(a, cc._LogInfos.TextureAtlas_updateQuad);
        cc.assert(0 <= b && b < this._capacity, cc._LogInfos.TextureAtlas_updateQuad_2);
        this._totalQuads = Math.max(b + 1, this._totalQuads);
        this._setQuadToArray(a, b);
        this.dirty = !0
    },
    insertQuad: function(a, b) {
        cc.assert(b < this._capacity, cc._LogInfos.TextureAtlas_insertQuad_2);
        this._totalQuads++;
        if (this._totalQuads > this._capacity) cc.log(cc._LogInfos.TextureAtlas_insertQuad);
        else {
            var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
                d = b * c,
                e = (this._totalQuads -
                    1 - b) * c;
            this._quads[this._totalQuads - 1] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * c);
            this._quadsReader.set(this._quadsReader.subarray(d, d + e), d + c);
            this._setQuadToArray(a, b);
            this.dirty = !0
        }
    },
    insertQuads: function(a, b, c) {
        c = c || a.length;
        cc.assert(b + c <= this._capacity, cc._LogInfos.TextureAtlas_insertQuads);
        var d = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._totalQuads += c;
        if (this._totalQuads > this._capacity) cc.log(cc._LogInfos.TextureAtlas_insertQuad);
        else {
            var e = b *
                d,
                f = (this._totalQuads - 1 - b - c) * d,
                g = this._totalQuads - 1 - c,
                h;
            for (h = 0; h < c; h++) this._quads[g + h] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * d);
            this._quadsReader.set(this._quadsReader.subarray(e, e + f), e + d * c);
            for (h = 0; h < c; h++) this._setQuadToArray(a[h], b + h);
            this.dirty = !0
        }
    },
    insertQuadFromIndex: function(a, b) {
        if (a !== b) {
            cc.assert(0 <= b || b < this._totalQuads, cc._LogInfos.TextureAtlas_insertQuadFromIndex);
            cc.assert(0 <= a || a < this._totalQuads, cc._LogInfos.TextureAtlas_insertQuadFromIndex_2);
            var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
                d = this._quadsReader,
                e = d.subarray(a * c, c),
                f;
            a > b ? (f = b * c, d.set(d.subarray(f, f + (a - b) * c), f + c), d.set(e, f)) : (f = (a + 1) * c, d.set(d.subarray(f, f + (b - a) * c), f - c), d.set(e, b * c));
            this.dirty = !0
        }
    },
    removeQuadAtIndex: function(a) {
        cc.assert(a < this._totalQuads, cc._LogInfos.TextureAtlas_removeQuadAtIndex);
        var b = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._totalQuads--;
        this._quads.length = this._totalQuads;
        if (a !== this._totalQuads) {
            var c = (a + 1) * b;
            this._quadsReader.set(this._quadsReader.subarray(c,
                c + (this._totalQuads - a) * b), c - b)
        }
        this.dirty = !0
    },
    removeQuadsAtIndex: function(a, b) {
        cc.assert(a + b <= this._totalQuads, cc._LogInfos.TextureAtlas_removeQuadsAtIndex);
        this._totalQuads -= b;
        if (a !== this._totalQuads) {
            var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
                d = (a + b) * c;
            this._quadsReader.set(this._quadsReader.subarray(d, d + (this._totalQuads - a) * c), a * c)
        }
        this.dirty = !0
    },
    removeAllQuads: function() {
        this._totalQuads = this._quads.length = 0
    },
    _setDirty: function(a) {
        this.dirty = a
    },
    resizeCapacity: function(a) {
        if (a == this._capacity) return !0;
        var b = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
            c = this._capacity;
        this._totalQuads = Math.min(this._totalQuads, a);
        var d = this._capacity = 0 | a,
            e = this._totalQuads;
        if (null == this._quads) {
            this._quads = [];
            this._quadsArrayBuffer = new ArrayBuffer(b * d);
            this._quadsReader = new Uint8Array(this._quadsArrayBuffer);
            for (a = 0; a < d; a++) this._quads = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, a * b)
        } else {
            var f, g, h = this._quads;
            if (d > c) {
                f = [];
                g = new ArrayBuffer(b * d);
                for (a = 0; a < e; a++) f[a] = new cc.V3F_C4B_T2F_Quad(h[a].tl,
                    h[a].bl, h[a].tr, h[a].br, g, a * b);
                for (; a < d; a++) f[a] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, g, a * b)
            } else {
                e = Math.max(e, d);
                f = [];
                g = new ArrayBuffer(b * d);
                for (a = 0; a < e; a++) f[a] = new cc.V3F_C4B_T2F_Quad(h[a].tl, h[a].bl, h[a].tr, h[a].br, g, a * b)
            }
            this._quadsReader = new Uint8Array(g);
            this._quads = f;
            this._quadsArrayBuffer = g
        }
        null == this._indices ? this._indices = new Uint16Array(6 * d) : d > c ? (b = new Uint16Array(6 * d), b.set(this._indices, 0), this._indices = b) : this._indices = this._indices.subarray(0, 6 * d);
        this._setupIndices();
        this._mapBuffers();
        return this.dirty = !0
    },
    increaseTotalQuadsWith: function(a) {
        this._totalQuads += a
    },
    moveQuadsFromIndex: function(a, b, c) {
        if (void 0 === c) {
            if (c = b, b = this._totalQuads - a, cc.assert(c + (this._totalQuads - a) <= this._capacity, cc._LogInfos.TextureAtlas_moveQuadsFromIndex), 0 === b) return
        } else if (cc.assert(c + b <= this._totalQuads, cc._LogInfos.TextureAtlas_moveQuadsFromIndex_2), cc.assert(a < this._totalQuads, cc._LogInfos.TextureAtlas_moveQuadsFromIndex_3), a == c) return;
        var d = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,
            e = a * d,
            f = b * d,
            g = this._quadsReader,
            h = g.subarray(e, e + f),
            k = c * d;
        c < a ? (b = c * d, g.set(g.subarray(b, b + (a - c) * d), b + f)) : (b = (a + b) * d, g.set(g.subarray(b, b + (c - a) * d), e));
        g.set(h, k);
        this.dirty = !0
    },
    fillWithEmptyQuadsFromIndex: function(a, b) {
        for (var c = b * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, d = new Uint8Array(this._quadsArrayBuffer, a * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, c), e = 0; e < c; e++) d[e] = 0
    },
    drawQuads: function() {
        this.drawNumberOfQuads(this._totalQuads, 0)
    },
    _releaseBuffer: function() {
        var a = cc._renderContext;
        this._buffersVBO && (this._buffersVBO[0] && a.deleteBuffer(this._buffersVBO[0]),
            this._buffersVBO[1] && a.deleteBuffer(this._buffersVBO[1]));
        this._quadsWebBuffer && a.deleteBuffer(this._quadsWebBuffer)
    }
});
_p = cc.TextureAtlas.prototype;
cc.defineGetterSetter(_p, "totalQuads", _p.getTotalQuads);
cc.defineGetterSetter(_p, "capacity", _p.getCapacity);
cc.defineGetterSetter(_p, "quads", _p.getQuads, _p.setQuads);
cc.TextureAtlas.create = function(a, b) {
    return new cc.TextureAtlas(a, b)
};
cc._renderType === cc._RENDER_TYPE_WEBGL && (cc.assert("function" === typeof cc._tmp.WebGLTextureAtlas, cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTextureAtlas(), delete cc._tmp.WebGLTextureAtlas);
cc.assert("function" === typeof cc._tmp.PrototypeTextureAtlas, cc._LogInfos.MissingFile, "TexturesPropertyDefine.js");
cc._tmp.PrototypeTextureAtlas();
delete cc._tmp.PrototypeTextureAtlas;
cc.Scene = cc.Node.extend({
    _className: "Scene",
    ctor: function() {
        cc.Node.prototype.ctor.call(this);
        this._ignoreAnchorPointForPosition = !0;
        this.setAnchorPoint(0.5, 0.5);
        this.setContentSize(cc.director.getWinSize())
    }
});
cc.Scene.create = function() {
    return new cc.Scene
};
cc.LoaderScene = cc.Scene.extend({
    _interval: null,
    _length: 0,
    _count: 0,
    _label: null,
    barWidth: 265,
    barHeight: 25,
    logoWidth: 160,
    logoHeight: 200,
    _className: "LoaderScene",
    init: function() {
        var a = this;
        this.barWidth = cc.barWidth;
        this.barHeight = cc.barHeight;
        var b = a._bgLayer = cc.LayerColor.create(cc.color(cc.bglayerColor[0], cc.bglayerColor[1], cc.bglayerColor[2], cc.bglayerColor[3]));
        b.setPosition(cc.visibleRect.bottomLeft);
        a.addChild(b, 0);
        b = -this.logoHeight / 2 + 100;
        cc._loaderImage && cc.loader.loadImg(cc._loaderImage, {
                isCrossOrigin: !1
            },
            function(b, c) {
                this.logoWidth = c.width;
                this.logoHeight = c.height;
                a._initStage(c, cc.visibleRect.center)
            });
        cc._loadingbar && (cc.loader.loadImg(cc._loadingbar, {
            isCrossOrigin: !1
        }, function(b, c) {
            a._initBar(c, cc.visibleRect.center)
        }), b = -50);
        cc.tgideasLogo && cc.loader.loadImg(cc.tgideasLogo, {
            isCrossOrigin: !1
        }, function(b, c) {
            cc.tglogotexture2d = new cc.Texture2D;
            cc.tglogotexture2d.initWithElement(c);
            cc.tglogotexture2d.handleLoadedTexture();
            a.foot = cc.Sprite.create(cc.tglogotexture2d);
            a._bgLayer.addChild(a.foot, 11);
            a.foot.y = 10;
            a.foot.anchorX = 0.5;
            a.foot.anchorY = 0;
            a.foot.x = cc.visibleRect.center.x
        });
        var c = a._label = cc.LabelTTF.create("Loading... ", "Arial", 24);
        c.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, b)));
        c.setColor(cc.color(0, 0, 0));
        return !0
    },
    _initBar: function(a, b) {
        var c = this._texture2d = new cc.Texture2D;
        c.initWithElement(a);
        c.handleLoadedTexture();
        this._bar = cc.Sprite.create(c);
        this._bar.color = cc.color(cc.barColor[0], cc.barColor[1], cc.barColor[2], cc.barColor[3]);
        this._barbg = cc.Sprite.create(c);
        this._barbg.color =
            cc.color(cc.barBgColor[0], cc.barBgColor[1], cc.barBgColor[2], cc.barBgColor[3]);
        this._bar.setScale(cc.contentScaleFactor());
        this._barbg.setScale(cc.contentScaleFactor());
        this._bar.anchorY = 0;
        this._bar.anchorX = 0;
        this._barbg.anchorY = 0;
        this._barbg.anchorX = 0;
        this._bar.setTextureRect(cc.rect(0, 0, 0, this.barHeight));
        this._barbg.x = this._bar.x = b.x - this.barWidth / 2;
        this._barbg.y = this._bar.y = b.y - this.barHeight / 2;
        this._barbg.y -= 2;
        this._bgLayer.addChild(this._barbg, 10);
        this._bgLayer.addChild(this._bar, 11)
    },
    _initStage: function(a,
        b) {
        var c = this._texture2d = new cc.Texture2D;
        c.initWithElement(a);
        c.handleLoadedTexture();
        c = this._logo = cc.Sprite.create(c);
        c.setScale(cc.contentScaleFactor());
        c.x = b.x;
        c.y = b.y + c.height / 2 + 35;
        this._bgLayer.addChild(c, 10)
    },
    onEnter: function() {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this._startLoading, 0.3)
    },
    onExit: function() {
        cc.Node.prototype.onExit.call(this)
    },
    initWithResources: function(a, b) {
        "string" == typeof a && (a = [a]);
        this.resources = a || [];
        this.cb = b
    },
    _startLoading: function() {
        var a = this;
        a.unschedule(a._startLoading);
        var b = a.resources;
        a._length = b.length;
        a._count = 0;
        cc.loader.load(b, function(b, d) {
            a._count = d
        }, function() {
            a.cb && a.cb()
        });
        a.schedule(a._updatePercent)
    },
    _updatePercent: function() {
        var a = this._count,
            b = this._length,
            c;
        c = Math.min(100 * (a / b) | 0, 100);
        this._bar && this._bar.setTextureRect(cc.rect(0, 0, this.barWidth * c / 100, this.barHeight));
        this._label.setString("Loading... ");
        a >= b && this.unschedule(this._updatePercent)
    }
});
cc.LoaderScene.preload = function(a, b) {
    var c = cc;
    c.loaderScene || (c.loaderScene = new cc.LoaderScene, c.loaderScene.init());
    c.loaderScene.initWithResources(a, b);
    cc.director.runScene(c.loaderScene);
    return c.loaderScene
};
cc._tmp.PrototypeLayerRGBA = function() {
    var a = cc.LayerRGBA.prototype;
    cc.defineGetterSetter(a, "opacityModifyRGB", a.isOpacityModifyRGB, a.setOpacityModifyRGB);
    cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity);
    cc.defineGetterSetter(a, "cascadeOpacity", a.isCascadeOpacityEnabled, a.setCascadeOpacityEnabled);
    cc.defineGetterSetter(a, "color", a.getColor, a.setColor);
    cc.defineGetterSetter(a, "cascadeColor", a.isCascadeColorEnabled, a.setCascadeColorEnabled)
};
cc._tmp.PrototypeLayerColor = function() {
    var a = cc.LayerColor.prototype;
    cc.defineGetterSetter(a, "width", a._getWidth, a._setWidth);
    cc.defineGetterSetter(a, "height", a._getHeight, a._setHeight)
};
cc._tmp.PrototypeLayerGradient = function() {
    var a = cc.LayerGradient.prototype;
    cc.defineGetterSetter(a, "startColor", a.getStartColor, a.setStartColor);
    cc.defineGetterSetter(a, "endColor", a.getEndColor, a.setEndColor);
    cc.defineGetterSetter(a, "startOpacity", a.getStartOpacity, a.setStartOpacity);
    cc.defineGetterSetter(a, "endOpacity", a.getEndOpacity, a.setEndOpacity);
    cc.defineGetterSetter(a, "vector", a.getVector, a.setVector)
};
cc.Layer = cc.Node.extend({
    _isBaked: !1,
    _bakeSprite: null,
    _className: "Layer",
    ctor: function() {
        var a = cc.Node.prototype;
        a.ctor.call(this);
        this._ignoreAnchorPointForPosition = !0;
        a.setAnchorPoint.call(this, 0.5, 0.5);
        a.setContentSize.call(this, cc.winSize)
    },
    bake: null,
    unbake: null,
    isBaked: function() {
        return this._isBaked
    },
    visit: null
});
cc.Layer.create = function() {
    return new cc.Layer
};
if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
    var p = cc.Layer.prototype;
    p.bake = function() {
        if (!this._isBaked) {
            this._isBaked = this._cacheDirty = !0;
            this._cachedParent = this;
            for (var a = this._children, b = 0, c = a.length; b < c; b++) a[b]._setCachedParent(this);
            this._bakeSprite || (this._bakeSprite = new cc.BakeSprite)
        }
    };
    p.unbake = function() {
        if (this._isBaked) {
            this._isBaked = !1;
            this._cacheDirty = !0;
            this._cachedParent = null;
            for (var a = this._children, b = 0, c = a.length; b < c; b++) a[b]._setCachedParent(null)
        }
    };
    p.visit = function(a) {
        if (this._isBaked) {
            a =
                a || cc._renderContext;
            var b, c = this._children,
                d = c.length;
            if (this._visible && 0 !== d) {
                var e = this._bakeSprite;
                a.save();
                this.transform(a);
                if (this._cacheDirty) {
                    b = this._getBoundingBoxForBake();
                    b.width |= 0;
                    b.height |= 0;
                    var f = e.getCacheContext();
                    e.resetCanvasSize(b.width, b.height);
                    f.translate(0 - b.x, b.height + b.y);
                    var g = e.getAnchorPointInPoints();
                    e.setPosition(g.x + b.x, g.y + b.y);
                    this.sortAllChildren();
                    for (b = 0; b < d; b++) c[b].visit(f);
                    this._cacheDirty = !1
                }
                e.visit(a);
                this.arrivalOrder = 0;
                a.restore()
            }
        } else cc.Node.prototype.visit.call(this,
            a)
    };
    p._getBoundingBoxForBake = function() {
        var a = null;
        if (!this._children || 0 === this._children.length) return cc.rect(0, 0, 10, 10);
        for (var b = this._children, c = 0; c < b.length; c++) {
            var d = b[c];
            d && d._visible && (a ? (d = d._getBoundingBoxToCurrentNode()) && (a = cc.rectUnion(a, d)) : a = d._getBoundingBoxToCurrentNode())
        }
        return a
    };
    p = null
} else cc.assert("function" === typeof cc._tmp.LayerDefineForWebGL, cc._LogInfos.MissingFile, "CCLayerWebGL.js"), cc._tmp.LayerDefineForWebGL(), delete cc._tmp.LayerDefineForWebGL;
cc.LayerRGBA = cc.Layer.extend({
    RGBAProtocol: !0,
    _displayedOpacity: 255,
    _realOpacity: 255,
    _displayedColor: null,
    _realColor: null,
    _cascadeOpacityEnabled: !1,
    _cascadeColorEnabled: !1,
    _className: "LayerRGBA",
    ctor: function() {
        cc.Layer.prototype.ctor.call(this);
        this._displayedColor = cc.color(255, 255, 255, 255);
        this._realColor = cc.color(255, 255, 255, 255)
    },
    init: function() {
        var a = cc.Layer.prototype;
        this._ignoreAnchorPointForPosition = !0;
        a.setAnchorPoint.call(this, 0.5, 0.5);
        a.setContentSize.call(this, cc.winSize);
        this.cascadeColor =
            this.cascadeOpacity = !1;
        return !0
    },
    getOpacity: function() {
        return this._realOpacity
    },
    getDisplayedOpacity: function() {
        return this._displayedOpacity
    },
    setOpacity: function(a) {
        this._displayedOpacity = this._realOpacity = a;
        var b = 255,
            c = this._parent;
        c && (c.RGBAProtocol && c.cascadeOpacity) && (b = c.getDisplayedOpacity());
        this.updateDisplayedOpacity(b);
        this._displayedColor.a = this._realColor.a = a
    },
    updateDisplayedOpacity: function(a) {
        this._displayedOpacity = 0 | this._realOpacity * a / 255;
        if (this._cascadeOpacityEnabled) {
            a = this._children;
            for (var b, c = 0; c < a.length; c++)(b = a[c]) && b.RGBAProtocol && b.updateDisplayedOpacity(this._displayedOpacity)
        }
    },
    isCascadeOpacityEnabled: function() {
        return this._cascadeOpacityEnabled
    },
    setCascadeOpacityEnabled: function(a) {
        this._cascadeOpacityEnabled !== a && ((this._cascadeOpacityEnabled = a) ? this._enableCascadeOpacity() : this._disableCascadeOpacity())
    },
    _enableCascadeOpacity: function() {
        var a = 255,
            b = this._parent;
        b && (b.RGBAProtocol && b.cascadeOpacity) && (a = b.getDisplayedOpacity());
        this.updateDisplayedOpacity(a)
    },
    _disableCascadeOpacity: function() {
        this._displayedOpacity =
            this._realOpacity;
        for (var a = this._children, b, c = 0; c < a.length; c++)(b = a[c]) && b.RGBAProtocol && b.updateDisplayedOpacity(255)
    },
    getColor: function() {
        var a = this._realColor;
        return cc.color(a.r, a.g, a.b, a.a)
    },
    getDisplayedColor: function() {
        var a = this._displayedColor;
        return cc.color(a.r, a.g, a.b)
    },
    setColor: function(a) {
        var b = this._displayedColor,
            c = this._realColor;
        b.r = c.r = a.r;
        b.g = c.g = a.g;
        b.b = c.b = a.b;
        b = (b = this._parent) && b.RGBAProtocol && b.cascadeColor ? b.getDisplayedColor() : cc.color.WHITE;
        this.updateDisplayedColor(b);
        void 0 !== a.a && !a.a_undefined && this.setOpacity(a.a)
    },
    updateDisplayedColor: function(a) {
        var b = this._displayedColor,
            c = this._realColor;
        b.r = 0 | c.r * a.r / 255;
        b.g = 0 | c.g * a.g / 255;
        b.b = 0 | c.b * a.b / 255;
        if (this._cascadeColorEnabled) {
            a = this._children;
            for (var d = 0; d < a.length; d++)(c = a[d]) && c.RGBAProtocol && c.updateDisplayedColor(b)
        }
    },
    isCascadeColorEnabled: function() {
        return this._cascadeColorEnabled
    },
    setCascadeColorEnabled: function(a) {
        this._cascadeColorEnabled !== a && ((this._cascadeColorEnabled = a) ? this._enableCascadeColor() :
            this._disableCascadeColor())
    },
    _enableCascadeColor: function() {
        var a;
        a = (a = this._parent) && a.RGBAProtocol && a.cascadeColor ? a.getDisplayedColor() : cc.color.WHITE;
        this.updateDisplayedColor(a)
    },
    _disableCascadeColor: function() {
        var a = this._displayedColor,
            b = this._realColor;
        a.r = b.r;
        a.g = b.g;
        a.b = b.b;
        var a = this._children,
            b = cc.color.WHITE,
            c, d;
        for (d = 0; d < a.length; d++)(c = a[d]) && c.RGBAProtocol && c.updateDisplayedColor(b)
    },
    addChild: function(a, b, c) {
        cc.Node.prototype.addChild.call(this, a, b, c);
        this._cascadeColorEnabled && this._enableCascadeColor();
        this._cascadeOpacityEnabled && this._enableCascadeOpacity()
    },
    setOpacityModifyRGB: function(a) {},
    isOpacityModifyRGB: function() {
        return !1
    }
});
cc.assert("function" === typeof cc._tmp.PrototypeLayerRGBA, cc._LogInfos.MissingFile, "CCLayerPropertyDefine.js");
cc._tmp.PrototypeLayerRGBA();
delete cc._tmp.PrototypeLayerRGBA;
cc.LayerColor = cc.LayerRGBA.extend({
    _blendFunc: null,
    _className: "LayerColor",
    getBlendFunc: function() {
        return this._blendFunc
    },
    changeWidthAndHeight: function(a, b) {
        this.width = a;
        this.height = b
    },
    changeWidth: function(a) {
        this.width = a
    },
    changeHeight: function(a) {
        this.height = a
    },
    setOpacityModifyRGB: function(a) {},
    isOpacityModifyRGB: function() {
        return !1
    },
    setColor: function(a) {
        cc.LayerRGBA.prototype.setColor.call(this, a);
        this._updateColor()
    },
    setOpacity: function(a) {
        cc.LayerRGBA.prototype.setOpacity.call(this, a);
        this._updateColor()
    },
    _isLighterMode: !1,
    ctor: null,
    init: function(a, b, c) {
        cc._renderType !== cc._RENDER_TYPE_CANVAS && (this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR));
        var d = cc.director.getWinSize();
        a = a || cc.color(0, 0, 0, 255);
        b = void 0 === b ? d.width : b;
        c = void 0 === c ? d.height : c;
        d = this._displayedColor;
        d.r = a.r;
        d.g = a.g;
        d.b = a.b;
        d = this._realColor;
        d.r = a.r;
        d.g = a.g;
        d.b = a.b;
        this._realOpacity = this._displayedOpacity = a.a;
        a = cc.LayerColor.prototype;
        a.setContentSize.call(this, b, c);
        a._updateColor.call(this);
        return !0
    },
    setBlendFunc: function(a,
        b) {
        this._blendFunc = void 0 === b ? a : {
            src: a,
            dst: b
        };
        cc._renderType === cc._RENDER_TYPE_CANVAS && (this._isLighterMode = this._blendFunc && 1 == this._blendFunc.src && 771 == this._blendFunc.dst)
    },
    _setWidth: null,
    _setHeight: null,
    _updateColor: null,
    updateDisplayedColor: function(a) {
        cc.LayerRGBA.prototype.updateDisplayedColor.call(this, a);
        this._updateColor()
    },
    updateDisplayedOpacity: function(a) {
        cc.LayerRGBA.prototype.updateDisplayedOpacity.call(this, a);
        this._updateColor()
    },
    draw: null
});
cc.LayerColor.create = function(a, b, c) {
    return new cc.LayerColor(a, b, c)
};
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.LayerColor.prototype, _p.ctor = function(a, b, c) {
    cc.LayerRGBA.prototype.ctor.call(this);
    this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
    cc.LayerColor.prototype.init.call(this, a, b, c)
}, _p._setWidth = cc.LayerRGBA.prototype._setWidth, _p._setHeight = cc.LayerRGBA.prototype._setHeight, _p._updateColor = function() {}, _p.draw = function(a) {
    a = a || cc._renderContext;
    var b = cc.view,
        c = this._displayedColor;
    a.fillStyle = "rgba(" + (0 | c.r) + "," + (0 | c.g) + "," + (0 | c.b) + "," + this._displayedOpacity /
        255 + ")";
    a.fillRect(0, 0, this.width * b.getScaleX(), -this.height * b.getScaleY());
    cc.g_NumberOfDraws++
}, _p.visit = function(a) {
    if (this._isBaked) {
        a = a || cc._renderContext;
        var b, c = this._children,
            d = c.length;
        if (this._visible) {
            var e = this._bakeSprite;
            a.save();
            this.transform(a);
            if (this._cacheDirty) {
                b = this._getBoundingBoxForBake();
                b.width |= 0;
                b.height |= 0;
                var f = e.getCacheContext();
                e.resetCanvasSize(b.width, b.height);
                var g = e.getAnchorPointInPoints(),
                    h = this._position;
                if (this._ignoreAnchorPointForPosition) f.translate(0 -
                    b.x + h.x, b.height + b.y - h.y), e.setPosition(g.x + b.x - h.x, g.y + b.y - h.y);
                else {
                    var k = this.getAnchorPointInPoints(),
                        m = h.x - k.x,
                        h = h.y - k.y;
                    f.translate(0 - b.x + m, b.height + b.y - h);
                    e.setPosition(g.x + b.x - m, g.y + b.y - h)
                }
                if (0 < d) {
                    this.sortAllChildren();
                    for (b = 0; b < d; b++)
                        if (g = c[b], 0 > g._localZOrder) g.visit(f);
                        else break;
                    for (this.draw(f); b < d; b++) c[b].visit(f)
                } else this.draw(f);
                this._cacheDirty = !1
            }
            e.visit(a);
            this.arrivalOrder = 0;
            a.restore()
        }
    } else cc.Node.prototype.visit.call(this, a)
}, _p._getBoundingBoxForBake = function() {
    var a = cc.rect(0,
            0, this._contentSize.width, this._contentSize.height),
        b = this.nodeToWorldTransform(),
        a = cc.RectApplyAffineTransform(a, this.nodeToWorldTransform());
    if (!this._children || 0 === this._children.length) return a;
    for (var c = this._children, d = 0; d < c.length; d++) {
        var e = c[d];
        e && e._visible && (e = e._getBoundingBoxToCurrentNode(b), a = cc.rectUnion(a, e))
    }
    return a
}, _p = null) : (cc.assert("function" === typeof cc._tmp.WebGLLayerColor, cc._LogInfos.MissingFile, "CCLayerWebGL.js"), cc._tmp.WebGLLayerColor(), delete cc._tmp.WebGLLayerColor);
cc.assert("function" === typeof cc._tmp.PrototypeLayerColor, cc._LogInfos.MissingFile, "CCLayerPropertyDefine.js");
cc._tmp.PrototypeLayerColor();
delete cc._tmp.PrototypeLayerColor;
cc.LayerGradient = cc.LayerColor.extend({
    _startColor: null,
    _endColor: null,
    _startOpacity: 255,
    _endOpacity: 255,
    _alongVector: null,
    _compressedInterpolation: !1,
    _gradientStartPoint: null,
    _gradientEndPoint: null,
    _className: "LayerGradient",
    ctor: function(a, b, c) {
        cc.LayerColor.prototype.ctor.call(this);
        this._startColor = cc.color(0, 0, 0, 255);
        this._endColor = cc.color(0, 0, 0, 255);
        this._alongVector = cc.p(0, -1);
        this._endOpacity = this._startOpacity = 255;
        this._gradientStartPoint = cc.p(0, 0);
        this._gradientEndPoint = cc.p(0, 0);
        cc.LayerGradient.prototype.init.call(this,
            a, b, c)
    },
    init: function(a, b, c) {
        a = a || cc.color(0, 0, 0, 255);
        b = b || cc.color(0, 0, 0, 255);
        c = c || cc.p(0, -1);
        var d = this._startColor,
            e = this._endColor;
        d.r = a.r;
        d.g = a.g;
        d.b = a.b;
        this._startOpacity = a.a;
        e.r = b.r;
        e.g = b.g;
        e.b = b.b;
        this._endOpacity = b.a;
        this._alongVector = c;
        this._compressedInterpolation = !0;
        this._gradientStartPoint = cc.p(0, 0);
        this._gradientEndPoint = cc.p(0, 0);
        cc.LayerColor.prototype.init.call(this, cc.color(a.r, a.g, a.b, 255));
        cc.LayerGradient.prototype._updateColor.call(this);
        return !0
    },
    setContentSize: function(a,
        b) {
        cc.LayerColor.prototype.setContentSize.call(this, a, b);
        this._updateColor()
    },
    _setWidth: function(a) {
        cc.LayerColor.prototype._setWidth.call(this, a);
        this._updateColor()
    },
    _setHeight: function(a) {
        cc.LayerColor.prototype._setHeight.call(this, a);
        this._updateColor()
    },
    getStartColor: function() {
        return this._realColor
    },
    setStartColor: function(a) {
        this.color = a
    },
    setEndColor: function(a) {
        this._endColor = a;
        this._updateColor()
    },
    getEndColor: function() {
        return this._endColor
    },
    setStartOpacity: function(a) {
        this._startOpacity =
            a;
        this._updateColor()
    },
    getStartOpacity: function() {
        return this._startOpacity
    },
    setEndOpacity: function(a) {
        this._endOpacity = a;
        this._updateColor()
    },
    getEndOpacity: function() {
        return this._endOpacity
    },
    setVector: function(a) {
        this._alongVector.x = a.x;
        this._alongVector.y = a.y;
        this._updateColor()
    },
    getVector: function() {
        return cc.p(this._alongVector.x, this._alongVector.y)
    },
    isCompressedInterpolation: function() {
        return this._compressedInterpolation
    },
    setCompressedInterpolation: function(a) {
        this._compressedInterpolation =
            a;
        this._updateColor()
    },
    _draw: null,
    _updateColor: null
});
cc.LayerGradient.create = function(a, b, c) {
    return new cc.LayerGradient(a, b, c)
};
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.LayerGradient.prototype, _p.draw = function(a) {
    a = a || cc._renderContext;
    this._isLighterMode && (a.globalCompositeOperation = "lighter");
    a.save();
    var b = cc.view,
        c = this._displayedOpacity / 255,
        d = this.width * b.getScaleX(),
        b = this.height * b.getScaleY(),
        e = a.createLinearGradient(this._gradientStartPoint.x, this._gradientStartPoint.y, this._gradientEndPoint.x, this._gradientEndPoint.y),
        f = this._displayedColor,
        g = this._endColor;
    e.addColorStop(0, "rgba(" + Math.round(f.r) + "," + Math.round(f.g) +
        "," + Math.round(f.b) + "," + (c * (this._startOpacity / 255)).toFixed(4) + ")");
    e.addColorStop(1, "rgba(" + Math.round(g.r) + "," + Math.round(g.g) + "," + Math.round(g.b) + "," + (c * (this._endOpacity / 255)).toFixed(4) + ")");
    a.fillStyle = e;
    a.fillRect(0, 0, d, -b);
    0 != this._rotation && a.rotate(this._rotationRadians);
    a.restore()
}, _p._updateColor = function() {
    var a = this._alongVector,
        b = 0.5 * this.width,
        c = 0.5 * this.height;
    this._gradientStartPoint.x = b * -a.x + b;
    this._gradientStartPoint.y = c * a.y - c;
    this._gradientEndPoint.x = b * a.x + b;
    this._gradientEndPoint.y =
        c * -a.y - c
}, _p = null) : (cc.assert("function" === typeof cc._tmp.WebGLLayerGradient, cc._LogInfos.MissingFile, "CCLayerWebGL.js"), cc._tmp.WebGLLayerGradient(), delete cc._tmp.WebGLLayerGradient);
cc.assert("function" === typeof cc._tmp.PrototypeLayerGradient, cc._LogInfos.MissingFile, "CCLayerPropertyDefine.js");
cc._tmp.PrototypeLayerGradient();
delete cc._tmp.PrototypeLayerGradient;
cc.LayerMultiplex = cc.Layer.extend({
    _enabledLayer: 0,
    _layers: null,
    _className: "LayerMultiplex",
    ctor: function(a) {
        cc.Layer.prototype.ctor.call(this);
        a && cc.LayerMultiplex.prototype.initWithLayers.call(this, a)
    },
    initWithLayers: function(a) {
        0 < a.length && null == a[a.length - 1] && cc.log(cc._LogInfos.LayerMultiplex_initWithLayers);
        this._layers = a;
        this._enabledLayer = 0;
        this.addChild(this._layers[this._enabledLayer]);
        return !0
    },
    switchTo: function(a) {
        a >= this._layers.length ? cc.log(cc._LogInfos.LayerMultiplex_switchTo) : (this.removeChild(this._layers[this._enabledLayer], !0), this._enabledLayer = a, this.addChild(this._layers[a]))
    },
    switchToAndReleaseMe: function(a) {
        a >= this._layers.length ? cc.log(cc._LogInfos.LayerMultiplex_switchToAndReleaseMe) : (this.removeChild(this._layers[this._enabledLayer], !0), this._layers[this._enabledLayer] = null, this._enabledLayer = a, this.addChild(this._layers[a]))
    },
    addLayer: function(a) {
        a ? this._layers.push(a) : cc.log(cc._LogInfos.LayerMultiplex_addLayer)
    }
});
cc.LayerMultiplex.create = function() {
    return new cc.LayerMultiplex(arguments)
};
cc._tmp.PrototypeSprite = function() {
    var a = cc.Sprite.prototype;
    cc.defineGetterSetter(a, "opacityModifyRGB", a.isOpacityModifyRGB, a.setOpacityModifyRGB);
    cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity);
    cc.defineGetterSetter(a, "color", a.getColor, a.setColor);
    cc.defineGetterSetter(a, "flippedX", a.isFlippedX, a.setFlippedX);
    cc.defineGetterSetter(a, "flippedY", a.isFlippedY, a.setFlippedY);
    cc.defineGetterSetter(a, "offsetX", a._getOffsetX);
    cc.defineGetterSetter(a, "offsetY", a._getOffsetY);
    cc.defineGetterSetter(a,
        "texture", a.getTexture, a.setTexture);
    cc.defineGetterSetter(a, "textureRectRotated", a.isTextureRectRotated);
    cc.defineGetterSetter(a, "batchNode", a.getBatchNode, a.setBatchNode);
    cc.defineGetterSetter(a, "quad", a.getQuad)
};
cc.generateTextureCacheForColor = function(a) {
    function b() {
        var b = cc.generateTextureCacheForColor,
            d = a.width,
            g = a.height;
        c[0].width = d;
        c[0].height = g;
        c[1].width = d;
        c[1].height = g;
        c[2].width = d;
        c[2].height = g;
        c[3].width = d;
        c[3].height = g;
        b.canvas.width = d;
        b.canvas.height = g;
        var h = b.canvas.getContext("2d");
        h.drawImage(a, 0, 0);
        b.tempCanvas.width = d;
        b.tempCanvas.height = g;
        for (var h = h.getImageData(0, 0, d, g).data, k = 0; 4 > k; k++) {
            var m = c[k].getContext("2d");
            m.getImageData(0, 0, d, g).data;
            b.tempCtx.drawImage(a, 0, 0);
            for (var n = b.tempCtx.getImageData(0,
                    0, d, g), q = n.data, s = 0; s < h.length; s += 4) q[s] = 0 === k ? h[s] : 0, q[s + 1] = 1 === k ? h[s + 1] : 0, q[s + 2] = 2 === k ? h[s + 2] : 0, q[s + 3] = h[s + 3];
            m.putImageData(n, 0, 0)
        }
        a.onload = null
    }
    if (a.channelCache) return a.channelCache;
    var c = [cc.newElement("canvas"), cc.newElement("canvas"), cc.newElement("canvas"), cc.newElement("canvas")];
    try {
        b()
    } catch (d) {
        a.onload = b
    }
    return a.channelCache = c
};
cc.generateTextureCacheForColor.canvas = cc.newElement("canvas");
cc.generateTextureCacheForColor.tempCanvas = cc.newElement("canvas");
cc.generateTextureCacheForColor.tempCtx = cc.generateTextureCacheForColor.tempCanvas.getContext("2d");
cc.generateTintImage2 = function(a, b, c) {
    c || (c = cc.rect(0, 0, a.width, a.height), c = cc.rectPixelsToPoints(c));
    var d = cc.newElement("canvas"),
        e = d.getContext("2d");
    d.width != c.width && (d.width = c.width);
    d.height != c.height && (d.height = c.height);
    e.save();
    e.drawImage(a, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height);
    e.globalCompositeOperation = "source-in";
    e.globalAlpha = b.a / 255;
    e.fillStyle = "rgb(" + b.r + "," + b.g + "," + b.b + ")";
    e.fillRect(0, 0, c.width, c.height);
    e.restore();
    return d
};
cc.generateTintImage = function(a, b, c, d, e) {
    d || (d = cc.rect(0, 0, a.width, a.height));
    a = c.r / 255;
    var f = c.g / 255;
    c = c.b / 255;
    var g = Math.min(d.width, b[0].width),
        h = Math.min(d.height, b[0].height),
        k;
    e ? (k = e.getContext("2d"), k.clearRect(0, 0, g, h)) : (e = cc.newElement("canvas"), e.width = g, e.height = h, k = e.getContext("2d"));
    k.save();
    k.globalCompositeOperation = "lighter";
    var m = k.globalAlpha;
    0 < a && (k.globalAlpha = a * m, k.drawImage(b[0], d.x, d.y, g, h, 0, 0, g, h));
    0 < f && (k.globalAlpha = f * m, k.drawImage(b[1], d.x, d.y, g, h, 0, 0, g, h));
    0 < c && (k.globalAlpha =
        c * m, k.drawImage(b[2], d.x, d.y, g, h, 0, 0, g, h));
    1 > a + f + c && (k.globalAlpha = m, k.drawImage(b[3], d.x, d.y, g, h, 0, 0, g, h));
    k.restore();
    return e
};
cc.cutRotateImageToCanvas = function(a, b) {
    if (!a) return null;
    if (!b) return a;
    var c = cc.newElement("canvas");
    c.width = b.width;
    c.height = b.height;
    var d = c.getContext("2d");
    d.translate(c.width / 2, c.height / 2);
    d.rotate(-1.5707963267948966);
    d.drawImage(a, b.x, b.y, b.height, b.width, -b.height / 2, -b.width / 2, b.height, b.width);
    return c
};
cc.Sprite = cc.NodeRGBA.extend({
    RGBAProtocol: !0,
    dirty: !1,
    atlasIndex: 0,
    textureAtlas: null,
    _batchNode: null,
    _recursiveDirty: null,
    _hasChildren: null,
    _shouldBeHidden: !1,
    _transformToBatch: null,
    _blendFunc: null,
    _texture: null,
    _rect: null,
    _rectRotated: !1,
    _offsetPosition: null,
    _unflippedOffsetPositionFromCenter: null,
    _opacityModifyRGB: !1,
    _flippedX: !1,
    _flippedY: !1,
    _textureLoaded: !1,
    _loadedEventListeners: null,
    _newTextureWhenChangeColor: null,
    _className: "Sprite",
    textureLoaded: function() {
        return this._textureLoaded
    },
    addLoadedEventListener: function(a,
        b) {
        this._loadedEventListeners || (this._loadedEventListeners = []);
        this._loadedEventListeners.push({
            eventCallback: a,
            eventTarget: b
        })
    },
    _callLoadedEventCallbacks: function() {
        if (this._loadedEventListeners) {
            for (var a = this._loadedEventListeners, b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                d.eventCallback.call(d.eventTarget, this)
            }
            a.length = 0
        }
    },
    isDirty: function() {
        return this.dirty
    },
    setDirty: function(a) {
        this.dirty = a
    },
    isTextureRectRotated: function() {
        return this._rectRotated
    },
    getAtlasIndex: function() {
        return this.atlasIndex
    },
    setAtlasIndex: function(a) {
        this.atlasIndex = a
    },
    getTextureRect: function() {
        return cc.rect(this._rect.x, this._rect.y, this._rect.width, this._rect.height)
    },
    getTextureAtlas: function() {
        return this.textureAtlas
    },
    setTextureAtlas: function(a) {
        this.textureAtlas = a
    },
    getOffsetPosition: function() {
        return this._offsetPosition
    },
    _getOffsetX: function() {
        return this._offsetPosition.x
    },
    _getOffsetY: function() {
        return this._offsetPosition.y
    },
    getBlendFunc: function() {
        return this._blendFunc
    },
    initWithSpriteFrame: function(a) {
        cc.assert(a,
            cc._LogInfos.Sprite_initWithSpriteFrame);
        a.textureLoaded() || (this._textureLoaded = !1, a.addLoadedEventListener(this._spriteFrameLoadedCallback, this));
        var b = cc._renderType === cc._RENDER_TYPE_CANVAS ? !1 : a._rotated,
            b = this.initWithTexture(a.getTexture(), a.getRect(), b);
        this.setSpriteFrame(a);
        return b
    },
    _spriteFrameLoadedCallback: null,
    initWithSpriteFrameName: function(a) {
        cc.assert(a, cc._LogInfos.Sprite_initWithSpriteFrameName);
        var b = cc.spriteFrameCache.getSpriteFrame(a);
        cc.assert(b, a + cc._LogInfos.Sprite_initWithSpriteFrameName1);
        return this.initWithSpriteFrame(b)
    },
    useBatchNode: function(a) {
        this.textureAtlas = a.textureAtlas;
        this._batchNode = a
    },
    setVertexRect: function(a) {
        this._rect.x = a.x;
        this._rect.y = a.y;
        this._rect.width = a.width;
        this._rect.height = a.height
    },
    sortAllChildren: function() {
        if (this._reorderChildDirty) {
            var a = this._children,
                b = a.length,
                c, d, e;
            for (c = 1; c < b; c++) {
                e = a[c];
                for (d = c - 1; 0 <= d;) {
                    if (e._localZOrder < a[d]._localZOrder) a[d + 1] = a[d];
                    else if (e._localZOrder === a[d]._localZOrder && e.arrivalOrder < a[d].arrivalOrder) a[d + 1] = a[d];
                    else break;
                    d--
                }
                a[d + 1] = e
            }
            this._batchNode && this._arrayMakeObjectsPerformSelector(a, cc.Node.StateCallbackType.sortAllChildren);
            this._reorderChildDirty = !1
        }
    },
    reorderChild: function(a, b) {
        cc.assert(a, cc._LogInfos.Sprite_reorderChild_2); - 1 === this._children.indexOf(a) ? cc.log(cc._LogInfos.Sprite_reorderChild) : b !== a.zIndex && (this._batchNode && !this._reorderChildDirty && (this._setReorderChildDirtyRecursively(), this._batchNode.reorderBatch(!0)), cc.Node.prototype.reorderChild.call(this, a, b))
    },
    removeChild: function(a, b) {
        this._batchNode &&
            this._batchNode.removeSpriteFromAtlas(a);
        cc.Node.prototype.removeChild.call(this, a, b)
    },
    removeAllChildren: function(a) {
        var b = this._children,
            c = this._batchNode;
        if (c && null != b)
            for (var d = 0, e = b.length; d < e; d++) c.removeSpriteFromAtlas(b[d]);
        cc.Node.prototype.removeAllChildren.call(this, a);
        this._hasChildren = !1
    },
    setDirtyRecursively: function(a) {
        this.dirty = this._recursiveDirty = a;
        a = this._children;
        for (var b, c = a ? a.length : 0, d = 0; d < c; d++) b = a[d], b instanceof cc.Sprite && b.setDirtyRecursively(!0)
    },
    setNodeDirty: function(a) {
        cc.Node.prototype.setNodeDirty.call(this);
        !a && (this._batchNode && !this._recursiveDirty) && (this._hasChildren ? this.setDirtyRecursively(!0) : this.dirty = this._recursiveDirty = !0)
    },
    ignoreAnchorPointForPosition: function(a) {
        this._batchNode ? cc.log(cc._LogInfos.Sprite_ignoreAnchorPointForPosition) : cc.Node.prototype.ignoreAnchorPointForPosition.call(this, a)
    },
    setFlippedX: function(a) {
        this._flippedX != a && (this._flippedX = a, this.setTextureRect(this._rect, this._rectRotated, this._contentSize), this.setNodeDirty(!0))
    },
    setFlippedY: function(a) {
        this._flippedY != a &&
            (this._flippedY = a, this.setTextureRect(this._rect, this._rectRotated, this._contentSize), this.setNodeDirty(!0))
    },
    isFlippedX: function() {
        return this._flippedX
    },
    isFlippedY: function() {
        return this._flippedY
    },
    setOpacityModifyRGB: null,
    isOpacityModifyRGB: function() {
        return this._opacityModifyRGB
    },
    updateDisplayedOpacity: null,
    setDisplayFrameWithAnimationName: function(a, b) {
        cc.assert(a, cc._LogInfos.Sprite_setDisplayFrameWithAnimationName_3);
        var c = cc.animationCache.getAnimation(a);
        c ? (c = c.getFrames()[b]) ? this.setSpriteFrame(c.getSpriteFrame()) :
            cc.log(cc._LogInfos.Sprite_setDisplayFrameWithAnimationName_2) : cc.log(cc._LogInfos.Sprite_setDisplayFrameWithAnimationName)
    },
    getBatchNode: function() {
        return this._batchNode
    },
    _setReorderChildDirtyRecursively: function() {
        if (!this._reorderChildDirty) {
            this._reorderChildDirty = !0;
            for (var a = this._parent; a && a != this._batchNode;) a._setReorderChildDirtyRecursively(), a = a.parent
        }
    },
    getTexture: function() {
        return this._texture
    },
    _quad: null,
    _quadWebBuffer: null,
    _quadDirty: !1,
    _colorized: !1,
    _isLighterMode: !1,
    _originalTexture: null,
    _textureRect_Canvas: null,
    _drawSize_Canvas: null,
    ctor: null,
    _softInit: function(a, b, c) {
        if (void 0 === a) cc.Sprite.prototype.init.call(this);
        else if ("string" === typeof a) "#" === a[0] ? (a = a.substr(1, a.length - 1), a = cc.spriteFrameCache.getSpriteFrame(a), this.initWithSpriteFrame(a)) : cc.Sprite.prototype.init.call(this, a, b);
        else if ("object" === typeof a)
            if (a instanceof cc.Texture2D) this.initWithTexture(a, b, c);
            else if (a instanceof cc.SpriteFrame) this.initWithSpriteFrame(a);
        else if (a instanceof HTMLImageElement || a instanceof HTMLCanvasElement) b = new cc.Texture2D, b.initWithElement(a), b.handleLoadedTexture(), this.initWithTexture(b)
    },
    getQuad: function() {
        return this._quad
    },
    setBlendFunc: null,
    init: null,
    initWithFile: function(a, b) {
        cc.assert(a, cc._LogInfos.Sprite_initWithFile);
        var c = cc.textureCache.textureForKey(a);
        if (c) {
            if (!b) {
                var d = c.getContentSize();
                b = cc.rect(0, 0, d.width, d.height)
            }
            return this.initWithTexture(c, b)
        }
        c = cc.textureCache.addImage(a);
        return this.initWithTexture(c, b || cc.rect(0, 0, c._contentSize.width, c._contentSize.height))
    },
    initWithTexture: null,
    _textureLoadedCallback: null,
    setTextureRect: null,
    updateTransform: null,
    addChild: null,
    updateColor: function() {
        var a = this._displayedColor,
            b = this._displayedOpacity,
            a = {
                r: a.r,
                g: a.g,
                b: a.b,
                a: b
            };
        this._opacityModifyRGB && (a.r *= b / 255, a.g *= b / 255, a.b *= b / 255);
        b = this._quad;
        b.bl.colors = a;
        b.br.colors = a;
        b.tl.colors = a;
        b.tr.colors = a;
        this._batchNode && (this.atlasIndex != cc.Sprite.INDEX_NOT_INITIALIZED ? this.textureAtlas.updateQuad(b, this.atlasIndex) : this.dirty = !0);
        this._quadDirty = !0
    },
    setOpacity: null,
    setColor: null,
    updateDisplayedColor: null,
    setSpriteFrame: null,
    setDisplayFrame: function(a) {
        cc.log(cc._LogInfos.Sprite_setDisplayFrame);
        this.setSpriteFrame(a)
    },
    isFrameDisplayed: null,
    displayFrame: function() {
        return cc.SpriteFrame.create(this._texture, cc.rectPointsToPixels(this._rect), this._rectRotated, cc.pointPointsToPixels(this._unflippedOffsetPositionFromCenter), cc.sizePointsToPixels(this._contentSize))
    },
    setBatchNode: null,
    setTexture: null,
    _updateBlendFunc: function() {
        this._batchNode ? cc.log(cc._LogInfos.Sprite__updateBlendFunc) :
            !this._texture || !this._texture.hasPremultipliedAlpha() ? (this._blendFunc.src = cc.SRC_ALPHA, this._blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA, this.opacityModifyRGB = !1) : (this._blendFunc.src = cc.BLEND_SRC, this._blendFunc.dst = cc.BLEND_DST, this.opacityModifyRGB = !0)
    },
    _changeTextureColor: function() {
        var a, b = this._texture,
            c = this._textureRect_Canvas;
        if (b && (c.validRect && this._originalTexture) && (a = b.getHtmlElementObj()))
            if (b = cc.textureCache.getTextureColors(this._originalTexture.getHtmlElementObj())) this._colorized = !0,
                a instanceof HTMLCanvasElement && !this._rectRotated && !this._newTextureWhenChangeColor ? cc.generateTintImage(a, b, this._displayedColor, c, a) : (a = cc.generateTintImage(a, b, this._displayedColor, c), b = new cc.Texture2D, b.initWithElement(a), b.handleLoadedTexture(), this.texture = b)
    },
    _setTextureCoords: function(a) {
        a = cc.rectPointsToPixels(a);
        var b = this._batchNode ? this.textureAtlas.texture : this._texture;
        if (b) {
            var c = b.pixelsWidth,
                d = b.pixelsHeight,
                e, f = this._quad;
            this._rectRotated ? (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL ?
                (b = (2 * a.x + 1) / (2 * c), c = b + (2 * a.height - 2) / (2 * c), e = (2 * a.y + 1) / (2 * d), a = e + (2 * a.width - 2) / (2 * d)) : (b = a.x / c, c = (a.x + a.height) / c, e = a.y / d, a = (a.y + a.width) / d), this._flippedX && (d = e, e = a, a = d), this._flippedY && (d = b, b = c, c = d), f.bl.texCoords.u = b, f.bl.texCoords.v = e, f.br.texCoords.u = b, f.br.texCoords.v = a, f.tl.texCoords.u = c, f.tl.texCoords.v = e, f.tr.texCoords.u = c, f.tr.texCoords.v = a) : (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? (b = (2 * a.x + 1) / (2 * c), c = b + (2 * a.width - 2) / (2 * c), e = (2 * a.y + 1) / (2 * d), a = e + (2 * a.height - 2) / (2 * d)) : (b = a.x / c, c = (a.x + a.width) /
                c, e = a.y / d, a = (a.y + a.height) / d), this._flippedX && (d = b, b = c, c = d), this._flippedY && (d = e, e = a, a = d), f.bl.texCoords.u = b, f.bl.texCoords.v = a, f.br.texCoords.u = c, f.br.texCoords.v = a, f.tl.texCoords.u = b, f.tl.texCoords.v = e, f.tr.texCoords.u = c, f.tr.texCoords.v = e);
            this._quadDirty = !0
        }
    },
    draw: null
});
cc.Sprite.create = function(a, b, c) {
    return new cc.Sprite(a, b, c)
};
cc.Sprite.INDEX_NOT_INITIALIZED = -1;
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.Sprite.prototype, _p._spriteFrameLoadedCallback = function(a) {
    this.setNodeDirty(!0);
    this.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize());
    a = this.color;
    (255 !== a.r || 255 !== a.g || 255 !== a.b) && this._changeTextureColor();
    this._callLoadedEventCallbacks()
}, _p.setOpacityModifyRGB = function(a) {
    this._opacityModifyRGB !== a && (this._opacityModifyRGB = a, this.setNodeDirty(!0))
}, _p.updateDisplayedOpacity = function(a) {
    cc.NodeRGBA.prototype.updateDisplayedOpacity.call(this,
        a);
    this._setNodeDirtyForCache()
}, _p.ctor = function(a, b, c) {
    cc.NodeRGBA.prototype.ctor.call(this);
    this._shouldBeHidden = !1;
    this._offsetPosition = cc.p(0, 0);
    this._unflippedOffsetPositionFromCenter = cc.p(0, 0);
    this._blendFunc = {
        src: cc.BLEND_SRC,
        dst: cc.BLEND_DST
    };
    this._rect = cc.rect(0, 0, 0, 0);
    this._newTextureWhenChangeColor = !1;
    this._textureLoaded = !0;
    this._textureRect_Canvas = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        validRect: !1
    };
    this._drawSize_Canvas = cc.size(0, 0);
    this._softInit(a, b, c)
}, _p.setBlendFunc = function(a, b) {
    var c = this._blendFunc;
    void 0 === b ? (c.src = a.src, c.dst = a.dst) : (c.src = a, c.dst = b);
    this._isLighterMode = c && (c.src == cc.SRC_ALPHA && c.dst == cc.ONE || c.src == cc.ONE && c.dst == cc.ONE)
}, _p.init = function() {
    if (0 < arguments.length) return this.initWithFile(arguments[0], arguments[1]);
    cc.NodeRGBA.prototype.init.call(this);
    this.dirty = this._recursiveDirty = !1;
    this._opacityModifyRGB = !0;
    this._blendFunc.src = cc.BLEND_SRC;
    this._blendFunc.dst = cc.BLEND_DST;
    this.texture = null;
    this._textureLoaded = !0;
    this._flippedX = this._flippedY = !1;
    this.anchorY = this.anchorX =
        0.5;
    this._offsetPosition.x = 0;
    this._offsetPosition.y = 0;
    this._hasChildren = !1;
    this.setTextureRect(cc.rect(0, 0, 0, 0), !1, cc.size(0, 0));
    return !0
}, _p.initWithTexture = function(a, b, c) {
    cc.assert(0 != arguments.length, cc._LogInfos.CCSpriteBatchNode_initWithTexture);
    if ((c = c || !1) && a.isLoaded()) {
        var d = a.getHtmlElementObj(),
            d = cc.cutRotateImageToCanvas(d, b),
            e = new cc.Texture2D;
        e.initWithElement(d);
        e.handleLoadedTexture();
        a = e;
        this._rect = cc.rect(0, 0, b.width, b.height)
    }
    if (!cc.NodeRGBA.prototype.init.call(this)) return !1;
    this._batchNode = null;
    this.dirty = this._recursiveDirty = !1;
    this._opacityModifyRGB = !0;
    this._blendFunc.src = cc.BLEND_SRC;
    this._blendFunc.dst = cc.BLEND_DST;
    this._flippedX = this._flippedY = !1;
    this.anchorY = this.anchorX = 0.5;
    this._offsetPosition.x = 0;
    this._offsetPosition.y = 0;
    this._hasChildren = !1;
    this._textureLoaded = d = a.isLoaded();
    if (!d) return this._rectRotated = c, b && (this._rect.x = b.x, this._rect.y = b.y, this._rect.width = b.width, this._rect.height = b.height), a.addLoadedEventListener(this._textureLoadedCallback, this), !0;
    b || (b = cc.rect(0, 0, a.width, a.height));
    a && (d = b.y + b.height, b.x + b.width > a.width && cc.error(cc._LogInfos.RectWidth, a.url), d > a.height && cc.error(cc._LogInfos.RectHeight, a.url));
    this.texture = this._originalTexture = a;
    this.setTextureRect(b, c);
    this.batchNode = null;
    return !0
}, _p._textureLoadedCallback = function(a) {
    if (!this._textureLoaded) {
        this._textureLoaded = !0;
        var b = this._rect;
        b ? cc._rectEqualToZero(b) && (b.width = a.width, b.height = a.height) : b = cc.rect(0, 0, a.width, a.height);
        this.texture = this._originalTexture = a;
        this.setTextureRect(b,
            this._rectRotated);
        this.batchNode = this._batchNode;
        this._callLoadedEventCallbacks()
    }
}, _p.setTextureRect = function(a, b, c) {
    this._rectRotated = b || !1;
    this.setContentSize(c || a);
    this.setVertexRect(a);
    b = this._textureRect_Canvas;
    c = cc.contentScaleFactor();
    b.x = 0 | a.x * c;
    b.y = 0 | a.y * c;
    b.width = 0 | a.width * c;
    b.height = 0 | a.height * c;
    b.validRect = !(0 === b.width || 0 === b.height || 0 > b.x || 0 > b.y);
    a = this._unflippedOffsetPositionFromCenter;
    this._flippedX && (a.x = -a.x);
    this._flippedY && (a.y = -a.y);
    this._offsetPosition.x = a.x + (this._contentSize.width -
        this._rect.width) / 2;
    this._offsetPosition.y = a.y + (this._contentSize.height - this._rect.height) / 2;
    this._batchNode && (this.dirty = !0)
}, _p.updateTransform = function() {
    if (this.dirty) {
        var a = this._parent;
        !this._visible || a && a != this._batchNode && a._shouldBeHidden ? this._shouldBeHidden = !0 : (this._shouldBeHidden = !1, this._transformToBatch = !a || a == this._batchNode ? this.nodeToParentTransform() : cc.AffineTransformConcat(this.nodeToParentTransform(), a._transformToBatch));
        this.dirty = this._recursiveDirty = !1
    }
    this._hasChildren &&
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.updateTransform)
}, _p.addChild = function(a, b, c) {
    cc.assert(a, cc._LogInfos.CCSpriteBatchNode_addChild_2);
    null == b && (b = a._localZOrder);
    null == c && (c = a.tag);
    cc.NodeRGBA.prototype.addChild.call(this, a, b, c);
    this._hasChildren = !0
}, _p.setOpacity = function(a) {
    cc.NodeRGBA.prototype.setOpacity.call(this, a);
    this._setNodeDirtyForCache()
}, _p.setColor = function(a) {
    var b = this.color;
    b.r === a.r && b.g === a.g && b.b === a.b || (cc.NodeRGBA.prototype.setColor.call(this,
        a), this._changeTextureColor(), this._setNodeDirtyForCache())
}, _p.updateDisplayedColor = function(a) {
    var b = this.color;
    cc.NodeRGBA.prototype.updateDisplayedColor.call(this, a);
    a = this._displayedColor;
    b.r === a.r && b.g === a.g && b.b === a.b || (this._changeTextureColor(), this._setNodeDirtyForCache())
}, _p.setSpriteFrame = function(a) {
    var b = this;
    "string" == typeof a && (a = cc.spriteFrameCache.getSpriteFrame(a), cc.assert(a, cc._LogInfos.CCSpriteBatchNode_setSpriteFrame));
    b.setNodeDirty(!0);
    var c = a.getOffset();
    b._unflippedOffsetPositionFromCenter.x =
        c.x;
    b._unflippedOffsetPositionFromCenter.y = c.y;
    b._rectRotated = a.isRotated();
    var c = a.getTexture(),
        d = a.textureLoaded();
    d || (b._textureLoaded = !1, a.addLoadedEventListener(function(a) {
        b._textureLoaded = !0;
        var c = a.getTexture();
        c != b._texture && (b.texture = c);
        b.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize());
        b._callLoadedEventCallbacks()
    }, b));
    c != b._texture && (b.texture = c);
    b._rectRotated && (b._originalTexture = c);
    b.setTextureRect(a.getRect(), b._rectRotated, a.getOriginalSize());
    b._colorized = !1;
    d && (a =
        b.color, (255 !== a.r || 255 !== a.g || 255 !== a.b) && b._changeTextureColor())
}, _p.isFrameDisplayed = function(a) {
    return a.getTexture() != this._texture ? !1 : cc.rectEqualToRect(a.getRect(), this._rect)
}, _p.setBatchNode = function(a) {
    (this._batchNode = a) ? (this._transformToBatch = cc.AffineTransformIdentity(), this.textureAtlas = this._batchNode.textureAtlas) : (this.atlasIndex = cc.Sprite.INDEX_NOT_INITIALIZED, this.textureAtlas = null, this.dirty = this._recursiveDirty = !1)
}, _p.setTexture = function(a) {
    a && "string" === typeof a ? (a = cc.textureCache.addImage(a),
        this.setTexture(a), a = a.getContentSize(), this.setTextureRect(cc.rect(0, 0, a.width, a.height))) : (cc.assert(!a || a instanceof cc.Texture2D, cc._LogInfos.CCSpriteBatchNode_setTexture), this._texture != a && (a && a.getHtmlElementObj() instanceof HTMLImageElement && (this._originalTexture = a), this._texture = a))
}, _p.draw = function(a) {
    if (this._textureLoaded) {
        a = a || cc._renderContext;
        this._isLighterMode && (a.globalCompositeOperation = "lighter");
        var b = cc.view.getScaleX(),
            c = cc.view.getScaleY();
        a.globalAlpha = this._displayedOpacity /
            255;
        var d = this._rect,
            e = this._contentSize,
            f = this._offsetPosition,
            g = this._drawSize_Canvas,
            h = 0 | f.x,
            k = -f.y - d.height,
            m = this._textureRect_Canvas;
        g.width = d.width * b;
        g.height = d.height * c;
        if (this._flippedX || this._flippedY) a.save(), this._flippedX && (h = -f.x - d.width, a.scale(-1, 1)), this._flippedY && (k = f.y, a.scale(1, -1));
        h *= b;
        k *= c;
        this._texture && m.validRect ? (e = this._texture.getHtmlElementObj(), this._colorized ? a.drawImage(e, 0, 0, m.width, m.height, h, k, g.width, g.height) : a.drawImage(e, m.x, m.y, m.width, m.height, h, k, g.width,
            g.height)) : !this._texture && m.validRect && (g = this.color, a.fillStyle = "rgba(" + g.r + "," + g.g + "," + g.b + ",1)", a.fillRect(h, k, e.width * b, e.height * c));
        1 === cc.SPRITE_DEBUG_DRAW || this._showNode ? (a.strokeStyle = "rgba(0,255,0,1)", h /= b, k = -(k / c), h = [cc.p(h, k), cc.p(h + d.width, k), cc.p(h + d.width, k - d.height), cc.p(h, k - d.height)], cc._drawingUtil.drawPoly(h, 4, !0)) : 2 === cc.SPRITE_DEBUG_DRAW && (a.strokeStyle = "rgba(0,255,0,1)", b = this._rect, k = -k, h = [cc.p(h, k), cc.p(h + b.width, k), cc.p(h + b.width, k - b.height), cc.p(h, k - b.height)], cc._drawingUtil.drawPoly(h,
            4, !0));
        (this._flippedX || this._flippedY) && a.restore();
        cc.g_NumberOfDraws++
    }
}, delete _p) : (cc.assert("function" === typeof cc._tmp.WebGLSprite, cc._LogInfos.MissingFile, "SpritesWebGL.js"), cc._tmp.WebGLSprite(), delete cc._tmp.WebGLSprite);
cc.assert("function" === typeof cc._tmp.PrototypeSprite, cc._LogInfos.MissingFile, "SpritesPropertyDefine.js");
cc._tmp.PrototypeSprite();
delete cc._tmp.PrototypeSprite;
cc.AnimationFrame = cc.Class.extend({
    _spriteFrame: null,
    _delayPerUnit: 0,
    _userInfo: null,
    ctor: function(a, b, c) {
        this._spriteFrame = a || null;
        this._delayPerUnit = b || 0;
        this._userInfo = c || null
    },
    clone: function() {
        var a = new cc.AnimationFrame;
        a.initWithSpriteFrame(this._spriteFrame.clone(), this._delayPerUnit, this._userInfo);
        return a
    },
    copyWithZone: function(a) {
        return cc.clone(this)
    },
    copy: function(a) {
        a = new cc.AnimationFrame;
        a.initWithSpriteFrame(this._spriteFrame.clone(), this._delayPerUnit, this._userInfo);
        return a
    },
    initWithSpriteFrame: function(a,
        b, c) {
        this._spriteFrame = a;
        this._delayPerUnit = b;
        this._userInfo = c;
        return !0
    },
    getSpriteFrame: function() {
        return this._spriteFrame
    },
    setSpriteFrame: function(a) {
        this._spriteFrame = a
    },
    getDelayUnits: function() {
        return this._delayPerUnit
    },
    setDelayUnits: function(a) {
        this._delayPerUnit = a
    },
    getUserInfo: function() {
        return this._userInfo
    },
    setUserInfo: function(a) {
        this._userInfo = a
    }
});
cc.AnimationFrame.create = function(a, b, c) {
    return new cc.AnimationFrame(a, b, c)
};
cc.Animation = cc.Class.extend({
    _frames: null,
    _loops: 0,
    _restoreOriginalFrame: !1,
    _duration: 0,
    _delayPerUnit: 0,
    _totalDelayUnits: 0,
    ctor: function(a, b, c) {
        this._frames = [];
        if (void 0 === a) this.initWithSpriteFrames(null, 0);
        else {
            var d = a[0];
            d && (d instanceof cc.SpriteFrame ? this.initWithSpriteFrames(a, b, c) : d instanceof cc.AnimationFrame && this.initWithAnimationFrames(a, b, c))
        }
    },
    getFrames: function() {
        return this._frames
    },
    setFrames: function(a) {
        this._frames = a
    },
    addSpriteFrame: function(a) {
        var b = new cc.AnimationFrame;
        b.initWithSpriteFrame(a,
            1, null);
        this._frames.push(b);
        this._totalDelayUnits++
    },
    addSpriteFrameWithFile: function(a) {
        a = cc.textureCache.addImage(a);
        var b = cc.rect(0, 0, 0, 0);
        b.width = a.width;
        b.height = a.height;
        a = cc.SpriteFrame.create(a, b);
        this.addSpriteFrame(a)
    },
    addSpriteFrameWithTexture: function(a, b) {
        var c = cc.SpriteFrame.create(a, b);
        this.addSpriteFrame(c)
    },
    initWithAnimationFrames: function(a, b, c) {
        cc.arrayVerifyType(a, cc.AnimationFrame);
        this._delayPerUnit = b;
        this._loops = void 0 === c ? 1 : c;
        this._totalDelayUnits = 0;
        b = this._frames;
        for (c = b.length =
            0; c < a.length; c++) {
            var d = a[c];
            b.push(d);
            this._totalDelayUnits += d.getDelayUnits()
        }
        return !0
    },
    clone: function() {
        var a = new cc.Animation;
        a.initWithAnimationFrames(this._copyFrames(), this._delayPerUnit, this._loops);
        a.setRestoreOriginalFrame(this._restoreOriginalFrame);
        return a
    },
    copyWithZone: function(a) {
        a = new cc.Animation;
        a.initWithAnimationFrames(this._copyFrames(), this._delayPerUnit, this._loops);
        a.setRestoreOriginalFrame(this._restoreOriginalFrame);
        return a
    },
    _copyFrames: function() {
        for (var a = [], b = 0; b < this._frames.length; b++) a.push(this._frames[b].clone());
        return a
    },
    copy: function(a) {
        return this.copyWithZone(null)
    },
    getLoops: function() {
        return this._loops
    },
    setLoops: function(a) {
        this._loops = a
    },
    setRestoreOriginalFrame: function(a) {
        this._restoreOriginalFrame = a
    },
    getRestoreOriginalFrame: function() {
        return this._restoreOriginalFrame
    },
    getDuration: function() {
        return this._totalDelayUnits * this._delayPerUnit
    },
    getDelayPerUnit: function() {
        return this._delayPerUnit
    },
    setDelayPerUnit: function(a) {
        this._delayPerUnit = a
    },
    getTotalDelayUnits: function() {
        return this._totalDelayUnits
    },
    initWithSpriteFrames: function(a, b, c) {
        cc.arrayVerifyType(a, cc.SpriteFrame);
        this._loops = void 0 === c ? 1 : c;
        this._delayPerUnit = b || 0;
        this._totalDelayUnits = 0;
        b = this._frames;
        b.length = 0;
        if (a) {
            for (c = 0; c < a.length; c++) {
                var d = a[c],
                    e = new cc.AnimationFrame;
                e.initWithSpriteFrame(d, 1, null);
                b.push(e)
            }
            this._totalDelayUnits += a.length
        }
        return !0
    },
    retain: function() {},
    release: function() {}
});
cc.Animation.create = function(a, b, c) {
    return new cc.Animation(a, b, c)
};
cc.animationCache = {
    _animations: {},
    addAnimation: function(a, b) {
        this._animations[b] = a
    },
    removeAnimation: function(a) {
        a && this._animations[a] && delete this._animations[a]
    },
    getAnimation: function(a) {
        return this._animations[a] ? this._animations[a] : null
    },
    _addAnimationsWithDictionary: function(a, b) {
        var c = a.animations;
        if (c) {
            var d = 1,
                e = a.properties;
            if (e)
                for (var d = null != e.format ? parseInt(e.format) : d, e = e.spritesheets, f = cc.spriteFrameCache, g = cc.path, h = 0; h < e.length; h++) f.addSpriteFrames(g.changeBasename(b, e[h]));
            switch (d) {
                case 1:
                    this._parseVersion1(c);
                    break;
                case 2:
                    this._parseVersion2(c);
                    break;
                default:
                    cc.log(cc._LogInfos.animationCache__addAnimationsWithDictionary_2)
            }
        } else cc.log(cc._LogInfos.animationCache__addAnimationsWithDictionary)
    },
    addAnimations: function(a) {
        cc.assert(a, cc._LogInfos.animationCache_addAnimations_2);
        var b = cc.loader.getRes(a);
        b ? this._addAnimationsWithDictionary(b, a) : cc.log(cc._LogInfos.animationCache_addAnimations)
    },
    _parseVersion1: function(a) {
        var b = cc.spriteFrameCache,
            c;
        for (c in a) {
            var d = a[c],
                e = d.frames,
                d = parseFloat(d.delay) ||
                0,
                f = null;
            if (e) {
                for (var f = [], g = 0; g < e.length; g++) {
                    var h = b.getSpriteFrame(e[g]);
                    if (h) {
                        var k = new cc.AnimationFrame;
                        k.initWithSpriteFrame(h, 1, null);
                        f.push(k)
                    } else cc.log(cc._LogInfos.animationCache__parseVersion1_2, c, e[g])
                }
                0 === f.length ? cc.log(cc._LogInfos.animationCache__parseVersion1_3, c) : (f.length != e.length && cc.log(cc._LogInfos.animationCache__parseVersion1_4, c), f = cc.Animation.create(f, d, 1), cc.animationCache.addAnimation(f, c))
            } else cc.log(cc._LogInfos.animationCache__parseVersion1, c)
        }
    },
    _parseVersion2: function(a) {
        var b =
            cc.spriteFrameCache,
            c;
        for (c in a) {
            var d = a[c],
                e = d.loop,
                f = parseInt(d.loops),
                e = e ? cc.REPEAT_FOREVER : isNaN(f) ? 1 : f,
                f = d.restoreOriginalFrame && !0 == d.restoreOriginalFrame ? !0 : !1,
                g = d.frames;
            if (g) {
                for (var h = [], k = 0; k < g.length; k++) {
                    var m = g[k],
                        n = m.spriteframe,
                        q = b.getSpriteFrame(n);
                    if (q) {
                        var n = parseFloat(m.delayUnits) || 0,
                            m = m.notification,
                            s = new cc.AnimationFrame;
                        s.initWithSpriteFrame(q, n, m);
                        h.push(s)
                    } else cc.log(cc._LogInfos.animationCache__parseVersion2_2, c, n)
                }
                d = parseFloat(d.delayPerUnit) || 0;
                g = new cc.Animation;
                g.initWithAnimationFrames(h,
                    d, e);
                g.setRestoreOriginalFrame(f);
                cc.animationCache.addAnimation(g, c)
            } else cc.log(cc._LogInfos.animationCache__parseVersion2, c)
        }
    },
    _clear: function() {
        this._animations = {}
    }
};
cc.SpriteFrame = cc.Class.extend({
    _offset: null,
    _originalSize: null,
    _rectInPixels: null,
    _rotated: !1,
    _rect: null,
    _offsetInPixels: null,
    _originalSizeInPixels: null,
    _texture: null,
    _textureFilename: "",
    _textureLoaded: !1,
    _eventListeners: null,
    ctor: function(a, b, c, d, e) {
        this._offset = cc.p(0, 0);
        this._offsetInPixels = cc.p(0, 0);
        this._originalSize = cc.size(0, 0);
        this._rotated = !1;
        this._originalSizeInPixels = cc.size(0, 0);
        this._textureFilename = "";
        this._texture = null;
        this._textureLoaded = !1;
        void 0 !== a && void 0 !== b && (void 0 === c || void 0 ===
            d || void 0 === e ? this.initWithTexture(a, b) : this.initWithTexture(a, b, c, d, e))
    },
    textureLoaded: function() {
        return this._textureLoaded
    },
    addLoadedEventListener: function(a, b) {
        null == this._eventListeners && (this._eventListeners = []);
        this._eventListeners.push({
            eventCallback: a,
            eventTarget: b
        })
    },
    _callLoadedEventCallbacks: function() {
        var a = this._eventListeners;
        if (a) {
            for (var b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                d.eventCallback.call(d.eventTarget, this)
            }
            a.length = 0
        }
    },
    getRectInPixels: function() {
        var a = this._rectInPixels;
        return cc.rect(a.x,
            a.y, a.width, a.height)
    },
    setRectInPixels: function(a) {
        this._rectInPixels || (this._rectInPixels = cc.rect(0, 0, 0, 0));
        this._rectInPixels.x = a.x;
        this._rectInPixels.y = a.y;
        this._rectInPixels.width = a.width;
        this._rectInPixels.height = a.height;
        this._rect = cc.rectPixelsToPoints(a)
    },
    isRotated: function() {
        return this._rotated
    },
    setRotated: function(a) {
        this._rotated = a
    },
    getRect: function() {
        var a = this._rect;
        return cc.rect(a.x, a.y, a.width, a.height)
    },
    setRect: function(a) {
        this._rect || (this._rect = cc.rect(0, 0, 0, 0));
        this._rect.x = a.x;
        this._rect.y = a.y;
        this._rect.width = a.width;
        this._rect.height = a.height;
        this._rectInPixels = cc.rectPointsToPixels(this._rect)
    },
    getOffsetInPixels: function() {
        return this._offsetInPixels
    },
    setOffsetInPixels: function(a) {
        this._offsetInPixels.x = a.x;
        this._offsetInPixels.y = a.y;
        cc._pointPixelsToPointsOut(this._offsetInPixels, this._offset)
    },
    getOriginalSizeInPixels: function() {
        return this._originalSizeInPixels
    },
    setOriginalSizeInPixels: function(a) {
        this._originalSizeInPixels.width = a.width;
        this._originalSizeInPixels.height =
            a.height
    },
    getOriginalSize: function() {
        return this._originalSize
    },
    setOriginalSize: function(a) {
        this._originalSize.width = a.width;
        this._originalSize.height = a.height
    },
    getTexture: function() {
        if (this._texture) return this._texture;
        if ("" !== this._textureFilename) {
            var a = cc.textureCache.addImage(this._textureFilename);
            a && (this._textureLoaded = a.isLoaded());
            return a
        }
        return null
    },
    setTexture: function(a) {
        if (this._texture != a) {
            var b = a.isLoaded();
            this._textureLoaded = b;
            this._texture = a;
            b || a.addLoadedEventListener(function(a) {
                this._textureLoaded = !0;
                if (this._rotated && cc._renderType === cc._RENDER_TYPE_CANVAS) {
                    var b = a.getHtmlElementObj(),
                        b = cc.cutRotateImageToCanvas(b, this.getRect()),
                        e = new cc.Texture2D;
                    e.initWithElement(b);
                    e.handleLoadedTexture();
                    this.setTexture(e);
                    b = this.getRect();
                    this.setRect(cc.rect(0, 0, b.width, b.height))
                }
                b = this._rect;
                0 === b.width && 0 === b.height && (b = a.width, a = a.height, this._rect.width = b, this._rect.height = a, this._rectInPixels = cc.rectPointsToPixels(this._rect), this._originalSizeInPixels.width = this._rectInPixels.width, this._originalSizeInPixels.height =
                    this._rectInPixels.height, this._originalSize.width = b, this._originalSize.height = a);
                this._callLoadedEventCallbacks()
            }, this)
        }
    },
    getOffset: function() {
        return this._offset
    },
    setOffset: function(a) {
        this._offset.x = a.x;
        this._offset.y = a.y
    },
    clone: function() {
        var a = new cc.SpriteFrame;
        a.initWithTexture(this._textureFilename, this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels);
        a.setTexture(this._texture);
        return a
    },
    copyWithZone: function() {
        var a = new cc.SpriteFrame;
        a.initWithTexture(this._textureFilename,
            this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels);
        a.setTexture(this._texture);
        return a
    },
    copy: function() {
        return this.copyWithZone()
    },
    initWithTexture: function(a, b, c, d, e) {
        2 === arguments.length && (b = cc.rectPointsToPixels(b));
        d = d || cc.p(0, 0);
        e = e || b;
        c = c || !1;
        "string" == typeof a ? (this._texture = null, this._textureFilename = a) : a instanceof cc.Texture2D && this.setTexture(a);
        if (a = this.getTexture()) {
            var f, g;
            c ? (f = b.x + b.height, g = b.y + b.width) : (f = b.x + b.width, g = b.y + b.height);
            f > a.width && cc.error(cc._LogInfos.RectWidth,
                a.url);
            g > a.height && cc.error(cc._LogInfos.RectHeight, a.url)
        }
        this._rectInPixels = b;
        this._rect = cc.rectPixelsToPoints(b);
        this._offsetInPixels.x = d.x;
        this._offsetInPixels.y = d.y;
        cc._pointPixelsToPointsOut(d, this._offset);
        this._originalSizeInPixels.width = e.width;
        this._originalSizeInPixels.height = e.height;
        cc._sizePixelsToPointsOut(e, this._originalSize);
        this._rotated = c;
        return !0
    }
});
cc.SpriteFrame.create = function(a, b, c, d, e) {
    return new cc.SpriteFrame(a, b, c, d, e)
};
cc.SpriteFrame._frameWithTextureForCanvas = function(a, b, c, d, e) {
    var f = new cc.SpriteFrame;
    f._texture = a;
    f._rectInPixels = b;
    f._rect = cc.rectPixelsToPoints(b);
    f._offsetInPixels.x = d.x;
    f._offsetInPixels.y = d.y;
    cc._pointPixelsToPointsOut(f._offsetInPixels, f._offset);
    f._originalSizeInPixels.width = e.width;
    f._originalSizeInPixels.height = e.height;
    cc._sizePixelsToPointsOut(f._originalSizeInPixels, f._originalSize);
    f._rotated = c;
    return f
};
cc.spriteFrameCache = {
    _CCNS_REG1: /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/,
    _CCNS_REG2: /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/,
    _spriteFrames: {},
    _spriteFramesAliases: {},
    _frameConfigCache: {},
    _rectFromString: function(a) {
        a = this._CCNS_REG2.exec(a);
        return !a ? cc.rect(0, 0, 0, 0) : cc.rect(parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]), parseFloat(a[4]))
    },
    _pointFromString: function(a) {
        a = this._CCNS_REG1.exec(a);
        return !a ? cc.p(0, 0) : cc.p(parseFloat(a[1]), parseFloat(a[2]))
    },
    _sizeFromString: function(a) {
        a = this._CCNS_REG1.exec(a);
        return !a ? cc.size(0, 0) : cc.size(parseFloat(a[1]), parseFloat(a[2]))
    },
    _getFrameConfig: function(a) {
        var b = cc.loader.getRes(a);
        cc.assert(b, cc._LogInfos.spriteFrameCache__getFrameConfig_2, a);
        cc.loader.release(a);
        if (b._inited) return this._frameConfigCache[a] = b;
        var c = b.frames,
            d = b.metadata || b.meta,
            b = {},
            e = {},
            f = 0;
        d && (f = d.format, f = 1 >= f.length ? parseInt(f) : f, e.image = d.textureFileName || d.textureFileName ||
            d.image);
        for (var g in c) {
            var h = c[g];
            if (h) {
                d = {};
                if (0 == f) {
                    d.rect = cc.rect(h.x, h.y, h.width, h.height);
                    d.rotated = !1;
                    d.offset = cc.p(h.offsetX, h.offsetY);
                    var k = h.originalWidth,
                        h = h.originalHeight;
                    (!k || !h) && cc.log(cc._LogInfos.spriteFrameCache__getFrameConfig);
                    k = Math.abs(k);
                    h = Math.abs(h);
                    d.size = cc.size(k, h)
                } else if (1 == f || 2 == f) d.rect = this._rectFromString(h.frame), d.rotated = h.rotated || !1, d.offset = this._pointFromString(h.offset), d.size = this._sizeFromString(h.sourceSize);
                else if (3 == f) {
                    var k = this._sizeFromString(h.spriteSize),
                        m = this._rectFromString(h.textureRect);
                    k && (m = cc.rect(m.x, m.y, k.width, k.height));
                    d.rect = m;
                    d.rotated = h.textureRotated || !1;
                    d.offset = this._pointFromString(h.spriteOffset);
                    d.size = this._sizeFromString(h.spriteSourceSize);
                    d.aliases = h.aliases
                } else k = h.frame, m = h.sourceSize, g = h.filename || g, d.rect = cc.rect(k.x, k.y, k.w, k.h), d.rotated = h.rotated || !1, d.offset = cc.p(0, 0), d.size = cc.size(m.w, m.h);
                b[g] = d
            }
        }
        return this._frameConfigCache[a] = {
            _inited: !0,
            frames: b,
            meta: e
        }
    },
    addSpriteFrames: function(a, b) {
        cc.assert(a, cc._LogInfos.spriteFrameCache_addSpriteFrames_2);
        var c = this._frameConfigCache[a] || cc.loader.getRes(a);
        if (c && c.frames) {
            var d = this._frameConfigCache[a] || this._getFrameConfig(a),
                c = d.frames,
                d = d.meta;
            b ? b instanceof cc.Texture2D || ("string" == typeof b ? b = cc.textureCache.addImage(b) : cc.assert(0, cc._LogInfos.spriteFrameCache_addSpriteFrames_3)) : (d = cc.path.changeBasename(a, d.image || ".png"), b = cc.textureCache.addImage(d));
            var d = this._spriteFramesAliases,
                e = this._spriteFrames,
                f;
            for (f in c) {
                var g = c[f],
                    h = e[f];
                if (!h) {
                    h = cc.SpriteFrame.create(b, g.rect, g.rotated, g.offset,
                        g.size);
                    if (g = g.aliases)
                        for (var k = 0, m = g.length; k < m; k++) {
                            var n = g[k];
                            d[n] && cc.log(cc._LogInfos.spriteFrameCache_addSpriteFrames, n);
                            d[n] = f
                        }
                    cc._renderType === cc._RENDER_TYPE_CANVAS && h.isRotated() && h.getTexture().isLoaded() && (g = h.getTexture().getHtmlElementObj(), g = cc.cutRotateImageToCanvas(g, h.getRectInPixels()), k = new cc.Texture2D, k.initWithElement(g), k.handleLoadedTexture(), h.setTexture(k), g = h._rect, h.setRect(cc.rect(0, 0, g.width, g.height)));
                    e[f] = h
                }
            }
        }
    },
    _checkConflict: function(a) {
        a = a.frames;
        for (var b in a) this._spriteFrames[b] &&
            cc.log(cc._LogInfos.spriteFrameCache__checkConflict, b)
    },
    addSpriteFrame: function(a, b) {
        this._spriteFrames[b] = a
    },
    removeSpriteFrames: function() {
        this._spriteFrames = {};
        this._spriteFramesAliases = {}
    },
    removeSpriteFrameByName: function(a) {
        a && (this._spriteFramesAliases[a] && delete this._spriteFramesAliases[a], this._spriteFrames[a] && delete this._spriteFrames[a])
    },
    removeSpriteFramesFromFile: function(a) {
        var b = this._spriteFrames,
            c = this._spriteFramesAliases;
        if (a = this._frameConfigCache[a]) {
            a = a.frames;
            for (var d in a)
                if (b[d]) {
                    delete b[d];
                    for (var e in c) c[e] == d && delete c[e]
                }
        }
    },
    removeSpriteFramesFromTexture: function(a) {
        var b = this._spriteFrames,
            c = this._spriteFramesAliases,
            d;
        for (d in b) {
            var e = b[d];
            if (e && e.getTexture() == a) {
                delete b[d];
                for (var f in c) c[f] == d && delete c[f]
            }
        }
    },
    getSpriteFrame: function(a) {
        var b = this._spriteFrames[a];
        if (!b) {
            var c = this._spriteFramesAliases[a];
            c && ((b = this._spriteFrames[c.toString()]) || delete this._spriteFramesAliases[a])
        }
        b || cc.log(cc._LogInfos.spriteFrameCache_getSpriteFrame, a);
        return b
    },
    _clear: function() {
        this._spriteFrames = {};
        this._spriteFramesAliases = {};
        this._frameConfigCache = {}
    }
};
cc.DEFAULT_SPRITE_BATCH_CAPACITY = 29;
cc.SpriteBatchNode = cc.Node.extend({
    textureAtlas: null,
    _blendFunc: null,
    _descendants: null,
    _className: "SpriteBatchNode",
    addSpriteWithoutQuad: function(a, b, c) {
        cc.assert(a, cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad_2);
        if (!(a instanceof cc.Sprite)) return cc.log(cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad), null;
        a.atlasIndex = b;
        var d = 0,
            e = this._descendants;
        if (e && 0 < e.length)
            for (var f = 0; f < e.length; f++) {
                var g = e[f];
                g && g.atlasIndex >= b && ++d
            }
        e.splice(d, 0, a);
        cc.Node.prototype.addChild.call(this, a, b, c);
        this.reorderBatch(!1);
        return this
    },
    getTextureAtlas: function() {
        return this.textureAtlas
    },
    setTextureAtlas: function(a) {
        a != this.textureAtlas && (this.textureAtlas = a)
    },
    getDescendants: function() {
        return this._descendants
    },
    initWithFile: function(a, b) {
        var c = cc.textureCache.textureForKey(a);
        c || (c = cc.textureCache.addImage(a));
        return this.initWithTexture(c, b)
    },
    _setNodeDirtyForCache: function() {
        this._cacheDirty = !0
    },
    init: function(a, b) {
        var c = cc.textureCache.textureForKey(a);
        c || (c = cc.textureCache.addImage(a));
        return this.initWithTexture(c,
            b)
    },
    increaseAtlasCapacity: function() {
        var a = this.textureAtlas.capacity,
            b = Math.floor(4 * (a + 1) / 3);
        cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity, a, b);
        this.textureAtlas.resizeCapacity(b) || cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity_2)
    },
    removeChildAtIndex: function(a, b) {
        this.removeChild(this._children[a], b)
    },
    rebuildIndexInOrder: function(a, b) {
        var c = a.children;
        if (c && 0 < c.length)
            for (var d = 0; d < c.length; d++) {
                var e = c[d];
                e && 0 > e.zIndex && (b = this.rebuildIndexInOrder(e, b))
            }!a == this && (a.atlasIndex =
                b, b++);
        if (c && 0 < c.length)
            for (d = 0; d < c.length; d++)(e = c[d]) && 0 <= e.zIndex && (b = this.rebuildIndexInOrder(e, b));
        return b
    },
    highestAtlasIndexInChild: function(a) {
        var b = a.children;
        return !b || 0 == b.length ? a.atlasIndex : this.highestAtlasIndexInChild(b[b.length - 1])
    },
    lowestAtlasIndexInChild: function(a) {
        var b = a.children;
        return !b || 0 == b.length ? a.atlasIndex : this.lowestAtlasIndexInChild(b[b.length - 1])
    },
    atlasIndexForChild: function(a, b) {
        var c = a.parent,
            d = c.children,
            e = d.indexOf(a),
            f = null;
        0 < e && e < cc.UINT_MAX && (f = d[e - 1]);
        return c ==
            this ? 0 == e ? 0 : this.highestAtlasIndexInChild(f) + 1 : 0 == e ? 0 > b ? c.atlasIndex : c.atlasIndex + 1 : 0 > f.zIndex && 0 > b || 0 <= f.zIndex && 0 <= b ? this.highestAtlasIndexInChild(f) + 1 : c.atlasIndex + 1
    },
    reorderBatch: function(a) {
        this._reorderChildDirty = a
    },
    setBlendFunc: function(a, b) {
        this._blendFunc = void 0 === b ? a : {
            src: a,
            dst: b
        }
    },
    getBlendFunc: function() {
        return this._blendFunc
    },
    reorderChild: function(a, b) {
        cc.assert(a, cc._LogInfos.SpriteBatchNode_reorderChild_2); - 1 === this._children.indexOf(a) ? cc.log(cc._LogInfos.SpriteBatchNode_reorderChild) :
            b !== a.zIndex && (cc.Node.prototype.reorderChild.call(this, a, b), this.setNodeDirty())
    },
    removeChild: function(a, b) {
        null != a && (-1 === this._children.indexOf(a) ? cc.log(cc._LogInfos.SpriteBatchNode_removeChild) : (this.removeSpriteFromAtlas(a), cc.Node.prototype.removeChild.call(this, a, b)))
    },
    _mvpMatrix: null,
    _textureForCanvas: null,
    _useCache: !1,
    _originalTexture: null,
    ctor: null,
    _ctorForCanvas: function(a, b) {
        cc.Node.prototype.ctor.call(this);
        var c;
        b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        "string" == typeof a ? (c = cc.textureCache.textureForKey(a)) ||
            (c = cc.textureCache.addImage(a)) : a instanceof cc.Texture2D && (c = a);
        c && this.initWithTexture(c, b)
    },
    _ctorForWebGL: function(a, b) {
        cc.Node.prototype.ctor.call(this);
        this._mvpMatrix = new cc.kmMat4;
        var c;
        b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        "string" == typeof a ? (c = cc.textureCache.textureForKey(a)) || (c = cc.textureCache.addImage(a)) : a instanceof cc.Texture2D && (c = a);
        c && this.initWithTexture(c, b)
    },
    updateQuadFromSprite: null,
    _updateQuadFromSpriteForCanvas: function(a, b) {
        cc.assert(a, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2);
        a instanceof cc.Sprite ? (a.batchNode = this, a.atlasIndex = b, a.dirty = !0, a.updateTransform()) : cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite)
    },
    _updateQuadFromSpriteForWebGL: function(a, b) {
        cc.assert(a, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
        if (a instanceof cc.Sprite) {
            for (var c = this.textureAtlas.capacity; b >= c || c == this.textureAtlas.totalQuads;) this.increaseAtlasCapacity();
            a.batchNode = this;
            a.atlasIndex = b;
            a.dirty = !0;
            a.updateTransform()
        } else cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite)
    },
    _swap: function(a, b) {
        var c = this._descendants,
            d = this.textureAtlas,
            e = d.quads,
            f = c[a],
            g = cc.V3F_C4B_T2F_QuadCopy(e[a]);
        c[b].atlasIndex = a;
        c[a] = c[b];
        d.updateQuad(e[b], a);
        c[b] = f;
        d.updateQuad(g, b)
    },
    insertQuadFromSprite: null,
    _insertQuadFromSpriteForCanvas: function(a, b) {
        cc.assert(a, cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite_2);
        a instanceof cc.Sprite ? (a.batchNode = this, a.atlasIndex = b, a.dirty = !0, a.updateTransform(), this._children.splice(b, 0, a)) : cc.log(cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite)
    },
    _insertQuadFromSpriteForWebGL: function(a, b) {
        cc.assert(a, cc._LogInfos.Sprite_insertQuadFromSprite_2);
        if (a instanceof cc.Sprite) {
            for (var c = this.textureAtlas; b >= c.capacity || c.capacity === c.totalQuads;) this.increaseAtlasCapacity();
            a.batchNode = this;
            a.atlasIndex = b;
            c.insertQuad(a.quad, b);
            a.dirty = !0;
            a.updateTransform()
        } else cc.log(cc._LogInfos.Sprite_insertQuadFromSprite)
    },
    _updateAtlasIndex: function(a, b) {
        var c = 0,
            d = a.children;
        d && (c = d.length);
        var e = 0;
        if (0 === c) e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e !=
            b && this._swap(e, b), b++;
        else {
            e = !0;
            0 <= d[0].zIndex && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++, e = !1);
            for (c = 0; c < d.length; c++) {
                var f = d[c];
                e && 0 <= f.zIndex && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++, e = !1);
                b = this._updateAtlasIndex(f, b)
            }
            e && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++)
        }
        return b
    },
    _updateBlendFunc: function() {
        this.textureAtlas.texture.hasPremultipliedAlpha() || (this._blendFunc.src = cc.SRC_ALPHA, this._blendFunc.dst =
            cc.ONE_MINUS_SRC_ALPHA)
    },
    initWithTexture: null,
    _initWithTextureForCanvas: function(a, b) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this._textureForCanvas = this._originalTexture = a;
        return !0
    },
    _initWithTextureForWebGL: function(a, b) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        this.textureAtlas = new cc.TextureAtlas;
        this.textureAtlas.initWithTexture(a, b);
        this._updateBlendFunc();
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        return !0
    },
    insertChild: function(a, b) {
        a.batchNode = this;
        a.atlasIndex = b;
        a.dirty = !0;
        var c = this.textureAtlas;
        c.totalQuads >= c.capacity && this.increaseAtlasCapacity();
        c.insertQuad(a.quad, b);
        this._descendants.splice(b, 0, a);
        var c = b + 1,
            d = this._descendants;
        if (d && 0 < d.length)
            for (; c < d.length; c++) d[c].atlasIndex++;
        var d = a.children,
            e;
        if (d) {
            c = 0;
            for (l = d.length || 0; c < l; c++)
                if (e = d[c]) {
                    var f = this.atlasIndexForChild(e, e.zIndex);
                    this.insertChild(e,
                        f)
                }
        }
    },
    appendChild: null,
    _appendChildForCanvas: function(a) {
        this._reorderChildDirty = !0;
        a.batchNode = this;
        a.dirty = !0;
        this._descendants.push(a);
        a.atlasIndex = this._descendants.length - 1;
        a = a.children;
        for (var b = 0, c = a.length || 0; b < c; b++) this.appendChild(a[b])
    },
    _appendChildForWebGL: function(a) {
        this._reorderChildDirty = !0;
        a.batchNode = this;
        a.dirty = !0;
        this._descendants.push(a);
        var b = this._descendants.length - 1;
        a.atlasIndex = b;
        var c = this.textureAtlas;
        c.totalQuads == c.capacity && this.increaseAtlasCapacity();
        c.insertQuad(a.quad,
            b);
        a = a.children;
        b = 0;
        for (c = a.length || 0; b < c; b++) this.appendChild(a[b])
    },
    removeSpriteFromAtlas: null,
    _removeSpriteFromAtlasForCanvas: function(a) {
        a.batchNode = null;
        var b = this._descendants,
            c = b.indexOf(a);
        if (-1 != c) {
            b.splice(c, 1);
            for (var d = b.length; c < d; ++c) b[c].atlasIndex--
        }
        if (a = a.children) {
            b = 0;
            for (c = a.length || 0; b < c; b++) a[b] && this.removeSpriteFromAtlas(a[b])
        }
    },
    _removeSpriteFromAtlasForWebGL: function(a) {
        this.textureAtlas.removeQuadAtIndex(a.atlasIndex);
        a.batchNode = null;
        var b = this._descendants,
            c = b.indexOf(a);
        if (-1 != c) {
            b.splice(c, 1);
            for (var d = b.length; c < d; ++c) b[c].atlasIndex--
        }
        if (a = a.children) {
            b = 0;
            for (c = a.length || 0; b < c; b++) a[b] && this.removeSpriteFromAtlas(a[b])
        }
    },
    getTexture: null,
    _getTextureForCanvas: function() {
        return this._textureForCanvas
    },
    _getTextureForWebGL: function() {
        return this.textureAtlas.texture
    },
    setTexture: null,
    _setTextureForCanvas: function(a) {
        this._textureForCanvas = a;
        for (var b = this._children, c = 0; c < b.length; c++) b[c].texture = a
    },
    _setTextureForWebGL: function(a) {
        this.textureAtlas.texture = a;
        this._updateBlendFunc()
    },
    visit: null,
    _visitForCanvas: function(a) {
        var b = a || cc._renderContext;
        if (this._visible) {
            b.save();
            this.transform(a);
            var c = this._children;
            if (c) {
                this.sortAllChildren();
                for (a = 0; a < c.length; a++) c[a] && c[a].visit(b)
            }
            b.restore()
        }
    },
    _visitForWebGL: function(a) {
        a = a || cc._renderContext;
        if (this._visible) {
            cc.kmGLPushMatrix();
            var b = this.grid;
            b && b.isActive() && (b.beforeDraw(), this.transformAncestors());
            this.sortAllChildren();
            this.transform(a);
            this.draw(a);
            b && b.isActive() && b.afterDraw(this);
            cc.kmGLPopMatrix();
            this.arrivalOrder =
                0
        }
    },
    addChild: null,
    _addChildForCanvas: function(a, b, c) {
        cc.assert(null != a, cc._LogInfos.CCSpriteBatchNode_addChild_3);
        a instanceof cc.Sprite ? (b = null == b ? a.zIndex : b, c = null == c ? a.tag : c, cc.Node.prototype.addChild.call(this, a, b, c), this.appendChild(a), this.setNodeDirty()) : cc.log(cc._LogInfos.CCSpriteBatchNode_addChild)
    },
    _addChildForWebGL: function(a, b, c) {
        cc.assert(null != a, cc._LogInfos.Sprite_addChild_6);
        a instanceof cc.Sprite ? a.texture != this.textureAtlas.texture ? cc.log(cc._LogInfos.Sprite_addChild_5) : (b = null ==
            b ? a.zIndex : b, c = null == c ? a.tag : c, cc.Node.prototype.addChild.call(this, a, b, c), this.appendChild(a), this.setNodeDirty()) : cc.log(cc._LogInfos.Sprite_addChild_4)
    },
    removeAllChildren: null,
    _removeAllChildrenForCanvas: function(a) {
        var b = this._descendants;
        if (b && 0 < b.length)
            for (var c = 0, d = b.length; c < d; c++) b[c] && (b[c].batchNode = null);
        cc.Node.prototype.removeAllChildren.call(this, a);
        this._descendants.length = 0
    },
    _removeAllChildrenForWebGL: function(a) {
        var b = this._descendants;
        if (b && 0 < b.length)
            for (var c = 0, d = b.length; c <
                d; c++) b[c] && (b[c].batchNode = null);
        cc.Node.prototype.removeAllChildren.call(this, a);
        this._descendants.length = 0;
        this.textureAtlas.removeAllQuads()
    },
    sortAllChildren: null,
    _sortAllChildrenForCanvas: function() {
        if (this._reorderChildDirty) {
            var a, b = 0,
                c = this._children,
                d = c.length,
                e;
            for (a = 1; a < d; a++) {
                var f = c[a],
                    b = a - 1;
                for (e = c[b]; 0 <= b && (f._localZOrder < e._localZOrder || f._localZOrder == e._localZOrder && f.arrivalOrder < e.arrivalOrder);) c[b + 1] = e, b -= 1, e = c[b];
                c[b + 1] = f
            }
            0 < c.length && this._arrayMakeObjectsPerformSelector(c,
                cc.Node.StateCallbackType.sortAllChildren);
            this._reorderChildDirty = !1
        }
    },
    _sortAllChildrenForWebGL: function() {
        if (this._reorderChildDirty) {
            var a = this._children,
                b, c = 0,
                d = a.length,
                e;
            for (b = 1; b < d; b++) {
                var f = a[b],
                    c = b - 1;
                for (e = a[c]; 0 <= c && (f._localZOrder < e._localZOrder || f._localZOrder == e._localZOrder && f.arrivalOrder < e.arrivalOrder);) a[c + 1] = e, c -= 1, e = a[c];
                a[c + 1] = f
            }
            if (0 < a.length) {
                this._arrayMakeObjectsPerformSelector(a, cc.Node.StateCallbackType.sortAllChildren);
                for (b = c = 0; b < a.length; b++) c = this._updateAtlasIndex(a[b],
                    c)
            }
            this._reorderChildDirty = !1
        }
    },
    draw: null,
    _drawForWebGL: function() {
        0 !== this.textureAtlas.totalQuads && (this._shaderProgram.use(), this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(), this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.updateTransform), cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst), this.textureAtlas.drawQuads())
    }
});
_p = cc.SpriteBatchNode.prototype;
cc._renderType === cc._RENDER_TYPE_WEBGL ? (_p.ctor = _p._ctorForWebGL, _p.updateQuadFromSprite = _p._updateQuadFromSpriteForWebGL, _p.insertQuadFromSprite = _p._insertQuadFromSpriteForWebGL, _p.initWithTexture = _p._initWithTextureForWebGL, _p.appendChild = _p._appendChildForWebGL, _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForWebGL, _p.getTexture = _p._getTextureForWebGL, _p.setTexture = _p._setTextureForWebGL, _p.visit = _p._visitForWebGL, _p.addChild = _p._addChildForWebGL, _p.removeAllChildren = _p._removeAllChildrenForWebGL,
    _p.sortAllChildren = _p._sortAllChildrenForWebGL, _p.draw = _p._drawForWebGL) : (_p.ctor = _p._ctorForCanvas, _p.updateQuadFromSprite = _p._updateQuadFromSpriteForCanvas, _p.insertQuadFromSprite = _p._insertQuadFromSpriteForCanvas, _p.initWithTexture = _p._initWithTextureForCanvas, _p.appendChild = _p._appendChildForCanvas, _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForCanvas, _p.getTexture = _p._getTextureForCanvas, _p.setTexture = _p._setTextureForCanvas, _p.visit = _p._visitForCanvas, _p.removeAllChildren = _p._removeAllChildrenForCanvas,
    _p.addChild = _p._addChildForCanvas, _p.sortAllChildren = _p._sortAllChildrenForCanvas, _p.draw = cc.Node.prototype.draw);
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.defineGetterSetter(_p, "descendants", _p.getDescendants);
cc.SpriteBatchNode.create = function(a, b) {
    return new cc.SpriteBatchNode(a, b)
};
cc.configuration = {
    ERROR: 0,
    STRING: 1,
    INT: 2,
    DOUBLE: 3,
    BOOLEAN: 4,
    _maxTextureSize: 0,
    _maxModelviewStackDepth: 0,
    _supportsPVRTC: !1,
    _supportsNPOT: !1,
    _supportsBGRA8888: !1,
    _supportsDiscardFramebuffer: !1,
    _supportsShareableVAO: !1,
    _maxSamplesAllowed: 0,
    _maxTextureUnits: 0,
    _GlExtensions: "",
    _valueDict: {},
    _inited: !1,
    _init: function() {
        var a = this._valueDict;
        a["cocos2d.x.version"] = cc.ENGINE_VERSION;
        a["cocos2d.x.compiled_with_profiler"] = !1;
        a["cocos2d.x.compiled_with_gl_state_cache"] = cc.ENABLE_GL_STATE_CACHE;
        this._inited = !0
    },
    getMaxTextureSize: function() {
        return this._maxTextureSize
    },
    getMaxModelviewStackDepth: function() {
        return this._maxModelviewStackDepth
    },
    getMaxTextureUnits: function() {
        return this._maxTextureUnits
    },
    supportsNPOT: function() {
        return this._supportsNPOT
    },
    supportsPVRTC: function() {
        return this._supportsPVRTC
    },
    supportsETC: function() {
        return !1
    },
    supportsS3TC: function() {
        return !1
    },
    supportsATITC: function() {
        return !1
    },
    supportsBGRA8888: function() {
        return this._supportsBGRA8888
    },
    supportsDiscardFramebuffer: function() {
        return this._supportsDiscardFramebuffer
    },
    supportsShareableVAO: function() {
        return this._supportsShareableVAO
    },
    checkForGLExtension: function(a) {
        return -1 < this._GlExtensions.indexOf(a)
    },
    getValue: function(a, b) {
        this._inited || this._init();
        var c = this._valueDict;
        return c[a] ? c[a] : b
    },
    setValue: function(a, b) {
        this._valueDict[a] = b
    },
    dumpInfo: function() {
        0 === cc.ENABLE_GL_STATE_CACHE && (cc.log(""), cc.log(cc._LogInfos.configuration_dumpInfo), cc.log(""))
    },
    gatherGPUInfo: function() {
        if (cc._renderType !== cc._RENDER_TYPE_CANVAS) {
            this._inited || this._init();
            var a = cc._renderContext,
                b = this._valueDict;
            b["gl.vendor"] = a.getParameter(a.VENDOR);
            b["gl.renderer"] = a.getParameter(a.RENDERER);
            b["gl.version"] = a.getParameter(a.VERSION);
            this._GlExtensions = "";
            for (var c = a.getSupportedExtensions(), d = 0; d < c.length; d++) this._GlExtensions += c[d] + " ";
            this._maxTextureSize = a.getParameter(a.MAX_TEXTURE_SIZE);
            b["gl.max_texture_size"] = this._maxTextureSize;
            this._maxTextureUnits = a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            b["gl.max_texture_units"] = this._maxTextureUnits;
            this._supportsPVRTC = this.checkForGLExtension("GL_IMG_texture_compression_pvrtc");
            b["gl.supports_PVRTC"] = this._supportsPVRTC;
            this._supportsNPOT = !1;
            b["gl.supports_NPOT"] = this._supportsNPOT;
            this._supportsBGRA8888 = this.checkForGLExtension("GL_IMG_texture_format_BGRA888");
            b["gl.supports_BGRA8888"] = this._supportsBGRA8888;
            this._supportsDiscardFramebuffer = this.checkForGLExtension("GL_EXT_discard_framebuffer");
            b["gl.supports_discard_framebuffer"] = this._supportsDiscardFramebuffer;
            this._supportsShareableVAO = this.checkForGLExtension("vertex_array_object");
            b["gl.supports_vertex_array_object"] =
                this._supportsShareableVAO;
            cc.checkGLErrorDebug()
        }
    },
    loadConfigFile: function(a) {
        this._inited || this._init();
        var b = cc.loader.getRes(a);
        if (!b) throw "Please load the resource first : " + a;
        cc.assert(b, cc._LogInfos.configuration_loadConfigFile_2, a);
        if (b = b.data)
            for (var c in b) this._valueDict[c] = b[c];
        else cc.log(cc._LogInfos.configuration_loadConfigFile, a)
    }
};
cc.g_NumberOfDraws = 0;
cc.GLToClipTransform = function(a) {
    var b = new cc.kmMat4;
    cc.kmGLGetMatrix(cc.KM_GL_PROJECTION, b);
    var c = new cc.kmMat4;
    cc.kmGLGetMatrix(cc.KM_GL_MODELVIEW, c);
    cc.kmMat4Multiply(a, b, c)
};
cc.Director = cc.Class.extend({
    _landscape: !1,
    _nextDeltaTimeZero: !1,
    _paused: !1,
    _purgeDirectorInNextLoop: !1,
    _sendCleanupToScene: !1,
    _animationInterval: 0,
    _oldAnimationInterval: 0,
    _projection: 0,
    _accumDt: 0,
    _contentScaleFactor: 1,
    _displayStats: !1,
    _deltaTime: 0,
    _frameRate: 0,
    _FPSLabel: null,
    _SPFLabel: null,
    _drawsLabel: null,
    _winSizeInPoints: null,
    _lastUpdate: null,
    _nextScene: null,
    _notificationNode: null,
    _openGLView: null,
    _scenesStack: null,
    _projectionDelegate: null,
    _runningScene: null,
    _frames: 0,
    _totalFrames: 0,
    _secondsPerFrame: 0,
    _dirtyRegion: null,
    _scheduler: null,
    _actionManager: null,
    _eventProjectionChanged: null,
    _eventAfterDraw: null,
    _eventAfterVisit: null,
    _eventAfterUpdate: null,
    ctor: function() {
        var a = this;
        a._lastUpdate = Date.now();
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
            a._lastUpdate = Date.now()
        })
    },
    init: function() {
        this._oldAnimationInterval = this._animationInterval = 1 / cc.defaultFPS;
        this._scenesStack = [];
        this._projection = cc.Director.PROJECTION_DEFAULT;
        this._projectionDelegate = null;
        this._frameRate = this._accumDt =
            0;
        this._displayStats = !1;
        this._totalFrames = this._frames = 0;
        this._lastUpdate = Date.now();
        this._purgeDirectorInNextLoop = this._paused = !1;
        this._winSizeInPoints = cc.size(0, 0);
        this._openGLView = null;
        this._contentScaleFactor = 1;
        this._scheduler = new cc.Scheduler;
        this._actionManager = cc.ActionManager ? new cc.ActionManager : null;
        this._scheduler.scheduleUpdateForTarget(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
        this._eventAfterDraw = new cc.EventCustom(cc.Director.EVENT_AFTER_DRAW);
        this._eventAfterDraw.setUserData(this);
        this._eventAfterVisit = new cc.EventCustom(cc.Director.EVENT_AFTER_VISIT);
        this._eventAfterVisit.setUserData(this);
        this._eventAfterUpdate = new cc.EventCustom(cc.Director.EVENT_AFTER_UPDATE);
        this._eventAfterUpdate.setUserData(this);
        this._eventProjectionChanged = new cc.EventCustom(cc.Director.EVENT_PROJECTION_CHANGED);
        this._eventProjectionChanged.setUserData(this);
        return !0
    },
    calculateDeltaTime: function() {
        var a = Date.now();
        this._nextDeltaTimeZero ? (this._deltaTime = 0, this._nextDeltaTimeZero = !1) : this._deltaTime =
            (a - this._lastUpdate) / 1E3;
        0 < cc.game.config[cc.game.CONFIG_KEY.debugMode] && 0.2 < this._deltaTime && (this._deltaTime = 1 / 60);
        this._lastUpdate = a
    },
    drawScene: function() {
        this.calculateDeltaTime();
        this._paused || (this._scheduler.update(this._deltaTime), cc.eventManager.dispatchEvent(this._eventAfterUpdate));
        this._clear();
        this._nextScene && this.setNextScene();
        this._beforeVisitScene && this._beforeVisitScene();
        this._runningScene && (this._runningScene.visit(), cc.eventManager.dispatchEvent(this._eventAfterVisit));
        this._notificationNode &&
            this._notificationNode.visit();
        this._displayStats && this._showStats();
        this._afterVisitScene && this._afterVisitScene();
        cc.eventManager.dispatchEvent(this._eventAfterDraw);
        this._totalFrames++;
        this._displayStats && this._calculateMPF()
    },
    _beforeVisitScene: null,
    _afterVisitScene: null,
    end: function() {
        this._purgeDirectorInNextLoop = !0
    },
    getContentScaleFactor: function() {
        return this._contentScaleFactor
    },
    getNotificationNode: function() {
        return this._notificationNode
    },
    getWinSize: function() {
        return this._winSizeInPoints
    },
    getWinSizeInPixels: function() {
        return cc.size(this._winSizeInPoints.width * this._contentScaleFactor, this._winSizeInPoints.height * this._contentScaleFactor)
    },
    pause: function() {
        this._paused || (this._oldAnimationInterval = this._animationInterval, this.setAnimationInterval(0.25), this._paused = !0)
    },
    popScene: function() {
        cc.assert(this._runningScene, cc._LogInfos.Director_popScene);
        this._scenesStack.pop();
        var a = this._scenesStack.length;
        0 == a ? this.end() : (this._sendCleanupToScene = !0, this._nextScene = this._scenesStack[a -
            1])
    },
    purgeCachedData: function() {
        cc.animationCache._clear();
        cc.spriteFrameCache._clear();
        cc.textureCache._clear()
    },
    purgeDirector: function() {
        this.getScheduler().unscheduleAllCallbacks();
        cc.eventManager && cc.eventManager.setEnabled(!1);
        this._runningScene && (this._runningScene.onExitTransitionDidStart(), this._runningScene.onExit(), this._runningScene.cleanup());
        this._nextScene = this._runningScene = null;
        this._scenesStack.length = 0;
        this.stopAnimation();
        this.purgeCachedData();
        cc.checkGLErrorDebug()
    },
    pushScene: function(a) {
        cc.assert(a,
            cc._LogInfos.Director_pushScene);
        this._sendCleanupToScene = !1;
        this._scenesStack.push(a);
        this._nextScene = a
    },
    runScene: function(a) {
        cc.assert(a, cc._LogInfos.Director_pushScene);
        if (this._runningScene) {
            var b = this._scenesStack.length;
            0 === b ? (this._sendCleanupToScene = !0, this._scenesStack[b] = a) : (this._sendCleanupToScene = !0, this._scenesStack[b - 1] = a);
            this._nextScene = a
        } else this.pushScene(a), this.startAnimation()
    },
    resume: function() {
        this._paused && (this.setAnimationInterval(this._oldAnimationInterval), (this._lastUpdate =
            Date.now()) || cc.log(cc._LogInfos.Director_resume), this._paused = !1, this._deltaTime = 0)
    },
    setContentScaleFactor: function(a) {
        a != this._contentScaleFactor && (this._contentScaleFactor = a, this._createStatsLabel())
    },
    setDefaultValues: function() {},
    setNextDeltaTimeZero: function(a) {
        this._nextDeltaTimeZero = a
    },
    setNextScene: function() {
        var a = !1,
            b = !1;
        cc.TransitionScene && (a = this._runningScene ? this._runningScene instanceof cc.TransitionScene : !1, b = this._nextScene ? this._nextScene instanceof cc.TransitionScene : !1);
        if (!b) {
            if (b =
                this._runningScene) b.onExitTransitionDidStart(), b.onExit();
            this._sendCleanupToScene && b && b.cleanup()
        }
        this._runningScene = this._nextScene;
        this._nextScene = null;
        !a && null != this._runningScene && (this._runningScene.onEnter(), this._runningScene.onEnterTransitionDidFinish())
    },
    setNotificationNode: function(a) {
        this._notificationNode = a
    },
    getDelegate: function() {
        return this._projectionDelegate
    },
    setDelegate: function(a) {
        this._projectionDelegate = a
    },
    _showStats: function() {
        this._frames++;
        this._accumDt += this._deltaTime;
        this._FPSLabel &&
            this._SPFLabel && this._drawsLabel ? (this._accumDt > cc.DIRECTOR_FPS_INTERVAL && (this._SPFLabel.string = this._secondsPerFrame.toFixed(3), this._frameRate = this._frames / this._accumDt, this._accumDt = this._frames = 0, this._FPSLabel.string = this._frameRate.toFixed(1), this._drawsLabel.string = (0 | cc.g_NumberOfDraws).toString()), this._FPSLabel.visit(), this._SPFLabel.visit(), this._drawsLabel.visit()) : this._createStatsLabel();
        cc.g_NumberOfDraws = 0
    },
    isSendCleanupToScene: function() {
        return this._sendCleanupToScene
    },
    getRunningScene: function() {
        return this._runningScene
    },
    getAnimationInterval: function() {
        return this._animationInterval
    },
    isDisplayStats: function() {
        return this._displayStats
    },
    setDisplayStats: function(a) {
        this._displayStats = a
    },
    getSecondsPerFrame: function() {
        return this._secondsPerFrame
    },
    isNextDeltaTimeZero: function() {
        return this._nextDeltaTimeZero
    },
    isPaused: function() {
        return this._paused
    },
    getTotalFrames: function() {
        return this._totalFrames
    },
    popToRootScene: function() {
        this.popToSceneStackLevel(1)
    },
    popToSceneStackLevel: function(a) {
        cc.assert(this._runningScene,
            cc._LogInfos.Director_popToSceneStackLevel_2);
        var b = this._scenesStack,
            c = b.length;
        if (0 == c) this.end();
        else if (!(a > c)) {
            for (; c > a;) {
                var d = b.pop();
                d.running && (d.onExitTransitionDidStart(), d.onExit());
                d.cleanup();
                c--
            }
            this._nextScene = b[b.length - 1];
            this._sendCleanupToScene = !1
        }
    },
    getScheduler: function() {
        return this._scheduler
    },
    setScheduler: function(a) {
        this._scheduler != a && (this._scheduler = a)
    },
    getActionManager: function() {
        return this._actionManager
    },
    setActionManager: function(a) {
        this._actionManager != a && (this._actionManager =
            a)
    },
    getDeltaTime: function() {
        return this._deltaTime
    },
    _createStatsLabel: null,
    _calculateMPF: function() {
        this._secondsPerFrame = (Date.now() - this._lastUpdate) / 1E3
    }
});
cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";
cc.Director.EVENT_AFTER_DRAW = "director_after_draw";
cc.Director.EVENT_AFTER_VISIT = "director_after_visit";
cc.Director.EVENT_AFTER_UPDATE = "director_after_update";
cc.DisplayLinkDirector = cc.Director.extend({
    invalid: !1,
    startAnimation: function() {
        this._nextDeltaTimeZero = !0;
        this.invalid = !1
    },
    mainLoop: function() {
        this._purgeDirectorInNextLoop ? (this._purgeDirectorInNextLoop = !1, this.purgeDirector()) : this.invalid || this.drawScene()
    },
    stopAnimation: function() {
        this.invalid = !0
    },
    setAnimationInterval: function(a) {
        this._animationInterval = a;
        this.invalid || (this.stopAnimation(), this.startAnimation())
    }
});
cc.Director.sharedDirector = null;
cc.Director.firstUseDirector = !0;
cc.Director._getInstance = function() {
    cc.Director.firstUseDirector && (cc.Director.firstUseDirector = !1, cc.Director.sharedDirector = new cc.DisplayLinkDirector, cc.Director.sharedDirector.init());
    return cc.Director.sharedDirector
};
cc.defaultFPS = 60;
cc.Director.PROJECTION_2D = 0;
cc.Director.PROJECTION_3D = 1;
cc.Director.PROJECTION_CUSTOM = 3;
cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_3D;
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.Director.prototype, _p.setProjection = function(a) {
    this._projection = a;
    cc.eventManager.dispatchEvent(this._eventProjectionChanged)
}, _p.setDepthTest = function() {}, _p.setOpenGLView = function(a) {
    this._winSizeInPoints.width = cc._canvas.width;
    this._winSizeInPoints.height = cc._canvas.height;
    this._openGLView = a || cc.view;
    cc.eventManager && cc.eventManager.setEnabled(!0)
}, _p._clear = function() {
    var a = this._openGLView.getViewPortRect();
    cc._renderContext.clearRect(-a.x, a.y,
        a.width, -a.height)
}, _p._createStatsLabel = function() {
    var a = 0,
        a = this._winSizeInPoints.width > this._winSizeInPoints.height ? 0 | 24 * (this._winSizeInPoints.height / 320) : 0 | 24 * (this._winSizeInPoints.width / 320);
    this._FPSLabel = cc.LabelTTF.create("000.0", "Arial", a);
    this._SPFLabel = cc.LabelTTF.create("0.000", "Arial", a);
    this._drawsLabel = cc.LabelTTF.create("0000", "Arial", a);
    a = cc.DIRECTOR_STATS_POSITION;
    this._drawsLabel.setPosition(this._drawsLabel.width / 2 + a.x, 5 * this._drawsLabel.height / 2 + a.y);
    this._SPFLabel.setPosition(this._SPFLabel.width /
        2 + a.x, 3 * this._SPFLabel.height / 2 + a.y);
    this._FPSLabel.setPosition(this._FPSLabel.width / 2 + a.x, this._FPSLabel.height / 2 + a.y)
}, _p.getVisibleSize = function() {
    return this.getWinSize()
}, _p.getVisibleOrigin = function() {
    return cc.p(0, 0)
}) : (cc.Director._fpsImage = new Image, cc._addEventListener(cc.Director._fpsImage, "load", function() {
        cc.Director._fpsImageLoaded = !0
    }), cc._fpsImage && (cc.Director._fpsImage.src = cc._fpsImage), cc.assert("function" === typeof cc._tmp.DirectorWebGL, cc._LogInfos.MissingFile, "CCDirectorWebGL.js"),
    cc._tmp.DirectorWebGL(), delete cc._tmp.DirectorWebGL);
cc.Camera = cc.Class.extend({
    _eyeX: null,
    _eyeY: null,
    _eyeZ: null,
    _centerX: null,
    _centerY: null,
    _centerZ: null,
    _upX: null,
    _upY: null,
    _upZ: null,
    _dirty: null,
    _lookupMatrix: null,
    ctor: function() {
        this._lookupMatrix = new cc.kmMat4;
        this.restore()
    },
    description: function() {
        return "\x3cCCCamera | center \x3d(" + this._centerX + "," + this._centerY + "," + this._centerZ + ")\x3e"
    },
    setDirty: function(a) {
        this._dirty = a
    },
    isDirty: function() {
        return this._dirty
    },
    restore: function() {
        this._eyeX = this._eyeY = 0;
        this._eyeZ = cc.Camera.getZEye();
        this._upX =
            this._centerX = this._centerY = this._centerZ = 0;
        this._upY = 1;
        this._upZ = 0;
        cc.kmMat4Identity(this._lookupMatrix);
        this._dirty = !1
    },
    locate: function() {
        if (this._dirty) {
            var a = new cc.kmVec3,
                b = new cc.kmVec3,
                c = new cc.kmVec3;
            cc.kmVec3Fill(a, this._eyeX, this._eyeY, this._eyeZ);
            cc.kmVec3Fill(b, this._centerX, this._centerY, this._centerZ);
            cc.kmVec3Fill(c, this._upX, this._upY, this._upZ);
            cc.kmMat4LookAt(this._lookupMatrix, a, b, c);
            this._dirty = !1
        }
        cc.kmGLMultMatrix(this._lookupMatrix)
    },
    setEyeXYZ: function(a, b, c) {
        this.setEye(a, b,
            c)
    },
    setEye: function(a, b, c) {
        this._eyeX = a;
        this._eyeY = b;
        this._eyeZ = c;
        this._dirty = !0
    },
    setCenterXYZ: function(a, b, c) {
        this.setCenter(a, b, c)
    },
    setCenter: function(a, b, c) {
        this._centerX = a;
        this._centerY = b;
        this._centerZ = c;
        this._dirty = !0
    },
    setUpXYZ: function(a, b, c) {
        this.setUp(a, b, c)
    },
    setUp: function(a, b, c) {
        this._upX = a;
        this._upY = b;
        this._upZ = c;
        this._dirty = !0
    },
    getEyeXYZ: function(a, b, c) {
        return {
            x: this._eyeX,
            y: this._eyeY,
            z: this._eyeZ
        }
    },
    getEye: function() {
        return {
            x: this._eyeX,
            y: this._eyeY,
            z: this._eyeZ
        }
    },
    getCenterXYZ: function(a,
        b, c) {
        return {
            x: this._centerX,
            y: this._centerY,
            z: this._centerZ
        }
    },
    getCenter: function() {
        return {
            x: this._centerX,
            y: this._centerY,
            z: this._centerZ
        }
    },
    getUpXYZ: function(a, b, c) {
        return {
            x: this._upX,
            y: this._upY,
            z: this._upZ
        }
    },
    getUp: function() {
        return {
            x: this._upX,
            y: this._upY,
            z: this._upZ
        }
    },
    _DISALLOW_COPY_AND_ASSIGN: function(a) {}
});
cc.Camera.getZEye = function() {
    return cc.FLT_EPSILON
};
cc.PRIORITY_NON_SYSTEM = cc.PRIORITY_SYSTEM + 1;
cc.arrayVerifyType = function(a, b) {
    if (a && 0 < a.length)
        for (var c = 0; c < a.length; c++)
            if (!(a[c] instanceof b)) return cc.log(cc._LogInfos.arrayVerifyType), !1;
    return !0
};
cc.arrayRemoveObject = function(a, b) {
    for (var c = 0, d = a.length; c < d; c++)
        if (a[c] == b) {
            a.splice(c, 1);
            break
        }
};
cc.arrayRemoveArray = function(a, b) {
    for (var c = 0, d = b.length; c < d; c++) cc.arrayRemoveObject(a, b[c])
};
cc.arrayAppendObjectsToIndex = function(a, b, c) {
    a.splice.apply(a, [c, 0].concat(b));
    return a
};
cc.ListEntry = function(a, b, c, d, e, f) {
    this.prev = a;
    this.next = b;
    this.target = c;
    this.priority = d;
    this.paused = e;
    this.markedForDeletion = f
};
cc.HashUpdateEntry = function(a, b, c, d) {
    this.list = a;
    this.entry = b;
    this.target = c;
    this.hh = d
};
cc.HashTimerEntry = function(a, b, c, d, e, f, g) {
    this.timers = a;
    this.target = b;
    this.timerIndex = c;
    this.currentTimer = d;
    this.currentTimerSalvaged = e;
    this.paused = f;
    this.hh = g
};
cc.Timer = cc.Class.extend({
    _interval: 0,
    _callback: null,
    _target: null,
    _elapsed: 0,
    _runForever: !1,
    _useDelay: !1,
    _timesExecuted: 0,
    _repeat: 0,
    _delay: 0,
    getInterval: function() {
        return this._interval
    },
    setInterval: function(a) {
        this._interval = a
    },
    getCallback: function() {
        return this._callback
    },
    ctor: function(a, b, c, d, e) {
        this._target = a;
        this._callback = b;
        this._elapsed = -1;
        this._interval = c || 0;
        this._delay = e || 0;
        this._useDelay = 0 < this._delay;
        this._repeat = null == d ? cc.REPEAT_FOREVER : d;
        this._runForever = this._repeat == cc.REPEAT_FOREVER
    },
    _doCallback: function() {
        if ("string" == typeof this._callback) this._target[this._callback](this._elapsed);
        else this._callback.call(this._target, this._elapsed)
    },
    update: function(a) {
        if (-1 == this._elapsed) this._timesExecuted = this._elapsed = 0;
        else {
            var b = this._target,
                c = this._callback;
            this._elapsed += a;
            this._runForever && !this._useDelay ? this._elapsed >= this._interval && (b && c && this._doCallback(), this._elapsed = 0) : (this._useDelay ? this._elapsed >= this._delay && (b && c && this._doCallback(), this._elapsed -= this._delay, this._timesExecuted +=
                1, this._useDelay = !1) : this._elapsed >= this._interval && (b && c && this._doCallback(), this._elapsed = 0, this._timesExecuted += 1), this._timesExecuted > this._repeat && cc.director.getScheduler().unscheduleCallbackForTarget(b, c))
        }
    }
});
cc.Scheduler = cc.Class.extend({
    _timeScale: 1,
    _updates: null,
    _hashForUpdates: null,
    _arrayForUpdates: null,
    _hashForTimers: null,
    _arrayForTimes: null,
    _currentTarget: null,
    _currentTargetSalvaged: !1,
    _updateHashLocked: !1,
    ctor: function() {
        this._timeScale = 1;
        this._updates = [
            [],
            [],
            []
        ];
        this._hashForUpdates = {};
        this._arrayForUpdates = [];
        this._hashForTimers = {};
        this._arrayForTimers = [];
        this._currentTarget = null;
        this._updateHashLocked = this._currentTargetSalvaged = !1
    },
    _removeHashElement: function(a) {
        delete this._hashForTimers[a.target.__instanceId];
        cc.arrayRemoveObject(this._arrayForTimers, a);
        a.Timer = null;
        a.target = null
    },
    _removeUpdateFromHash: function(a) {
        if (a = this._hashForUpdates[a.target.__instanceId]) cc.arrayRemoveObject(a.list, a.entry), delete this._hashForUpdates[a.target.__instanceId], cc.arrayRemoveObject(this._arrayForUpdates, a), a.entry = null, a.target = null
    },
    _priorityIn: function(a, b, c, d) {
        d = new cc.ListEntry(null, null, b, c, d, !1);
        if (a) {
            for (var e = a.length - 1, f = 0; f <= e && !(c < a[f].priority); f++);
            a.splice(f, 0, d)
        } else a = [], a.push(d);
        c = new cc.HashUpdateEntry(a,
            d, b, null);
        this._arrayForUpdates.push(c);
        this._hashForUpdates[b.__instanceId] = c;
        return a
    },
    _appendIn: function(a, b, c) {
        c = new cc.ListEntry(null, null, b, 0, c, !1);
        a.push(c);
        a = new cc.HashUpdateEntry(a, c, b, null);
        this._arrayForUpdates.push(a);
        this._hashForUpdates[b.__instanceId] = a
    },
    setTimeScale: function(a) {
        this._timeScale = a
    },
    getTimeScale: function() {
        return this._timeScale
    },
    update: function(a) {
        var b = this._updates,
            c = this._arrayForTimers,
            d, e, f;
        this._updateHashLocked = !0;
        1 != this._timeScale && (a *= this._timeScale);
        e = 0;
        for (f = b.length; e < f && 0 <= e; e++)
            for (var g = this._updates[e], h = 0, k = g.length; h < k; h++) d = g[h], !d.paused && !d.markedForDeletion && d.target.update(a);
        e = 0;
        for (f = c.length; e < f; e++) {
            d = c[e];
            if (!d) break;
            this._currentTarget = d;
            this._currentTargetSalvaged = !1;
            if (!d.paused)
                for (d.timerIndex = 0; d.timerIndex < d.timers.length; d.timerIndex++) d.currentTimer = d.timers[d.timerIndex], d.currentTimerSalvaged = !1, d.currentTimer.update(a), d.currentTimer = null;
            this._currentTargetSalvaged && 0 == d.timers.length && (this._removeHashElement(d), e--)
        }
        e =
            0;
        for (f = b.length; e < f; e++) {
            g = this._updates[e];
            h = 0;
            for (k = g.length; h < k;) {
                d = g[h];
                if (!d) break;
                d.markedForDeletion ? this._removeUpdateFromHash(d) : h++
            }
        }
        this._updateHashLocked = !1;
        this._currentTarget = null
    },
    scheduleCallbackForTarget: function(a, b, c, d, e, f) {
        cc.assert(b, cc._LogInfos.Scheduler_scheduleCallbackForTarget_2);
        cc.assert(a, cc._LogInfos.Scheduler_scheduleCallbackForTarget_3);
        c = c || 0;
        d = null == d ? cc.REPEAT_FOREVER : d;
        e = e || 0;
        f = f || !1;
        var g = this._hashForTimers[a.__instanceId];
        g || (g = new cc.HashTimerEntry(null, a,
            0, null, null, f, null), this._arrayForTimers.push(g), this._hashForTimers[a.__instanceId] = g);
        if (null == g.timers) g.timers = [];
        else
            for (var h = 0; h < g.timers.length; h++)
                if (f = g.timers[h], b == f._callback) {
                    cc.log(cc._LogInfos.Scheduler_scheduleCallbackForTarget, f.getInterval().toFixed(4), c.toFixed(4));
                    f._interval = c;
                    return
                }
        f = new cc.Timer(a, b, c, d, e);
        g.timers.push(f)
    },
    scheduleUpdateForTarget: function(a, b, c) {
        if (null !== a) {
            var d = this._updates,
                e = this._hashForUpdates[a.__instanceId];
            e ? e.entry.markedForDeletion = !1 : 0 == b ? this._appendIn(d[1],
                a, c) : 0 > b ? d[0] = this._priorityIn(d[0], a, b, c) : d[2] = this._priorityIn(d[2], a, b, c)
        }
    },
    unscheduleCallbackForTarget: function(a, b) {
        if (!(null == a || null == b)) {
            var c = this._hashForTimers[a.__instanceId];
            if (c)
                for (var d = c.timers, e = 0, f = d.length; e < f; e++) {
                    var g = d[e];
                    if (b == g._callback) {
                        g == c.currentTimer && !c.currentTimerSalvaged && (c.currentTimerSalvaged = !0);
                        d.splice(e, 1);
                        c.timerIndex >= e && c.timerIndex--;
                        0 == d.length && (this._currentTarget == c ? this._currentTargetSalvaged = !0 : this._removeHashElement(c));
                        break
                    }
                }
        }
    },
    unscheduleUpdateForTarget: function(a) {
        null !=
            a && (a = this._hashForUpdates[a.__instanceId], null != a && (this._updateHashLocked ? a.entry.markedForDeletion = !0 : this._removeUpdateFromHash(a.entry)))
    },
    unscheduleAllCallbacksForTarget: function(a) {
        if (null != a) {
            var b = this._hashForTimers[a.__instanceId];
            if (b) {
                var c = b.timers;
                !b.currentTimerSalvaged && 0 <= c.indexOf(b.currentTimer) && (b.currentTimerSalvaged = !0);
                c.length = 0;
                this._currentTarget == b ? this._currentTargetSalvaged = !0 : this._removeHashElement(b)
            }
            this.unscheduleUpdateForTarget(a)
        }
    },
    unscheduleAllCallbacks: function() {
        this.unscheduleAllCallbacksWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM)
    },
    unscheduleAllCallbacksWithMinPriority: function(a) {
        for (var b = this._arrayForTimers, c = this._updates, d = 0, e = b.length; d < e; d++) this.unscheduleAllCallbacksForTarget(b[d].target);
        for (d = 2; 0 <= d; d--)
            if (!(1 == d && 0 < a || 0 == d && 0 <= a))
                for (var b = c[d], e = 0, f = b.length; e < f; e++) this.unscheduleUpdateForTarget(b[e].target)
    },
    pauseAllTargets: function() {
        return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM)
    },
    pauseAllTargetsWithMinPriority: function(a) {
        a = [];
        for (var b, c = this._arrayForTimers, d = this._updates, e = 0, f =
                c.length; e < f; e++)
            if (b = c[e]) b.paused = !0, a.push(b.target);
        e = 0;
        for (f = d.length; e < f; e++)
            for (var c = d[e], g = 0, h = c.length; g < h; g++)
                if (b = c[g]) b.paused = !0, a.push(b.target);
        return a
    },
    resumeTargets: function(a) {
        if (a)
            for (var b = 0; b < a.length; b++) this.resumeTarget(a[b])
    },
    pauseTarget: function(a) {
        cc.assert(a, cc._LogInfos.Scheduler_pauseTarget);
        var b = this._hashForTimers[a.__instanceId];
        b && (b.paused = !0);
        if (a = this._hashForUpdates[a.__instanceId]) a.entry.paused = !0
    },
    resumeTarget: function(a) {
        cc.assert(a, cc._LogInfos.Scheduler_resumeTarget);
        var b = this._hashForTimers[a.__instanceId];
        b && (b.paused = !1);
        if (a = this._hashForUpdates[a.__instanceId]) a.entry.paused = !1
    },
    isTargetPaused: function(a) {
        cc.assert(a, cc._LogInfos.Scheduler_isTargetPaused);
        return (a = this._hashForTimers[a.__instanceId]) ? a.paused : !1
    }
});
cc.Scheduler.PRIORITY_SYSTEM = -2147483648;
cc._tmp.PrototypeLabelTTF = function() {
    var a = cc.LabelTTF.prototype;
    cc.defineGetterSetter(a, "color", a.getColor, a.setColor);
    cc.defineGetterSetter(a, "opacity", a.getOpacity, a.setOpacity);
    cc.defineGetterSetter(a, "string", a.getString, a.setString);
    cc.defineGetterSetter(a, "textAlign", a.getHorizontalAlignment, a.setHorizontalAlignment);
    cc.defineGetterSetter(a, "verticalAlign", a.getVerticalAlignment, a.setVerticalAlignment);
    cc.defineGetterSetter(a, "fontSize", a.getFontSize, a.setFontSize);
    cc.defineGetterSetter(a,
        "fontName", a.getFontName, a.setFontName);
    cc.defineGetterSetter(a, "font", a._getFont, a._setFont);
    cc.defineGetterSetter(a, "boundingWidth", a._getBoundingWidth, a._setBoundingWidth);
    cc.defineGetterSetter(a, "boundingHeight", a._getBoundingHeight, a._setBoundingHeight);
    cc.defineGetterSetter(a, "fillStyle", a._getFillStyle, a.setFontFillColor);
    cc.defineGetterSetter(a, "strokeStyle", a._getStrokeStyle, a._setStrokeStyle);
    cc.defineGetterSetter(a, "lineWidth", a._getLineWidth, a._setLineWidth);
    cc.defineGetterSetter(a, "shadowOffsetX",
        a._getShadowOffsetX, a._setShadowOffsetX);
    cc.defineGetterSetter(a, "shadowOffsetY", a._getShadowOffsetY, a._setShadowOffsetY);
    cc.defineGetterSetter(a, "shadowOpacity", a._getShadowOpacity, a._setShadowOpacity);
    cc.defineGetterSetter(a, "shadowBlur", a._getShadowBlur, a._setShadowBlur)
};
cc.LabelTTF = cc.Sprite.extend({
    _dimensions: null,
    _hAlignment: cc.TEXT_ALIGNMENT_CENTER,
    _vAlignment: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
    _fontName: null,
    _fontSize: 0,
    _string: "",
    _originalText: null,
    _isMultiLine: !1,
    _fontStyleStr: null,
    _shadowEnabled: !1,
    _shadowOffset: null,
    _shadowOpacity: 0,
    _shadowBlur: 0,
    _shadowColorStr: null,
    _strokeEnabled: !1,
    _strokeColor: null,
    _strokeSize: 0,
    _strokeColorStr: null,
    _textFillColor: null,
    _fillColorStr: null,
    _strokeShadowOffsetX: 0,
    _strokeShadowOffsetY: 0,
    _needUpdateTexture: !1,
    _labelCanvas: null,
    _labelContext: null,
    _lineWidths: null,
    _className: "LabelTTF",
    ctor: function(a, b, c, d, e, f) {
        cc.Sprite.prototype.ctor.call(this);
        this._dimensions = cc.size(0, 0);
        this._hAlignment = cc.TEXT_ALIGNMENT_LEFT;
        this._vAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        this._opacityModifyRGB = !1;
        this._fontStyleStr = "";
        this._fontName = "Arial";
        this._shadowEnabled = this._isMultiLine = !1;
        this._shadowOffset = cc.p(0, 0);
        this._shadowBlur = this._shadowOpacity = 0;
        this._shadowColorStr = "rgba(128, 128, 128, 0.5)";
        this._strokeEnabled = !1;
        this._strokeColor =
            cc.color(255, 255, 255, 255);
        this._strokeSize = 0;
        this._strokeColorStr = "";
        this._textFillColor = cc.color(255, 255, 255, 255);
        this._fillColorStr = "rgba(255,255,255,1)";
        this._strokeShadowOffsetY = this._strokeShadowOffsetX = 0;
        this._needUpdateTexture = !1;
        this._lineWidths = [];
        this._setColorsString();
        b && b instanceof cc.FontDefinition ? this.initWithStringAndTextDefinition(a, b) : cc.LabelTTF.prototype.initWithString.call(this, a, b, c, d, e, f)
    },
    init: function() {
        return this.initWithString(" ", this._fontName, this._fontSize)
    },
    _measureConfig: function() {
        this._getLabelContext().font =
            this._fontStyleStr
    },
    _measure: function(a) {
        return this._getLabelContext().measureText(a).width
    },
    _checkNextline: function(a, b) {
        var c = this._measure(a),
            d = Math.floor(a.length * b / c),
            e = a.indexOf("\n");
        if (0.8 * d >= e && 0 < e) return e + 1;
        if (c < b) return a.length;
        for (var c = !1, f = b + 1, e = -1, g = d, h, k = cc.LabelTTF._checkRegEx, m = cc.LabelTTF._reverseCheckRegEx, n = cc.LabelTTF._checkEnRegEx, q = a.substr(d); h = k.exec(q);) {
            g += h[0].length;
            f = a.substr(0, g);
            f = this._measure(f);
            if ("\n" == h[2] && f < b) {
                c = !0;
                e = g;
                break
            }
            if (f > b) {
                -1 != e && (c = !0);
                break
            }
            e =
                g;
            q = a.substr(g)
        }
        if (c) return e;
        q = a.substr(0, d);
        for (e = d; h = m.exec(q);)
            if (e = h[1].length, q = h[1], f = this._measure(q), f < b) {
                n.test(h[2]) && e++;
                break
            }
        return e || 1
    },
    description: function() {
        return "\x3ccc.LabelTTF | FontName \x3d" + this._fontName + " FontSize \x3d " + this._fontSize.toFixed(1) + "\x3e"
    },
    setColor: null,
    _setColorsString: null,
    updateDisplayedColor: null,
    setOpacity: null,
    updateDisplayedOpacity: null,
    updateDisplayedOpacityForCanvas: function(a) {
        cc.NodeRGBA.prototype.updateDisplayedOpacity.call(this, a);
        this._setColorsString()
    },
    getString: function() {
        return this._string
    },
    getHorizontalAlignment: function() {
        return this._hAlignment
    },
    getVerticalAlignment: function() {
        return this._vAlignment
    },
    getDimensions: function() {
        return cc.size(this._dimensions.width, this._dimensions.height)
    },
    getFontSize: function() {
        return this._fontSize
    },
    getFontName: function() {
        return this._fontName
    },
    initWithString: function(a, b, c, d, e, f) {
        a = a ? a + "" : "";
        c = c || 16;
        d = d || cc.size(0, c);
        e = e || cc.TEXT_ALIGNMENT_LEFT;
        f = f || cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        this._opacityModifyRGB = !1;
        this._dimensions = cc.size(d.width, d.height);
        this._fontName = b || "Arial";
        this._hAlignment = e;
        this._vAlignment = f;
        this._fontSize = c;
        this._fontStyleStr = this._fontSize + "px '" + b + "'";
        this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(b, this._fontSize);
        this.string = a;
        this._setColorsString();
        this._updateTexture();
        this._needUpdateTexture = !1;
        return !0
    },
    initWithStringAndTextDefinition: null,
    setTextDefinition: function(a) {
        a && this._updateWithTextDefinition(a, !0)
    },
    getTextDefinition: function() {
        return this._prepareTextDefinition(!1)
    },
    enableShadow: function(a, b, c, d) {
        c = c || 0.5;
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        var e = this._shadowOffset;
        if (e && e.x != a || e._y != b) e.x = a, e.y = b;
        this._shadowOpacity != c && (this._shadowOpacity = c);
        this._setColorsString();
        this._shadowBlur != d && (this._shadowBlur = d);
        this._needUpdateTexture = !0
    },
    _getShadowOffsetX: function() {
        return this._shadowOffset.x
    },
    _setShadowOffsetX: function(a) {
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        this._shadowOffset.x != a && (this._shadowOffset.x = a, this._needUpdateTexture = !0)
    },
    _getShadowOffsetY: function() {
        return this._shadowOffset._y
    },
    _setShadowOffsetY: function(a) {
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        this._shadowOffset._y != a && (this._shadowOffset._y = a, this._needUpdateTexture = !0)
    },
    _getShadowOffset: function() {
        return cc.p(this._shadowOffset.x, this._shadowOffset.y)
    },
    _setShadowOffset: function(a) {
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        if (this._shadowOffset.x != a.x || this._shadowOffset.y != a.y) this._shadowOffset.x = a.x, this._shadowOffset.y = a.y, this._needUpdateTexture = !0
    },
    _getShadowOpacity: function() {
        return this._shadowOpacity
    },
    _setShadowOpacity: function(a) {
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        this._shadowOpacity != a && (this._shadowOpacity = a, this._setColorsString(), this._needUpdateTexture = !0)
    },
    _getShadowBlur: function() {
        return this._shadowBlur
    },
    _setShadowBlur: function(a) {
        !1 === this._shadowEnabled && (this._shadowEnabled = !0);
        this._shadowBlur != a && (this._shadowBlur = a, this._needUpdateTexture = !0)
    },
    disableShadow: function() {
        this._shadowEnabled && (this._shadowEnabled = !1, this._needUpdateTexture = !0)
    },
    enableStroke: function(a, b) {
        !1 === this._strokeEnabled && (this._strokeEnabled = !0);
        var c = this._strokeColor;
        if (c.r !== a.r || c.g !== a.g || c.b !== a.b) c.r = a.r, c.g = a.g, c.b = a.b, this._setColorsString();
        this._strokeSize !== b && (this._strokeSize = b || 0);
        this._needUpdateTexture = !0
    },
    _getStrokeStyle: function() {
        return this._strokeColor
    },
    _setStrokeStyle: function(a) {
        !1 === this._strokeEnabled && (this._strokeEnabled = !0);
        var b = this._strokeColor;
        if (b.r !== a.r || b.g !== a.g || b.b !== a.b) b.r = a.r, b.g = a.g, b.b =
            a.b, this._setColorsString(), this._needUpdateTexture = !0
    },
    _getLineWidth: function() {
        return this._strokeSize
    },
    _setLineWidth: function(a) {
        !1 === this._strokeEnabled && (this._strokeEnabled = !0);
        this._strokeSize !== a && (this._strokeSize = a || 0, this._needUpdateTexture = !0)
    },
    disableStroke: function() {
        this._strokeEnabled && (this._strokeEnabled = !1, this._needUpdateTexture = !0)
    },
    setFontFillColor: null,
    _getFillStyle: function() {
        return this._textFillColor
    },
    _updateWithTextDefinition: function(a, b) {
        a.fontDimensions ? (this._dimensions.width =
            a.boundingWidth, this._dimensions.height = a.boundingHeight) : (this._dimensions.width = 0, this._dimensions.height = 0);
        this._hAlignment = a.textAlign;
        this._vAlignment = a.verticalAlign;
        this._fontName = a.fontName;
        this._fontSize = a.fontSize || 12;
        this._fontStyleStr = this._fontSize + "px '" + this._fontName + "'";
        this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(this._fontName, this._fontSize);
        a.shadowEnabled && this.enableShadow(a.shadowOffsetX, a.shadowOffsetY, a.shadowOpacity, a.shadowBlur);
        a.strokeEnabled && this.enableStroke(a.strokeStyle,
            a.lineWidth);
        this.setFontFillColor(a.fillStyle);
        b && this._updateTexture()
    },
    _prepareTextDefinition: function(a) {
        var b = new cc.FontDefinition;
        a ? (b.fontSize = this._fontSize, b.boundingWidth = cc.contentScaleFactor() * this._dimensions.width, b.boundingHeight = cc.contentScaleFactor() * this._dimensions.height) : (b.fontSize = this._fontSize, b.boundingWidth = this._dimensions.width, b.boundingHeight = this._dimensions.height);
        b.fontName = this._fontName;
        b.textAlign = this._hAlignment;
        b.verticalAlign = this._vAlignment;
        if (this._strokeEnabled) {
            b.strokeEnabled = !0;
            var c = this._strokeColor;
            b.strokeStyle = cc.color(c.r, c.g, c.b);
            b.lineWidth = this._strokeSize
        } else b.strokeEnabled = !1;
        this._shadowEnabled ? (b.shadowEnabled = !0, b.shadowBlur = this._shadowBlur, b.shadowOpacity = this._shadowOpacity, b.shadowOffsetX = (a ? cc.contentScaleFactor() : 1) * this._shadowOffset.x, b.shadowOffsetY = (a ? cc.contentScaleFactor() : 1) * this._shadowOffset.y) : b._shadowEnabled = !1;
        a = this._textFillColor;
        b.fillStyle = cc.color(a.r, a.g, a.b);
        return b
    },
    _fontClientHeight: 18,
    setString: function(a) {
        a = String(a);
        this._originalText !=
            a && (this._originalText = a + "", this._updateString(), this._needUpdateTexture = !0)
    },
    _updateString: function() {
        this._string = this._originalText
    },
    setHorizontalAlignment: function(a) {
        a !== this._hAlignment && (this._hAlignment = a, this._needUpdateTexture = !0)
    },
    setVerticalAlignment: function(a) {
        a != this._vAlignment && (this._vAlignment = a, this._needUpdateTexture = !0)
    },
    setDimensions: function(a) {
        if (a.width != this._dimensions.width || a.height != this._dimensions.height) this._dimensions = a, this._updateString(), this._needUpdateTexture = !0
    },
    _getBoundingWidth: function() {
        return this._dimensions.width
    },
    _setBoundingWidth: function(a) {
        a != this._dimensions.width && (this._dimensions.width = a, this._updateString(), this._needUpdateTexture = !0)
    },
    _getBoundingHeight: function() {
        return this._dimensions.height
    },
    _setBoundingHeight: function(a) {
        a != this._dimensions.height && (this._dimensions.height = a, this._updateString(), this._needUpdateTexture = !0)
    },
    setFontSize: function(a) {
        this._fontSize !== a && (this._fontSize = a, this._fontStyleStr = a + "px '" + this._fontName + "'",
            this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(this._fontName, a), this._needUpdateTexture = !0)
    },
    setFontName: function(a) {
        this._fontName && this._fontName != a && (this._fontName = a, this._fontStyleStr = this._fontSize + "px '" + a + "'", this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(a, this._fontSize), this._needUpdateTexture = !0)
    },
    _getFont: function() {
        return this._fontStyleStr
    },
    _setFont: function(a) {
        var b = cc.LabelTTF._fontStyleRE.exec(a);
        b && (this._fontSize = parseInt(b[1]), this._fontName = b[2], this._fontStyleStr =
            a, this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(this._fontName, this._fontSize), this._needUpdateTexture = !0)
    },
    _drawTTFInCanvas: function(a) {
        if (a) {
            var b = this._strokeShadowOffsetX,
                c = this._strokeShadowOffsetY,
                d = this._contentSize.height - c,
                e = this._vAlignment,
                f = this._hAlignment,
                g = this._fontClientHeight,
                h = this._strokeSize;
            a.setTransform(1, 0, 0, 1, 0 + 0.5 * b, d + 0.5 * c);
            a.font != this._fontStyleStr && (a.font = this._fontStyleStr);
            a.fillStyle = this._fillColorStr;
            var k = c = 0,
                m = this._strokeEnabled;
            m && (a.lineWidth = 2 *
                h, a.strokeStyle = this._strokeColorStr);
            this._shadowEnabled && (h = this._shadowOffset, a.shadowColor = this._shadowColorStr, a.shadowOffsetX = h.x, a.shadowOffsetY = -h.y, a.shadowBlur = this._shadowBlur);
            a.textBaseline = cc.LabelTTF._textBaseline[e];
            a.textAlign = cc.LabelTTF._textAlign[f];
            b = this._contentSize.width - b;
            c = f === cc.TEXT_ALIGNMENT_RIGHT ? c + b : f === cc.TEXT_ALIGNMENT_CENTER ? c + b / 2 : c + 0;
            if (this._isMultiLine) {
                f = this._strings.length;
                e === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM ? k = g + d - g * f : e === cc.VERTICAL_TEXT_ALIGNMENT_CENTER &&
                    (k = g / 2 + (d - g * f) / 2);
                for (e = 0; e < f; e++) b = this._strings[e], h = -d + g * e + k, m && a.strokeText(b, c, h), a.fillText(b, c, h)
            } else e !== cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM && (k = e === cc.VERTICAL_TEXT_ALIGNMENT_TOP ? k - d : k - 0.5 * d), m && a.strokeText(this._string, c, k), a.fillText(this._string, c, k)
        }
    },
    _getLabelContext: function() {
        if (this._labelContext) return this._labelContext;
        if (!this._labelCanvas) {
            var a = cc.newElement("canvas"),
                b = new cc.Texture2D;
            b.initWithElement(a);
            this.texture = b;
            this._labelCanvas = a
        }
        return this._labelContext = this._labelCanvas.getContext("2d")
    },
    _updateTTF: function() {
        var a = this._dimensions.width,
            b, c, d = this._lineWidths;
        d.length = 0;
        this._isMultiLine = !1;
        this._measureConfig();
        if (0 !== a) {
            var e = this._string;
            this._strings = [];
            b = 0;
            for (c = this._string.length; b < c;) {
                var f = this._checkNextline(e.substr(b), a),
                    g = e.substr(b, f);
                this._strings.push(g);
                b += f
            }
        } else {
            this._strings = this._string.split("\n");
            b = 0;
            for (c = this._strings.length; b < c; b++) d.push(this._measure(this._strings[b]))
        }
        0 < this._strings.length && (this._isMultiLine = !0);
        c = b = 0;
        this._strokeEnabled && (b = c = 2 * this._strokeSize);
        this._shadowEnabled && (e = this._shadowOffset, b += 2 * Math.abs(e.x), c += 2 * Math.abs(e.y));
        a = 0 === a ? this._isMultiLine ? cc.size(0 | Math.max.apply(Math, d) + b, 0 | this._fontClientHeight * this._strings.length + c) : cc.size(0 | this._measure(this._string) + b, 0 | this._fontClientHeight + c) : 0 === this._dimensions.height ? this._isMultiLine ? cc.size(0 | a + b, 0 | this._fontClientHeight * this._strings.length + c) : cc.size(0 | a + b, 0 | this._fontClientHeight + c) : cc.size(0 | a + b, 0 | this._dimensions.height + c);
        this.setContentSize(a);
        this._strokeShadowOffsetX =
            b;
        this._strokeShadowOffsetY = c;
        d = this._anchorPoint;
        this._anchorPointInPoints.x = 0.5 * b + (a.width - b) * d.x;
        this._anchorPointInPoints.y = 0.5 * c + (a.height - c) * d.y
    },
    getContentSize: function() {
        this._needUpdateTexture && this._updateTTF();
        return cc.Sprite.prototype.getContentSize.call(this)
    },
    _getWidth: function() {
        this._needUpdateTexture && this._updateTTF();
        return cc.Sprite.prototype._getWidth.call(this)
    },
    _getHeight: function() {
        this._needUpdateTexture && this._updateTTF();
        return cc.Sprite.prototype._getHeight.call(this)
    },
    _updateTexture: function() {
        var a = this._getLabelContext(),
            b = this._labelCanvas,
            c = this._contentSize;
        if (0 === this._string.length) return b.width = 1, b.height = c.height, this.setTextureRect(cc.rect(0, 0, 1, c.height)), !0;
        a.font = this._fontStyleStr;
        this._updateTTF();
        var d = c.width,
            c = c.height,
            e = b.width == d && b.height == c;
        b.width = d;
        b.height = c;
        e && a.clearRect(0, 0, d, c);
        this._drawTTFInCanvas(a);
        this._texture && this._texture.handleLoadedTexture();
        this.setTextureRect(cc.rect(0, 0, d, c));
        return !0
    },
    visit: function(a) {
        this._string &&
            "" != this._string && (this._needUpdateTexture && (this._needUpdateTexture = !1, this._updateTexture()), cc.Sprite.prototype.visit.call(this, a || cc._renderContext))
    },
    draw: null,
    _setTextureCoords: function(a) {
        var b = this._batchNode ? this.textureAtlas.texture : this._texture;
        if (b) {
            var c = b.pixelsWidth,
                d = b.pixelsHeight,
                e, f = this._quad;
            this._rectRotated ? (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? (b = (2 * a.x + 1) / (2 * c), c = b + (2 * a.height - 2) / (2 * c), e = (2 * a.y + 1) / (2 * d), a = e + (2 * a.width - 2) / (2 * d)) : (b = a.x / c, c = (a.x + a.height) / c, e = a.y / d, a = (a.y + a.width) /
                d), this._flippedX && (d = e, e = a, a = d), this._flippedY && (d = b, b = c, c = d), f.bl.texCoords.u = b, f.bl.texCoords.v = e, f.br.texCoords.u = b, f.br.texCoords.v = a, f.tl.texCoords.u = c, f.tl.texCoords.v = e, f.tr.texCoords.u = c, f.tr.texCoords.v = a) : (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? (b = (2 * a.x + 1) / (2 * c), c = b + (2 * a.width - 2) / (2 * c), e = (2 * a.y + 1) / (2 * d), a = e + (2 * a.height - 2) / (2 * d)) : (b = a.x / c, c = (a.x + a.width) / c, e = a.y / d, a = (a.y + a.height) / d), this._flippedX && (d = b, b = c, c = d), this._flippedY && (d = e, e = a, a = d), f.bl.texCoords.u = b, f.bl.texCoords.v = a, f.br.texCoords.u =
                c, f.br.texCoords.v = a, f.tl.texCoords.u = b, f.tl.texCoords.v = e, f.tr.texCoords.u = c, f.tr.texCoords.v = e);
            this._quadDirty = !0
        }
    }
});
cc._renderType === cc._RENDER_TYPE_CANVAS ? (_p = cc.LabelTTF.prototype, _p.setColor = function(a) {
    cc.NodeRGBA.prototype.setColor.call(this, a);
    this._setColorsString()
}, _p._setColorsString = function() {
    this._needUpdateTexture = !0;
    var a = this._displayedColor,
        b = this._displayedOpacity,
        c = this._strokeColor,
        d = this._textFillColor;
    this._shadowColorStr = "rgba(" + (0 | 0.5 * a.r) + "," + (0 | 0.5 * a.g) + "," + (0 | 0.5 * a.b) + "," + this._shadowOpacity + ")";
    this._fillColorStr = "rgba(" + (0 | a.r / 255 * d.r) + "," + (0 | a.g / 255 * d.g) + "," + (0 | a.b / 255 * d.b) + ", " + b /
        255 + ")";
    this._strokeColorStr = "rgba(" + (0 | a.r / 255 * c.r) + "," + (0 | a.g / 255 * c.g) + "," + (0 | a.b / 255 * c.b) + ", " + b / 255 + ")"
}, _p.updateDisplayedColor = function(a) {
    cc.NodeRGBA.prototype.updateDisplayedColor.call(this, a);
    this._setColorsString()
}, _p.setOpacity = function(a) {
    this._opacity !== a && (cc.Sprite.prototype.setOpacity.call(this, a), this._setColorsString(), this._needUpdateTexture = !0)
}, _p.updateDisplayedOpacity = cc.Sprite.prototype.updateDisplayedOpacity, _p.initWithStringAndTextDefinition = function(a, b) {
    this._updateWithTextDefinition(b, !1);
    this.string = a;
    return !0
}, _p.setFontFillColor = function(a) {
    var b = this._textFillColor;
    if (b.r != a.r || b.g != a.g || b.b != a.b) b.r = a.r, b.g = a.g, b.b = a.b, this._setColorsString(), this._needUpdateTexture = !0
}, _p.draw = cc.Sprite.prototype.draw, _p.setTextureRect = function(a, b, c) {
    this._rectRotated = b || !1;
    this.setContentSize(c || a);
    this.setVertexRect(a);
    b = this._textureRect_Canvas;
    b.x = a.x;
    b.y = a.y;
    b.width = a.width;
    b.height = a.height;
    b.validRect = !(0 === b.width || 0 === b.height || 0 > b.x || 0 > b.y);
    a = this._unflippedOffsetPositionFromCenter;
    this._flippedX && (a.x = -a.x);
    this._flippedY && (a.y = -a.y);
    this._offsetPosition.x = a.x + (this._contentSize.width - this._rect.width) / 2;
    this._offsetPosition.y = a.y + (this._contentSize.height - this._rect.height) / 2;
    this._batchNode && (this.dirty = !0)
}, _p = null) : (cc.assert("function" === typeof cc._tmp.WebGLLabelTTF, cc._LogInfos.MissingFile, "LabelTTFWebGL.js"), cc._tmp.WebGLLabelTTF(), delete cc._tmp.WebGLLabelTTF);
cc.assert("function" === typeof cc._tmp.PrototypeLabelTTF, cc._LogInfos.MissingFile, "LabelTTFPropertyDefine.js");
cc._tmp.PrototypeLabelTTF();
delete cc._tmp.PrototypeLabelTTF;
cc.LabelTTF._textAlign = ["left", "center", "right"];
cc.LabelTTF._textBaseline = ["top", "middle", "bottom"];
cc.LabelTTF._checkRegEx = /(.+?)([\s\n\r\-\/\\\:]|[\u4E00-\u9FA5]|[\uFE30-\uFFA0])/;
cc.LabelTTF._reverseCheckRegEx = /(.*)([\s\n\r\-\/\\\:]|[\u4E00-\u9FA5]|[\uFE30-\uFFA0])/;
cc.LabelTTF._checkEnRegEx = /[\s\-\/\\\:]/;
cc.LabelTTF._fontStyleRE = /^(\d+)px\s+['"]?([\w\s\d]+)['"]?$/;
cc.LabelTTF.create = function(a, b, c, d, e, f) {
    return new cc.LabelTTF(a, b, c, d, e, f)
};
cc.LabelTTF._SHADER_PROGRAM = cc.USE_LA88_LABELS ? cc.SHADER_POSITION_TEXTURECOLOR : cc.SHADER_POSITION_TEXTUREA8COLOR;
cc.LabelTTF.__labelHeightDiv = cc.newElement("div");
cc.LabelTTF.__labelHeightDiv.style.fontFamily = "Arial";
cc.LabelTTF.__labelHeightDiv.style.position = "absolute";
cc.LabelTTF.__labelHeightDiv.style.left = "-100px";
cc.LabelTTF.__labelHeightDiv.style.top = "-100px";
cc.LabelTTF.__labelHeightDiv.style.lineHeight = "normal";
document.body ? document.body.appendChild(cc.LabelTTF.__labelHeightDiv) : cc._addEventListener(window, "load", function() {
    this.removeEventListener("load", arguments.callee, !1);
    document.body.appendChild(cc.LabelTTF.__labelHeightDiv)
}, !1);
cc.LabelTTF.__getFontHeightByDiv = function(a, b) {
    var c = cc.LabelTTF.__fontHeightCache[a + "." + b];
    if (0 < c) return c;
    var d = cc.LabelTTF.__labelHeightDiv;
    d.innerHTML = "ajghl~!";
    d.style.fontFamily = a;
    d.style.fontSize = b + "px";
    c = d.clientHeight;
    cc.LabelTTF.__fontHeightCache[a + "." + b] = c;
    d.innerHTML = "";
    return c
};
cc.LabelTTF.__fontHeightCache = {};
cc.HashElement = cc.Class.extend({
    actions: null,
    target: null,
    actionIndex: 0,
    currentAction: null,
    currentActionSalvaged: !1,
    paused: !1,
    hh: null,
    ctor: function() {
        this.actions = [];
        this.target = null;
        this.actionIndex = 0;
        this.currentAction = null;
        this.paused = this.currentActionSalvaged = !1;
        this.hh = null
    }
});
cc.ActionManager = cc.Class.extend({
    _hashTargets: null,
    _arrayTargets: null,
    _currentTarget: null,
    _currentTargetSalvaged: !1,
    _searchElementByTarget: function(a, b) {
        for (var c = 0; c < a.length; c++)
            if (b == a[c].target) return a[c];
        return null
    },
    ctor: function() {
        this._hashTargets = {};
        this._arrayTargets = [];
        this._currentTarget = null;
        this._currentTargetSalvaged = !1
    },
    addAction: function(a, b, c) {
        if (!a) throw "cc.ActionManager.addAction(): action must be non-null";
        if (!b) throw "cc.ActionManager.addAction(): action must be non-null";
        var d =
            this._hashTargets[b.__instanceId];
        d || (d = new cc.HashElement, d.paused = c, d.target = b, this._hashTargets[b.__instanceId] = d, this._arrayTargets.push(d));
        this._actionAllocWithHashElement(d);
        d.actions.push(a);
        a.startWithTarget(b)
    },
    removeAllActions: function() {
        for (var a = this._arrayTargets, b = 0; b < a.length; b++) {
            var c = a[b];
            c && this.removeAllActionsFromTarget(c.target, !0)
        }
    },
    removeAllActionsFromTarget: function(a, b) {
        if (null != a) {
            var c = this._hashTargets[a.__instanceId];
            c && (-1 !== c.actions.indexOf(c.currentAction) && !c.currentActionSalvaged &&
                (c.currentActionSalvaged = !0), c.actions.length = 0, this._currentTarget == c && !b ? this._currentTargetSalvaged = !0 : this._deleteHashElement(c))
        }
    },
    removeAction: function(a) {
        if (null != a) {
            var b = a.getOriginalTarget();
            if (b = this._hashTargets[b.__instanceId])
                for (var c = 0; c < b.actions.length; c++) {
                    if (b.actions[c] == a) {
                        b.actions.splice(c, 1);
                        break
                    }
                } else cc.log(cc._LogInfos.ActionManager_removeAction)
        }
    },
    removeActionByTag: function(a, b) {
        a == cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_addAction);
        cc.assert(b, cc._LogInfos.ActionManager_addAction);
        var c = this._hashTargets[b.__instanceId];
        if (c)
            for (var d = c.actions.length, e = 0; e < d; ++e) {
                var f = c.actions[e];
                if (f && f.getTag() === a && f.getOriginalTarget() == b) {
                    this._removeActionAtIndex(e, c);
                    break
                }
            }
    },
    getActionByTag: function(a, b) {
        a == cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_getActionByTag);
        var c = this._hashTargets[b.__instanceId];
        if (c) {
            if (null != c.actions)
                for (var d = 0; d < c.actions.length; ++d) {
                    var e = c.actions[d];
                    if (e && e.getTag() === a) return e
                }
            cc.log(cc._LogInfos.ActionManager_getActionByTag_2, a)
        }
        return null
    },
    numberOfRunningActionsInTarget: function(a) {
        return (a = this._hashTargets[a.__instanceId]) ? a.actions ? a.actions.length : 0 : 0
    },
    pauseTarget: function(a) {
        if (a = this._hashTargets[a.__instanceId]) a.paused = !0
    },
    resumeTarget: function(a) {
        if (a = this._hashTargets[a.__instanceId]) a.paused = !1
    },
    pauseAllRunningActions: function() {
        for (var a = [], b = this._arrayTargets, c = 0; c < b.length; c++) {
            var d = b[c];
            d && !d.paused && (d.paused = !0, a.push(d.target))
        }
        return a
    },
    resumeTargets: function(a) {
        if (a)
            for (var b = 0; b < a.length; b++) a[b] && this.resumeTarget(a[b])
    },
    purgeSharedManager: function() {
        cc.director.getScheduler().unscheduleUpdateForTarget(this)
    },
    _removeActionAtIndex: function(a, b) {
        b.actions[a] == b.currentAction && !b.currentActionSalvaged && (b.currentActionSalvaged = !0);
        b.actions.splice(a, 1);
        b.actionIndex >= a && b.actionIndex--;
        0 == b.actions.length && (this._currentTarget == b ? this._currentTargetSalvaged = !0 : this._deleteHashElement(b))
    },
    _deleteHashElement: function(a) {
        a && (delete this._hashTargets[a.target.__instanceId], cc.arrayRemoveObject(this._arrayTargets, a), a.actions =
            null, a.target = null)
    },
    _actionAllocWithHashElement: function(a) {
        null == a.actions && (a.actions = [])
    },
    update: function(a) {
        for (var b = this._arrayTargets, c, d = 0; d < b.length; d++) {
            c = this._currentTarget = b[d];
            if (!c.paused)
                for (c.actionIndex = 0; c.actionIndex < c.actions.length; c.actionIndex++)
                    if (c.currentAction = c.actions[c.actionIndex], c.currentAction) {
                        c.currentActionSalvaged = !1;
                        c.currentAction.step(a * (c.currentAction._speedMethod ? c.currentAction._speed : 1));
                        if (c.currentActionSalvaged) c.currentAction = null;
                        else if (c.currentAction.isDone()) {
                            c.currentAction.stop();
                            var e = c.currentAction;
                            c.currentAction = null;
                            this.removeAction(e)
                        }
                        c.currentAction = null
                    }
            this._currentTargetSalvaged && 0 === c.actions.length && this._deleteHashElement(c)
        }
    }
});
cc.IMAGE_FORMAT_JPEG = 0;
cc.IMAGE_FORMAT_PNG = 1;
cc.IMAGE_FORMAT_RAWDATA = 2;
cc.NextPOT = function(a) {
    a -= 1;
    a |= a >> 1;
    a |= a >> 2;
    a |= a >> 4;
    a |= a >> 8;
    return (a | a >> 16) + 1
};
cc.RenderTexture = cc.Node.extend({
    sprite: null,
    clearFlags: 0,
    clearDepthVal: 0,
    autoDraw: !1,
    _cacheCanvas: null,
    _cacheContext: null,
    _fBO: 0,
    _depthRenderBuffer: 0,
    _oldFBO: 0,
    _texture: null,
    _textureCopy: null,
    _uITextureImage: null,
    _pixelFormat: cc.Texture2D.PIXEL_FORMAT_RGBA8888,
    _clearColor: null,
    clearStencilVal: 0,
    _clearColorStr: null,
    _className: "RenderTexture",
    ctor: null,
    _ctorForCanvas: function(a, b, c, d) {
        cc.Node.prototype.ctor.call(this);
        this._clearColor = cc.color(255, 255, 255, 255);
        this._clearColorStr = "rgba(255,255,255,1)";
        this._cacheCanvas = cc.newElement("canvas");
        this._cacheContext = this._cacheCanvas.getContext("2d");
        this.anchorY = this.anchorX = 0;
        void 0 !== a && void 0 !== b && (c = c || cc.Texture2D.PIXEL_FORMAT_RGBA8888, this.initWithWidthAndHeight(a, b, c, d || 0))
    },
    _ctorForWebGL: function(a, b, c, d) {
        cc.Node.prototype.ctor.call(this);
        this._clearColor = cc.color(0, 0, 0, 0);
        void 0 !== a && void 0 !== b && (c = c || cc.Texture2D.PIXEL_FORMAT_RGBA8888, this.initWithWidthAndHeight(a, b, c, d || 0))
    },
    cleanup: null,
    _cleanupForCanvas: function() {
        cc.Node.prototype.onExit.call(this);
        this._cacheCanvas = this._cacheContext = null
    },
    _cleanupForWebGL: function() {
        cc.Node.prototype.onExit.call(this);
        this._textureCopy = null;
        var a = cc._renderContext;
        a.deleteFramebuffer(this._fBO);
        this._depthRenderBuffer && a.deleteRenderbuffer(this._depthRenderBuffer);
        this._uITextureImage = null
    },
    getSprite: function() {
        return this.sprite
    },
    setSprite: function(a) {
        this.sprite = a
    },
    initWithWidthAndHeight: null,
    _initWithWidthAndHeightForCanvas: function(a, b, c, d) {
        c = this._cacheCanvas;
        d = cc.contentScaleFactor();
        c.width = 0 | a * d;
        c.height =
            0 | b * d;
        this._cacheContext.translate(0, c.height);
        a = new cc.Texture2D;
        a.initWithElement(c);
        a.handleLoadedTexture();
        this.sprite = cc.Sprite.create(a);
        return !0
    },
    _initWithWidthAndHeightForWebGL: function(a, b, c, d) {
        c == cc.Texture2D.PIXEL_FORMAT_A8 && cc.log("cc.RenderTexture._initWithWidthAndHeightForWebGL() : only RGB and RGBA formats are valid for a render texture;");
        var e = cc._renderContext,
            f = cc.contentScaleFactor();
        a = 0 | a * f;
        b = 0 | b * f;
        this._oldFBO = e.getParameter(e.FRAMEBUFFER_BINDING);
        var g;
        cc.configuration.supportsNPOT() ?
            (f = a, g = b) : (f = cc.NextPOT(a), g = cc.NextPOT(b));
        for (var h = new Uint8Array(4 * f * g), k = 0; k < 4 * f * g; k++) h[k] = 0;
        this._pixelFormat = c;
        this._texture = new cc.Texture2D;
        if (!this._texture) return !1;
        k = this._texture;
        k.initWithData(h, this._pixelFormat, f, g, cc.size(a, b));
        c = e.getParameter(e.RENDERBUFFER_BINDING);
        if (cc.configuration.checkForGLExtension("GL_QCOM")) {
            this._textureCopy = new cc.Texture2D;
            if (!this._textureCopy) return !1;
            this._textureCopy.initWithData(h, this._pixelFormat, f, g, cc.size(a, b))
        }
        this._fBO = e.createFramebuffer();
        e.bindFramebuffer(e.FRAMEBUFFER, this._fBO);
        e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, k._webTextureObj, 0);
        0 != d && (this._depthRenderBuffer = e.createRenderbuffer(), e.bindRenderbuffer(e.RENDERBUFFER, this._depthRenderBuffer), e.renderbufferStorage(e.RENDERBUFFER, d, f, g), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.RENDERBUFFER, this._depthRenderBuffer));
        e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE && cc.log("Could not attach texture to the framebuffer");
        k.setAliasTexParameters();
        a = this.sprite = cc.Sprite.create(k);
        a.scaleY = -1;
        a.setBlendFunc(e.ONE, e.ONE_MINUS_SRC_ALPHA);
        e.bindRenderbuffer(e.RENDERBUFFER, c);
        e.bindFramebuffer(e.FRAMEBUFFER, this._oldFBO);
        this.autoDraw = !1;
        this.addChild(a);
        return !0
    },
    begin: null,
    _beginForCanvas: function() {
        cc._renderContext = this._cacheContext;
        cc.view._setScaleXYForRenderTexture()
    },
    _beginForWebGL: function() {
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPushMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        var a =
            cc.director;
        a.setProjection(a.getProjection());
        var b = this._texture.getContentSizeInPixels(),
            c = cc.director.getWinSizeInPixels(),
            a = c.width / b.width,
            c = c.height / b.height,
            d = cc._renderContext;
        d.viewport(0, 0, b.width, b.height);
        b = new cc.kmMat4;
        cc.kmMat4OrthographicProjection(b, -1 / a, 1 / a, -1 / c, 1 / c, -1, 1);
        cc.kmGLMultMatrix(b);
        this._oldFBO = d.getParameter(d.FRAMEBUFFER_BINDING);
        d.bindFramebuffer(d.FRAMEBUFFER, this._fBO);
        cc.configuration.checkForGLExtension("GL_QCOM") && (d.framebufferTexture2D(d.FRAMEBUFFER, d.COLOR_ATTACHMENT0,
            d.TEXTURE_2D, this._textureCopy._webTextureObj, 0), d.clear(d.COLOR_BUFFER_BIT | d.DEPTH_BUFFER_BIT), d.framebufferTexture2D(d.FRAMEBUFFER, d.COLOR_ATTACHMENT0, d.TEXTURE_2D, this._texture._webTextureObj, 0))
    },
    beginWithClear: function(a, b, c, d, e, f) {
        var g = cc._renderContext;
        e = e || g.COLOR_BUFFER_BIT;
        f = f || g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT;
        this._beginWithClear(a, b, c, d, e, f, g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT)
    },
    _beginWithClear: null,
    _beginWithClearForCanvas: function(a, b, c, d, e, f, g) {
        this.begin();
        a = a || 0;
        b = b || 0;
        c = c || 0;
        d = isNaN(d) ? 1 : d;
        e = this._cacheContext;
        f = this._cacheCanvas;
        e.save();
        e.fillStyle = "rgba(" + (0 | a) + "," + (0 | b) + "," + (0 | c) + "," + d / 255 + ")";
        e.clearRect(0, 0, f.width, -f.height);
        e.fillRect(0, 0, f.width, -f.height);
        e.restore()
    },
    _beginWithClearForWebGL: function(a, b, c, d, e, f, g) {
        this.begin();
        var h = cc._renderContext,
            k = [0, 0, 0, 0],
            m = 0,
            n = 0;
        g & h.COLOR_BUFFER_BIT && (k = h.getParameter(h.COLOR_CLEAR_VALUE), h.clearColor(a, b, c, d));
        g & h.DEPTH_BUFFER_BIT && (m = h.getParameter(h.DEPTH_CLEAR_VALUE), h.clearDepth(e));
        g & h.STENCIL_BUFFER_BIT &&
            (n = h.getParameter(h.STENCIL_CLEAR_VALUE), h.clearStencil(f));
        h.clear(g);
        g & h.COLOR_BUFFER_BIT && h.clearColor(k[0], k[1], k[2], k[3]);
        g & h.DEPTH_BUFFER_BIT && h.clearDepth(m);
        g & h.STENCIL_BUFFER_BIT && h.clearStencil(n)
    },
    end: null,
    _endForCanvas: function() {
        cc._renderContext = cc._mainRenderContextBackup;
        cc.view._resetScale()
    },
    _endForWebGL: function() {
        var a = cc._renderContext,
            b = cc.director;
        a.bindFramebuffer(a.FRAMEBUFFER, this._oldFBO);
        b.setViewport();
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPopMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPopMatrix()
    },
    clear: function(a, b, c, d) {
        this.beginWithClear(a, b, c, d);
        this.end()
    },
    clearRect: null,
    _clearRectForCanvas: function(a, b, c, d) {
        this._cacheContext.clearRect(a, b, c, -d)
    },
    _clearRectForWebGL: function(a, b, c, d) {},
    clearDepth: null,
    _clearDepthForCanvas: function(a) {
        cc.log("clearDepth isn't supported on Cocos2d-Html5")
    },
    _clearDepthForWebGL: function(a) {
        this.begin();
        var b = cc._renderContext,
            c = b.getParameter(b.DEPTH_CLEAR_VALUE);
        b.clearDepth(a);
        b.clear(b.DEPTH_BUFFER_BIT);
        b.clearDepth(c);
        this.end()
    },
    clearStencil: null,
    _clearStencilForCanvas: function(a) {
        cc.log("clearDepth isn't supported on Cocos2d-Html5")
    },
    _clearStencilForWebGL: function(a) {
        var b = cc._renderContext,
            c = b.getParameter(b.STENCIL_CLEAR_VALUE);
        b.clearStencil(a);
        b.clear(b.STENCIL_BUFFER_BIT);
        b.clearStencil(c)
    },
    visit: null,
    _visitForCanvas: function(a) {
        this._visible && (a = a || cc._renderContext, a.save(), this.draw(a), this.transform(a), this.sprite.visit(), a.restore(), this.arrivalOrder = 0)
    },
    _visitForWebGL: function(a) {
        if (this._visible) {
            cc.kmGLPushMatrix();
            var b = this.grid;
            b && b.isActive() && (b.beforeDraw(), this.transformAncestors());
            this.transform(a);
            this.sprite.visit();
            this.draw(a);
            b && b.isActive() && b.afterDraw(this);
            cc.kmGLPopMatrix();
            this.arrivalOrder = 0
        }
    },
    draw: null,
    _drawForCanvas: function(a) {
        a = a || cc._renderContext;
        if (this.autoDraw) {
            this.begin();
            if (this.clearFlags) {
                var b = this._cacheCanvas;
                a.save();
                a.fillStyle = this._clearColorStr;
                a.clearRect(0, 0, b.width, -b.height);
                a.fillRect(0, 0, b.width, -b.height);
                a.restore()
            }
            this.sortAllChildren();
            a = this._children;
            for (var b = a.length,
                    c = this.sprite, d = 0; d < b; d++) {
                var e = a[d];
                e != c && e.visit()
            }
            this.end()
        }
    },
    _drawForWebGL: function(a) {
        a = cc._renderContext;
        if (this.autoDraw) {
            this.begin();
            var b = this.clearFlags;
            if (b) {
                var c = [0, 0, 0, 0],
                    d = 0,
                    e = 0;
                b & a.COLOR_BUFFER_BIT && (c = a.getParameter(a.COLOR_CLEAR_VALUE), a.clearColor(this._clearColor.r / 255, this._clearColor.g / 255, this._clearColor.b / 255, this._clearColor.a / 255));
                b & a.DEPTH_BUFFER_BIT && (d = a.getParameter(a.DEPTH_CLEAR_VALUE), a.clearDepth(this.clearDepthVal));
                b & a.STENCIL_BUFFER_BIT && (e = a.getParameter(a.STENCIL_CLEAR_VALUE),
                    a.clearStencil(this.clearStencilVal));
                a.clear(b);
                b & a.COLOR_BUFFER_BIT && a.clearColor(c[0], c[1], c[2], c[3]);
                b & a.DEPTH_BUFFER_BIT && a.clearDepth(d);
                b & a.STENCIL_BUFFER_BIT && a.clearStencil(e)
            }
            this.sortAllChildren();
            a = this._children;
            for (b = 0; b < a.length; b++) c = a[b], c != this.sprite && c.visit();
            this.end()
        }
    },
    newCCImage: function(a) {
        cc.log("saveToFile isn't supported on cocos2d-html5");
        return null
    },
    _memcpy: function(a, b, c, d, e) {
        for (var f = 0; f < e; f++) a[b + f] = c[d + f]
    },
    saveToFile: function(a, b) {
        cc.log("saveToFile isn't supported on Cocos2d-Html5")
    },
    listenToBackground: function(a) {
        cc.log("listenToBackground isn't supported on Cocos2d-Html5")
    },
    listenToForeground: function(a) {
        cc.log("listenToForeground isn't supported on Cocos2d-Html5")
    },
    getClearFlags: function() {
        return this.clearFlags
    },
    setClearFlags: function(a) {
        this.clearFlags = a
    },
    getClearColor: function() {
        return this._clearColor
    },
    setClearColor: null,
    _setClearColorForCanvas: function(a) {
        var b = this._clearColor;
        b.r = a.r;
        b.g = a.g;
        b.b = a.b;
        b.a = a.a;
        this._clearColorStr = "rgba(" + (0 | a.r) + "," + (0 | a.g) + "," + (0 | a.b) +
            "," + a.a / 255 + ")"
    },
    _setClearColorForWebGL: function(a) {
        var b = this._clearColor;
        b.r = a.r;
        b.g = a.g;
        b.b = a.b;
        b.a = a.a
    },
    getClearDepth: function() {
        return this.clearDepthVal
    },
    setClearDepth: function(a) {
        this.clearDepthVal = a
    },
    getClearStencil: function() {
        return this.clearStencilVal
    },
    setClearStencil: function(a) {
        this.clearStencilVal = a
    },
    isAutoDraw: function() {
        return this.autoDraw
    },
    setAutoDraw: function(a) {
        this.autoDraw = a
    }
});
_p = cc.RenderTexture.prototype;
cc._renderType == cc._RENDER_TYPE_WEBGL ? (_p.ctor = _p._ctorForWebGL, _p.cleanup = _p._cleanupForWebGL, _p.initWithWidthAndHeight = _p._initWithWidthAndHeightForWebGL, _p.begin = _p._beginForWebGL, _p._beginWithClear = _p._beginWithClearForWebGL, _p.end = _p._endForWebGL, _p.clearRect = _p._clearRectForWebGL, _p.clearDepth = _p._clearDepthForWebGL, _p.clearStencil = _p._clearStencilForWebGL, _p.visit = _p._visitForWebGL, _p.draw = _p._drawForWebGL, _p.setClearColor = _p._setClearColorForWebGL) : (_p.ctor = _p._ctorForCanvas, _p.cleanup = _p._cleanupForCanvas,
    _p.initWithWidthAndHeight = _p._initWithWidthAndHeightForCanvas, _p.begin = _p._beginForCanvas, _p._beginWithClear = _p._beginWithClearForCanvas, _p.end = _p._endForCanvas, _p.clearRect = _p._clearRectForCanvas, _p.clearDepth = _p._clearDepthForCanvas, _p.clearStencil = _p._clearStencilForCanvas, _p.visit = _p._visitForCanvas, _p.draw = _p._drawForCanvas, _p.setClearColor = _p._setClearColorForCanvas);
cc.defineGetterSetter(_p, "clearColorVal", _p.getClearColor, _p.setClearColor);
cc.RenderTexture.create = function(a, b, c, d) {
    return new cc.RenderTexture(a, b, c, d)
};
cc.LabelAtlas = cc.AtlasNode.extend({
    _string: null,
    _mapStartChar: null,
    _textureLoaded: !1,
    _loadedEventListeners: null,
    _className: "LabelAtlas",
    ctor: function(a, b, c, d, e) {
        cc.AtlasNode.prototype.ctor.call(this);
        b && cc.LabelAtlas.prototype.initWithString.call(this, a, b, c, d, e)
    },
    textureLoaded: function() {
        return this._textureLoaded
    },
    addLoadedEventListener: function(a, b) {
        this._loadedEventListeners || (this._loadedEventListeners = []);
        this._loadedEventListeners.push({
            eventCallback: a,
            eventTarget: b
        })
    },
    _callLoadedEventCallbacks: function() {
        if (this._loadedEventListeners) {
            this._textureLoaded = !0;
            for (var a = this._loadedEventListeners, b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                d.eventCallback.call(d.eventTarget, this)
            }
            a.length = 0
        }
    },
    initWithString: function(a, b, c, d, e) {
        var f = a + "",
            g, h;
        if (void 0 === c) {
            c = cc.loader.getRes(b);
            if (1 !== parseInt(c.version, 10)) return cc.log("cc.LabelAtlas.initWithString(): Unsupported version. Upgrade cocos2d version"), !1;
            b = cc.path.changeBasename(b, c.textureFilename);
            d = cc.contentScaleFactor();
            g = parseInt(c.itemWidth, 10) / d;
            h = parseInt(c.itemHeight, 10) / d;
            c = String.fromCharCode(parseInt(c.firstChar,
                10))
        } else g = c || 0, h = d || 0, c = e || " ";
        var k = null,
            k = b instanceof cc.Texture2D ? b : cc.textureCache.addImage(b);
        (this._textureLoaded = b = k.isLoaded()) || k.addLoadedEventListener(function(a) {
            this.initWithTexture(k, g, h, f.length);
            this.string = f;
            this._callLoadedEventCallbacks()
        }, this);
        return this.initWithTexture(k, g, h, f.length) ? (this._mapStartChar = c, this.string = f, !0) : !1
    },
    setColor: function(a) {
        cc.AtlasNode.prototype.setColor.call(this, a);
        this.updateAtlasValues()
    },
    getString: function() {
        return this._string
    },
    draw: function(a) {
        cc.AtlasNode.prototype.draw.call(this,
            a);
        cc.LABELATLAS_DEBUG_DRAW && (a = this.size, a = [cc.p(0, 0), cc.p(a.width, 0), cc.p(a.width, a.height), cc.p(0, a.height)], cc._drawingUtil.drawPoly(a, 4, !0))
    },
    _addChildForCanvas: function(a, b, c) {
        a._lateChild = !0;
        cc.NodeRGBA.prototype.addChild.call(this, a, b, c)
    },
    updateAtlasValues: null,
    _updateAtlasValuesForCanvas: function() {
        for (var a = this._string, b = a.length, c = this.texture, d = this._itemWidth, e = this._itemHeight, f = 0; f < b; f++) {
            var g = a.charCodeAt(f) - this._mapStartChar.charCodeAt(0),
                h = parseInt(g % this._itemsPerRow, 10),
                g = parseInt(g /
                    this._itemsPerRow, 10),
                h = cc.rect(h * d, g * e, d, e),
                g = a.charCodeAt(f),
                k = this.getChildByTag(f);
            k ? 32 == g ? (k.init(), k.setTextureRect(cc.rect(0, 0, 10, 10), !1, cc.size(0, 0))) : (k.initWithTexture(c, h), k.visible = !0, k.opacity = this._displayedOpacity) : (k = new cc.Sprite, 32 == g ? (k.init(), k.setTextureRect(cc.rect(0, 0, 10, 10), !1, cc.size(0, 0))) : k.initWithTexture(c, h), cc.NodeRGBA.prototype.addChild.call(this, k, 0, f));
            k.setPosition(f * d + d / 2, e / 2)
        }
    },
    _updateAtlasValuesForWebGL: function() {
        var a = this._string,
            b = a.length,
            c = this.textureAtlas,
            d = c.texture,
            e = d.pixelsWidth,
            d = d.pixelsHeight,
            f = this._itemWidth,
            g = this._itemHeight;
        this._ignoreContentScaleFactor || (f = this._itemWidth * cc.contentScaleFactor(), g = this._itemHeight * cc.contentScaleFactor());
        b > c.getCapacity() && cc.log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");
        for (var h = c.quads, k = this._displayedColor, k = {
                r: k.r,
                g: k.g,
                b: k.b,
                a: this._displayedOpacity
            }, m = this._itemWidth, n = 0; n < b; n++) {
            var q = a.charCodeAt(n) - this._mapStartChar.charCodeAt(0),
                s = q % this._itemsPerRow,
                r = 0 | q / this._itemsPerRow,
                u;
            cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? (s = (2 * s * f + 1) / (2 * e), q = s + (2 * f - 2) / (2 * e), r = (2 * r * g + 1) / (2 * d), u = r + (2 * g - 2) / (2 * d)) : (s = s * f / e, q = s + f / e, r = r * g / d, u = r + g / d);
            var t = h[n],
                v = t.tl,
                w = t.tr,
                x = t.bl,
                t = t.br;
            v.texCoords.u = s;
            v.texCoords.v = r;
            w.texCoords.u = q;
            w.texCoords.v = r;
            x.texCoords.u = s;
            x.texCoords.v = u;
            t.texCoords.u = q;
            t.texCoords.v = u;
            x.vertices.x = n * m;
            x.vertices.y = 0;
            x.vertices.z = 0;
            t.vertices.x = n * m + m;
            t.vertices.y = 0;
            t.vertices.z = 0;
            v.vertices.x = n * m;
            v.vertices.y = this._itemHeight;
            v.vertices.z = 0;
            w.vertices.x = n * m + m;
            w.vertices.y =
                this._itemHeight;
            w.vertices.z = 0;
            v.colors = k;
            w.colors = k;
            x.colors = k;
            t.colors = k
        }
        0 < b && (c.dirty = !0, a = c.totalQuads, b > a && c.increaseTotalQuadsWith(b - a))
    },
    setString: null,
    _setStringForCanvas: function(a) {
        a = String(a);
        var b = a.length;
        this._string = a;
        this.width = b * this._itemWidth;
        this.height = this._itemHeight;
        if (this._children) {
            a = this._children;
            for (var b = a.length, c = 0; c < b; c++) {
                var d = a[c];
                d && !d._lateChild && (d.visible = !1)
            }
        }
        this.updateAtlasValues();
        this.quadsToDraw = b
    },
    _setStringForWebGL: function(a) {
        a = String(a);
        var b = a.length;
        b > this.textureAtlas.totalQuads && this.textureAtlas.resizeCapacity(b);
        this._string = a;
        this.width = b * this._itemWidth;
        this.height = this._itemHeight;
        this.updateAtlasValues();
        this.quadsToDraw = b
    },
    setOpacity: null,
    _setOpacityForCanvas: function(a) {
        if (this._displayedOpacity !== a) {
            cc.AtlasNode.prototype.setOpacity.call(this, a);
            for (var b = this._children, c = 0, d = b.length; c < d; c++) b[c] && (b[c].opacity = a)
        }
    },
    _setOpacityForWebGL: function(a) {
        this._opacity !== a && cc.AtlasNode.prototype.setOpacity.call(this, a)
    }
});
_p = cc.LabelAtlas.prototype;
cc._renderType === cc._RENDER_TYPE_WEBGL ? (_p.updateAtlasValues = _p._updateAtlasValuesForWebGL, _p.setString = _p._setStringForWebGL, _p.setOpacity = _p._setOpacityForWebGL) : (_p.updateAtlasValues = _p._updateAtlasValuesForCanvas, _p.setString = _p._setStringForCanvas, _p.setOpacity = _p._setOpacityForCanvas, _p.addChild = _p._addChildForCanvas);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
cc.LabelAtlas.create = function(a, b, c, d, e) {
    return new cc.LabelAtlas(a, b, c, d, e)
};
cc.ACTION_TAG_INVALID = -1;
cc.Action = cc.Class.extend({
    originalTarget: null,
    target: null,
    tag: cc.ACTION_TAG_INVALID,
    ctor: function() {
        this.target = this.originalTarget = null;
        this.tag = cc.ACTION_TAG_INVALID
    },
    copy: function() {
        cc.log("copy is deprecated. Please use clone instead.");
        return this.clone()
    },
    clone: function() {
        var a = new cc.Action;
        a.originalTarget = null;
        a.target = null;
        a.tag = this.tag;
        return a
    },
    isDone: function() {
        return !0
    },
    startWithTarget: function(a) {
        this.target = this.originalTarget = a
    },
    stop: function() {
        this.target = null
    },
    step: function(a) {
        cc.log("[Action step]. override me")
    },
    update: function(a) {
        cc.log("[Action update]. override me")
    },
    getTarget: function() {
        return this.target
    },
    setTarget: function(a) {
        this.target = a
    },
    getOriginalTarget: function() {
        return this.originalTarget
    },
    setOriginalTarget: function(a) {
        this.originalTarget = a
    },
    getTag: function() {
        return this.tag
    },
    setTag: function(a) {
        this.tag = a
    },
    retain: function() {},
    release: function() {}
});
cc.Action.create = function() {
    return new cc.Action
};
cc.FiniteTimeAction = cc.Action.extend({
    _duration: 0,
    ctor: function() {
        cc.Action.prototype.ctor.call(this);
        this._duration = 0
    },
    getDuration: function() {
        return this._duration * (this._times || 1)
    },
    setDuration: function(a) {
        this._duration = a
    },
    reverse: function() {
        cc.log("cocos2d: FiniteTimeAction#reverse: Implement me");
        return null
    },
    clone: function() {
        return new cc.FiniteTimeAction
    }
});
cc.Speed = cc.Action.extend({
    _speed: 0,
    _innerAction: null,
    ctor: function(a, b) {
        cc.Action.prototype.ctor.call(this);
        this._speed = 0;
        this._innerAction = null;
        a && this.initWithAction(a, b)
    },
    getSpeed: function() {
        return this._speed
    },
    setSpeed: function(a) {
        this._speed = a
    },
    initWithAction: function(a, b) {
        if (!a) throw "cc.Speed.initWithAction(): action must be non nil";
        this._innerAction = a;
        this._speed = b;
        return !0
    },
    clone: function() {
        var a = new cc.Speed;
        a.initWithAction(this._innerAction.clone(), this._speed);
        return a
    },
    startWithTarget: function(a) {
        cc.Action.prototype.startWithTarget.call(this,
            a);
        this._innerAction.startWithTarget(a)
    },
    stop: function() {
        this._innerAction.stop();
        cc.Action.prototype.stop.call(this)
    },
    step: function(a) {
        this._innerAction.step(a * this._speed)
    },
    isDone: function() {
        return this._innerAction.isDone()
    },
    reverse: function() {
        return cc.Speed.create(this._innerAction.reverse(), this._speed)
    },
    setInnerAction: function(a) {
        this._innerAction != a && (this._innerAction = a)
    },
    getInnerAction: function() {
        return this._innerAction
    }
});
cc.Speed.create = function(a, b) {
    return new cc.Speed(a, b)
};
cc.Follow = cc.Action.extend({
    _followedNode: null,
    _boundarySet: !1,
    _boundaryFullyCovered: !1,
    _halfScreenSize: null,
    _fullScreenSize: null,
    leftBoundary: 0,
    rightBoundary: 0,
    topBoundary: 0,
    bottomBoundary: 0,
    _worldRect: null,
    ctor: function(a, b) {
        cc.Action.prototype.ctor.call(this);
        this._followedNode = null;
        this._boundaryFullyCovered = this._boundarySet = !1;
        this._fullScreenSize = this._halfScreenSize = null;
        this.bottomBoundary = this.topBoundary = this.rightBoundary = this.leftBoundary = 0;
        this._worldRect = cc.rect(0, 0, 0, 0);
        a && (b ? this.initWithTarget(a,
            b) : this.initWithTarget(a))
    },
    clone: function() {
        var a = new cc.Follow,
            b = this._worldRect,
            b = new cc.Rect(b.x, b.y, b.width, b.height);
        a.initWithTarget(this._followedNode, b);
        return a
    },
    isBoundarySet: function() {
        return this._boundarySet
    },
    setBoudarySet: function(a) {
        this._boundarySet = a
    },
    initWithTarget: function(a, b) {
        if (!a) throw "cc.Follow.initWithAction(): followedNode must be non nil";
        b = b || cc.rect(0, 0, 0, 0);
        this._followedNode = a;
        this._worldRect = b;
        this._boundarySet = !cc._rectEqualToZero(b);
        this._boundaryFullyCovered = !1;
        var c = cc.director.getWinSize();
        this._fullScreenSize = cc.p(c.width, c.height);
        this._halfScreenSize = cc.pMult(this._fullScreenSize, 0.5);
        this._boundarySet && (this.leftBoundary = -(b.x + b.width - this._fullScreenSize.x), this.rightBoundary = -b.x, this.topBoundary = -b.y, this.bottomBoundary = -(b.y + b.height - this._fullScreenSize.y), this.rightBoundary < this.leftBoundary && (this.rightBoundary = this.leftBoundary = (this.leftBoundary + this.rightBoundary) / 2), this.topBoundary < this.bottomBoundary && (this.topBoundary = this.bottomBoundary =
            (this.topBoundary + this.bottomBoundary) / 2), this.topBoundary == this.bottomBoundary && this.leftBoundary == this.rightBoundary && (this._boundaryFullyCovered = !0));
        return !0
    },
    step: function(a) {
        a = this._followedNode.x;
        var b = this._followedNode.y;
        a = this._halfScreenSize.x - a;
        b = this._halfScreenSize.y - b;
        this._boundarySet ? this._boundaryFullyCovered || this.target.setPosition(cc.clampf(a, this.leftBoundary, this.rightBoundary), cc.clampf(b, this.bottomBoundary, this.topBoundary)) : this.target.setPosition(a, b)
    },
    isDone: function() {
        return !this._followedNode.running
    },
    stop: function() {
        this.target = null;
        cc.Action.prototype.stop.call(this)
    }
});
cc.Follow.create = function(a, b) {
    return new cc.Follow(a, b)
};
cc.v2fzero = function() {
    return {
        x: 0,
        y: 0
    }
};
cc.v2f = function(a, b) {
    return {
        x: a,
        y: b
    }
};
cc.v2fadd = function(a, b) {
    return cc.v2f(a.x + b.x, a.y + b.y)
};
cc.v2fsub = function(a, b) {
    return cc.v2f(a.x - b.x, a.y - b.y)
};
cc.v2fmult = function(a, b) {
    return cc.v2f(a.x * b, a.y * b)
};
cc.v2fperp = function(a) {
    return cc.v2f(-a.y, a.x)
};
cc.v2fneg = function(a) {
    return cc.v2f(-a.x, -a.y)
};
cc.v2fdot = function(a, b) {
    return a.x * b.x + a.y * b.y
};
cc.v2fforangle = function(a) {
    return cc.v2f(Math.cos(a), Math.sin(a))
};
cc.v2fnormalize = function(a) {
    a = cc.pNormalize(cc.p(a.x, a.y));
    return cc.v2f(a.x, a.y)
};
cc.__v2f = function(a) {
    return cc.v2f(a.x, a.y)
};
cc.__t = function(a) {
    return {
        u: a.x,
        v: a.y
    }
};
cc.DrawNodeCanvas = cc.Node.extend({
    _buffer: null,
    _blendFunc: null,
    _lineWidth: 1,
    _drawColor: null,
    _className: "DrawNodeCanvas",
    ctor: function() {
        cc.Node.prototype.ctor.call(this);
        this._buffer = [];
        this._drawColor = cc.color(255, 255, 255, 255);
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this.init()
    },
    getBlendFunc: function() {
        return this._blendFunc
    },
    setBlendFunc: function(a, b) {
        void 0 === b ? (this._blendFunc.src = a.src, this._blendFunc.dst = a.dst) : (this._blendFunc.src = a, this._blendFunc.dst = b)
    },
    setLineWidth: function(a) {
        this._lineWidth =
            a
    },
    getLineWidth: function() {
        return this._lineWidth
    },
    setDrawColor: function(a) {
        var b = this._drawColor;
        b.r = a.r;
        b.g = a.g;
        b.b = a.b;
        b.a = null == a.a ? 255 : a.a
    },
    getDrawColor: function() {
        return cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a)
    },
    drawRect: function(a, b, c, d, e) {
        d = d || this._lineWidth;
        e = e || this.getDrawColor();
        null == e.a && (e.a = 255);
        a = [a, cc.p(b.x, a.y), b, cc.p(a.x, b.y)];
        b = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        b.verts = a;
        b.lineWidth = d;
        b.lineColor = e;
        b.isClosePolygon = !0;
        b.isStroke = !0;
        b.lineCap = "butt";
        if (b.fillColor = c) null == c.a && (c.a = 255), b.isFill = !0;
        this._buffer.push(b)
    },
    drawCircle: function(a, b, c, d, e, f, g) {
        f = f || this._lineWidth;
        g = g || this.getDrawColor();
        null == g.a && (g.a = 255);
        for (var h = 2 * Math.PI / d, k = [], m = 0; m <= d; m++) {
            var n = m * h,
                q = b * Math.cos(n + c) + a.x,
                n = b * Math.sin(n + c) + a.y;
            k.push(cc.p(q, n))
        }
        e && k.push(cc.p(a.x, a.y));
        a = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        a.verts = k;
        a.lineWidth = f;
        a.lineColor = g;
        a.isClosePolygon = !0;
        a.isStroke = !0;
        this._buffer.push(a)
    },
    drawQuadBezier: function(a,
        b, c, d, e, f) {
        e = e || this._lineWidth;
        f = f || this.getDrawColor();
        null == f.a && (f.a = 255);
        for (var g = [], h = 0, k = 0; k < d; k++) {
            var m = Math.pow(1 - h, 2) * a.x + 2 * (1 - h) * h * b.x + h * h * c.x,
                n = Math.pow(1 - h, 2) * a.y + 2 * (1 - h) * h * b.y + h * h * c.y;
            g.push(cc.p(m, n));
            h += 1 / d
        }
        g.push(cc.p(c.x, c.y));
        a = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        a.verts = g;
        a.lineWidth = e;
        a.lineColor = f;
        a.isStroke = !0;
        a.lineCap = "round";
        this._buffer.push(a)
    },
    drawCubicBezier: function(a, b, c, d, e, f, g) {
        f = f || this._lineWidth;
        g = g || this.getDrawColor();
        null == g.a && (g.a = 255);
        for (var h = [], k = 0, m = 0; m < e; m++) {
            var n = Math.pow(1 - k, 3) * a.x + 3 * Math.pow(1 - k, 2) * k * b.x + 3 * (1 - k) * k * k * c.x + k * k * k * d.x,
                q = Math.pow(1 - k, 3) * a.y + 3 * Math.pow(1 - k, 2) * k * b.y + 3 * (1 - k) * k * k * c.y + k * k * k * d.y;
            h.push(cc.p(n, q));
            k += 1 / e
        }
        h.push(cc.p(d.x, d.y));
        a = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        a.verts = h;
        a.lineWidth = f;
        a.lineColor = g;
        a.isStroke = !0;
        a.lineCap = "round";
        this._buffer.push(a)
    },
    drawCatmullRom: function(a, b, c, d) {
        this.drawCardinalSpline(a, 0.5, b, c, d)
    },
    drawCardinalSpline: function(a, b, c, d, e) {
        d = d || this._lineWidth;
        e = e || this.getDrawColor();
        null == e.a && (e.a = 255);
        for (var f = [], g, h, k = 1 / a.length, m = 0; m < c + 1; m++) h = m / c, 1 == h ? (g = a.length - 1, h = 1) : (g = 0 | h / k, h = (h - k * g) / k), g = cc.cardinalSplineAt(cc.getControlPointAt(a, g - 1), cc.getControlPointAt(a, g - 0), cc.getControlPointAt(a, g + 1), cc.getControlPointAt(a, g + 2), b, h), f.push(g);
        a = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        a.verts = f;
        a.lineWidth = d;
        a.lineColor = e;
        a.isStroke = !0;
        a.lineCap = "round";
        this._buffer.push(a)
    },
    drawDot: function(a, b, c) {
        c = c || this.getDrawColor();
        null == c.a && (c.a = 255);
        var d = new cc._DrawNodeElement(cc.DrawNode.TYPE_DOT);
        d.verts = [a];
        d.lineWidth = b;
        d.fillColor = c;
        this._buffer.push(d)
    },
    drawDots: function(a, b, c) {
        if (a && 0 != a.length) {
            c = c || this.getDrawColor();
            null == c.a && (c.a = 255);
            for (var d = 0, e = a.length; d < e; d++) this.drawDot(a[d], b, c)
        }
    },
    drawSegment: function(a, b, c, d) {
        c = c || this._lineWidth;
        d = d || this.getDrawColor();
        null == d.a && (d.a = 255);
        var e = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        e.verts = [a, b];
        e.lineWidth = 2 * c;
        e.lineColor = d;
        e.isStroke = !0;
        e.lineCap = "round";
        this._buffer.push(e)
    },
    drawPoly_: function(a, b, c, d) {
        c = c || this._lineWidth;
        d = d || this.getDrawColor();
        null == d.a && (d.a = 255);
        var e = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        e.verts = a;
        e.fillColor = b;
        e.lineWidth = c;
        e.lineColor = d;
        e.isClosePolygon = !0;
        e.isStroke = !0;
        e.lineCap = "round";
        b && (e.isFill = !0);
        this._buffer.push(e)
    },
    drawPoly: function(a, b, c, d) {
        for (var e = [], f = 0; f < a.length; f++) e.push(cc.p(a[f].x, a[f].y));
        return this.drawPoly_(e, b, c, d)
    },
    draw: function(a) {
        a = a || cc._renderContext;
        this._blendFunc && (this._blendFunc.src == cc.SRC_ALPHA && this._blendFunc.dst == cc.ONE) && (a.globalCompositeOperation =
            "lighter");
        for (var b = 0; b < this._buffer.length; b++) {
            var c = this._buffer[b];
            switch (c.type) {
                case cc.DrawNode.TYPE_DOT:
                    this._drawDot(a, c);
                    break;
                case cc.DrawNode.TYPE_SEGMENT:
                    this._drawSegment(a, c);
                    break;
                case cc.DrawNode.TYPE_POLY:
                    this._drawPoly(a, c)
            }
        }
    },
    _drawDot: function(a, b) {
        var c = b.fillColor,
            d = b.verts[0],
            e = b.lineWidth,
            f = cc.view.getScaleX(),
            g = cc.view.getScaleY();
        a.fillStyle = "rgba(" + (0 | c.r) + "," + (0 | c.g) + "," + (0 | c.b) + "," + c.a / 255 + ")";
        a.beginPath();
        a.arc(d.x * f, -d.y * g, e * f, 0, 2 * Math.PI, !1);
        a.closePath();
        a.fill()
    },
    _drawSegment: function(a, b) {
        var c = b.lineColor,
            d = b.verts[0],
            e = b.verts[1],
            f = b.lineWidth,
            g = b.lineCap,
            h = cc.view.getScaleX(),
            k = cc.view.getScaleY();
        a.strokeStyle = "rgba(" + (0 | c.r) + "," + (0 | c.g) + "," + (0 | c.b) + "," + c.a / 255 + ")";
        a.lineWidth = f * h;
        a.beginPath();
        a.lineCap = g;
        a.moveTo(d.x * h, -d.y * k);
        a.lineTo(e.x * h, -e.y * k);
        a.stroke()
    },
    _drawPoly: function(a, b) {
        var c = b.verts,
            d = b.lineCap,
            e = b.fillColor,
            f = b.lineWidth,
            g = b.lineColor,
            h = b.isClosePolygon,
            k = b.isFill,
            m = b.isStroke;
        if (null != c) {
            var n = c[0],
                q = cc.view.getScaleX(),
                s = cc.view.getScaleY();
            a.lineCap = d;
            e && (a.fillStyle = "rgba(" + (0 | e.r) + "," + (0 | e.g) + "," + (0 | e.b) + "," + e.a / 255 + ")");
            f && (a.lineWidth = f * q);
            g && (a.strokeStyle = "rgba(" + (0 | g.r) + "," + (0 | g.g) + "," + (0 | g.b) + "," + g.a / 255 + ")");
            a.beginPath();
            a.moveTo(n.x * q, -n.y * s);
            d = 1;
            for (e = c.length; d < e; d++) a.lineTo(c[d].x * q, -c[d].y * s);
            h && a.closePath();
            k && a.fill();
            m && a.stroke()
        }
    },
    clear: function() {
        this._buffer.length = 0
    }
});
cc.DrawNodeWebGL = cc.Node.extend({
    _bufferCapacity: 0,
    _buffer: null,
    _trianglesArrayBuffer: null,
    _trianglesWebBuffer: null,
    _trianglesReader: null,
    _lineWidth: 1,
    _drawColor: null,
    _blendFunc: null,
    _dirty: !1,
    _className: "DrawNodeWebGL",
    getBlendFunc: function() {
        return this._blendFunc
    },
    setBlendFunc: function(a, b) {
        void 0 === b ? (this._blendFunc.src = a.src, this._blendFunc.dst = a.dst) : (this._blendFunc.src = a, this._blendFunc.dst = b)
    },
    ctor: function() {
        cc.Node.prototype.ctor.call(this);
        this._buffer = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC,
            cc.BLEND_DST);
        this._drawColor = cc.color(255, 255, 255, 255);
        this.init()
    },
    init: function() {
        return cc.Node.prototype.init.call(this) ? (this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_LENGTHTEXTURECOLOR), this._ensureCapacity(64), this._trianglesWebBuffer = cc._renderContext.createBuffer(), this._dirty = !0) : !1
    },
    setLineWidth: function(a) {
        this._lineWidth = a
    },
    getLineWidth: function() {
        return this._lineWidth
    },
    setDrawColor: function(a) {
        var b = this._drawColor;
        b.r = a.r;
        b.g = a.g;
        b.b = a.b;
        b.a = a.a
    },
    getDrawColor: function() {
        return cc.color(this._drawColor.r,
            this._drawColor.g, this._drawColor.b, this._drawColor.a)
    },
    drawRect: function(a, b, c, d, e) {
        d = d || this._lineWidth;
        e = e || this.getDrawColor();
        null == e.a && (e.a = 255);
        a = [a, cc.p(b.x, a.y), b, cc.p(a.x, b.y)];
        null == c ? this._drawSegments(a, d, e, !0) : this.drawPoly(a, c, d, e)
    },
    drawCircle: function(a, b, c, d, e, f, g) {
        f = f || this._lineWidth;
        g = g || this.getDrawColor();
        null == g.a && (g.a = 255);
        var h = 2 * Math.PI / d,
            k = [],
            m;
        for (m = 0; m <= d; m++) {
            var n = m * h,
                q = b * Math.cos(n + c) + a.x,
                n = b * Math.sin(n + c) + a.y;
            k.push(cc.p(q, n))
        }
        e && k.push(cc.p(a.x, a.y));
        f *= 0.5;
        m = 0;
        for (a = k.length; m < a - 1; m++) this.drawSegment(k[m], k[m + 1], f, g)
    },
    drawQuadBezier: function(a, b, c, d, e, f) {
        e = e || this._lineWidth;
        f = f || this.getDrawColor();
        null == f.a && (f.a = 255);
        for (var g = [], h = 0, k = 0; k < d; k++) {
            var m = Math.pow(1 - h, 2) * a.x + 2 * (1 - h) * h * b.x + h * h * c.x,
                n = Math.pow(1 - h, 2) * a.y + 2 * (1 - h) * h * b.y + h * h * c.y;
            g.push(cc.p(m, n));
            h += 1 / d
        }
        g.push(cc.p(c.x, c.y));
        this._drawSegments(g, e, f, !1)
    },
    drawCubicBezier: function(a, b, c, d, e, f, g) {
        f = f || this._lineWidth;
        g = g || this.getDrawColor();
        null == g.a && (g.a = 255);
        for (var h = [], k = 0, m = 0; m < e; m++) {
            var n =
                Math.pow(1 - k, 3) * a.x + 3 * Math.pow(1 - k, 2) * k * b.x + 3 * (1 - k) * k * k * c.x + k * k * k * d.x,
                q = Math.pow(1 - k, 3) * a.y + 3 * Math.pow(1 - k, 2) * k * b.y + 3 * (1 - k) * k * k * c.y + k * k * k * d.y;
            h.push(cc.p(n, q));
            k += 1 / e
        }
        h.push(cc.p(d.x, d.y));
        this._drawSegments(h, f, g, !1)
    },
    drawCatmullRom: function(a, b, c, d) {
        this.drawCardinalSpline(a, 0.5, b, c, d)
    },
    drawCardinalSpline: function(a, b, c, d, e) {
        d = d || this._lineWidth;
        e = e || this.getDrawColor();
        null == e.a && (e.a = 255);
        for (var f = [], g, h, k = 1 / a.length, m = 0; m < c + 1; m++) h = m / c, 1 == h ? (g = a.length - 1, h = 1) : (g = 0 | h / k, h = (h - k * g) / k), g = cc.cardinalSplineAt(cc.getControlPointAt(a,
            g - 1), cc.getControlPointAt(a, g - 0), cc.getControlPointAt(a, g + 1), cc.getControlPointAt(a, g + 2), b, h), f.push(g);
        d *= 0.5;
        a = 0;
        for (b = f.length; a < b - 1; a++) this.drawSegment(f[a], f[a + 1], d, e)
    },
    _render: function() {
        var a = cc._renderContext;
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        a.bindBuffer(a.ARRAY_BUFFER, this._trianglesWebBuffer);
        this._dirty && (a.bufferData(a.ARRAY_BUFFER, this._trianglesArrayBuffer, a.STREAM_DRAW), this._dirty = !1);
        var b = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,
            2, a.FLOAT, !1, b, 0);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, a.UNSIGNED_BYTE, !0, b, 8);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, a.FLOAT, !1, b, 12);
        a.drawArrays(a.TRIANGLES, 0, 3 * this._buffer.length);
        cc.incrementGLDraws(1)
    },
    _ensureCapacity: function(a) {
        var b = this._buffer;
        if (b.length + a > this._bufferCapacity) {
            var c = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT;
            this._bufferCapacity += Math.max(this._bufferCapacity, a);
            if (null == b || 0 === b.length) this._buffer = [], this._trianglesArrayBuffer = new ArrayBuffer(c *
                this._bufferCapacity), this._trianglesReader = new Uint8Array(this._trianglesArrayBuffer);
            else {
                a = [];
                for (var d = new ArrayBuffer(c * this._bufferCapacity), e = 0; e < b.length; e++) a[e] = new cc.V2F_C4B_T2F_Triangle(b[e].a, b[e].b, b[e].c, d, e * c);
                this._trianglesReader = new Uint8Array(d);
                this._trianglesArrayBuffer = d;
                this._buffer = a
            }
        }
    },
    draw: function() {
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram.setUniformsForBuiltins();
        this._render()
    },
    drawDot: function(a, b, c) {
        c = c ||
            this.getDrawColor();
        null == c.a && (c.a = 255);
        var d = {
            r: 0 | c.r,
            g: 0 | c.g,
            b: 0 | c.b,
            a: 0 | c.a
        };
        c = {
            vertices: {
                x: a.x - b,
                y: a.y - b
            },
            colors: d,
            texCoords: {
                u: -1,
                v: -1
            }
        };
        var e = {
                vertices: {
                    x: a.x - b,
                    y: a.y + b
                },
                colors: d,
                texCoords: {
                    u: -1,
                    v: 1
                }
            },
            f = {
                vertices: {
                    x: a.x + b,
                    y: a.y + b
                },
                colors: d,
                texCoords: {
                    u: 1,
                    v: 1
                }
            };
        a = {
            vertices: {
                x: a.x + b,
                y: a.y - b
            },
            colors: d,
            texCoords: {
                u: 1,
                v: -1
            }
        };
        this._ensureCapacity(6);
        this._buffer.push(new cc.V2F_C4B_T2F_Triangle(c, e, f, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
        this._buffer.push(new cc.V2F_C4B_T2F_Triangle(c,
            f, a, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
        this._dirty = !0
    },
    drawDots: function(a, b, c) {
        if (a && 0 != a.length) {
            c = c || this.getDrawColor();
            null == c.a && (c.a = 255);
            for (var d = 0, e = a.length; d < e; d++) this.drawDot(a[d], b, c)
        }
    },
    drawSegment: function(a, b, c, d) {
        d = d || this.getDrawColor();
        null == d.a && (d.a = 255);
        c = c || 0.5 * this._lineWidth;
        this._ensureCapacity(18);
        d = {
            r: 0 | d.r,
            g: 0 | d.g,
            b: 0 | d.b,
            a: 0 | d.a
        };
        var e = cc.__v2f(a),
            f = cc.__v2f(b);
        b = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(f, e)));
        a = cc.v2fperp(b);
        var g = cc.v2fmult(b, c),
            h = cc.v2fmult(a, c);
        c = cc.v2fsub(f, cc.v2fadd(g, h));
        var k = cc.v2fadd(f, cc.v2fsub(g, h)),
            m = cc.v2fsub(f, g),
            f = cc.v2fadd(f, g),
            n = cc.v2fsub(e, g),
            q = cc.v2fadd(e, g),
            s = cc.v2fsub(e, cc.v2fsub(g, h)),
            e = cc.v2fadd(e, cc.v2fadd(g, h)),
            g = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT,
            h = this._trianglesArrayBuffer,
            r = this._buffer;
        r.push(new cc.V2F_C4B_T2F_Triangle({
                vertices: c,
                colors: d,
                texCoords: cc.__t(cc.v2fneg(cc.v2fadd(b, a)))
            }, {
                vertices: k,
                colors: d,
                texCoords: cc.__t(cc.v2fsub(b, a))
            }, {
                vertices: m,
                colors: d,
                texCoords: cc.__t(cc.v2fneg(b))
            },
            h, r.length * g));
        r.push(new cc.V2F_C4B_T2F_Triangle({
            vertices: f,
            colors: d,
            texCoords: cc.__t(b)
        }, {
            vertices: k,
            colors: d,
            texCoords: cc.__t(cc.v2fsub(b, a))
        }, {
            vertices: m,
            colors: d,
            texCoords: cc.__t(cc.v2fneg(b))
        }, h, r.length * g));
        r.push(new cc.V2F_C4B_T2F_Triangle({
            vertices: f,
            colors: d,
            texCoords: cc.__t(b)
        }, {
            vertices: n,
            colors: d,
            texCoords: cc.__t(cc.v2fneg(b))
        }, {
            vertices: m,
            colors: d,
            texCoords: cc.__t(cc.v2fneg(b))
        }, h, r.length * g));
        r.push(new cc.V2F_C4B_T2F_Triangle({
            vertices: f,
            colors: d,
            texCoords: cc.__t(b)
        }, {
            vertices: n,
            colors: d,
            texCoords: cc.__t(cc.v2fneg(b))
        }, {
            vertices: q,
            colors: d,
            texCoords: cc.__t(b)
        }, h, r.length * g));
        r.push(new cc.V2F_C4B_T2F_Triangle({
            vertices: s,
            colors: d,
            texCoords: cc.__t(cc.v2fsub(a, b))
        }, {
            vertices: n,
            colors: d,
            texCoords: cc.__t(cc.v2fneg(b))
        }, {
            vertices: q,
            colors: d,
            texCoords: cc.__t(b)
        }, h, r.length * g));
        r.push(new cc.V2F_C4B_T2F_Triangle({
            vertices: s,
            colors: d,
            texCoords: cc.__t(cc.v2fsub(a, b))
        }, {
            vertices: e,
            colors: d,
            texCoords: cc.__t(cc.v2fadd(b, a))
        }, {
            vertices: q,
            colors: d,
            texCoords: cc.__t(b)
        }, h, r.length * g));
        this._dirty = !0
    },
    drawPoly: function(a, b, c, d) {
        if (null == b) this._drawSegments(a, c, d, !0);
        else {
            null == b.a && (b.a = 255);
            null == d.a && (d.a = 255);
            c = c || this._lineWidth;
            c *= 0.5;
            b = {
                r: 0 | b.r,
                g: 0 | b.g,
                b: 0 | b.b,
                a: 0 | b.a
            };
            d = {
                r: 0 | d.r,
                g: 0 | d.g,
                b: 0 | d.b,
                a: 0 | d.a
            };
            var e = [],
                f, g, h, k, m = a.length;
            for (f = 0; f < m; f++) {
                g = cc.__v2f(a[(f - 1 + m) % m]);
                h = cc.__v2f(a[f]);
                k = cc.__v2f(a[(f + 1) % m]);
                var n = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(h, g)));
                h = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(k, h)));
                n = cc.v2fmult(cc.v2fadd(n, h), 1 / (cc.v2fdot(n, h) + 1));
                e[f] = {
                    offset: n,
                    n: h
                }
            }
            n = 0 < c;
            this._ensureCapacity(3 *
                (3 * m - 2));
            var q = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT,
                s = this._trianglesArrayBuffer,
                r = this._buffer,
                u = !1 == n ? 0.5 : 0;
            for (f = 0; f < m - 2; f++) g = cc.v2fsub(cc.__v2f(a[0]), cc.v2fmult(e[0].offset, u)), h = cc.v2fsub(cc.__v2f(a[f + 1]), cc.v2fmult(e[f + 1].offset, u)), k = cc.v2fsub(cc.__v2f(a[f + 2]), cc.v2fmult(e[f + 2].offset, u)), r.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: g,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, {
                    vertices: h,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, {
                    vertices: k,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, s, r.length *
                q));
            for (f = 0; f < m; f++) {
                u = (f + 1) % m;
                g = cc.__v2f(a[f]);
                h = cc.__v2f(a[u]);
                k = e[f].n;
                var t = e[f].offset,
                    v = e[u].offset,
                    u = n ? cc.v2fsub(g, cc.v2fmult(t, c)) : cc.v2fsub(g, cc.v2fmult(t, 0.5)),
                    w = n ? cc.v2fsub(h, cc.v2fmult(v, c)) : cc.v2fsub(h, cc.v2fmult(v, 0.5));
                g = n ? cc.v2fadd(g, cc.v2fmult(t, c)) : cc.v2fadd(g, cc.v2fmult(t, 0.5));
                h = n ? cc.v2fadd(h, cc.v2fmult(v, c)) : cc.v2fadd(h, cc.v2fmult(v, 0.5));
                n ? (r.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: u,
                    colors: d,
                    texCoords: cc.__t(cc.v2fneg(k))
                }, {
                    vertices: w,
                    colors: d,
                    texCoords: cc.__t(cc.v2fneg(k))
                }, {
                    vertices: h,
                    colors: d,
                    texCoords: cc.__t(k)
                }, s, r.length * q)), r.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: u,
                    colors: d,
                    texCoords: cc.__t(cc.v2fneg(k))
                }, {
                    vertices: g,
                    colors: d,
                    texCoords: cc.__t(k)
                }, {
                    vertices: h,
                    colors: d,
                    texCoords: cc.__t(k)
                }, s, r.length * q))) : (r.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: u,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, {
                    vertices: w,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, {
                    vertices: h,
                    colors: b,
                    texCoords: cc.__t(k)
                }, s, r.length * q)), r.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: u,
                    colors: b,
                    texCoords: cc.__t(cc.v2fzero())
                }, {
                    vertices: g,
                    colors: b,
                    texCoords: cc.__t(k)
                }, {
                    vertices: h,
                    colors: b,
                    texCoords: cc.__t(k)
                }, s, r.length * q)))
            }
            this._dirty = !0
        }
    },
    _drawSegments: function(a, b, c, d) {
        b = b || this._lineWidth;
        c = c || this._drawColor;
        null == c.a && (c.a = 255);
        b *= 0.5;
        if (!(0 >= b)) {
            c = {
                r: 0 | c.r,
                g: 0 | c.g,
                b: 0 | c.b,
                a: 0 | c.a
            };
            var e = [],
                f, g, h, k, m = a.length;
            for (f = 0; f < m; f++) {
                g = cc.__v2f(a[(f - 1 + m) % m]);
                h = cc.__v2f(a[f]);
                k = cc.__v2f(a[(f + 1) % m]);
                var n = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(h, g)));
                h = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(k, h)));
                k = cc.v2fmult(cc.v2fadd(n, h),
                    1 / (cc.v2fdot(n, h) + 1));
                e[f] = {
                    offset: k,
                    n: h
                }
            }
            this._ensureCapacity(3 * (3 * m - 2));
            k = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT;
            var n = this._trianglesArrayBuffer,
                q = this._buffer;
            d = d ? m : m - 1;
            for (f = 0; f < d; f++) {
                var s = (f + 1) % m;
                g = cc.__v2f(a[f]);
                h = cc.__v2f(a[s]);
                var r = e[f].n,
                    u = e[f].offset,
                    t = e[s].offset,
                    s = cc.v2fsub(g, cc.v2fmult(u, b)),
                    v = cc.v2fsub(h, cc.v2fmult(t, b));
                g = cc.v2fadd(g, cc.v2fmult(u, b));
                h = cc.v2fadd(h, cc.v2fmult(t, b));
                q.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: s,
                    colors: c,
                    texCoords: cc.__t(cc.v2fneg(r))
                }, {
                    vertices: v,
                    colors: c,
                    texCoords: cc.__t(cc.v2fneg(r))
                }, {
                    vertices: h,
                    colors: c,
                    texCoords: cc.__t(r)
                }, n, q.length * k));
                q.push(new cc.V2F_C4B_T2F_Triangle({
                    vertices: s,
                    colors: c,
                    texCoords: cc.__t(cc.v2fneg(r))
                }, {
                    vertices: g,
                    colors: c,
                    texCoords: cc.__t(r)
                }, {
                    vertices: h,
                    colors: c,
                    texCoords: cc.__t(r)
                }, n, q.length * k))
            }
            this._dirty = !0
        }
    },
    clear: function() {
        this._buffer.length = 0;
        this._dirty = !0
    }
});
cc.DrawNode = cc._renderType == cc._RENDER_TYPE_WEBGL ? cc.DrawNodeWebGL : cc.DrawNodeCanvas;
cc.DrawNode.create = function() {
    return new cc.DrawNode
};
cc._DrawNodeElement = function(a, b, c, d, e, f, g, h, k) {
    this.type = a;
    this.verts = b || null;
    this.fillColor = c || null;
    this.lineWidth = d || 0;
    this.lineColor = e || null;
    this.lineCap = f || "butt";
    this.isClosePolygon = g || !1;
    this.isFill = h || !1;
    this.isStroke = k || !1
};
cc.DrawNode.TYPE_DOT = 0;
cc.DrawNode.TYPE_SEGMENT = 1;
cc.DrawNode.TYPE_POLY = 2;
cc.ActionInterval = cc.FiniteTimeAction.extend({
    _elapsed: 0,
    _firstTick: !1,
    _easeList: null,
    _times: 1,
    _repeatForever: !1,
    _repeatMethod: !1,
    _speed: 1,
    _speedMethod: !1,
    ctor: function(a) {
        this._times = this._speed = 1;
        this._repeatForever = !1;
        this.MAX_VALUE = 2;
        this._speedMethod = this._repeatMethod = !1;
        cc.FiniteTimeAction.prototype.ctor.call(this);
        void 0 !== a && this.initWithDuration(a)
    },
    getElapsed: function() {
        return this._elapsed
    },
    initWithDuration: function(a) {
        this._duration = 0 === a ? cc.FLT_EPSILON : a;
        this._elapsed = 0;
        return this._firstTick = !0
    },
    isDone: function() {
        return this._elapsed >= this._duration
    },
    _cloneDecoration: function(a) {
        a._repeatForever = this._repeatForever;
        a._speed = this._speed;
        a._times = this._times;
        a._easeList = this._easeList;
        a._speedMethod = this._speedMethod;
        a._repeatMethod = this._repeatMethod
    },
    _reverseEaseList: function(a) {
        if (this._easeList) {
            a._easeList = [];
            for (var b = 0; b < this._easeList.length; b++) a._easeList.push(this._easeList[b].reverse())
        }
    },
    clone: function() {
        var a = new cc.ActionInterval(this._duration);
        this._cloneDecoration(a);
        return a
    },
    easing: function(a) {
        this._easeList ? this._easeList.length = 0 : this._easeList = [];
        for (var b = 0; b < arguments.length; b++) this._easeList.push(arguments[b]);
        return this
    },
    _computeEaseTime: function(a) {
        var b = this._easeList;
        if (!b || 0 === b.length) return a;
        for (var c = 0, d = b.length; c < d; c++) a = b[c].easing(a);
        return a
    },
    step: function(a) {
        this._firstTick ? (this._firstTick = !1, this._elapsed = 0) : this._elapsed += a;
        a = this._elapsed / (1.192092896E-7 < this._duration ? this._duration : 1.192092896E-7);
        a = 1 > a ? a : 1;
        this.update(0 < a ? a : 0);
        this._repeatMethod && (1 < this._times && this.isDone()) && (this._repeatForever || this._times--, this.startWithTarget(this.target), this.step(this._elapsed - this._duration))
    },
    startWithTarget: function(a) {
        cc.Action.prototype.startWithTarget.call(this, a);
        this._elapsed = 0;
        this._firstTick = !0
    },
    reverse: function() {
        cc.log("cc.IntervalAction: reverse not implemented.");
        return null
    },
    setAmplitudeRate: function(a) {
        cc.log("cc.ActionInterval.setAmplitudeRate(): it should be overridden in subclass.")
    },
    getAmplitudeRate: function() {
        cc.log("cc.ActionInterval.getAmplitudeRate(): it should be overridden in subclass.");
        return 0
    },
    speed: function(a) {
        if (0 >= a) return cc.log("The speed parameter error"), this;
        this._speedMethod = !0;
        this._speed *= a;
        return this
    },
    getSpeed: function() {
        return this._speed
    },
    setSpeed: function(a) {
        this._speed = a;
        return this
    },
    repeat: function(a) {
        a = Math.round(a);
        if (isNaN(a) || 1 > a) return cc.log("The repeat parameter error"), this;
        this._repeatMethod = !0;
        this._times *= a;
        return this
    },
    repeatForever: function() {
        this._repeatMethod = !0;
        this._times = this.MAX_VALUE;
        this._repeatForever = !0;
        return this
    }
});
cc.ActionInterval.create = function(a) {
    return new cc.ActionInterval(a)
};
cc.Sequence = cc.ActionInterval.extend({
    _actions: null,
    _split: null,
    _last: 0,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._actions = [];
        var b = a instanceof Array ? a : arguments,
            c = b.length - 1;
        0 <= c && null == b[c] && cc.log("parameters should not be ending with null in Javascript");
        if (0 <= c) {
            for (var d = b[0], e, f = 1; f < c; f++) b[f] && (e = d, d = cc.Sequence.create(), d.initWithTwoActions(e, b[f]));
            this.initWithTwoActions(d, b[c])
        }
    },
    initWithTwoActions: function(a, b) {
        if (!a || !b) throw "cc.Sequence.initWithTwoActions(): arguments must all be non nil";
        this.initWithDuration(a._duration + b._duration);
        this._actions[0] = a;
        this._actions[1] = b;
        return !0
    },
    clone: function() {
        var a = new cc.Sequence;
        this._cloneDecoration(a);
        a.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._split = this._actions[0]._duration / this._duration;
        this._last = -1
    },
    stop: function() {
        -1 !== this._last && this._actions[this._last].stop();
        cc.Action.prototype.stop.call(this)
    },
    update: function(a) {
        a =
            this._computeEaseTime(a);
        var b = 0,
            c = this._split,
            d = this._actions,
            e = this._last;
        a < c ? (a = 0 !== c ? a / c : 1, 0 === b && 1 === e && (d[1].update(0), d[1].stop())) : (b = 1, a = 1 === c ? 1 : (a - c) / (1 - c), -1 === e && (d[0].startWithTarget(this.target), d[0].update(1), d[0].stop()), e || (d[0].update(1), d[0].stop()));
        e === b && d[b].isDone() || (e !== b && d[b].startWithTarget(this.target), d[b].update(a), this._last = b)
    },
    reverse: function() {
        var a = cc.Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.Sequence.create = function(a) {
    var b = a instanceof Array ? a : arguments;
    0 < b.length && null == b[b.length - 1] && cc.log("parameters should not be ending with null in Javascript");
    for (var c = b[0], d = 1; d < b.length; d++) b[d] && (c = cc.Sequence._actionOneTwo(c, b[d]));
    return c
};
cc.Sequence._actionOneTwo = function(a, b) {
    var c = new cc.Sequence;
    c.initWithTwoActions(a, b);
    return c
};
cc.Repeat = cc.ActionInterval.extend({
    _times: 0,
    _total: 0,
    _nextDt: 0,
    _actionInstant: !1,
    _innerAction: null,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithAction(a, b)
    },
    initWithAction: function(a, b) {
        return this.initWithDuration(a._duration * b) ? (this._times = b, this._innerAction = a, a instanceof cc.ActionInstant && (this._actionInstant = !0, this._times -= 1), this._total = 0, !0) : !1
    },
    clone: function() {
        var a = new cc.Repeat;
        this._cloneDecoration(a);
        a.initWithAction(this._innerAction.clone(),
            this._times);
        return a
    },
    startWithTarget: function(a) {
        this._total = 0;
        this._nextDt = this._innerAction._duration / this._duration;
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._innerAction.startWithTarget(a)
    },
    stop: function() {
        this._innerAction.stop();
        cc.Action.prototype.stop.call(this)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        var b = this._innerAction,
            c = this._duration,
            d = this._times,
            e = this._nextDt;
        if (a >= e) {
            for (; a > e && this._total < d;) b.update(1), this._total++, b.stop(), b.startWithTarget(this.target),
                this._nextDt = e += b._duration / c;
            1 <= a && this._total < d && this._total++;
            this._actionInstant || (this._total === d ? (b.update(1), b.stop()) : b.update(a - (e - b._duration / c)))
        } else b.update(a * d % 1)
    },
    isDone: function() {
        return this._total == this._times
    },
    reverse: function() {
        var a = cc.Repeat.create(this._innerAction.reverse(), this._times);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    setInnerAction: function(a) {
        this._innerAction != a && (this._innerAction = a)
    },
    getInnerAction: function() {
        return this._innerAction
    }
});
cc.Repeat.create = function(a, b) {
    return new cc.Repeat(a, b)
};
cc.RepeatForever = cc.ActionInterval.extend({
    _innerAction: null,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._innerAction = null;
        a && this.initWithAction(a)
    },
    initWithAction: function(a) {
        if (!a) throw "cc.RepeatForever.initWithAction(): action must be non null";
        this._innerAction = a;
        return !0
    },
    clone: function() {
        var a = new cc.RepeatForever;
        this._cloneDecoration(a);
        a.initWithAction(this._innerAction.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._innerAction.startWithTarget(a)
    },
    step: function(a) {
        var b = this._innerAction;
        b.step(a);
        b.isDone() && (b.startWithTarget(this.target), b.step(b.getElapsed() - b._duration))
    },
    isDone: function() {
        return !1
    },
    reverse: function() {
        var a = cc.RepeatForever.create(this._innerAction.reverse());
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    setInnerAction: function(a) {
        this._innerAction != a && (this._innerAction = a)
    },
    getInnerAction: function() {
        return this._innerAction
    }
});
cc.RepeatForever.create = function(a) {
    return new cc.RepeatForever(a)
};
cc.Spawn = cc.ActionInterval.extend({
    _one: null,
    _two: null,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._two = this._one = null;
        var b = a instanceof Array ? a : arguments,
            c = b.length - 1;
        0 <= c && null == b[c] && cc.log("parameters should not be ending with null in Javascript");
        if (0 <= c) {
            for (var d = b[0], e, f = 1; f < c; f++) b[f] && (e = d, d = cc.Spwan.create(), d.initWithTwoActions(e, b[f]));
            this.initWithTwoActions(d, b[c])
        }
    },
    initWithTwoActions: function(a, b) {
        if (!a || !b) throw "cc.Spawn.initWithTwoActions(): arguments must all be non null";
        var c = !1,
            d = a._duration,
            e = b._duration;
        this.initWithDuration(Math.max(d, e)) && (this._one = a, this._two = b, d > e ? this._two = cc.Sequence._actionOneTwo(b, cc.DelayTime.create(d - e)) : d < e && (this._one = cc.Sequence._actionOneTwo(a, cc.DelayTime.create(e - d))), c = !0);
        return c
    },
    clone: function() {
        var a = new cc.Spawn;
        this._cloneDecoration(a);
        a.initWithTwoActions(this._one.clone(), this._two.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._one.startWithTarget(a);
        this._two.startWithTarget(a)
    },
    stop: function() {
        this._one.stop();
        this._two.stop();
        cc.Action.prototype.stop.call(this)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this._one && this._one.update(a);
        this._two && this._two.update(a)
    },
    reverse: function() {
        var a = cc.Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.Spawn.create = function(a) {
    var b = a instanceof Array ? a : arguments;
    0 < b.length && null == b[b.length - 1] && cc.log("parameters should not be ending with null in Javascript");
    for (var c = b[0], d = 1; d < b.length; d++) null != b[d] && (c = this._actionOneTwo(c, b[d]));
    return c
};
cc.Spawn._actionOneTwo = function(a, b) {
    var c = new cc.Spawn;
    c.initWithTwoActions(a, b);
    return c
};
cc.RotateTo = cc.ActionInterval.extend({
    _dstAngleX: 0,
    _startAngleX: 0,
    _diffAngleX: 0,
    _dstAngleY: 0,
    _startAngleY: 0,
    _diffAngleY: 0,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._dstAngleX = b || 0, this._dstAngleY = c || this._dstAngleX, !0) : !1
    },
    clone: function() {
        var a = new cc.RotateTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._dstAngleX,
            this._dstAngleY);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        var b = a.rotationX % 360,
            c = this._dstAngleX - b;
        180 < c && (c -= 360); - 180 > c && (c += 360);
        this._startAngleX = b;
        this._diffAngleX = c;
        this._startAngleY = a.rotationY % 360;
        a = this._dstAngleY - this._startAngleY;
        180 < a && (a -= 360); - 180 > a && (a += 360);
        this._diffAngleY = a
    },
    reverse: function() {
        cc.log("cc.RotateTo.reverse(): it should be overridden in subclass.")
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this.target && (this.target.rotationX =
            this._startAngleX + this._diffAngleX * a, this.target.rotationY = this._startAngleY + this._diffAngleY * a)
    }
});
cc.RotateTo.create = function(a, b, c) {
    return new cc.RotateTo(a, b, c)
};
cc.RotateBy = cc.ActionInterval.extend({
    _angleX: 0,
    _startAngleX: 0,
    _angleY: 0,
    _startAngleY: 0,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._angleX = b || 0, this._angleY = c || this._angleX, !0) : !1
    },
    clone: function() {
        var a = new cc.RotateBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._angleX, this._angleY);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        this._startAngleX = a.rotationX;
        this._startAngleY = a.rotationY
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this.target && (this.target.rotationX = this._startAngleX + this._angleX * a, this.target.rotationY = this._startAngleY + this._angleY * a)
    },
    reverse: function() {
        var a = cc.RotateBy.create(this._duration, -this._angleX, -this._angleY);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.RotateBy.create = function(a, b, c) {
    var d = new cc.RotateBy;
    d.initWithDuration(a, b, c);
    return d
};
cc.MoveBy = cc.ActionInterval.extend({
    _positionDelta: null,
    _startPosition: null,
    _previousPosition: null,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._positionDelta = cc.p(0, 0);
        this._startPosition = cc.p(0, 0);
        this._previousPosition = cc.p(0, 0);
        void 0 !== b && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (void 0 !== b.x && (c = b.y, b = b.x), this._positionDelta.x = b, this._positionDelta.y = c, !0) : !1
    },
    clone: function() {
        var a =
            new cc.MoveBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._positionDelta);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        var b = a.getPositionX();
        a = a.getPositionY();
        this._previousPosition.x = b;
        this._previousPosition.y = a;
        this._startPosition.x = b;
        this._startPosition.y = a
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        if (this.target) {
            var b = this._positionDelta.x * a;
            a *= this._positionDelta.y;
            var c = this._startPosition;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var d =
                    this.target.getPositionX(),
                    e = this.target.getPositionY(),
                    f = this._previousPosition;
                c.x = c.x + d - f.x;
                c.y = c.y + e - f.y;
                b += c.x;
                a += c.y;
                f.x = b;
                f.y = a;
                this.target.setPosition(b, a)
            } else this.target.setPosition(c.x + b, c.y + a)
        }
    },
    reverse: function() {
        var a = cc.MoveBy.create(this._duration, cc.p(-this._positionDelta.x, -this._positionDelta.y));
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.MoveBy.create = function(a, b, c) {
    return new cc.MoveBy(a, b, c)
};
cc.MoveTo = cc.MoveBy.extend({
    _endPosition: null,
    ctor: function(a, b, c) {
        cc.MoveBy.prototype.ctor.call(this);
        this._endPosition = cc.p(0, 0);
        void 0 !== b && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.MoveBy.prototype.initWithDuration.call(this, a, b, c) ? (void 0 !== b.x && (c = b.y, b = b.x), this._endPosition.x = b, this._endPosition.y = c, !0) : !1
    },
    clone: function() {
        var a = new cc.MoveTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._endPosition);
        return a
    },
    startWithTarget: function(a) {
        cc.MoveBy.prototype.startWithTarget.call(this,
            a);
        this._positionDelta.x = this._endPosition.x - a.getPositionX();
        this._positionDelta.y = this._endPosition.y - a.getPositionY()
    }
});
cc.MoveTo.create = function(a, b, c) {
    return new cc.MoveTo(a, b, c)
};
cc.SkewTo = cc.ActionInterval.extend({
    _skewX: 0,
    _skewY: 0,
    _startSkewX: 0,
    _startSkewY: 0,
    _endSkewX: 0,
    _endSkewY: 0,
    _deltaX: 0,
    _deltaY: 0,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== c && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        var d = !1;
        cc.ActionInterval.prototype.initWithDuration.call(this, a) && (this._endSkewX = b, this._endSkewY = c, d = !0);
        return d
    },
    clone: function() {
        var a = new cc.SkewTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._startSkewX = a.skewX % 180;
        this._deltaX = this._endSkewX - this._startSkewX;
        180 < this._deltaX && (this._deltaX -= 360); - 180 > this._deltaX && (this._deltaX += 360);
        this._startSkewY = a.skewY % 360;
        this._deltaY = this._endSkewY - this._startSkewY;
        180 < this._deltaY && (this._deltaY -= 360); - 180 > this._deltaY && (this._deltaY += 360)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this.target.skewX = this._startSkewX + this._deltaX * a;
        this.target.skewY =
            this._startSkewY + this._deltaY * a
    }
});
cc.SkewTo.create = function(a, b, c) {
    return new cc.SkewTo(a, b, c)
};
cc.SkewBy = cc.SkewTo.extend({
    ctor: function(a, b, c) {
        cc.SkewTo.prototype.ctor.call(this);
        void 0 !== c && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        var d = !1;
        cc.SkewTo.prototype.initWithDuration.call(this, a, b, c) && (this._skewX = b, this._skewY = c, d = !0);
        return d
    },
    clone: function() {
        var a = new cc.SkewBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._skewX, this._skewY);
        return a
    },
    startWithTarget: function(a) {
        cc.SkewTo.prototype.startWithTarget.call(this, a);
        this._deltaX = this._skewX;
        this._deltaY = this._skewY;
        this._endSkewX = this._startSkewX + this._deltaX;
        this._endSkewY = this._startSkewY + this._deltaY
    },
    reverse: function() {
        var a = cc.SkewBy.create(this._duration, -this._skewX, -this._skewY);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.SkewBy.create = function(a, b, c) {
    var d = new cc.SkewBy;
    d && d.initWithDuration(a, b, c);
    return d
};
cc.JumpBy = cc.ActionInterval.extend({
    _startPosition: null,
    _delta: null,
    _height: 0,
    _jumps: 0,
    _previousPosition: null,
    ctor: function(a, b, c, d, e) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._startPosition = cc.p(0, 0);
        this._previousPosition = cc.p(0, 0);
        this._delta = cc.p(0, 0);
        void 0 !== d && this.initWithDuration(a, b, c, d, e)
    },
    initWithDuration: function(a, b, c, d, e) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (void 0 === e && (e = d, d = c, c = b.y, b = b.x), this._delta.x = b, this._delta.y = c, this._height = d, this._jumps =
            e, !0) : !1
    },
    clone: function() {
        var a = new cc.JumpBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._delta, this._height, this._jumps);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        var b = a.getPositionX();
        a = a.getPositionY();
        this._previousPosition.x = b;
        this._previousPosition.y = a;
        this._startPosition.x = b;
        this._startPosition.y = a
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        if (this.target) {
            var b = a * this._jumps % 1,
                b = 4 * this._height * b * (1 - b),
                b = b + this._delta.y *
                a;
            a *= this._delta.x;
            var c = this._startPosition;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var d = this.target.getPositionX(),
                    e = this.target.getPositionY(),
                    f = this._previousPosition;
                c.x = c.x + d - f.x;
                c.y = c.y + e - f.y;
                a += c.x;
                b += c.y;
                f.x = a;
                f.y = b;
                this.target.setPosition(a, b)
            } else this.target.setPosition(c.x + a, c.y + b)
        }
    },
    reverse: function() {
        var a = cc.JumpBy.create(this._duration, cc.p(-this._delta.x, -this._delta.y), this._height, this._jumps);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.JumpBy.create = function(a, b, c, d, e) {
    return new cc.JumpBy(a, b, c, d, e)
};
cc.JumpTo = cc.JumpBy.extend({
    _endPosition: null,
    ctor: function(a, b, c, d, e) {
        cc.JumpBy.prototype.ctor.call(this);
        this._endPosition = cc.p(0, 0);
        void 0 !== d && this.initWithDuration(a, b, c, d, e)
    },
    initWithDuration: function(a, b, c, d, e) {
        return cc.JumpBy.prototype.initWithDuration.call(this, a, b, c, d, e) ? (void 0 === e && (c = b.y, b = b.x), this._endPosition.x = b, this._endPosition.y = c, !0) : !1
    },
    startWithTarget: function(a) {
        cc.JumpBy.prototype.startWithTarget.call(this, a);
        this._delta.x = this._endPosition.x - this._startPosition.x;
        this._delta.y =
            this._endPosition.y - this._startPosition.y
    },
    clone: function() {
        var a = new cc.JumpTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._endPosition, this._height, this._jumps);
        return a
    }
});
cc.JumpTo.create = function(a, b, c, d, e) {
    return new cc.JumpTo(a, b, c, d, e)
};
cc.bezierAt = function(a, b, c, d, e) {
    return Math.pow(1 - e, 3) * a + 3 * e * Math.pow(1 - e, 2) * b + 3 * Math.pow(e, 2) * (1 - e) * c + Math.pow(e, 3) * d
};
cc.BezierBy = cc.ActionInterval.extend({
    _config: null,
    _startPosition: null,
    _previousPosition: null,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._config = [];
        this._startPosition = cc.p(0, 0);
        this._previousPosition = cc.p(0, 0);
        b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._config = b, !0) : !1
    },
    clone: function() {
        var a = new cc.BezierBy;
        this._cloneDecoration(a);
        for (var b = [], c = 0; c < this._config.length; c++) {
            var d =
                this._config[c];
            b.push(cc.p(d.x, d.y))
        }
        a.initWithDuration(this._duration, b);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        var b = a.getPositionX();
        a = a.getPositionY();
        this._previousPosition.x = b;
        this._previousPosition.y = a;
        this._startPosition.x = b;
        this._startPosition.y = a
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        if (this.target) {
            var b = this._config,
                c = b[0].y,
                d = b[1].y,
                e = b[2].y,
                b = cc.bezierAt(0, b[0].x, b[1].x, b[2].x, a);
            a = cc.bezierAt(0, c, d, e, a);
            c = this._startPosition;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var d = this.target.getPositionX(),
                    e = this.target.getPositionY(),
                    f = this._previousPosition;
                c.x = c.x + d - f.x;
                c.y = c.y + e - f.y;
                b += c.x;
                a += c.y;
                f.x = b;
                f.y = a;
                this.target.setPosition(b, a)
            } else this.target.setPosition(c.x + b, c.y + a)
        }
    },
    reverse: function() {
        var a = this._config,
            a = [cc.pAdd(a[1], cc.pNeg(a[2])), cc.pAdd(a[0], cc.pNeg(a[2])), cc.pNeg(a[2])],
            a = cc.BezierBy.create(this._duration, a);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.BezierBy.create = function(a, b) {
    return new cc.BezierBy(a, b)
};
cc.BezierTo = cc.BezierBy.extend({
    _toConfig: null,
    ctor: function(a, b) {
        cc.BezierBy.prototype.ctor.call(this);
        this._toConfig = [];
        b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._toConfig = b, !0) : !1
    },
    clone: function() {
        var a = new cc.BezierTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._toConfig);
        return a
    },
    startWithTarget: function(a) {
        cc.BezierBy.prototype.startWithTarget.call(this, a);
        a = this._startPosition;
        var b =
            this._toConfig,
            c = this._config;
        c[0] = cc.pSub(b[0], a);
        c[1] = cc.pSub(b[1], a);
        c[2] = cc.pSub(b[2], a)
    }
});
cc.BezierTo.create = function(a, b) {
    return new cc.BezierTo(a, b)
};
cc.ScaleTo = cc.ActionInterval.extend({
    _scaleX: 1,
    _scaleY: 1,
    _startScaleX: 1,
    _startScaleY: 1,
    _endScaleX: 0,
    _endScaleY: 0,
    _deltaX: 0,
    _deltaY: 0,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._endScaleX = b, this._endScaleY = null != c ? c : b, !0) : !1
    },
    clone: function() {
        var a = new cc.ScaleTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._endScaleX,
            this._endScaleY);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._startScaleX = a.scaleX;
        this._startScaleY = a.scaleY;
        this._deltaX = this._endScaleX - this._startScaleX;
        this._deltaY = this._endScaleY - this._startScaleY
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this.target && (this.target.scaleX = this._startScaleX + this._deltaX * a, this.target.scaleY = this._startScaleY + this._deltaY * a)
    }
});
cc.ScaleTo.create = function(a, b, c) {
    var d = new cc.ScaleTo;
    d.initWithDuration(a, b, c);
    return d
};
cc.ScaleBy = cc.ScaleTo.extend({
    startWithTarget: function(a) {
        cc.ScaleTo.prototype.startWithTarget.call(this, a);
        this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
        this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY
    },
    reverse: function() {
        var a = cc.ScaleBy.create(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    clone: function() {
        var a = new cc.ScaleBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._endScaleX,
            this._endScaleY);
        return a
    }
});
cc.ScaleBy.create = function(a, b, c) {
    return new cc.ScaleBy(a, b, c)
};
cc.Blink = cc.ActionInterval.extend({
    _times: 0,
    _originalState: !1,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._times = b, !0) : !1
    },
    clone: function() {
        var a = new cc.Blink;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._times);
        return a
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        if (this.target && !this.isDone()) {
            var b = 1 / this._times;
            this.target.visible =
                a % b > b / 2
        }
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._originalState = a.visible
    },
    stop: function() {
        this.target.visible = this._originalState;
        cc.ActionInterval.prototype.stop.call(this)
    },
    reverse: function() {
        var a = cc.Blink.create(this._duration, this._times);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.Blink.create = function(a, b) {
    var c = new cc.Blink;
    c.initWithDuration(a, b);
    return c
};
cc.FadeTo = cc.ActionInterval.extend({
    _toOpacity: 0,
    _fromOpacity: 0,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._toOpacity = b, !0) : !1
    },
    clone: function() {
        var a = new cc.FadeTo;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._toOpacity);
        return a
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        if (this.target.RGBAProtocol) {
            var b = void 0 !==
                this._fromOpacity ? this._fromOpacity : 255;
            this.target.opacity = b + (this._toOpacity - b) * a
        }
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this.target.RGBAProtocol && (this._fromOpacity = a.opacity)
    }
});
cc.FadeTo.create = function(a, b) {
    return new cc.FadeTo(a, b)
};
cc.FadeIn = cc.FadeTo.extend({
    _reverseAction: null,
    reverse: function() {
        var a = new cc.FadeOut;
        a.initWithDuration(this._duration, 0);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    clone: function() {
        var a = new cc.FadeIn;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._toOpacity);
        return a
    },
    startWithTarget: function(a) {
        this._reverseAction && (this._toOpacity = this._reverseAction._fromOpacity);
        cc.FadeTo.prototype.startWithTarget.call(this, a)
    }
});
cc.FadeIn.create = function(a) {
    return new cc.FadeIn(a, 255)
};
cc.FadeOut = cc.FadeTo.extend({
    reverse: function() {
        var a = new cc.FadeIn;
        a._reverseAction = this;
        a.initWithDuration(this._duration, 255);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    clone: function() {
        var a = new cc.FadeOut;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._toOpacity);
        return a
    }
});
cc.FadeOut.create = function(a) {
    var b = new cc.FadeOut;
    b.initWithDuration(a, 0);
    return b
};
cc.TintTo = cc.ActionInterval.extend({
    _to: null,
    _from: null,
    ctor: function(a, b, c, d) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._to = cc.color(0, 0, 0);
        this._from = cc.color(0, 0, 0);
        void 0 !== d && this.initWithDuration(a, b, c, d)
    },
    initWithDuration: function(a, b, c, d) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._to = cc.color(b, c, d), !0) : !1
    },
    clone: function() {
        var a = new cc.TintTo;
        this._cloneDecoration(a);
        var b = this._to;
        a.initWithDuration(this._duration, b.r, b.g, b.b);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        this.target.RGBAProtocol && (this._from = this.target.color)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        var b = this._from,
            c = this._to;
        b && this.target.RGBAProtocol && (this.target.color = cc.color(b.r + (c.r - b.r) * a, b.g + (c.g - b.g) * a, b.b + (c.b - b.b) * a))
    }
});
cc.TintTo.create = function(a, b, c, d) {
    return new cc.TintTo(a, b, c, d)
};
cc.TintBy = cc.ActionInterval.extend({
    _deltaR: 0,
    _deltaG: 0,
    _deltaB: 0,
    _fromR: 0,
    _fromG: 0,
    _fromB: 0,
    ctor: function(a, b, c, d) {
        cc.ActionInterval.prototype.ctor.call(this);
        void 0 !== d && this.initWithDuration(a, b, c, d)
    },
    initWithDuration: function(a, b, c, d) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._deltaR = b, this._deltaG = c, this._deltaB = d, !0) : !1
    },
    clone: function() {
        var a = new cc.TintBy;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration, this._deltaR, this._deltaG, this._deltaB);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        a.RGBAProtocol && (a = a.color, this._fromR = a.r, this._fromG = a.g, this._fromB = a.b)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this.target.RGBAProtocol && (this.target.color = cc.color(this._fromR + this._deltaR * a, this._fromG + this._deltaG * a, this._fromB + this._deltaB * a))
    },
    reverse: function() {
        var a = cc.TintBy.create(this._duration, -this._deltaR, -this._deltaG, -this._deltaB);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    }
});
cc.TintBy.create = function(a, b, c, d) {
    return new cc.TintBy(a, b, c, d)
};
cc.DelayTime = cc.ActionInterval.extend({
    update: function(a) {},
    reverse: function() {
        var a = cc.DelayTime.create(this._duration);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    clone: function() {
        var a = new cc.DelayTime;
        this._cloneDecoration(a);
        a.initWithDuration(this._duration);
        return a
    }
});
cc.DelayTime.create = function(a) {
    return new cc.DelayTime(a)
};
cc.ReverseTime = cc.ActionInterval.extend({
    _other: null,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._other = null;
        a && this.initWithAction(a)
    },
    initWithAction: function(a) {
        if (!a) throw "cc.ReverseTime.initWithAction(): action must be non null";
        if (a == this._other) throw "cc.ReverseTime.initWithAction(): the action was already passed in.";
        return cc.ActionInterval.prototype.initWithDuration.call(this, a._duration) ? (this._other = a, !0) : !1
    },
    clone: function() {
        var a = new cc.ReverseTime;
        this._cloneDecoration(a);
        a.initWithAction(this._other.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._other.startWithTarget(a)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this._other && this._other.update(1 - a)
    },
    reverse: function() {
        return this._other.clone()
    },
    stop: function() {
        this._other.stop();
        cc.Action.prototype.stop.call(this)
    }
});
cc.ReverseTime.create = function(a) {
    return new cc.ReverseTime(a)
};
cc.Animate = cc.ActionInterval.extend({
    _animation: null,
    _nextFrame: 0,
    _origFrame: null,
    _executedLoops: 0,
    _splitTimes: null,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._splitTimes = [];
        a && this.initWithAnimation(a)
    },
    getAnimation: function() {
        return this._animation
    },
    setAnimation: function(a) {
        this._animation = a
    },
    initWithAnimation: function(a) {
        if (!a) throw "cc.Animate.initWithAnimation(): animation must be non-NULL";
        var b = a.getDuration();
        if (this.initWithDuration(b * a.getLoops())) {
            this._nextFrame =
                0;
            this.setAnimation(a);
            this._origFrame = null;
            this._executedLoops = 0;
            var c = this._splitTimes,
                d = c.length = 0,
                e = b / a.getTotalDelayUnits();
            a = a.getFrames();
            cc.arrayVerifyType(a, cc.AnimationFrame);
            for (var f = 0; f < a.length; f++) {
                var g = d * e / b,
                    d = d + a[f].getDelayUnits();
                c.push(g)
            }
            return !0
        }
        return !1
    },
    clone: function() {
        var a = new cc.Animate;
        this._cloneDecoration(a);
        a.initWithAnimation(this._animation.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._animation.getRestoreOriginalFrame() &&
            (this._origFrame = a.displayFrame());
        this._executedLoops = this._nextFrame = 0
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        1 > a && (a *= this._animation.getLoops(), (0 | a) > this._executedLoops && (this._nextFrame = 0, this._executedLoops++), a %= 1);
        for (var b = this._animation.getFrames(), c = b.length, d = this._splitTimes, e = this._nextFrame; e < c; e++)
            if (d[e] <= a) this.target.setSpriteFrame(b[e].getSpriteFrame()), this._nextFrame = e + 1;
            else break
    },
    reverse: function() {
        var a = this._animation,
            b = a.getFrames(),
            c = [];
        cc.arrayVerifyType(b,
            cc.AnimationFrame);
        if (0 < b.length)
            for (var d = b.length - 1; 0 <= d; d--) {
                var e = b[d];
                if (!e) break;
                c.push(e.clone())
            }
        b = cc.Animation.create(c, a.getDelayPerUnit(), a.getLoops());
        b.setRestoreOriginalFrame(a.getRestoreOriginalFrame());
        a = cc.Animate.create(b);
        this._cloneDecoration(a);
        this._reverseEaseList(a);
        return a
    },
    stop: function() {
        this._animation.getRestoreOriginalFrame() && this.target && this.target.setSpriteFrame(this._origFrame);
        cc.Action.prototype.stop.call(this)
    }
});
cc.Animate.create = function(a) {
    return new cc.Animate(a)
};
cc.TargetedAction = cc.ActionInterval.extend({
    _action: null,
    _forcedTarget: null,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        b && this.initWithTarget(a, b)
    },
    initWithTarget: function(a, b) {
        return this.initWithDuration(b._duration) ? (this._forcedTarget = a, this._action = b, !0) : !1
    },
    clone: function() {
        var a = new cc.TargetedAction;
        this._cloneDecoration(a);
        a.initWithTarget(this._forcedTarget, this._action.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        this._action.startWithTarget(this._forcedTarget)
    },
    stop: function() {
        this._action.stop()
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        this._action.update(a)
    },
    getForcedTarget: function() {
        return this._forcedTarget
    },
    setForcedTarget: function(a) {
        this._forcedTarget != a && (this._forcedTarget = a)
    }
});
cc.TargetedAction.create = function(a, b) {
    return new cc.TargetedAction(a, b)
};
cc.ActionInstant = cc.FiniteTimeAction.extend({
    isDone: function() {
        return !0
    },
    step: function(a) {
        this.update(1)
    },
    update: function(a) {},
    reverse: function() {
        return this.clone()
    },
    clone: function() {
        return new cc.ActionInstant
    }
});
cc.Show = cc.ActionInstant.extend({
    update: function(a) {
        this.target.visible = !0
    },
    reverse: function() {
        return cc.Hide.create()
    },
    clone: function() {
        return new cc.Show
    }
});
cc.Show.create = function() {
    return new cc.Show
};
cc.Hide = cc.ActionInstant.extend({
    update: function(a) {
        this.target.visible = !1
    },
    reverse: function() {
        return cc.Show.create()
    },
    clone: function() {
        return new cc.Hide
    }
});
cc.Hide.create = function() {
    return new cc.Hide
};
cc.ToggleVisibility = cc.ActionInstant.extend({
    update: function(a) {
        this.target.visible = !this.target.visible
    },
    reverse: function() {
        return new cc.ToggleVisibility
    },
    clone: function() {
        return new cc.ToggleVisibility
    }
});
cc.ToggleVisibility.create = function() {
    return new cc.ToggleVisibility
};
cc.RemoveSelf = cc.ActionInstant.extend({
    _isNeedCleanUp: !0,
    ctor: function(a) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        void 0 !== a && this.init(a)
    },
    update: function(a) {
        this.target.removeFromParent(this._isNeedCleanUp)
    },
    init: function(a) {
        this._isNeedCleanUp = a;
        return !0
    },
    reverse: function() {
        return new cc.RemoveSelf(this._isNeedCleanUp)
    },
    clone: function() {
        return new cc.RemoveSelf(this._isNeedCleanUp)
    }
});
cc.RemoveSelf.create = function(a) {
    return new cc.RemoveSelf(a)
};
cc.FlipX = cc.ActionInstant.extend({
    _flippedX: !1,
    ctor: function(a) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        this._flippedX = !1;
        void 0 !== a && this.initWithFlipX(a)
    },
    initWithFlipX: function(a) {
        this._flippedX = a;
        return !0
    },
    update: function(a) {
        this.target.flippedX = this._flippedX
    },
    reverse: function() {
        return cc.FlipX.create(!this._flippedX)
    },
    clone: function() {
        var a = new cc.FlipX;
        a.initWithFlipX(this._flippedX);
        return a
    }
});
cc.FlipX.create = function(a) {
    return new cc.FlipX(a)
};
cc.FlipY = cc.ActionInstant.extend({
    _flippedY: !1,
    ctor: function(a) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        this._flippedY = !1;
        void 0 !== a && this.initWithFlipY(a)
    },
    initWithFlipY: function(a) {
        this._flippedY = a;
        return !0
    },
    update: function(a) {
        this.target.flippedY = this._flippedY
    },
    reverse: function() {
        return cc.FlipY.create(!this._flippedY)
    },
    clone: function() {
        var a = new cc.FlipY;
        a.initWithFlipY(this._flippedY);
        return a
    }
});
cc.FlipY.create = function(a) {
    return new cc.FlipY(a)
};
cc.Place = cc.ActionInstant.extend({
    _x: 0,
    _y: 0,
    ctor: function(a, b) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        this._y = this._x = 0;
        void 0 !== a && (void 0 !== a.x && (b = a.y, a = a.x), this.initWithPosition(a, b))
    },
    initWithPosition: function(a, b) {
        this._x = a;
        this._y = b;
        return !0
    },
    update: function(a) {
        this.target.setPosition(this._x, this._y)
    },
    clone: function() {
        var a = new cc.Place;
        a.initWithPosition(this._x, this._y);
        return a
    }
});
cc.Place.create = function(a, b) {
    return new cc.Place(a, b)
};
cc.CallFunc = cc.ActionInstant.extend({
    _selectorTarget: null,
    _callFunc: null,
    _function: null,
    _data: null,
    ctor: function(a, b, c) {
        cc.FiniteTimeAction.prototype.ctor.call(this);
        void 0 !== a && (void 0 === b ? this.initWithFunction(a) : this.initWithFunction(a, b, c))
    },
    initWithFunction: function(a, b, c) {
        b ? (this._data = c, this._callFunc = a, this._selectorTarget = b) : a && (this._function = a);
        return !0
    },
    execute: function() {
        null != this._callFunc ? this._callFunc.call(this._selectorTarget, this.target, this._data) : this._function && this._function.call(null,
            this.target)
    },
    update: function(a) {
        this.execute()
    },
    getTargetCallback: function() {
        return this._selectorTarget
    },
    setTargetCallback: function(a) {
        a != this._selectorTarget && (this._selectorTarget && (this._selectorTarget = null), this._selectorTarget = a)
    },
    clone: function() {
        var a = new cc.CallFunc;
        this._selectorTarget ? a.initWithFunction(this._callFunc, this._selectorTarget, this._data) : this._function && a.initWithFunction(this._function);
        return a
    }
});
cc.CallFunc.create = function(a, b, c) {
    return new cc.CallFunc(a, b, c)
};
cc.ActionCamera = cc.ActionInterval.extend({
    _centerXOrig: 0,
    _centerYOrig: 0,
    _centerZOrig: 0,
    _eyeXOrig: 0,
    _eyeYOrig: 0,
    _eyeZOrig: 0,
    _upXOrig: 0,
    _upYOrig: 0,
    _upZOrig: 0,
    ctor: function() {
        cc.ActionInterval.prototype.ctor.call(this);
        this._upZOrig = this._upYOrig = this._upXOrig = this._eyeZOrig = this._eyeYOrig = this._eyeXOrig = this._centerZOrig = this._centerYOrig = this._centerXOrig = 0
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        a = a.getCamera();
        var b = a.getCenter();
        this._centerXOrig = b.x;
        this._centerYOrig = b.y;
        this._centerZOrig = b.z;
        b = a.getEye();
        this._eyeXOrig = b.x;
        this._eyeYOrig = b.y;
        this._eyeZOrig = b.z;
        a = a.getUp();
        this._upXOrig = a.x;
        this._upYOrig = a.y;
        this._upZOrig = a.z
    },
    clone: function() {
        return new cc.ActionCamera
    },
    reverse: function() {
        return cc.ReverseTime.create(this)
    }
});
cc.OrbitCamera = cc.ActionCamera.extend({
    _radius: 0,
    _deltaRadius: 0,
    _angleZ: 0,
    _deltaAngleZ: 0,
    _angleX: 0,
    _deltaAngleX: 0,
    _radZ: 0,
    _radDeltaZ: 0,
    _radX: 0,
    _radDeltaX: 0,
    ctor: function(a, b, c, d, e, f, g) {
        cc.ActionCamera.prototype.ctor.call(this);
        void 0 !== g && this.initWithDuration(a, b, c, d, e, f, g)
    },
    initWithDuration: function(a, b, c, d, e, f, g) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._radius = b, this._deltaRadius = c, this._angleZ = d, this._deltaAngleZ = e, this._angleX = f, this._deltaAngleX = g, this._radDeltaZ =
            cc.degreesToRadians(e), this._radDeltaX = cc.degreesToRadians(g), !0) : !1
    },
    sphericalRadius: function() {
        var a, b;
        b = this.target.getCamera();
        var c = b.getEye();
        a = b.getCenter();
        b = c.x - a.x;
        var d = c.y - a.y;
        a = c.z - a.z;
        var c = Math.sqrt(Math.pow(b, 2) + Math.pow(d, 2) + Math.pow(a, 2)),
            e = Math.sqrt(Math.pow(b, 2) + Math.pow(d, 2));
        0 === e && (e = cc.FLT_EPSILON);
        0 === c && (c = cc.FLT_EPSILON);
        a = Math.acos(a / c);
        b = 0 > b ? Math.PI - Math.asin(d / e) : Math.asin(d / e);
        return {
            newRadius: c / cc.Camera.getZEye(),
            zenith: a,
            azimuth: b
        }
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        a = this.sphericalRadius();
        isNaN(this._radius) && (this._radius = a.newRadius);
        isNaN(this._angleZ) && (this._angleZ = cc.radiansToDegrees(a.zenith));
        isNaN(this._angleX) && (this._angleX = cc.radiansToDegrees(a.azimuth));
        this._radZ = cc.degreesToRadians(this._angleZ);
        this._radX = cc.degreesToRadians(this._angleX)
    },
    clone: function() {
        var a = new cc.OrbitCamera;
        a.initWithDuration(this._duration, this._radius, this._deltaRadius, this._angleZ, this._deltaAngleZ, this._angleX, this._deltaAngleX);
        return a
    },
    update: function(a) {
        a =
            this._computeEaseTime(a);
        var b = (this._radius + this._deltaRadius * a) * cc.Camera.getZEye(),
            c = this._radZ + this._radDeltaZ * a,
            d = this._radX + this._radDeltaX * a;
        a = Math.sin(c) * Math.cos(d) * b + this._centerXOrig;
        d = Math.sin(c) * Math.sin(d) * b + this._centerYOrig;
        b = Math.cos(c) * b + this._centerZOrig;
        this.target.getCamera().setEye(a, d, b)
    }
});
cc.OrbitCamera.create = function(a, b, c, d, e, f, g) {
    return new cc.OrbitCamera(a, b, c, d, e, f, g)
};
cc.ActionEase = cc.ActionInterval.extend({
    _inner: null,
    ctor: function(a) {
        cc.ActionInterval.prototype.ctor.call(this);
        a && this.initWithAction(a)
    },
    initWithAction: function(a) {
        if (!a) throw "cc.ActionEase.initWithAction(): action must be non nil";
        return this.initWithDuration(a.getDuration()) ? (this._inner = a, !0) : !1
    },
    clone: function() {
        var a = new cc.ActionEase;
        a.initWithAction(this._inner.clone());
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._inner.startWithTarget(this.target)
    },
    stop: function() {
        this._inner.stop();
        cc.ActionInterval.prototype.stop.call(this)
    },
    update: function(a) {
        this._inner.update(a)
    },
    reverse: function() {
        return cc.ActionEase.create(this._inner.reverse())
    },
    getInnerAction: function() {
        return this._inner
    }
});
cc.ActionEase.create = function(a) {
    return new cc.ActionEase(a)
};
cc.EaseRateAction = cc.ActionEase.extend({
    _rate: 0,
    ctor: function(a, b) {
        cc.ActionEase.prototype.ctor.call(this);
        void 0 !== b && this.initWithAction(a, b)
    },
    setRate: function(a) {
        this._rate = a
    },
    getRate: function() {
        return this._rate
    },
    initWithAction: function(a, b) {
        return cc.ActionEase.prototype.initWithAction.call(this, a) ? (this._rate = b, !0) : !1
    },
    clone: function() {
        var a = new cc.EaseRateAction;
        a.initWithAction(this._inner.clone(), this._rate);
        return a
    },
    reverse: function() {
        return cc.EaseRateAction.create(this._inner.reverse(),
            1 / this._rate)
    }
});
cc.EaseRateAction.create = function(a, b) {
    return new cc.EaseRateAction(a, b)
};
cc.EaseIn = cc.EaseRateAction.extend({
    update: function(a) {
        this._inner.update(Math.pow(a, this._rate))
    },
    reverse: function() {
        return cc.EaseIn.create(this._inner.reverse(), 1 / this._rate)
    },
    clone: function() {
        var a = new cc.EaseIn;
        a.initWithAction(this._inner.clone(), this._rate);
        return a
    }
});
cc.EaseIn.create = function(a, b) {
    return new cc.EaseIn(a, b)
};
cc.easeIn = function(a) {
    return {
        _rate: a,
        easing: function(a) {
            return Math.pow(a, this._rate)
        },
        reverse: function() {
            return cc.easeIn(1 / this._rate)
        }
    }
};
cc.EaseOut = cc.EaseRateAction.extend({
    update: function(a) {
        this._inner.update(Math.pow(a, 1 / this._rate))
    },
    reverse: function() {
        return cc.EaseOut.create(this._inner.reverse(), 1 / this._rate)
    },
    clone: function() {
        var a = new cc.EaseOut;
        a.initWithAction(this._inner.clone(), this._rate);
        return a
    }
});
cc.EaseOut.create = function(a, b) {
    return new cc.EaseOut(a, b)
};
cc.easeOut = function(a) {
    return {
        _rate: a,
        easing: function(a) {
            return Math.pow(a, 1 / this._rate)
        },
        reverse: function() {
            return cc.easeOut(1 / this._rate)
        }
    }
};
cc.EaseInOut = cc.EaseRateAction.extend({
    update: function(a) {
        a *= 2;
        1 > a ? this._inner.update(0.5 * Math.pow(a, this._rate)) : this._inner.update(1 - 0.5 * Math.pow(2 - a, this._rate))
    },
    clone: function() {
        var a = new cc.EaseInOut;
        a.initWithAction(this._inner.clone(), this._rate);
        return a
    },
    reverse: function() {
        return cc.EaseInOut.create(this._inner.reverse(), this._rate)
    }
});
cc.EaseInOut.create = function(a, b) {
    return new cc.EaseInOut(a, b)
};
cc.easeInOut = function(a) {
    return {
        _rate: a,
        easing: function(a) {
            a *= 2;
            return 1 > a ? 0.5 * Math.pow(a, this._rate) : 1 - 0.5 * Math.pow(2 - a, this._rate)
        },
        reverse: function() {
            return cc.easeInOut(this._rate)
        }
    }
};
cc.EaseExponentialIn = cc.ActionEase.extend({
    update: function(a) {
        this._inner.update(0 === a ? 0 : Math.pow(2, 10 * (a - 1)))
    },
    reverse: function() {
        return cc.EaseExponentialOut.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseExponentialIn;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseExponentialIn.create = function(a) {
    return new cc.EaseExponentialIn(a)
};
cc._easeExponentialInObj = {
    easing: function(a) {
        return 0 === a ? 0 : Math.pow(2, 10 * (a - 1))
    },
    reverse: function() {
        return cc._easeExponentialOutObj
    }
};
cc.easeExponentialIn = function() {
    return cc._easeExponentialInObj
};
cc.EaseExponentialOut = cc.ActionEase.extend({
    update: function(a) {
        this._inner.update(1 == a ? 1 : -Math.pow(2, -10 * a) + 1)
    },
    reverse: function() {
        return cc.EaseExponentialIn.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseExponentialOut;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseExponentialOut.create = function(a) {
    return new cc.EaseExponentialOut(a)
};
cc._easeExponentialOutObj = {
    easing: function(a) {
        return 1 == a ? 1 : -Math.pow(2, -10 * a) + 1
    },
    reverse: function() {
        return cc._easeExponentialInObj
    }
};
cc.easeExponentialOut = function() {
    return cc._easeExponentialOutObj
};
cc.EaseExponentialInOut = cc.ActionEase.extend({
    update: function(a) {
        1 != a && 0 !== a && (a *= 2, a = 1 > a ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2));
        this._inner.update(a)
    },
    reverse: function() {
        return cc.EaseExponentialInOut.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseExponentialInOut;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseExponentialInOut.create = function(a) {
    return new cc.EaseExponentialInOut(a)
};
cc._easeExponentialInOutObj = {
    easing: function(a) {
        return 1 !== a && 0 !== a ? (a *= 2, 1 > a ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)) : a
    },
    reverse: function() {
        return cc._easeExponentialInOutObj
    }
};
cc.easeExponentialInOut = function() {
    return cc._easeExponentialInOutObj
};
cc.EaseSineIn = cc.ActionEase.extend({
    update: function(a) {
        a = 0 === a || 1 === a ? a : -1 * Math.cos(a * Math.PI / 2) + 1;
        this._inner.update(a)
    },
    reverse: function() {
        return cc.EaseSineOut.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseSineIn;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseSineIn.create = function(a) {
    return new cc.EaseSineIn(a)
};
cc._easeSineInObj = {
    easing: function(a) {
        return 0 === a || 1 === a ? a : -1 * Math.cos(a * Math.PI / 2) + 1
    },
    reverse: function() {
        return cc._easeSineOutObj
    }
};
cc.easeSineIn = function() {
    return cc._easeSineInObj
};
cc.EaseSineOut = cc.ActionEase.extend({
    update: function(a) {
        a = 0 === a || 1 === a ? a : Math.sin(a * Math.PI / 2);
        this._inner.update(a)
    },
    reverse: function() {
        return cc.EaseSineIn.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseSineOut;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseSineOut.create = function(a) {
    return new cc.EaseSineOut(a)
};
cc._easeSineOutObj = {
    easing: function(a) {
        return 0 === a || 1 == a ? a : Math.sin(a * Math.PI / 2)
    },
    reverse: function() {
        return cc._easeSineInObj
    }
};
cc.easeSineOut = function() {
    return cc._easeSineOutObj
};
cc.EaseSineInOut = cc.ActionEase.extend({
    update: function(a) {
        a = 0 === a || 1 === a ? a : -0.5 * (Math.cos(Math.PI * a) - 1);
        this._inner.update(a)
    },
    clone: function() {
        var a = new cc.EaseSineInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseSineInOut.create(this._inner.reverse())
    }
});
cc.EaseSineInOut.create = function(a) {
    return new cc.EaseSineInOut(a)
};
cc._easeSineInOutObj = {
    easing: function(a) {
        return 0 === a || 1 === a ? a : -0.5 * (Math.cos(Math.PI * a) - 1)
    },
    reverse: function() {
        return cc._easeSineInOutObj
    }
};
cc.easeSineInOut = function() {
    return cc._easeSineInOutObj
};
cc.EaseElastic = cc.ActionEase.extend({
    _period: 0.3,
    ctor: function(a, b) {
        cc.ActionEase.prototype.ctor.call(this);
        a && this.initWithAction(a, b)
    },
    getPeriod: function() {
        return this._period
    },
    setPeriod: function(a) {
        this._period = a
    },
    initWithAction: function(a, b) {
        cc.ActionEase.prototype.initWithAction.call(this, a);
        this._period = null == b ? 0.3 : b;
        return !0
    },
    reverse: function() {
        cc.log("cc.EaseElastic.reverse(): it should be overridden in subclass.");
        return null
    },
    clone: function() {
        var a = new cc.EaseElastic;
        a.initWithAction(this._inner.clone(),
            this._period);
        return a
    }
});
cc.EaseElastic.create = function(a, b) {
    return new cc.EaseElastic(a, b)
};
cc.EaseElasticIn = cc.EaseElastic.extend({
    update: function(a) {
        var b = 0;
        0 === a || 1 === a ? b = a : (b = this._period / 4, a -= 1, b = -Math.pow(2, 10 * a) * Math.sin(2 * (a - b) * Math.PI / this._period));
        this._inner.update(b)
    },
    reverse: function() {
        return cc.EaseElasticOut.create(this._inner.reverse(), this._period)
    },
    clone: function() {
        var a = new cc.EaseElasticIn;
        a.initWithAction(this._inner.clone(), this._period);
        return a
    }
});
cc.EaseElasticIn.create = function(a, b) {
    return new cc.EaseElasticIn(a, b)
};
cc._easeElasticInObj = {
    easing: function(a) {
        if (0 === a || 1 === a) return a;
        a -= 1;
        return -Math.pow(2, 10 * a) * Math.sin(2 * (a - 0.075) * Math.PI / 0.3)
    },
    reverse: function() {
        return cc._easeElasticOutObj
    }
};
cc.easeElasticIn = function(a) {
    return a && 0.3 !== a ? {
        _period: a,
        easing: function(a) {
            if (0 === a || 1 === a) return a;
            a -= 1;
            return -Math.pow(2, 10 * a) * Math.sin(2 * (a - this._period / 4) * Math.PI / this._period)
        },
        reverse: function() {
            return cc.easeElasticOut(this._period)
        }
    } : cc._easeElasticInObj
};
cc.EaseElasticOut = cc.EaseElastic.extend({
    update: function(a) {
        var b = 0;
        0 === a || 1 == a ? b = a : (b = this._period / 4, b = Math.pow(2, -10 * a) * Math.sin(2 * (a - b) * Math.PI / this._period) + 1);
        this._inner.update(b)
    },
    reverse: function() {
        return cc.EaseElasticIn.create(this._inner.reverse(), this._period)
    },
    clone: function() {
        var a = new cc.EaseElasticOut;
        a.initWithAction(this._inner.clone(), this._period);
        return a
    }
});
cc.EaseElasticOut.create = function(a, b) {
    return new cc.EaseElasticOut(a, b)
};
cc._easeElasticOutObj = {
    easing: function(a) {
        return 0 === a || 1 === a ? a : Math.pow(2, -10 * a) * Math.sin(2 * (a - 0.075) * Math.PI / 0.3) + 1
    },
    reverse: function() {
        return cc._easeElasticInObj
    }
};
cc.easeElasticOut = function(a) {
    return a && 0.3 !== a ? {
        _period: a,
        easing: function(a) {
            return 0 === a || 1 === a ? a : Math.pow(2, -10 * a) * Math.sin(2 * (a - this._period / 4) * Math.PI / this._period) + 1
        },
        reverse: function() {
            return cc.easeElasticIn(this._period)
        }
    } : cc._easeElasticOutObj
};
cc.EaseElasticInOut = cc.EaseElastic.extend({
    update: function(a) {
        var b = 0,
            b = this._period;
        if (0 === a || 1 == a) b = a;
        else {
            b || (b = this._period = 0.3 * 1.5);
            var c = b / 4;
            a = 2 * a - 1;
            b = 0 > a ? -0.5 * Math.pow(2, 10 * a) * Math.sin(2 * (a - c) * Math.PI / b) : 0.5 * Math.pow(2, -10 * a) * Math.sin(2 * (a - c) * Math.PI / b) + 1
        }
        this._inner.update(b)
    },
    reverse: function() {
        return cc.EaseElasticInOut.create(this._inner.reverse(), this._period)
    },
    clone: function() {
        var a = new cc.EaseElasticInOut;
        a.initWithAction(this._inner.clone(), this._period);
        return a
    }
});
cc.EaseElasticInOut.create = function(a, b) {
    return new cc.EaseElasticInOut(a, b)
};
cc.easeElasticInOut = function(a) {
    return {
        _period: a || 0.3,
        easing: function(a) {
            var c = 0,
                c = this._period;
            if (0 === a || 1 === a) c = a;
            else {
                c || (c = this._period = 0.3 * 1.5);
                var d = c / 4;
                a = 2 * a - 1;
                c = 0 > a ? -0.5 * Math.pow(2, 10 * a) * Math.sin(2 * (a - d) * Math.PI / c) : 0.5 * Math.pow(2, -10 * a) * Math.sin(2 * (a - d) * Math.PI / c) + 1
            }
            return c
        },
        reverse: function() {
            return cc.easeElasticInOut(this._period)
        }
    }
};
cc.EaseBounce = cc.ActionEase.extend({
    bounceTime: function(a) {
        if (a < 1 / 2.75) return 7.5625 * a * a;
        if (a < 2 / 2.75) return a -= 1.5 / 2.75, 7.5625 * a * a + 0.75;
        if (a < 2.5 / 2.75) return a -= 2.25 / 2.75, 7.5625 * a * a + 0.9375;
        a -= 2.625 / 2.75;
        return 7.5625 * a * a + 0.984375
    },
    clone: function() {
        var a = new cc.EaseBounce;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseBounce.create(this._inner.reverse())
    }
});
cc.EaseBounce.create = function(a) {
    return new cc.EaseBounce(a)
};
cc.EaseBounceIn = cc.EaseBounce.extend({
    update: function(a) {
        a = 1 - this.bounceTime(1 - a);
        this._inner.update(a)
    },
    reverse: function() {
        return cc.EaseBounceOut.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseBounceIn;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseBounceIn.create = function(a) {
    return new cc.EaseBounceIn(a)
};
cc._bounceTime = function(a) {
    if (a < 1 / 2.75) return 7.5625 * a * a;
    if (a < 2 / 2.75) return a -= 1.5 / 2.75, 7.5625 * a * a + 0.75;
    if (a < 2.5 / 2.75) return a -= 2.25 / 2.75, 7.5625 * a * a + 0.9375;
    a -= 2.625 / 2.75;
    return 7.5625 * a * a + 0.984375
};
cc._easeBounceInObj = {
    easing: function(a) {
        return 1 - cc._bounceTime(1 - a)
    },
    reverse: function() {
        return cc._easeBounceOutObj
    }
};
cc.easeBounceIn = function() {
    return cc._easeBounceInObj
};
cc.EaseBounceOut = cc.EaseBounce.extend({
    update: function(a) {
        a = this.bounceTime(a);
        this._inner.update(a)
    },
    reverse: function() {
        return cc.EaseBounceIn.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseBounceOut;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseBounceOut.create = function(a) {
    return new cc.EaseBounceOut(a)
};
cc._easeBounceOutObj = {
    easing: function(a) {
        return cc._bounceTime(a)
    },
    reverse: function() {
        return cc._easeBounceInObj
    }
};
cc.easeBounceOut = function() {
    return cc._easeBounceOutObj
};
cc.EaseBounceInOut = cc.EaseBounce.extend({
    update: function(a) {
        var b = 0,
            b = 0.5 > a ? 0.5 * (1 - this.bounceTime(1 - 2 * a)) : 0.5 * this.bounceTime(2 * a - 1) + 0.5;
        this._inner.update(b)
    },
    clone: function() {
        var a = new cc.EaseBounceInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseBounceInOut.create(this._inner.reverse())
    }
});
cc.EaseBounceInOut.create = function(a) {
    return new cc.EaseBounceInOut(a)
};
cc._easeBounceInOutObj = {
    easing: function(a) {
        return a = 0.5 > a ? 0.5 * (1 - cc._bounceTime(1 - 2 * a)) : 0.5 * cc._bounceTime(2 * a - 1) + 0.5
    },
    reverse: function() {
        return cc._easeBounceInOutObj
    }
};
cc.easeBounceInOut = function() {
    return cc._easeBounceInOutObj
};
cc.EaseBackIn = cc.ActionEase.extend({
    update: function(a) {
        this._inner.update(0 === a || 1 == a ? a : a * a * (2.70158 * a - 1.70158))
    },
    reverse: function() {
        return cc.EaseBackOut.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseBackIn;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseBackIn.create = function(a) {
    return new cc.EaseBackIn(a)
};
cc._easeBackInObj = {
    easing: function(a) {
        return 0 === a || 1 === a ? a : a * a * (2.70158 * a - 1.70158)
    },
    reverse: function() {
        return cc._easeBackOutObj
    }
};
cc.easeBackIn = function() {
    return cc._easeBackInObj
};
cc.EaseBackOut = cc.ActionEase.extend({
    update: function(a) {
        a -= 1;
        this._inner.update(a * a * (2.70158 * a + 1.70158) + 1)
    },
    reverse: function() {
        return cc.EaseBackIn.create(this._inner.reverse())
    },
    clone: function() {
        var a = new cc.EaseBackOut;
        a.initWithAction(this._inner.clone());
        return a
    }
});
cc.EaseBackOut.create = function(a) {
    return new cc.EaseBackOut(a)
};
cc._easeBackOutObj = {
    easing: function(a) {
        a -= 1;
        return a * a * (2.70158 * a + 1.70158) + 1
    },
    reverse: function() {
        return cc._easeBackInObj
    }
};
cc.easeBackOut = function() {
    return cc._easeBackOutObj
};
cc.EaseBackInOut = cc.ActionEase.extend({
    update: function(a) {
        a *= 2;
        1 > a ? this._inner.update(a * a * (3.5949095 * a - 2.5949095) / 2) : (a -= 2, this._inner.update(a * a * (3.5949095 * a + 2.5949095) / 2 + 1))
    },
    clone: function() {
        var a = new cc.EaseBackInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseBackInOut.create(this._inner.reverse())
    }
});
cc.EaseBackInOut.create = function(a) {
    return new cc.EaseBackInOut(a)
};
cc._easeBackInOutObj = {
    easing: function(a) {
        a *= 2;
        if (1 > a) return a * a * (3.5949095 * a - 2.5949095) / 2;
        a -= 2;
        return a * a * (3.5949095 * a + 2.5949095) / 2 + 1
    },
    reverse: function() {
        return cc._easeBackInOutObj
    }
};
cc.easeBackInOut = function() {
    return cc._easeBackInOutObj
};
cc.EaseBezierAction = cc.ActionEase.extend({
    _p0: null,
    _p1: null,
    _p2: null,
    _p3: null,
    ctor: function(a) {
        cc.ActionEase.prototype.ctor.call(this, a)
    },
    _updateTime: function(a, b, c, d, e) {
        return Math.pow(1 - e, 3) * a + 3 * e * Math.pow(1 - e, 2) * b + 3 * Math.pow(e, 2) * (1 - e) * c + Math.pow(e, 3) * d
    },
    update: function(a) {
        a = this._updateTime(this._p0, this._p1, this._p2, this._p3, a);
        this._inner.update(a)
    },
    clone: function() {
        var a = new cc.EaseBezierAction;
        a.initWithAction(this._inner.clone());
        a.setBezierParamer(this._p0, this._p1, this._p2, this._p3);
        return a
    },
    reverse: function() {
        var a = cc.EaseBezierAction.create(this._inner.reverse());
        a.setBezierParamer(this._p3, this._p2, this._p1, this._p0);
        return a
    },
    setBezierParamer: function(a, b, c, d) {
        this._p0 = a || 0;
        this._p1 = b || 0;
        this._p2 = c || 0;
        this._p3 = d || 0
    }
});
cc.EaseBezierAction.create = function(a) {
    return new cc.EaseBezierAction(a)
};
cc.easeBezierAction = function(a, b, c, d) {
    return {
        easing: function(e) {
            return cc.EaseBezierAction.prototype._updateTime(a, b, c, d, e)
        },
        reverse: function() {
            return cc.easeBezierAction(d, c, b, a)
        }
    }
};
cc.EaseQuadraticActionIn = cc.ActionEase.extend({
    _updateTime: function(a) {
        return Math.pow(a, 2)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuadraticActionIn;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuadraticActionIn.create(this._inner.reverse())
    }
});
cc.EaseQuadraticActionIn.create = function(a) {
    return new cc.EaseQuadraticActionIn(a)
};
cc._easeQuadraticActionIn = {
    easing: cc.EaseQuadraticActionIn.prototype._updateTime,
    reverse: function() {
        return cc._easeQuadraticActionIn
    }
};
cc.easeQuadraticActionIn = function() {
    return cc._easeQuadraticActionIn
};
cc.EaseQuadraticActionOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        return -a * (a - 2)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuadraticActionOut;
        a.initWithAction();
        return a
    },
    reverse: function() {
        return cc.EaseQuadraticActionOut.create(this._inner.reverse())
    }
});
cc.EaseQuadraticActionOut.create = function(a) {
    return new cc.EaseQuadraticActionOut(a)
};
cc._easeQuadraticActionOut = {
    easing: cc.EaseQuadraticActionOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuadraticActionOut
    }
};
cc.easeQuadraticActionOut = function() {
    return cc._easeQuadraticActionOut
};
cc.EaseQuadraticActionInOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        var b = a;
        a *= 2;
        1 > a ? b = 0.5 * a * a : (--a, b = -0.5 * (a * (a - 2) - 1));
        return b
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuadraticActionInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuadraticActionInOut.create(this._inner.reverse())
    }
});
cc.EaseQuadraticActionInOut.create = function(a) {
    return new cc.EaseQuadraticActionInOut(a)
};
cc._easeQuadraticActionInOut = {
    easing: cc.EaseQuadraticActionInOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuadraticActionInOut
    }
};
cc.easeQuadraticActionInOut = function() {
    return cc._easeQuadraticActionInOut
};
cc.EaseQuarticActionIn = cc.ActionEase.extend({
    _updateTime: function(a) {
        return a * a * a * a
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuarticActionIn;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuarticActionIn.create(this._inner.reverse())
    }
});
cc.EaseQuarticActionIn.create = function(a) {
    return new cc.EaseQuarticActionIn(a)
};
cc._easeQuarticActionIn = {
    easing: cc.EaseQuarticActionIn.prototype._updateTime,
    reverse: function() {
        return cc._easeQuarticActionIn
    }
};
cc.easeQuarticActionIn = function() {
    return cc._easeQuarticActionIn
};
cc.EaseQuarticActionOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a -= 1;
        return -(a * a * a * a - 1)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuarticActionOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuarticActionOut.create(this._inner.reverse())
    }
});
cc.EaseQuarticActionOut.create = function(a) {
    return new cc.EaseQuarticActionOut(a)
};
cc._easeQuarticActionOut = {
    easing: cc.EaseQuarticActionOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuarticActionOut
    }
};
cc.easeQuarticActionOut = function() {
    return cc._easeQuarticActionOut
};
cc.EaseQuarticActionInOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a *= 2;
        if (1 > a) return 0.5 * a * a * a * a;
        a -= 2;
        return -0.5 * (a * a * a * a - 2)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuarticActionInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuarticActionInOut.create(this._inner.reverse())
    }
});
cc.EaseQuarticActionInOut.create = function(a) {
    return new cc.EaseQuarticActionInOut(a)
};
cc._easeQuarticActionInOut = {
    easing: cc.EaseQuarticActionInOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuarticActionInOut
    }
};
cc.easeQuarticActionInOut = function() {
    return cc._easeQuarticActionInOut
};
cc.EaseQuinticActionIn = cc.ActionEase.extend({
    _updateTime: function(a) {
        return a * a * a * a * a
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuinticActionIn;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuinticActionIn.create(this._inner.reverse())
    }
});
cc.EaseQuinticActionIn.create = function(a) {
    return new cc.EaseQuinticActionIn(a)
};
cc._easeQuinticActionIn = {
    easing: cc.EaseQuinticActionIn.prototype._updateTime,
    reverse: function() {
        return cc._easeQuinticActionIn
    }
};
cc.easeQuinticActionIn = function() {
    return cc._easeQuinticActionIn
};
cc.EaseQuinticActionOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a -= 1;
        return a * a * a * a * a + 1
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuinticActionOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuinticActionOut.create(this._inner.reverse())
    }
});
cc.EaseQuinticActionOut.create = function(a) {
    return new cc.EaseQuinticActionOut(a)
};
cc._easeQuinticActionOut = {
    easing: cc.EaseQuinticActionOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuinticActionOut
    }
};
cc.easeQuinticActionOut = function() {
    return cc._easeQuinticActionOut
};
cc.EaseQuinticActionInOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a *= 2;
        if (1 > a) return 0.5 * a * a * a * a * a;
        a -= 2;
        return 0.5 * (a * a * a * a * a + 2)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseQuinticActionInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseQuinticActionInOut.create(this._inner.reverse())
    }
});
cc.EaseQuinticActionInOut.create = function(a) {
    return new cc.EaseQuinticActionInOut(a)
};
cc._easeQuinticActionInOut = {
    easing: cc.EaseQuinticActionInOut.prototype._updateTime,
    reverse: function() {
        return cc._easeQuinticActionInOut
    }
};
cc.easeQuinticActionInOut = function() {
    return cc._easeQuinticActionInOut
};
cc.EaseCircleActionIn = cc.ActionEase.extend({
    _updateTime: function(a) {
        return -1 * (Math.sqrt(1 - a * a) - 1)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCircleActionIn;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCircleActionIn.create(this._inner.reverse())
    }
});
cc.EaseCircleActionIn.create = function(a) {
    return new cc.EaseCircleActionIn(a)
};
cc._easeCircleActionIn = {
    easing: cc.EaseCircleActionIn.prototype._updateTime,
    reverse: function() {
        return cc._easeCircleActionIn
    }
};
cc.easeCircleActionIn = function() {
    return cc._easeCircleActionIn
};
cc.EaseCircleActionOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a -= 1;
        return Math.sqrt(1 - a * a)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCircleActionOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCircleActionOut.create(this._inner.reverse())
    }
});
cc.EaseCircleActionOut.create = function(a) {
    return new cc.EaseCircleActionOut(a)
};
cc._easeCircleActionOut = {
    easing: cc.EaseCircleActionOut.prototype._updateTime,
    reverse: function() {
        return cc._easeCircleActionOut
    }
};
cc.easeCircleActionOut = function() {
    return cc._easeCircleActionOut
};
cc.EaseCircleActionInOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a *= 2;
        if (1 > a) return -0.5 * (Math.sqrt(1 - a * a) - 1);
        a -= 2;
        return 0.5 * (Math.sqrt(1 - a * a) + 1)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCircleActionInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCircleActionInOut.create(this._inner.reverse())
    }
});
cc.EaseCircleActionInOut.create = function(a) {
    return new cc.EaseCircleActionInOut(a)
};
cc._easeCircleActionInOut = {
    easing: cc.EaseCircleActionInOut.prototype._updateTime,
    reverse: function() {
        return cc._easeCircleActionInOut
    }
};
cc.easeCircleActionInOut = function() {
    return cc._easeCircleActionInOut
};
cc.EaseCubicActionIn = cc.ActionEase.extend({
    _updateTime: function(a) {
        return a * a * a
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCubicActionIn;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCubicActionIn.create(this._inner.reverse())
    }
});
cc.EaseCubicActionIn.create = function(a) {
    return new cc.EaseCubicActionIn(a)
};
cc._easeCubicActionIn = {
    easing: cc.EaseCubicActionIn.prototype._updateTime,
    reverse: function() {
        return cc._easeCubicActionIn
    }
};
cc.easeCubicActionIn = function() {
    return cc._easeCubicActionIn
};
cc.EaseCubicActionOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a -= 1;
        return a * a * a + 1
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCubicActionOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCubicActionOut.create(this._inner.reverse())
    }
});
cc.EaseCubicActionOut.create = function(a) {
    return new cc.EaseCubicActionOut(a)
};
cc._easeCubicActionOut = {
    easing: cc.EaseCubicActionOut.prototype._updateTime,
    reverse: function() {
        return cc._easeCubicActionOut
    }
};
cc.easeCubicActionOut = function() {
    return cc._easeCubicActionOut
};
cc.EaseCubicActionInOut = cc.ActionEase.extend({
    _updateTime: function(a) {
        a *= 2;
        if (1 > a) return 0.5 * a * a * a;
        a -= 2;
        return 0.5 * (a * a * a + 2)
    },
    update: function(a) {
        this._inner.update(this._updateTime(a))
    },
    clone: function() {
        var a = new cc.EaseCubicActionInOut;
        a.initWithAction(this._inner.clone());
        return a
    },
    reverse: function() {
        return cc.EaseCubicActionInOut.create(this._inner.reverse())
    }
});
cc.EaseCubicActionInOut.create = function(a) {
    return new cc.EaseCubicActionInOut(a)
};
cc._easeCubicActionInOut = {
    easing: cc.EaseCubicActionInOut.prototype._updateTime,
    reverse: function() {
        return cc._easeCubicActionInOut
    }
};
cc.easeCubicActionInOut = function() {
    return cc._easeCubicActionInOut
};
cc.cardinalSplineAt = function(a, b, c, d, e, f) {
    var g = f * f,
        h = g * f,
        k = (1 - e) / 2;
    e = k * (-h + 2 * g - f);
    var m = k * (-h + g) + (2 * h - 3 * g + 1);
    f = k * (h - 2 * g + f) + (-2 * h + 3 * g);
    g = k * (h - g);
    return cc.p(a.x * e + b.x * m + c.x * f + d.x * g, a.y * e + b.y * m + c.y * f + d.y * g)
};
cc.reverseControlPoints = function(a) {
    for (var b = [], c = a.length - 1; 0 <= c; c--) b.push(cc.p(a[c].x, a[c].y));
    return b
};
cc.copyControlPoints = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b.push(cc.p(a[c].x, a[c].y));
    return b
};
cc.getControlPointAt = function(a, b) {
    var c = Math.min(a.length - 1, Math.max(b, 0));
    return a[c]
};
cc.reverseControlPointsInline = function(a) {
    for (var b = a.length, c = 0 | b / 2, d = 0; d < c; ++d) {
        var e = a[d];
        a[d] = a[b - d - 1];
        a[b - d - 1] = e
    }
};
cc.CardinalSplineTo = cc.ActionInterval.extend({
    _points: null,
    _deltaT: 0,
    _tension: 0,
    _previousPosition: null,
    _accumulatedDiff: null,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._points = [];
        void 0 !== c && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        if (!b || 0 == b.length) throw "Invalid configuration. It must at least have one control point";
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this.setPoints(b), this._tension = c, !0) : !1
    },
    clone: function() {
        var a =
            new cc.CardinalSplineTo;
        a.initWithDuration(this._duration, cc.copyControlPoints(this._points), this._tension);
        return a
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a);
        this._deltaT = 1 / (this._points.length - 1);
        this._previousPosition = cc.p(this.target.getPositionX(), this.target.getPositionY());
        this._accumulatedDiff = cc.p(0, 0)
    },
    update: function(a) {
        a = this._computeEaseTime(a);
        var b, c = this._points;
        if (1 == a) b = c.length - 1, a = 1;
        else {
            var d = this._deltaT;
            b = 0 | a / d;
            a = (a - d * b) / d
        }
        b = cc.cardinalSplineAt(cc.getControlPointAt(c,
            b - 1), cc.getControlPointAt(c, b - 0), cc.getControlPointAt(c, b + 1), cc.getControlPointAt(c, b + 2), this._tension, a);
        if (cc.ENABLE_STACKABLE_ACTIONS && (c = this.target.getPositionX() - this._previousPosition.x, a = this.target.getPositionY() - this._previousPosition.y, 0 != c || 0 != a)) d = this._accumulatedDiff, c = d.x + c, a = d.y + a, d.x = c, d.y = a, b.x += c, b.y += a;
        this.updatePosition(b)
    },
    reverse: function() {
        var a = cc.reverseControlPoints(this._points);
        return cc.CardinalSplineTo.create(this._duration, a, this._tension)
    },
    updatePosition: function(a) {
        this.target.setPosition(a);
        this._previousPosition = a
    },
    getPoints: function() {
        return this._points
    },
    setPoints: function(a) {
        this._points = a
    }
});
cc.CardinalSplineTo.create = function(a, b, c) {
    return new cc.CardinalSplineTo(a, b, c)
};
cc.CardinalSplineBy = cc.CardinalSplineTo.extend({
    _startPosition: null,
    ctor: function(a, b, c) {
        cc.CardinalSplineTo.prototype.ctor.call(this);
        this._startPosition = cc.p(0, 0);
        void 0 !== c && this.initWithDuration(a, b, c)
    },
    startWithTarget: function(a) {
        cc.CardinalSplineTo.prototype.startWithTarget.call(this, a);
        this._startPosition.x = a.getPositionX();
        this._startPosition.y = a.getPositionY()
    },
    reverse: function() {
        for (var a = this._points.slice(), b, c = a[0], d = 1; d < a.length; ++d) b = a[d], a[d] = cc.pSub(b, c), c = b;
        a = cc.reverseControlPoints(a);
        c = a[a.length - 1];
        a.pop();
        c.x = -c.x;
        c.y = -c.y;
        a.unshift(c);
        for (d = 1; d < a.length; ++d) b = a[d], b.x = -b.x, b.y = -b.y, b.x += c.x, b.y += c.y, c = a[d] = b;
        return cc.CardinalSplineBy.create(this._duration, a, this._tension)
    },
    updatePosition: function(a) {
        var b = this._startPosition,
            c = a.x + b.x;
        a = a.y + b.y;
        this._previousPosition.x = c;
        this._previousPosition.y = a;
        this.target.setPosition(c, a)
    },
    clone: function() {
        var a = new cc.CardinalSplineBy;
        a.initWithDuration(this._duration, cc.copyControlPoints(this._points), this._tension);
        return a
    }
});
cc.CardinalSplineBy.create = function(a, b, c) {
    return new cc.CardinalSplineBy(a, b, c)
};
cc.CatmullRomTo = cc.CardinalSplineTo.extend({
    ctor: function(a, b) {
        b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.CardinalSplineTo.prototype.initWithDuration.call(this, a, b, 0.5)
    },
    clone: function() {
        var a = new cc.CatmullRomTo;
        a.initWithDuration(this._duration, cc.copyControlPoints(this._points));
        return a
    }
});
cc.CatmullRomTo.create = function(a, b) {
    return new cc.CatmullRomTo(a, b)
};
cc.CatmullRomBy = cc.CardinalSplineBy.extend({
    ctor: function(a, b) {
        cc.CardinalSplineBy.prototype.ctor.call(this);
        b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.CardinalSplineTo.prototype.initWithDuration.call(this, a, b, 0.5)
    },
    clone: function() {
        var a = new cc.CatmullRomBy;
        a.initWithDuration(this._duration, cc.copyControlPoints(this._points));
        return a
    }
});
cc.CatmullRomBy.create = function(a, b) {
    return new cc.CatmullRomBy(a, b)
};
cc.ActionTweenDelegate = cc.Class.extend({
    updateTweenAction: function(a, b) {}
});
cc.ActionTween = cc.ActionInterval.extend({
    key: "",
    from: 0,
    to: 0,
    delta: 0,
    ctor: function(a, b, c, d) {
        cc.ActionInterval.prototype.ctor.call(this);
        this.key = "";
        void 0 !== d && this.initWithDuration(a, b, c, d)
    },
    initWithDuration: function(a, b, c, d) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this.key = b, this.to = d, this.from = c, !0) : !1
    },
    startWithTarget: function(a) {
        if (!a || !a.updateTweenAction) throw "cc.ActionTween.startWithTarget(): target must be non-null, and target must implement updateTweenAction function";
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        this.delta = this.to - this.from
    },
    update: function(a) {
        this.target.updateTweenAction(this.to - this.delta * (1 - a), this.key)
    },
    reverse: function() {
        return cc.ActionTween.create(this.duration, this.key, this.to, this.from)
    },
    clone: function() {
        var a = new cc.ActionTween;
        a.initWithDuration(this._duration, this.key, this.from, this.to);
        return a
    }
});
cc.ActionTween.create = function(a, b, c, d) {
    var e = new cc.ActionTween;
    return e.initWithDuration(a, b, c, d) ? e : null
};
cc.action = cc.Action.create;
cc.speed = cc.Speed.create;
cc.follow = cc.Follow.create;
cc.orbitCamera = cc.OrbitCamera.create;
cc.cardinalSplineTo = cc.CardinalSplineTo.create;
cc.cardinalSplineBy = cc.CardinalSplineBy.create;
cc.catmullRomTo = cc.CatmullRomTo.create;
cc.catmullRomBy = cc.CatmullRomBy.create;
cc.show = cc.Show.create;
cc.hide = cc.Hide.create;
cc.toggleVisibility = cc.ToggleVisibility.create;
cc.removeSelf = cc.RemoveSelf.create;
cc.flipX = cc.FlipX.create;
cc.flipY = cc.FlipY.create;
cc.place = cc.Place.create;
cc.callFunc = cc.CallFunc.create;
cc.actionInterval = cc.ActionInterval.create;
cc.sequence = cc.Sequence.create;
cc.repeat = cc.Repeat.create;
cc.repeatForever = cc.RepeatForever.create;
cc.spawn = cc.Spawn.create;
cc.rotateTo = cc.RotateTo.create;
cc.rotateBy = cc.RotateBy.create;
cc.moveBy = cc.MoveBy.create;
cc.moveTo = cc.MoveTo.create;
cc.skewTo = cc.SkewTo.create;
cc.skewBy = cc.SkewBy.create;
cc.jumpBy = cc.JumpBy.create;
cc.jumpTo = cc.JumpTo.create;
cc.bezierBy = cc.BezierBy.create;
cc.bezierTo = cc.BezierTo.create;
cc.scaleTo = cc.ScaleTo.create;
cc.scaleBy = cc.ScaleBy.create;
cc.blink = cc.Blink.create;
cc.fadeTo = cc.FadeTo.create;
cc.fadeIn = cc.FadeIn.create;
cc.fadeOut = cc.FadeOut.create;
cc.tintTo = cc.TintTo.create;
cc.tintBy = cc.TintBy.create;
cc.delayTime = cc.DelayTime.create;
cc.reverseTime = cc.ReverseTime.create;
cc.animate = cc.Animate.create;
cc.targetedAction = cc.TargetedAction.create;
cc.actionTween = cc.ActionTween.create;
cc.ProgressTimer = cc.NodeRGBA.extend({
    _type: null,
    _percentage: 0,
    _sprite: null,
    _midPoint: null,
    _barChangeRate: null,
    _reverseDirection: !1,
    _className: "ProgressTimer",
    getMidpoint: function() {
        return cc.p(this._midPoint.x, this._midPoint.y)
    },
    setMidpoint: function(a) {
        this._midPoint = cc.pClamp(a, cc.p(0, 0), cc.p(1, 1))
    },
    getBarChangeRate: function() {
        return cc.p(this._barChangeRate.x, this._barChangeRate.y)
    },
    setBarChangeRate: function(a) {
        this._barChangeRate = cc.pClamp(a, cc.p(0, 0), cc.p(1, 1))
    },
    getType: function() {
        return this._type
    },
    getPercentage: function() {
        return this._percentage
    },
    getSprite: function() {
        return this._sprite
    },
    setPercentage: function(a) {
        this._percentage != a && (this._percentage = cc.clampf(a, 0, 100), this._updateProgress())
    },
    setOpacityModifyRGB: function(a) {},
    isOpacityModifyRGB: function() {
        return !1
    },
    isReverseDirection: function() {
        return this._reverseDirection
    },
    _boundaryTexCoord: function(a) {
        if (a < cc.ProgressTimer.TEXTURE_COORDS_COUNT) {
            var b = cc.ProgressTimer.TEXTURE_COORDS;
            return this._reverseDirection ? cc.p(b >> 7 - (a << 1) & 1, b >> 7 -
                ((a << 1) + 1) & 1) : cc.p(b >> (a << 1) + 1 & 1, b >> (a << 1) & 1)
        }
        return cc.p(0, 0)
    },
    _origin: null,
    _startAngle: 270,
    _endAngle: 270,
    _radius: 0,
    _counterClockWise: !1,
    _barRect: null,
    _vertexDataCount: 0,
    _vertexData: null,
    _vertexArrayBuffer: null,
    _vertexWebGLBuffer: null,
    _vertexDataDirty: !1,
    ctor: null,
    _ctorForCanvas: function() {
        cc.NodeRGBA.prototype.ctor.call(this);
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._percentage = 0;
        this._midPoint = cc.p(0, 0);
        this._barChangeRate = cc.p(0, 0);
        this._reverseDirection = !1;
        this._sprite = null;
        this._origin =
            cc.p(0, 0);
        this._endAngle = this._startAngle = 270;
        this._radius = 0;
        this._counterClockWise = !1;
        this._barRect = cc.rect(0, 0, 0, 0)
    },
    _ctorForWebGL: function() {
        cc.NodeRGBA.prototype.ctor.call(this);
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._percentage = 0;
        this._midPoint = cc.p(0, 0);
        this._barChangeRate = cc.p(0, 0);
        this._reverseDirection = !1;
        this._sprite = null;
        this._vertexWebGLBuffer = cc._renderContext.createBuffer();
        this._vertexDataCount = 0;
        this._vertexArrayBuffer = this._vertexData = null;
        this._vertexDataDirty = !1
    },
    setColor: function(a) {
        this._sprite.color =
            a;
        this._updateColor()
    },
    setOpacity: function(a) {
        this._sprite.opacity = a;
        this._updateColor()
    },
    getColor: function() {
        return this._sprite.color
    },
    getOpacity: function() {
        return this._sprite.opacity
    },
    setReverseProgress: null,
    _setReverseProgressForCanvas: function(a) {
        this._reverseDirection !== a && (this._reverseDirection = a)
    },
    _setReverseProgressForWebGL: function(a) {
        this._reverseDirection !== a && (this._reverseDirection = a, this._vertexArrayBuffer = this._vertexData = null, this._vertexDataCount = 0)
    },
    setSprite: null,
    _setSpriteForCanvas: function(a) {
        this._sprite !=
            a && (this._sprite = a, this.width = this._sprite.width, this.height = this._sprite.height)
    },
    _setSpriteForWebGL: function(a) {
        a && this._sprite != a && (this._sprite = a, this.width = a.width, this.height = a.height, this._vertexData && (this._vertexArrayBuffer = this._vertexData = null, this._vertexDataCount = 0))
    },
    setType: null,
    _setTypeForCanvas: function(a) {
        a !== this._type && (this._type = a)
    },
    _setTypeForWebGL: function(a) {
        a !== this._type && (this._vertexData && (this._vertexArrayBuffer = this._vertexData = null, this._vertexDataCount = 0), this._type =
            a)
    },
    setReverseDirection: null,
    _setReverseDirectionForCanvas: function(a) {
        this._reverseDirection !== a && (this._reverseDirection = a)
    },
    _setReverseDirectionForWebGL: function(a) {
        this._reverseDirection !== a && (this._reverseDirection = a, this._vertexArrayBuffer = this._vertexData = null, this._vertexDataCount = 0)
    },
    _textureCoordFromAlphaPoint: function(a) {
        var b = this._sprite;
        if (!b) return {
            u: 0,
            v: 0
        };
        var c = b.quad,
            d = cc.p(c.bl.texCoords.u, c.bl.texCoords.v),
            c = cc.p(c.tr.texCoords.u, c.tr.texCoords.v);
        b.textureRectRotated && (b = a.x,
            a.x = a.y, a.y = b);
        return {
            u: d.x * (1 - a.x) + c.x * a.x,
            v: d.y * (1 - a.y) + c.y * a.y
        }
    },
    _vertexFromAlphaPoint: function(a) {
        if (!this._sprite) return {
            x: 0,
            y: 0
        };
        var b = this._sprite.quad,
            c = cc.p(b.bl.vertices.x, b.bl.vertices.y),
            b = cc.p(b.tr.vertices.x, b.tr.vertices.y);
        return {
            x: c.x * (1 - a.x) + b.x * a.x,
            y: c.y * (1 - a.y) + b.y * a.y
        }
    },
    initWithSprite: null,
    _initWithSpriteForCanvas: function(a) {
        this.percentage = 0;
        this.anchorY = this.anchorX = 0.5;
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._reverseDirection = !1;
        this.midPoint = cc.p(0.5, 0.5);
        this.barChangeRate =
            cc.p(1, 1);
        this.sprite = a;
        return !0
    },
    _initWithSpriteForWebGL: function(a) {
        this.percentage = 0;
        this._vertexArrayBuffer = this._vertexData = null;
        this._vertexDataCount = 0;
        this.anchorY = this.anchorX = 0.5;
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._reverseDirection = !1;
        this.midPoint = cc.p(0.5, 0.5);
        this.barChangeRate = cc.p(1, 1);
        this.sprite = a;
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        return !0
    },
    draw: null,
    _drawForCanvas: function(a) {
        a = a || cc._renderContext;
        var b = this._sprite;
        b._isLighterMode &&
            (a.globalCompositeOperation = "lighter");
        var c = cc.view.getScaleX(),
            d = cc.view.getScaleY();
        a.globalAlpha = b._displayedOpacity / 255;
        var e = b._rect,
            f = b._contentSize,
            g = b._offsetPosition,
            h = b._drawSize_Canvas,
            k = 0 | g.x,
            m = -g.y - e.height,
            n = b._textureRect_Canvas;
        h.width = e.width * c;
        h.height = e.height * d;
        a.save();
        b._flippedX && (k = -g.x - e.width, a.scale(-1, 1));
        b._flippedY && (m = g.y, a.scale(1, -1));
        k *= c;
        m *= d;
        this._type == cc.ProgressTimer.TYPE_BAR ? (e = this._barRect, a.beginPath(), a.rect(e.x * c, e.y * d, e.width * c, e.height * d), a.clip(), a.closePath()) :
            this._type == cc.ProgressTimer.TYPE_RADIAL && (e = this._origin.x * c, g = this._origin.y * d, a.beginPath(), a.arc(e, g, this._radius * d, Math.PI / 180 * this._startAngle, Math.PI / 180 * this._endAngle, this._counterClockWise), a.lineTo(e, g), a.clip(), a.closePath());
        b._texture && n.validRect ? (c = b._texture.getHtmlElementObj(), this._colorized ? a.drawImage(c, 0, 0, n.width, n.height, k, m, h.width, h.height) : a.drawImage(c, n.x, n.y, n.width, n.height, k, m, h.width, h.height)) : 0 !== f.width && (h = this.color, a.fillStyle = "rgba(" + h.r + "," + h.g + "," + h.b + ",1)",
            a.fillRect(k, m, f.width * c, f.height * d));
        a.restore();
        cc.incrementGLDraws(1)
    },
    _drawForWebGL: function(a) {
        a = a || cc._renderContext;
        if (this._vertexData && this._sprite) {
            cc.nodeDrawSetup(this);
            var b = this._sprite.getBlendFunc();
            cc.glBlendFunc(b.src, b.dst);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
            cc.glBindTexture2D(this._sprite.texture);
            a.bindBuffer(a.ARRAY_BUFFER, this._vertexWebGLBuffer);
            this._vertexDataDirty && (a.bufferData(a.ARRAY_BUFFER, this._vertexArrayBuffer, a.DYNAMIC_DRAW), this._vertexDataDirty = !1);
            b = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
            a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, b, 0);
            a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, a.UNSIGNED_BYTE, !0, b, 8);
            a.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, a.FLOAT, !1, b, 12);
            this._type === cc.ProgressTimer.TYPE_RADIAL ? a.drawArrays(a.TRIANGLE_FAN, 0, this._vertexDataCount) : this._type == cc.ProgressTimer.TYPE_BAR && (this._reverseDirection ? (a.drawArrays(a.TRIANGLE_STRIP, 0, this._vertexDataCount / 2), a.drawArrays(a.TRIANGLE_STRIP, 4, this._vertexDataCount /
                2), cc.g_NumberOfDraws++) : a.drawArrays(a.TRIANGLE_STRIP, 0, this._vertexDataCount));
            cc.g_NumberOfDraws++
        }
    },
    _updateRadial: function() {
        if (this._sprite) {
            var a, b = this._midPoint;
            a = this._percentage / 100;
            var c = 2 * cc.PI * (this._reverseDirection ? a : 1 - a),
                d = cc.p(b.x, 1),
                e = cc.pRotateByAngle(d, b, c),
                c = 0;
            if (0 == a) e = d, c = 0;
            else if (1 == a) e = d, c = 4;
            else {
                var f = cc.FLT_MAX,
                    g = cc.ProgressTimer.TEXTURE_COORDS_COUNT;
                for (a = 0; a <= g; ++a) {
                    var h = (a + (g - 1)) % g,
                        k = this._boundaryTexCoord(a % g),
                        h = this._boundaryTexCoord(h);
                    0 == a ? h = cc.pLerp(k, h, 1 - b.x) :
                        4 == a && (k = cc.pLerp(k, h, 1 - b.x));
                    var m = cc.p(0, 0);
                    if (cc.pLineIntersect(k, h, b, e, m) && (!(0 == a || 4 == a) || 0 <= m.x && 1 >= m.x) && 0 <= m.y && m.y < f) f = m.y, c = a
                }
                e = cc.pAdd(b, cc.pMult(cc.pSub(e, b), f))
            }
            f = !0;
            this._vertexDataCount != c + 3 && (f = !1, this._vertexArrayBuffer = this._vertexData = null, this._vertexDataCount = 0);
            if (!this._vertexData) {
                g = this._vertexDataCount = c + 3;
                k = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
                this._vertexArrayBuffer = new ArrayBuffer(g * k);
                h = [];
                for (a = 0; a < g; a++) h[a] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, a * k);
                this._vertexData = h;
                if (!this._vertexData) {
                    cc.log("cc.ProgressTimer._updateRadial() : Not enough memory");
                    return
                }
            }
            this._updateColor();
            g = this._vertexData;
            if (!f) {
                g[0].texCoords = this._textureCoordFromAlphaPoint(b);
                g[0].vertices = this._vertexFromAlphaPoint(b);
                g[1].texCoords = this._textureCoordFromAlphaPoint(d);
                g[1].vertices = this._vertexFromAlphaPoint(d);
                for (a = 0; a < c; a++) b = this._boundaryTexCoord(a), g[a + 2].texCoords = this._textureCoordFromAlphaPoint(b), g[a + 2].vertices = this._vertexFromAlphaPoint(b)
            }
            g[this._vertexDataCount -
                1].texCoords = this._textureCoordFromAlphaPoint(e);
            g[this._vertexDataCount - 1].vertices = this._vertexFromAlphaPoint(e)
        }
    },
    _updateBar: function() {
        if (this._sprite) {
            var a, b = this._percentage / 100,
                c = this._barChangeRate,
                c = cc.pMult(cc.p(1 - c.x + b * c.x, 1 - c.y + b * c.y), 0.5),
                b = cc.pSub(this._midPoint, c),
                c = cc.pAdd(this._midPoint, c);
            0 > b.x && (c.x += -b.x, b.x = 0);
            1 < c.x && (b.x -= c.x - 1, c.x = 1);
            0 > b.y && (c.y += -b.y, b.y = 0);
            1 < c.y && (b.y -= c.y - 1, c.y = 1);
            if (this._reverseDirection) {
                if (!this._vertexData) {
                    this._vertexDataCount = 8;
                    var d = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
                    this._vertexArrayBuffer = new ArrayBuffer(8 * d);
                    var e = [];
                    for (a = 0; 8 > a; a++) e[a] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, a * d);
                    e[0].texCoords = this._textureCoordFromAlphaPoint(cc.p(0, 1));
                    e[0].vertices = this._vertexFromAlphaPoint(cc.p(0, 1));
                    e[1].texCoords = this._textureCoordFromAlphaPoint(cc.p(0, 0));
                    e[1].vertices = this._vertexFromAlphaPoint(cc.p(0, 0));
                    e[6].texCoords = this._textureCoordFromAlphaPoint(cc.p(1, 1));
                    e[6].vertices = this._vertexFromAlphaPoint(cc.p(1, 1));
                    e[7].texCoords = this._textureCoordFromAlphaPoint(cc.p(1,
                        0));
                    e[7].vertices = this._vertexFromAlphaPoint(cc.p(1, 0));
                    this._vertexData = e
                }
                a = this._vertexData;
                a[2].texCoords = this._textureCoordFromAlphaPoint(cc.p(b.x, c.y));
                a[2].vertices = this._vertexFromAlphaPoint(cc.p(b.x, c.y));
                a[3].texCoords = this._textureCoordFromAlphaPoint(cc.p(b.x, b.y));
                a[3].vertices = this._vertexFromAlphaPoint(cc.p(b.x, b.y));
                a[4].texCoords = this._textureCoordFromAlphaPoint(cc.p(c.x, c.y));
                a[4].vertices = this._vertexFromAlphaPoint(cc.p(c.x, c.y));
                a[5].texCoords = this._textureCoordFromAlphaPoint(cc.p(c.x,
                    b.y));
                a[5].vertices = this._vertexFromAlphaPoint(cc.p(c.x, b.y))
            } else {
                if (!this._vertexData) {
                    this._vertexDataCount = 4;
                    d = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
                    this._vertexArrayBuffer = new ArrayBuffer(4 * d);
                    this._vertexData = [];
                    for (a = 0; 4 > a; a++) this._vertexData[a] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, a * d)
                }
                a = this._vertexData;
                a[0].texCoords = this._textureCoordFromAlphaPoint(cc.p(b.x, c.y));
                a[0].vertices = this._vertexFromAlphaPoint(cc.p(b.x, c.y));
                a[1].texCoords = this._textureCoordFromAlphaPoint(cc.p(b.x,
                    b.y));
                a[1].vertices = this._vertexFromAlphaPoint(cc.p(b.x, b.y));
                a[2].texCoords = this._textureCoordFromAlphaPoint(cc.p(c.x, c.y));
                a[2].vertices = this._vertexFromAlphaPoint(cc.p(c.x, c.y));
                a[3].texCoords = this._textureCoordFromAlphaPoint(cc.p(c.x, b.y));
                a[3].vertices = this._vertexFromAlphaPoint(cc.p(c.x, b.y))
            }
            this._updateColor()
        }
    },
    _updateColor: function() {
        if (this._sprite && this._vertexData) {
            for (var a = this._sprite.quad.tl.colors, b = this._vertexData, c = 0, d = this._vertexDataCount; c < d; ++c) b[c].colors = a;
            this._vertexDataDirty = !0
        }
    },
    _updateProgress: null,
    _updateProgressForCanvas: function() {
        var a = this._sprite,
            b = a.width,
            c = a.height,
            d = this._midPoint;
        if (this._type == cc.ProgressTimer.TYPE_RADIAL) {
            this._radius = Math.round(Math.sqrt(b * b + c * c));
            var e, f = !1,
                g = this._origin;
            g.x = b * d.x;
            g.y = -c * d.y;
            this._reverseDirection ? (e = 270, d = 270 - 3.6 * this._percentage) : (d = -90, e = -90 + 3.6 * this._percentage);
            a._flippedX && (g.x -= b * 2 * this._midPoint.x, d = -d - 180, e = -e - 180, f = !f);
            a._flippedY && (g.y += c * 2 * this._midPoint.y, f = !f, d = -d, e = -e);
            this._startAngle = d;
            this._endAngle =
                e;
            this._counterClockWise = f
        } else {
            e = this._barChangeRate;
            g = this._percentage / 100;
            f = this._barRect;
            e = cc.size(b * (1 - e.x), c * (1 - e.y));
            var g = cc.size((b - e.width) * g, (c - e.height) * g),
                g = cc.size(e.width + g.width, e.height + g.height),
                h = cc.p(b * d.x, c * d.y);
            e = h.x - g.width / 2;
            0.5 < d.x && g.width / 2 >= b - h.x && (e = b - g.width);
            b = h.y - g.height / 2;
            0.5 < d.y && g.height / 2 >= c - h.y && (b = c - g.height);
            f.x = 0;
            c = 1;
            a._flippedX && (f.x -= g.width, c = -1);
            0 < e && (f.x += e * c);
            f.y = 0;
            c = 1;
            a._flippedY && (f.y += g.height, c = -1);
            0 < b && (f.y -= b * c);
            f.width = g.width;
            f.height = -g.height
        }
    },
    _updateProgressForWebGL: function() {
        var a = this._type;
        a === cc.ProgressTimer.TYPE_RADIAL ? this._updateRadial() : a === cc.ProgressTimer.TYPE_BAR && this._updateBar();
        this._vertexDataDirty = !0
    }
});
_p = cc.ProgressTimer.prototype;
cc._renderType == cc._RENDER_TYPE_WEBGL ? (_p.ctor = _p._ctorForWebGL, _p.setReverseProgress = _p._setReverseProgressForWebGL, _p.setSprite = _p._setSpriteForWebGL, _p.setType = _p._setTypeForWebGL, _p.setReverseDirection = _p._setReverseDirectionForWebGL, _p.initWithSprite = _p._initWithSpriteForWebGL, _p.draw = _p._drawForWebGL, _p._updateProgress = _p._updateProgressForWebGL) : (_p.ctor = _p._ctorForCanvas, _p.setReverseProgress = _p._setReverseProgressForCanvas, _p.setSprite = _p._setSpriteForCanvas, _p.setType = _p._setTypeForCanvas,
    _p.setReverseDirection = _p._setReverseDirectionForCanvas, _p.initWithSprite = _p._initWithSpriteForCanvas, _p.draw = _p._drawForCanvas, _p._updateProgress = cc.ProgressTimer.prototype._updateProgressForCanvas);
cc.defineGetterSetter(_p, "midPoint", _p.getMidpoint, _p.setMidpoint);
cc.defineGetterSetter(_p, "barChangeRate", _p.getBarChangeRate, _p.setBarChangeRate);
cc.defineGetterSetter(_p, "type", _p.getType, _p.setType);
cc.defineGetterSetter(_p, "percentage", _p.getPercentage, _p.setPercentage);
cc.defineGetterSetter(_p, "sprite", _p.getSprite, _p.setSprite);
cc.defineGetterSetter(_p, "reverseDir", _p.isReverseDirection, _p.setReverseDirection);
cc.ProgressTimer.create = function(a) {
    var b = new cc.ProgressTimer;
    return b.initWithSprite(a) ? b : null
};
cc.ProgressTimer.TEXTURE_COORDS_COUNT = 4;
cc.ProgressTimer.TEXTURE_COORDS = 75;
cc.ProgressTimer.TYPE_RADIAL = 0;
cc.ProgressTimer.TYPE_BAR = 1;
cc.ProgressTo = cc.ActionInterval.extend({
    _to: 0,
    _from: 0,
    ctor: function(a, b) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._from = this._to = 0;
        void 0 !== b && this.initWithDuration(a, b)
    },
    initWithDuration: function(a, b) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._to = b, !0) : !1
    },
    clone: function() {
        var a = new cc.ProgressTo;
        a.initWithDuration(this._duration, this._to);
        return a
    },
    reverse: function() {
        cc.log("cc.ProgressTo.reverse(): reverse hasn't been supported.");
        return null
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this,
            a);
        this._from = a.percentage;
        100 == this._from && (this._from = 0)
    },
    update: function(a) {
        this.target instanceof cc.ProgressTimer && (this.target.percentage = this._from + (this._to - this._from) * a)
    }
});
cc.ProgressTo.create = function(a, b) {
    return new cc.ProgressTo(a, b)
};
cc.ProgressFromTo = cc.ActionInterval.extend({
    _to: 0,
    _from: 0,
    ctor: function(a, b, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._from = this._to = 0;
        void 0 !== c && this.initWithDuration(a, b, c)
    },
    initWithDuration: function(a, b, c) {
        return cc.ActionInterval.prototype.initWithDuration.call(this, a) ? (this._to = c, this._from = b, !0) : !1
    },
    clone: function() {
        var a = new cc.ProgressFromTo;
        a.initWithDuration(this._duration, this._from, this._to);
        return a
    },
    reverse: function() {
        return cc.ProgressFromTo.create(this._duration, this._to,
            this._from)
    },
    startWithTarget: function(a) {
        cc.ActionInterval.prototype.startWithTarget.call(this, a)
    },
    update: function(a) {
        this.target instanceof cc.ProgressTimer && (this.target.percentage = this._from + (this._to - this._from) * a)
    }
});
cc.ProgressFromTo.create = function(a, b, c) {
    return new cc.ProgressFromTo(a, b, c)
};
cc.SCENE_FADE = 4208917214;
cc.TransitionEaseScene = cc.Class.extend({
    easeActionWithAction: function() {}
});
cc.TRANSITION_ORIENTATION_LEFT_OVER = 0;
cc.TRANSITION_ORIENTATION_RIGHT_OVER = 1;
cc.TRANSITION_ORIENTATION_UP_OVER = 0;
cc.TRANSITION_ORIENTATION_DOWN_OVER = 1;
cc.TransitionScene = cc.Scene.extend({
    _inScene: null,
    _outScene: null,
    _duration: null,
    _isInSceneOnTop: !1,
    _isSendCleanupToScene: !1,
    _className: "TransitionScene",
    ctor: function(a, b) {
        cc.Scene.prototype.ctor.call(this);
        void 0 !== a && void 0 !== b && this.initWithDuration(a, b)
    },
    _setNewScene: function(a) {
        this.unschedule(this._setNewScene);
        a = cc.director;
        this._isSendCleanupToScene = a.isSendCleanupToScene();
        a.runScene(this._inScene);
        cc.eventManager.setEnabled(!0);
        this._outScene.visible = !0
    },
    _sceneOrder: function() {
        this._isInSceneOnTop = !0
    },
    draw: function() {
        this._isInSceneOnTop ? (this._outScene.visit(), this._inScene.visit()) : (this._inScene.visit(), this._outScene.visit())
    },
    onEnter: function() {
        cc.Node.prototype.onEnter.call(this);
        cc.eventManager.setEnabled(!1);
        this._outScene.onExitTransitionDidStart();
        this._inScene.onEnter()
    },
    onExit: function() {
        cc.Node.prototype.onExit.call(this);
        cc.eventManager.setEnabled(!0);
        this._outScene.onExit();
        this._inScene.onEnterTransitionDidFinish()
    },
    cleanup: function() {
        cc.Node.prototype.cleanup.call(this);
        this._isSendCleanupToScene &&
            this._outScene.cleanup()
    },
    initWithDuration: function(a, b) {
        if (!b) throw "cc.TransitionScene.initWithDuration(): Argument scene must be non-nil";
        if (this.init()) {
            this._duration = a;
            this.attr({
                x: 0,
                y: 0,
                anchorX: 0,
                anchorY: 0
            });
            this._inScene = b;
            this._outScene = cc.director.getRunningScene();
            this._outScene || (this._outScene = cc.Scene.create(), this._outScene.init());
            if (this._inScene == this._outScene) throw "cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene";
            this._sceneOrder();
            return !0
        }
        return !1
    },
    finish: function() {
        this._inScene.attr({
            visible: !0,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        });
        cc._renderType === cc._RENDER_TYPE_WEBGL && this._inScene.getCamera().restore();
        this._outScene.attr({
            visible: !1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        });
        cc._renderType === cc._RENDER_TYPE_WEBGL && this._outScene.getCamera().restore();
        this.schedule(this._setNewScene, 0)
    },
    hideOutShowIn: function() {
        this._inScene.visible = !0;
        this._outScene.visible = !1
    }
});
cc.TransitionScene.create = function(a, b) {
    return new cc.TransitionScene(a, b)
};
cc.TransitionSceneOriented = cc.TransitionScene.extend({
    _orientation: 0,
    initWithDuration: function(a, b, c) {
        cc.TransitionScene.prototype.initWithDuration.call(this, a, b) && (this._orientation = c);
        return !0
    }
});
cc.TransitionSceneOriented.create = function(a, b, c) {
    var d = new cc.TransitionSceneOriented;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionRotoZoom = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this._inScene.attr({
            scale: 0.001,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this._outScene.attr({
            scale: 1,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var a = cc.Sequence.create(cc.Spawn.create(cc.ScaleBy.create(this._duration / 2, 0.001), cc.RotateBy.create(this._duration / 2, 720)), cc.DelayTime.create(this._duration / 2));
        this._outScene.runAction(a);
        this._inScene.runAction(cc.Sequence.create(a.reverse(), cc.CallFunc.create(this.finish,
            this)))
    }
});
cc.TransitionRotoZoom.create = function(a, b) {
    var c = new cc.TransitionRotoZoom;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionJumpZoom = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.director.getWinSize();
        this._inScene.attr({
            scale: 0.5,
            x: a.width,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this._outScene.anchorX = 0.5;
        this._outScene.anchorY = 0.5;
        var b = cc.JumpBy.create(this._duration / 4, cc.p(-a.width, 0), a.width / 4, 2),
            c = cc.ScaleTo.create(this._duration / 4, 1),
            a = cc.ScaleTo.create(this._duration / 4, 0.5),
            a = cc.Sequence.create(a, b),
            b = cc.Sequence.create(b, c),
            c = cc.DelayTime.create(this._duration /
                2);
        this._outScene.runAction(a);
        this._inScene.runAction(cc.Sequence.create(c, b, cc.CallFunc.create(this.finish, this)))
    }
});
cc.TransitionJumpZoom.create = function(a, b) {
    var c = new cc.TransitionJumpZoom;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionMoveInL = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this.initScenes();
        var a = this.action();
        this._inScene.runAction(cc.Sequence.create(this.easeActionWithAction(a), cc.CallFunc.create(this.finish, this)))
    },
    initScenes: function() {
        this._inScene.setPosition(-cc.director.getWinSize().width, 0)
    },
    action: function() {
        return cc.MoveTo.create(this._duration, cc.p(0, 0))
    },
    easeActionWithAction: function(a) {
        return cc.EaseOut.create(a, 2)
    }
});
cc.TransitionMoveInL.create = function(a, b) {
    var c = new cc.TransitionMoveInL;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionMoveInR = cc.TransitionMoveInL.extend({
    initScenes: function() {
        this._inScene.setPosition(cc.director.getWinSize().width, 0)
    }
});
cc.TransitionMoveInR.create = function(a, b) {
    var c = new cc.TransitionMoveInR;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionMoveInT = cc.TransitionMoveInL.extend({
    initScenes: function() {
        this._inScene.setPosition(0, cc.director.getWinSize().height)
    }
});
cc.TransitionMoveInT.create = function(a, b) {
    var c = new cc.TransitionMoveInT;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionMoveInB = cc.TransitionMoveInL.extend({
    initScenes: function() {
        this._inScene.setPosition(0, -cc.director.getWinSize().height)
    }
});
cc.TransitionMoveInB.create = function(a, b) {
    var c = new cc.TransitionMoveInB;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.ADJUST_FACTOR = 0.5;
cc.TransitionSlideInL = cc.TransitionScene.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this.initScenes();
        var a = this.action(),
            b = this.action(),
            a = this.easeActionWithAction(a),
            b = cc.Sequence.create(this.easeActionWithAction(b), cc.CallFunc.create(this.finish, this));
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    },
    initScenes: function() {
        this._inScene.setPosition(-cc.director.getWinSize().width + cc.ADJUST_FACTOR, 0)
    },
    action: function() {
        return cc.MoveBy.create(this._duration,
            cc.p(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0))
    },
    easeActionWithAction: function(a) {
        return cc.EaseOut.create(a, 2)
    }
});
cc.TransitionSlideInL.create = function(a, b) {
    var c = new cc.TransitionSlideInL;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionSlideInR = cc.TransitionSlideInL.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !0
    },
    initScenes: function() {
        this._inScene.setPosition(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0)
    },
    action: function() {
        return cc.MoveBy.create(this._duration, cc.p(-(cc.director.getWinSize().width - cc.ADJUST_FACTOR), 0))
    }
});
cc.TransitionSlideInR.create = function(a, b) {
    var c = new cc.TransitionSlideInR;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionSlideInB = cc.TransitionSlideInL.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    },
    initScenes: function() {
        this._inScene.setPosition(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR)
    },
    action: function() {
        return cc.MoveBy.create(this._duration, cc.p(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR)))
    }
});
cc.TransitionSlideInB.create = function(a, b) {
    var c = new cc.TransitionSlideInB;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionSlideInT = cc.TransitionSlideInL.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !0
    },
    initScenes: function() {
        this._inScene.setPosition(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR))
    },
    action: function() {
        return cc.MoveBy.create(this._duration, cc.p(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR))
    }
});
cc.TransitionSlideInT.create = function(a, b) {
    var c = new cc.TransitionSlideInT;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionShrinkGrow = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this._inScene.attr({
            scale: 0.001,
            anchorX: 2 / 3,
            anchorY: 0.5
        });
        this._outScene.attr({
            scale: 1,
            anchorX: 1 / 3,
            anchorY: 0.5
        });
        var a = cc.ScaleTo.create(this._duration, 0.01),
            b = cc.ScaleTo.create(this._duration, 1);
        this._inScene.runAction(this.easeActionWithAction(b));
        this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(a), cc.CallFunc.create(this.finish, this)))
    },
    easeActionWithAction: function(a) {
        return cc.EaseOut.create(a,
            2)
    }
});
cc.TransitionShrinkGrow.create = function(a, b) {
    var c = new cc.TransitionShrinkGrow;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionFlipX = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, 0, 0), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, 0, b, 0, 0), cc.Hide.create(),
            cc.DelayTime.create(this._duration / 2));
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionFlipX.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_RIGHT_OVER);
    var d = new cc.TransitionFlipX;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionFlipY = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation == cc.TRANSITION_ORIENTATION_UP_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, 90, 0), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, 0, b, 90, 0), cc.Hide.create(),
            cc.DelayTime.create(this._duration / 2));
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionFlipY.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_UP_OVER);
    var d = new cc.TransitionFlipY;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionFlipAngular = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, -45, 0), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, 0, b, 45, 0),
            cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionFlipAngular.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_RIGHT_OVER);
    var d = new cc.TransitionFlipAngular;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionZoomFlipX = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, 0, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration /
            2, 1, 0, 0, b, 0, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
        this._inScene.scale = 0.5;
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionZoomFlipX.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_RIGHT_OVER);
    var d = new cc.TransitionZoomFlipX;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionZoomFlipY = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation === cc.TRANSITION_ORIENTATION_UP_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, 90, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration /
            2, 1, 0, 0, b, 90, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
        this._inScene.scale = 0.5;
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionZoomFlipY.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_UP_OVER);
    var d = new cc.TransitionZoomFlipY;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionZoomFlipAngular = cc.TransitionSceneOriented.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a, b;
        this._inScene.visible = !1;
        var c;
        this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER ? (a = 90, c = 270, b = 90) : (a = -90, c = 90, b = -90);
        a = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, c, a, -45, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.Show.create(), cc.CallFunc.create(this.finish, this));
        b = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, 0, b, 45, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
        this._inScene.scale = 0.5;
        this._inScene.runAction(a);
        this._outScene.runAction(b)
    }
});
cc.TransitionZoomFlipAngular.create = function(a, b, c) {
    null == c && (c = cc.TRANSITION_ORIENTATION_RIGHT_OVER);
    var d = new cc.TransitionZoomFlipAngular;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionFade = cc.TransitionScene.extend({
    _color: null,
    ctor: function() {
        cc.TransitionScene.prototype.ctor.call(this);
        this._color = cc.color()
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.LayerColor.create(this._color);
        this._inScene.visible = !1;
        this.addChild(a, 2, cc.SCENE_FADE);
        var a = this.getChildByTag(cc.SCENE_FADE),
            b = cc.Sequence.create(cc.FadeIn.create(this._duration / 2), cc.CallFunc.create(this.hideOutShowIn, this), cc.FadeOut.create(this._duration / 2), cc.CallFunc.create(this.finish,
                this));
        a.runAction(b)
    },
    onExit: function() {
        cc.TransitionScene.prototype.onExit.call(this);
        this.removeChildByTag(cc.SCENE_FADE, !1)
    },
    initWithDuration: function(a, b, c) {
        c = c || cc.color.BLACK;
        cc.TransitionScene.prototype.initWithDuration.call(this, a, b) && (this._color.r = c.r, this._color.g = c.g, this._color.b = c.b, this._color.a = 0);
        return !0
    }
});
cc.TransitionFade.create = function(a, b, c) {
    var d = new cc.TransitionFade;
    d.initWithDuration(a, b, c);
    return d
};
cc.TransitionCrossFade = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.color(0, 0, 0, 0),
            b = cc.director.getWinSize(),
            a = cc.LayerColor.create(a),
            c = cc.RenderTexture.create(b.width, b.height);
        if (null != c) {
            c.sprite.anchorX = 0.5;
            c.sprite.anchorY = 0.5;
            c.attr({
                x: b.width / 2,
                y: b.height / 2,
                anchorX: 0.5,
                anchorY: 0.5
            });
            c.begin();
            this._inScene.visit();
            c.end();
            var d = cc.RenderTexture.create(b.width, b.height);
            d.setPosition(b.width / 2, b.height / 2);
            d.sprite.anchorX = d.anchorX =
                0.5;
            d.sprite.anchorY = d.anchorY = 0.5;
            d.begin();
            this._outScene.visit();
            d.end();
            c.sprite.setBlendFunc(cc.ONE, cc.ONE);
            d.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
            a.addChild(c);
            a.addChild(d);
            c.sprite.opacity = 255;
            d.sprite.opacity = 255;
            b = cc.Sequence.create(cc.FadeTo.create(this._duration, 0), cc.CallFunc.create(this.hideOutShowIn, this), cc.CallFunc.create(this.finish, this));
            d.sprite.runAction(b);
            this.addChild(a, 2, cc.SCENE_FADE)
        }
    },
    onExit: function() {
        this.removeChildByTag(cc.SCENE_FADE, !1);
        cc.TransitionScene.prototype.onExit.call(this)
    },
    draw: function() {}
});
cc.TransitionCrossFade.create = function(a, b) {
    var c = new cc.TransitionCrossFade;
    c.initWithDuration(a, b);
    return c
};
cc.TransitionTurnOffTiles = cc.TransitionScene.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.director.getWinSize(),
            a = cc.TurnOffTiles.create(this._duration, cc.size(0 | 12 * (a.width / a.height), 12)),
            a = this.easeActionWithAction(a);
        this._outScene.runAction(cc.Sequence.create(a, cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
    },
    easeActionWithAction: function(a) {
        return a
    }
});
cc.TransitionTurnOffTiles.create = function(a, b) {
    var c = new cc.TransitionTurnOffTiles;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionSplitCols = cc.TransitionScene.extend({
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this._inScene.visible = !1;
        var a = this.action(),
            a = cc.Sequence.create(a, cc.CallFunc.create(this.hideOutShowIn, this), a.reverse());
        this.runAction(cc.Sequence.create(this.easeActionWithAction(a), cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
    },
    easeActionWithAction: function(a) {
        return cc.EaseInOut.create(a, 3)
    },
    action: function() {
        return cc.SplitCols.create(this._duration / 2, 3)
    }
});
cc.TransitionSplitCols.create = function(a, b) {
    var c = new cc.TransitionSplitCols;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionSplitRows = cc.TransitionSplitCols.extend({
    action: function() {
        return cc.SplitRows.create(this._duration / 2, 3)
    }
});
cc.TransitionSplitRows.create = function(a, b) {
    var c = new cc.TransitionSplitRows;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionFadeTR = cc.TransitionScene.extend({
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.director.getWinSize(),
            a = this.actionWithSize(cc.size(0 | 12 * (a.width / a.height), 12));
        this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(a), cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
    },
    easeActionWithAction: function(a) {
        return a
    },
    actionWithSize: function(a) {
        return cc.FadeOutTRTiles.create(this._duration,
            a)
    }
});
cc.TransitionFadeTR.create = function(a, b) {
    var c = new cc.TransitionFadeTR;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionFadeBL = cc.TransitionFadeTR.extend({
    actionWithSize: function(a) {
        return cc.FadeOutBLTiles.create(this._duration, a)
    }
});
cc.TransitionFadeBL.create = function(a, b) {
    var c = new cc.TransitionFadeBL;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionFadeUp = cc.TransitionFadeTR.extend({
    actionWithSize: function(a) {
        return cc.FadeOutUpTiles.create(this._duration, a)
    }
});
cc.TransitionFadeUp.create = function(a, b) {
    var c = new cc.TransitionFadeUp;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionFadeDown = cc.TransitionFadeTR.extend({
    actionWithSize: function(a) {
        return cc.FadeOutDownTiles.create(this._duration, a)
    }
});
cc.TransitionFadeDown.create = function(a, b) {
    var c = new cc.TransitionFadeDown;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.SCENE_RADIAL = 49153;
cc.TransitionProgress = cc.TransitionScene.extend({
    _to: 0,
    _from: 0,
    _sceneToBeModified: null,
    _className: "TransitionProgress",
    _setAttrs: function(a, b, c) {
        a.attr({
            x: b,
            y: c,
            anchorX: 0.5,
            anchorY: 0.5
        })
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        this._setupTransition();
        var a = cc.director.getWinSize(),
            b = cc.RenderTexture.create(a.width, a.height);
        b.sprite.anchorX = 0.5;
        b.sprite.anchorY = 0.5;
        this._setAttrs(b, a.width / 2, a.height / 2);
        b.clear(0, 0, 0, 1);
        b.begin();
        this._sceneToBeModified.visit();
        b.end();
        this._sceneToBeModified == this._outScene && this.hideOutShowIn();
        a = this._progressTimerNodeWithRenderTexture(b);
        b = cc.Sequence.create(cc.ProgressFromTo.create(this._duration, this._from, this._to), cc.CallFunc.create(this.finish, this));
        a.runAction(b);
        this.addChild(a, 2, cc.SCENE_RADIAL)
    },
    onExit: function() {
        this.removeChildByTag(cc.SCENE_RADIAL, !0);
        cc.TransitionScene.prototype.onExit.call(this)
    },
    _setupTransition: function() {
        this._sceneToBeModified = this._outScene;
        this._from = 100;
        this._to = 0
    },
    _progressTimerNodeWithRenderTexture: function(a) {
        cc.log("cc.TransitionProgress._progressTimerNodeWithRenderTexture(): should be overridden in subclass");
        return null
    },
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    }
});
cc.TransitionProgress.create = function(a, b) {
    var c = new cc.TransitionProgress;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressRadialCCW = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_RADIAL;
        a.reverseDir = !1;
        a.percentage = 100;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    }
});
cc.TransitionProgressRadialCCW.create = function(a, b) {
    var c = new cc.TransitionProgressRadialCCW;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressRadialCW = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_RADIAL;
        a.reverseDir = !0;
        a.percentage = 100;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    }
});
cc.TransitionProgressRadialCW.create = function(a, b) {
    var c = new cc.TransitionProgressRadialCW;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressHorizontal = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_BAR;
        a.midPoint = cc.p(1, 0);
        a.barChangeRate = cc.p(1, 0);
        a.percentage = 100;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    }
});
cc.TransitionProgressHorizontal.create = function(a, b) {
    var c = new cc.TransitionProgressHorizontal;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressVertical = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_BAR;
        a.midPoint = cc.p(0, 0);
        a.barChangeRate = cc.p(0, 1);
        a.percentage = 100;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    }
});
cc.TransitionProgressVertical.create = function(a, b) {
    var c = new cc.TransitionProgressVertical;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressInOut = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_BAR;
        a.midPoint = cc.p(0.5, 0.5);
        a.barChangeRate = cc.p(1, 1);
        a.percentage = 0;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    },
    _sceneOrder: function() {
        this._isInSceneOnTop = !1
    },
    _setupTransition: function() {
        this._sceneToBeModified = this._inScene;
        this._from =
            0;
        this._to = 100
    }
});
cc.TransitionProgressInOut.create = function(a, b) {
    var c = new cc.TransitionProgressInOut;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionProgressOutIn = cc.TransitionProgress.extend({
    _progressTimerNodeWithRenderTexture: function(a) {
        var b = cc.director.getWinSize();
        a = cc.ProgressTimer.create(a.sprite);
        cc._renderType === cc._RENDER_TYPE_WEBGL && (a.sprite.flippedY = !0);
        a.type = cc.ProgressTimer.TYPE_BAR;
        a.midPoint = cc.p(0.5, 0.5);
        a.barChangeRate = cc.p(1, 1);
        a.percentage = 100;
        this._setAttrs(a, b.width / 2, b.height / 2);
        return a
    }
});
cc.TransitionProgressOutIn.create = function(a, b) {
    var c = new cc.TransitionProgressOutIn;
    return null != c && c.initWithDuration(a, b) ? c : null
};
cc.TransitionPageTurn = cc.TransitionScene.extend({
    _back: !0,
    _className: "TransitionPageTurn",
    initWithDuration: function(a, b, c) {
        this._back = c;
        cc.TransitionScene.prototype.initWithDuration.call(this, a, b);
        return !0
    },
    actionWithSize: function(a) {
        return this._back ? cc.ReverseTime.create(cc.PageTurn3D.create(this._duration, a)) : cc.PageTurn3D.create(this._duration, a)
    },
    onEnter: function() {
        cc.TransitionScene.prototype.onEnter.call(this);
        var a = cc.director.getWinSize(),
            b;
        a.width > a.height ? (a = 16, b = 12) : (a = 12, b = 16);
        a = this.actionWithSize(cc.size(a,
            b));
        this._back ? (this._inScene.visible = !1, this._inScene.runAction(cc.Sequence.create(cc.Show.create(), a, cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))) : this._outScene.runAction(cc.Sequence.create(a, cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
    },
    _sceneOrder: function() {
        this._isInSceneOnTop = this._back
    }
});
cc.TransitionPageTurn.create = function(a, b, c) {
    var d = new cc.TransitionPageTurn;
    d.initWithDuration(a, b, c);
    return d
}; /*  |xGv00|4235208e4ec3ef9095aa7fae69ad48ee */