"use strict";
exports.__esModule = true;
exports.state = void 0;
var rtdb_1 = require("./rtdb");
var API_BASE_URL = "http://localhost:4000";
exports.state = {
    data: {
        currentUser: {
            email: "",
            nombre: "",
            id: ""
        },
        currentChat: {
            roomId: "",
            roomToken: "",
            messages: []
        },
        signedIn: false
    },
    listeners: [],
    init: function () {
        var _this = this;
        var roomId = this.getState().currentChat.roomId;
        var chatroomsRef = rtdb_1.rtdb.ref("/rooms/" + roomId + "/mensajes");
        var currentState = this.getState();
        chatroomsRef.on("value", function (snapshot) {
            var messageFromServer = snapshot.val();
            currentState.currentChat.messages = messageFromServer;
            _this.setState(currentState);
        });
    },
    subscribe: function (cb) {
        this.listeners.push(cb);
    },
    getState: function () {
        return this.data;
    },
    setState: function (newState) {
        this.data = newState;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb(newState);
        }
    },
    setCurrentUser: function (email, nombre, room, token) {
        var _this = this;
        var currentState = this.getState();
        fetch("http://localhost:4000/signup", {
            headers: {
                "content-type": "application/json"
            },
            method: "post",
            body: JSON.stringify({
                email: email,
                nombre: nombre
            })
        })
            .then(function (r) {
            r.json().then(function (data) {
                currentState.currentUser.email = email;
                currentState.currentUser.nombre = nombre;
                currentState.currentUser.id = data.id;
                _this.setState(currentState);
                if (room == "nuevo-room") {
                    _this.setNewRoom(data.id);
                }
                else {
                    _this.setExistingRoom(token, data.id);
                }
            });
        })["catch"](function () {
            fetch("http://localhost:4000/auth", {
                headers: {
                    "content-type": "application/json"
                },
                method: "post",
                body: JSON.stringify({
                    email: email
                })
            }).then(function (r) {
                r.json().then(function (data) {
                    currentState.currentUser.email = email;
                    currentState.currentUser.nombre = nombre;
                    currentState.currentUser.id = data.id;
                    _this.setState(currentState);
                    if (room == "nuevo-room") {
                        _this.setNewRoom(data.id);
                    }
                    else {
                        _this.setExistingRoom(token, data.id);
                    }
                });
            });
        });
    },
    setNewRoom: function () {
        var _this = this;
        var userId = this.data.currentUser.id;
        fetch("http://localhost:4000/rooms", {
            headers: {
                "content-type": "application/json"
            },
            method: "post",
            body: JSON.stringify({
                userId: userId
            })
        }).then(function (res) {
            res.json().then(function (data) {
                // const currentState = this.getState();
                // currentState.currentChat.roomToken = data.roomToken;
                // this.setState(currentState);
                _this.setExistingRoom(data.roomToken, userId);
            });
        });
    },
    setExistingRoom: function (roomToken, userId) {
        var _this = this;
        fetch("http://localhost:4000/rooms/" + roomToken + "?userId=" + userId, {
            headers: {
                "content-type": "application/json"
            },
            method: "get"
        }).then(function (res) {
            res
                .json()
                .then(function (data) {
                var cs = _this.getState();
                cs.currentChat.roomId = data.longRoomId;
                cs.currentChat.roomToken = roomToken;
                _this.setState(cs);
            })
                .then(function () {
                var cs = _this.getState();
                cs.signedIn = true;
                _this.setState(cs);
            });
        });
    },
    pushMessage: function (message) {
        var nombre = this.data.currentUser.email;
        fetch("http://localhost:4000/messages", {
            headers: {
                "content-type": "application/json"
            },
            method: "post",
            body: JSON.stringify({
                mensaje: {
                    from: nombre,
                    mensaje: message
                },
                roomId: this.getState().currentChat.roomId
            })
        });
    },
    pushMensajePropio: function (mensaje) {
        var currentState = this.getState();
        currentState.currentChat.messages.push(mensaje);
        this.setState(currentState);
    }
};
