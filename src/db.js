"use strict";
exports.__esModule = true;
exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-dwf-m6-6d383-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
