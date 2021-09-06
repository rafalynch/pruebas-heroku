"use strict";
exports.__esModule = true;
exports.initRouter = void 0;
var home_1 = require("./pages/home");
var chat_1 = require("./pages/chat");
var routes = [
    {
        path: /\/home/,
        component: home_1.initHome
    },
    {
        path: /\/chat/,
        component: chat_1.initChat
    },
];
function initRouter(container) {
    history.pushState({}, "", "/home");
    function goTo(path) {
        history.pushState({}, "", path);
        handleRoute(path);
    }
    function handleRoute(route) {
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var r = routes_1[_i];
            if (r.path.test(route)) {
                var el = r.component({ goTo: goTo });
                if (container.firstChild) {
                    container.firstChild.remove();
                }
                container.appendChild(el);
            }
        }
    }
    if (location.pathname == "/") {
        goTo("/home");
    }
    if (location.pathname == "/desafio-modulo-6-cap-4") {
        goTo("/home");
    }
    else {
        handleRoute(location.pathname);
    }
}
exports.initRouter = initRouter;
