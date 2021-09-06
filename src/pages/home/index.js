"use strict";
exports.__esModule = true;
exports.initHome = void 0;
var state_1 = require("../../state");
function initHome(param) {
    var homeContainer = document.createElement("div");
    homeContainer.className = "home-container";
    // Titulo
    var titleContainer = document.createElement("div");
    titleContainer.innerHTML = "\n    <div class=\"title\">Bienvenido</div>\n  ";
    homeContainer.appendChild(titleContainer);
    // Input
    var textInput = document.createElement("form");
    textInput.innerHTML = "\n    <label class=\"label\">\n      email\n      <input class=\"input\" type=\"text\" name=\"email\"/>\n    </label>\n    <label class=\"label\">\n      tu nombre\n      <input class=\"input\" type=\"text\" name=\"name\"/>\n    </label>\n    <label class=\"label\">\n      room\n      <select class=\"selector\" name=\"room\">\n        <option value=\"nuevo-room\">Nuevo room</option>\n        <option value=\"existente-room\">Existente</option>\n      </select>\n    </label>\n    <label style=\"display:none\" class=\"label selector-label\">\n      room token\n      <input class=\"input\" type=\"text\" name=\"roomToken\"/>\n    </label>\n    <button class=\"boton\">Comenzar</button>\n  ";
    window.addEventListener("load", function () {
        var selector = document.querySelector(".selector");
        selector.addEventListener("change", function (event) {
            var target = event.target;
            if (target.value == "existente-room") {
                document
                    .querySelector(".selector-label")
                    .setAttribute("style", "display: block");
            }
            else {
                document
                    .querySelector(".selector-label")
                    .setAttribute("style", "display: none");
            }
        });
    });
    textInput.addEventListener("submit", function (e) {
        e.preventDefault();
        var target = e.target;
        state_1.state.setCurrentUser(target.email.value, target.name.value, target.room.value, target.roomToken.value);
        state_1.state.subscribe(function (state) {
            if (state.signedIn == true && window.location.href.includes("/home")) {
                param.goTo("/chat");
            }
            else {
            }
        });
    });
    homeContainer.appendChild(textInput);
    // CSS
    var style = document.createElement("style");
    style.innerHTML = "\n    .home-container {\n      padding: 15px;\n      display: grid;\n      justify-content: left;\n      gap: 25px\n    }\n    .title {\n      font-size: 50px;\n    }\n    .label {\n      display: block;\n      font-size: 25px;\n      margin: 15px 0 15px 0;\n    }\n    .selector{\n      display: block;\n      width: 312px;\n      height: 55px;\n      border-radius: 2px;\n      font-size: 25px;\n    }\n    .boton {\n      display: block;\n      background-color: #9CBBE9;\n      width: 312px;\n      height: 55px;\n      border-radius: 4px;\n      font-size: 22px;\n      border: none;\n    }\n    .input {\n      font-size: 25px;\n      display: block;\n      width: 312px;\n      height: 55px;\n      border-radius: 2px;\n    }\n  ";
    homeContainer.appendChild(style);
    // devolver el elemento
    return homeContainer;
}
exports.initHome = initHome;
