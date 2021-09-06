"use strict";
exports.__esModule = true;
exports.initChat = void 0;
var state_1 = require("../../state");
var map_1 = require("lodash/map");
function initChat(param) {
    state_1.state.init();
    var chatContainer = document.createElement("div");
    chatContainer.className = "chat-container";
    // Titulo
    var titleContainer = document.createElement("div");
    titleContainer.innerHTML = "\n    <div class=\"title\">Chat: " + state_1.state.getState().currentChat.roomToken + "</div>\n  ";
    chatContainer.appendChild(titleContainer);
    //Mensajes
    var chatHolder = document.createElement("div");
    chatContainer.appendChild(chatHolder);
    var messagesContainer = document.createElement("div");
    messagesContainer.className = "message-cont";
    function renderMensajes() {
        var mensajes = state_1.state.getState().currentChat.messages;
        messagesContainer.innerHTML = "";
        var arrayMensajes = map_1["default"](mensajes);
        arrayMensajes.forEach(function (element) {
            var unChat = document.createElement("div");
            unChat.classList.add("un-chat");
            if (element.from == state_1.state.getState().currentUser.email) {
                unChat.classList.add("propio");
                unChat.innerHTML = "\n        " + element.mensaje + "\n      ";
            }
            else {
                unChat.classList.add("ajeno");
                unChat.innerHTML = "\n        <label class=\"msg-label\">" + element.from + "</label>\n        <div class=\"inner-msg\">" + element.mensaje + "</div>\n      ";
            }
            messagesContainer.prepend(unChat);
        });
        chatHolder.appendChild(messagesContainer);
    }
    renderMensajes();
    state_1.state.subscribe(renderMensajes);
    // Input
    var textInput = document.createElement("form");
    textInput.innerHTML = "\n    <label class=\"label\">\n      <input class=\"input\" type=\"text\" name=\"name\"/>\n    </label>\n    <button class=\"boton\">Enviar</button>\n  ";
    textInput.addEventListener("submit", function (e) {
        e.preventDefault();
        var target = e.target;
        state_1.state.pushMessage(target.name.value);
        target.name.value = "";
    });
    chatContainer.appendChild(textInput);
    // CSS
    var style = document.createElement("style");
    style.innerHTML = "\n    .chat-container {\n      padding: 15px;\n      display: grid;\n      gap: 25px\n    }\n    .title {\n      font-size: 50px;\n    }\n    form {\n      bottom: 25px;\n      justify-self: center;\n      display: grid;\n      gap: 5px;\n    }\n    .boton {\n      display: block;\n      background-color: #9CBBE9;\n      width: 312px;\n      height: 55px;\n      border-radius: 4px;\n      font-size: 22px;\n      border: none;\n    }\n    .un-chat{\n      width: max-content;\n      font-size: 18px;\n      margin: 5px;\n      border-radius: 3px;\n    }\n    .propio{\n      background-color: #B9E97C;\n      text-align: right;\n      align-self: flex-end;\n      padding: 15px;\n    }\n    .msg-label{\n      font-size: 14px;\n      color: #A5A5A5;\n    }\n    .inner-msg{\n      background-color: #D8D8D8;\n      padding: 15px;\n    }\n    .input {\n      width: 312px;\n      height: 55px;\n      border-radius: 2px;\n    }\n    .message-cont{\n      height: 350px;\n      overflow: scroll;\n      display: flex;\n      flex-direction: column-reverse;\n    }\n    ::-webkit-scrollbar {\n      display: none;\n    }\n  ";
    chatContainer.appendChild(style);
    // devolver el elemento
    return chatContainer;
}
exports.initChat = initChat;
