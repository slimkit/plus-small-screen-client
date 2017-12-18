/*!
 * https://github.com/wusfen/console.js
 */
;
(function() {
    // toggle
    if (!location.href.match(/[?&]console/)) return;

    // view
    var tpl = '<style type="text/css"> .console {font-size: 12px; line-height: 1.5; position: fixed; -position: absolute; z-index: 999999999; bottom: 0; right: 0; width: 100%; color: #000; background: rgba(255, 255, 255, .98); box-shadow: rgba(150, 150, 150, 0.8) 0px 6px 15px 5px; } .listw {max-height: 250px; -height: 250px; overflow: scroll; overflow-x: auto; padding-right: 16px; width: 100%; margin-right: -16px; box-sizing: content-box; } .list {padding-bottom: 1.5em; } .cmd {margin: 0; border-top: solid 1px #f5f5f5; padding: 6px; white-space: pre-wrap; word-wrap: break-word; color: red; padding-left: 1.5em; text-indent: -1em; } .obj {padding-left: 6px; word-wrap: break-word; word-break: break-all; } .key {color: #a71d5d; } .value {color: #000; } .children {padding-left: .5em; } .input {line-height: 1.5; display: block; width: 100%; border: none; outline: none; height: 3em; padding: 0 .5em; background: rgba(0, 0, 0, 0); } </style> <div class="console"> <div class="listw"> <div class="list"> <div class="cmd">...</div> <div class="obj"> <span class="key">*: </span> <span class="value">[object Object]</span> <div class="children"></div> </div> </div> </div> <textarea class="input" placeholder="run js 回车清空；输入代码回车执行；分号回车换行" autofocus></textarea> </div>';
    var elMap = parseTpl(tpl);
    elMap.list.innerHTML = '';

    setTimeout(function() {
        document.body.appendChild(elMap.console);
        elMap.listw.scrollTop = 999999;
    }, 100);

    function parseTpl(tpl) {
        var elMap = {};
        var styleRe = /<style .*?>([\w\W]*?)<\/style>/i; //ie 中为大写
        var styleStr = (tpl.match(styleRe) || [])[1];

        var parseWrapEl = document.createElement('div');
        parseWrapEl.innerHTML = tpl.replace(styleRe, '');

        (function loop(node) {
            var className = node.className;
            if (className) {
                elMap[className] = node;
                var classRe = RegExp('\\.' + className + '\\s*?\\{([\\w\\W]*?)\\}');
                node.setAttribute('style', (styleStr.match(classRe) || [])[1]);
                // node.removeAttribute('class');
            }
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                loop(child);
            }
        })(parseWrapEl);

        return elMap;
    }

    // log
    function log(obj, type) {
        var views = print(obj);
        // elMap.listw.scrollTop = 999999;
        // elMap.list.scrollTop = 999999;
        return views;
    }

    function print(obj, key, parentChildrenEl) {
        var parentEl = parentChildrenEl || elMap.list;
        var objEl = elMap.obj.cloneNode();
        var keyEl = elMap.key.cloneNode(true);
        var valueEl = elMap.value.cloneNode(true);
        var childrenEl = elMap.children.cloneNode();
        parentEl.appendChild(objEl);
        objEl.appendChild(keyEl);
        objEl.appendChild(valueEl);
        objEl.appendChild(childrenEl);

        // key
        key = key === undefined ? '< ' : key + ': ';
        keyEl.innerHTML = key;

        // value
        var value = obj + '';
        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // escape <>
        if (obj && obj.nodeType) { // node
            var isNode = true;
            value = obj.nodeName;
            if (obj.id) { value += '#' + obj.id }
            if (obj.className) { value += '.' + obj.className }
            if (obj.nodeType == 1) {
                value = '<span style="color:red">' + value + '</span>';
            }
            if (obj.nodeValue) { value += ':' + obj.nodeValue }
            obj = obj.childNodes; // each children
        }
        valueEl.innerHTML = value;


        // save var
        valueEl.ondblclick = function() {
            window[prompt('保存变量为：') || 'v'] = obj;
        }


        if (typeof obj == 'object' && obj != null) {
            valueEl.onclick = function() {

                // toggle
                setTimeout(function() {
                    childrenEl.style.display = childrenEl.style.display != 'block' ? 'block' : 'none';
                }, 300); // timeout for dblclick
                if (valueEl.hasPrint) {
                    return
                }
                valueEl.hasPrint = true;

                // array-like
                for (var i = 0; i < obj.length; i++) {
                    if (i in obj) {
                        print(obj[i], i, childrenEl);
                    }
                }

                // -- node 
                if (obj.length) {
                    return;
                }

                // each obj
                for (var key in obj) {
                    var item = obj[key];
                    print(item, key, childrenEl);
                }
            }
        }
        return {
            objEl: objEl,
            keyEl: keyEl,
            valueEl: valueEl,
            childrenEl: childrenEl
        };
    }

    // console
    function noop() {}
    var winConsole = window.console || (window.console = {
        log: noop,
        dir: noop,
        info: noop,
        warn: noop,
        error: noop
    });
    var console = {
        run: run,
        log: function() {
            for (var i = 0; i < arguments.length; i++) {
                log(arguments[i]);
            }
        },
        info: function() {
            for (var i = 0; i < arguments.length; i++) {
                var views = log(arguments[i]);
                views.objEl.style.background = '#E0F2FF';
                views.valueEl.style.color = 'blue';
            }
        },
        warn: function() {
            for (var i = 0; i < arguments.length; i++) {
                var views = log(arguments[i]);
                views.objEl.style.background = '#FFFDE7';
                views.valueEl.style.color = '#FF6F00';
            }
        },
        error: function() {
            for (var i = 0; i < arguments.length; i++) {
                var views = log(arguments[i]);
                views.objEl.style.background = '#FFEDED';
                views.valueEl.style.color = 'red';
            }
        }
    };
    console.dir = console.log;
    for (var i in console) {
        (function() {
            var key = i;
            var fn = winConsole[key];
            winConsole[key] = function() {
                fn && fn.apply(winConsole, arguments);
                console[key].apply(console, arguments);
            }
        })();
    }


    // run
    function run(code) {
        // label
        var cmdEl = elMap.cmd.cloneNode(true);
        cmdEl.innerHTML = '> ' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        elMap.list.appendChild(cmdEl);
        // value
        code = code.match(/^\s*{/) ? '(' + code + ')' : code; // ({})
        try {
            console.log(window.eval(code));
        } catch (e) {
            // console.log(e);
            throw e;
        }
    }

    // input code
    elMap.input.onkeydown = function() {
        // 清空
        if (event.keyCode == 13 && this.value === '') {
            elMap.list.innerHTML = '';
            return false;
        }
        // 执行
        if (event.keyCode == 13 && !this.value.match(/;\s{0,2}$/)) {
            var code = this.value;
            var that = this;
            setTimeout(function() {
                that.value = '';
            }, 10);
            run(code);
            return false;
        }
    }


    // catch error
    window.onerror = function() {
        var s = '';
        for (var i = 0; i < arguments.length; i++) {
            s += arguments[i] + ' ';
        }
        console.error(s);
        // return true; // 表示已处理
    }

}());