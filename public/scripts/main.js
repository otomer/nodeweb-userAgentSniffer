$(function () {

    var onSearchKeyup = (function () {
        var timeout = null,
            defaultOptions = {
                delay: 300,
                onEach: $.noop,
                onStart: $.noop
            };
        return function ($el, options, fn) {
            var started = false;
            $el = $el instanceof jQuery ? $el : $($el);
            fn = typeof options === 'function' && !fn ? options : fn;
            options = $.extend(null, defaultOptions, options);
            $el.on('keyup change', function (e) {
                options.onEach(e, options.delay);
                if (!started) {
                    options.onStart(e, options.delay);
                    started = true;
                }
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    started = false;
                    fn($(e.currentTarget).val());
                }, options.delay);
            });
        };
    })();

    var domElements = {
        searchInput: $('.search'),
        resultContainer: $('#result'),
        noResultContainer: $('#noResult'),
        loading: $('.loading')
    }

    var clear = function () {
        domElements.loading.hide();
        domElements.resultContainer.hide();
        domElements.noResultContainer.html("No User Agent was entered.");
        domElements.noResultContainer.show();
    };

    var loading = function () {
        domElements.loading.fadeIn();
    };

    var iconsTable = {
        'chrome': [],
        'firefox': [],
        'edge': [],
        'ie': ['internet explorer'],
        'safari': [],
        'opera': [],
        'iphone': [],
        'android': [],
        'windows': []
    }
    var addUADetail = function (className, title, value) {
        if (!value) {
            value = '(-)';
        }
        else {
            var lValue = value.toLowerCase();

            var keys = Object.keys(iconsTable);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (lValue.indexOf(key) != -1) {
                    value += '  <img src="assets\\' + key + '.png" width="32" height="32" />';
                }

                if (iconsTable[key] && iconsTable[key].length > 0) {
                    for (var j = 0; j < iconsTable[key].length; j++) {
                        if (lValue.indexOf(iconsTable[key][j]) != -1) {
                            value += '  <img src="assets\\' + key + '.png" width="32" height="32" />';
                        }
                    }
                }
            }
        }

        domElements.resultContainer.find(className).html(title + ': ' + value);
    }
    var showParsedUA = function (parsedUA) {
        if (console.table) {
            console.table(parsedUA);
        }

        console.log(new Date());
        domElements.loading.hide();
        addUADetail('.browserName', 'Browser Name', parsedUA.browser.name);
        addUADetail('.browserVersion', 'Browser Version', parsedUA.browser.version);
        addUADetail('.browserMajorVersion', 'Browser Major Version', parsedUA.browser.major);
        addUADetail('.osName', 'OS Name', parsedUA.os.name);
        addUADetail('.osVersion', 'OS Version', parsedUA.os.version);
        addUADetail('.deviceModel', 'Device Model', parsedUA.device.model);
        addUADetail('.deviceName', 'Device Name', parsedUA.device.name);
        addUADetail('.deviceType', 'Device Type', parsedUA.device.type);
        addUADetail('.deviceModel', 'Device Model', parsedUA.device.model);
        addUADetail('.engineName', 'Engine Name', parsedUA.engine.name);
        addUADetail('.engineVersion', 'Engine Version', parsedUA.engine.version);
        addUADetail('.cpuArchitecture', 'CPU Architecture', parsedUA.cpu.architecture);
    };

    var search = (function () {
        var lastSearch = '';
        return function (q) {
            if (!q) {
                lastSearch = q;
                return clear();
            }

            if (lastSearch === q)
                return;

            loading();
            lastSearch = q;


            domElements.resultContainer.hide();
            domElements.noResultContainer.hide();

            ParserApi.search(q)
                .done(function (data) {
                    if (data.browser.name || data.os.name || data.engine.name || data.cpu.architecture) {
                        showParsedUA(data);
                        domElements.resultContainer.show();
                    } else {
                        domElements.noResultContainer.html("No result. '" + q + "' is an invalid User Agent");
                        domElements.noResultContainer.show();

                    }
                    domElements.loading.hide();
                })
                .fail(function (data) {
                    domElements.noResultContainer.html("Error");
                    domElements.noResultContainer.show();
                    domElements.loading.hide();
                })
        };
    })();

    onSearchKeyup('.search', function (q) {
        search(q);
    });

    $('#btnClear').click(function () {
        domElements.searchInput.val('');
        search(domElements.searchInput.val());
    });


    $('#btnSearch').click(function (e) {
        domElements.searchInput.val(navigator.userAgent);
        search(domElements.searchInput.val());
    });


    domElements.searchInput.val(navigator.userAgent);
    search(domElements.searchInput.val());
})
