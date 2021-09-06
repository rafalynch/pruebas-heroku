import * as admin from "firebase-admin";

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apx-dwf-m6-6d383-default-rtdb.firebaseio.com",
});

var firestore = admin.firestore();

export { firestore };
