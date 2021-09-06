"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var db_1 = require("./db");
var rtdb_1 = require("./rtdb");
var nanoid = require("nanoid");
var token = require("rand-token");
var app = express();
var PORT = "4000";
app.use(express.json());
app.use(cors());
var usersCollRef = db_1.firestore.collection("users");
app.post("/signup", function (req, res) {
    var emailInput = req.body.email;
    var nombreInput = req.body.nombre;
    usersCollRef
        .where("email", "==", emailInput)
        .get()
        .then(function (searchRes) {
        if (searchRes.empty) {
            db_1.firestore
                .collection("users")
                .add({ email: emailInput, nombre: nombreInput })
                .then(function (idRef) {
                res.json({
                    email: emailInput,
                    id: idRef.id
                });
            });
        }
        else {
            searchRes.docs.map(function (doc) {
                res.status(400);
                res.json({
                    Mensaje: "Ya existe",
                    id: doc.id
                });
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var emailInput = req.body.email;
    usersCollRef
        .where("email", "==", emailInput)
        .get()
        .then(function (searchRes) {
        if (searchRes.empty) {
            res.status(404).json({
                Mensaje: "Not Found"
            });
        }
        else {
            searchRes.docs.map(function (doc) {
                res.json({
                    id: doc.id
                });
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    var roomToken = token.uid(4);
    var roomId = nanoid.nanoid();
    usersCollRef
        .doc(userId)
        .get()
        .then(function (doc) {
        if (doc.exists) {
            rtdb_1.rtdb
                .ref("/rooms/" + roomId)
                .set({
                owner: userId
            })
                .then(function () {
                var longRoomId = rtdb_1.rtdb.ref("/rooms/" + roomId).key;
                db_1.firestore
                    .collection("rooms")
                    .doc(roomToken)
                    .create({
                    longRoomId: longRoomId
                })
                    .then(function () {
                    res.json({ roomToken: roomToken });
                });
            });
        }
        else {
            res.status(401).json("Unauthororized");
        }
    });
});
app.get("/rooms/:roomToken", function (req, res) {
    var userId = req.query.userId;
    usersCollRef
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            db_1.firestore
                .collection("rooms")
                .doc(req.params.roomToken)
                .get()
                .then(function (snap) {
                if (snap.exists) {
                    res.json({
                        longRoomId: snap.data().longRoomId
                    });
                }
                else {
                    res.status(404).json("no existe ese room");
                }
            });
        }
        else {
            res.status(401).json("Unauthorized");
        }
    });
});
app.post("/messages", function (req, res) {
    var roomId = req.body.roomId;
    var chatroomsRef = rtdb_1.rtdb.ref("/rooms/" + roomId + "/mensajes");
    chatroomsRef.push(req.body.mensaje, function () {
        res.json({ Mensaje: "esto fue una prueba de push" });
    });
});
app.listen(PORT, function () {
    console.log("App listening at http://localhost/" + PORT);
});
