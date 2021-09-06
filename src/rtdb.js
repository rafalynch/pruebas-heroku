"use strict";
exports.__esModule = true;
exports.rtdb = void 0;
var firebase_1 = require("firebase");
var app = firebase_1["default"].initializeApp({
    apiKey: "cBeWTX1lCrAmOYilMosEkO7n3QhGnwQSipbCFXNZ",
    databaseURL: "https://apx-dwf-m6-6d383-default-rtdb.firebaseio.com",
    authDomain: "apx-dwf-m6-6d383.firebaseapp.com"
});
var rtdb = firebase_1["default"].database();
exports.rtdb = rtdb;
