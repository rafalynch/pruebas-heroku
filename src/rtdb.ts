import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "cBeWTX1lCrAmOYilMosEkO7n3QhGnwQSipbCFXNZ",
  databaseURL: "https://apx-dwf-m6-6d383-default-rtdb.firebaseio.com",
  authDomain: "apx-dwf-m6-6d383.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
