import * as express from "express";
import * as cors from "cors";
import { firestore } from "./db";
import { rtdb } from "./rtdb";
import * as nanoid from "nanoid";
import * as token from "rand-token";
import { state } from "./state";

const app = express();
const PORT = "4000";

app.use(express.json());
app.use(cors());

const usersCollRef = firestore.collection("users");

app.post("/signup", (req, res) => {
  const emailInput = req.body.email;
  const nombreInput = req.body.nombre;
  usersCollRef
    .where("email", "==", emailInput)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        firestore
          .collection("users")
          .add({ email: emailInput, nombre: nombreInput })
          .then((idRef) => {
            res.json({
              email: emailInput,
              id: idRef.id,
            });
          });
      } else {
        searchRes.docs.map((doc) => {
          res.status(400);
          res.json({
            Mensaje: "Ya existe",
            id: doc.id,
          });
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const emailInput = req.body.email;
  usersCollRef
    .where("email", "==", emailInput)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        res.status(404).json({
          Mensaje: "Not Found",
        });
      } else {
        searchRes.docs.map((doc) => {
          res.json({
            id: doc.id,
          });
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const userId = req.body.userId;
  const roomToken = token.uid(4);
  const roomId = nanoid.nanoid();

  usersCollRef
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        rtdb
          .ref("/rooms/" + roomId)
          .set({
            owner: userId,
          })
          .then(() => {
            const longRoomId = rtdb.ref("/rooms/" + roomId).key;

            firestore
              .collection("rooms")
              .doc(roomToken)
              .create({
                longRoomId,
              })
              .then(() => {
                res.json({ roomToken });
              });
          });
      } else {
        res.status(401).json("Unauthororized");
      }
    });
});

app.get("/rooms/:roomToken", (req, res) => {
  const { userId } = req.query;
  usersCollRef
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        firestore
          .collection("rooms")
          .doc(req.params.roomToken)
          .get()
          .then((snap) => {
            if (snap.exists) {
              res.json({
                longRoomId: snap.data().longRoomId,
              });
            } else {
              res.status(404).json("no existe ese room");
            }
          });
      } else {
        res.status(401).json("Unauthorized");
      }
    });
});

app.post("/messages", function (req, res) {
  const roomId = req.body.roomId;
  const chatroomsRef = rtdb.ref("/rooms/" + roomId + "/mensajes");

  chatroomsRef.push(req.body.mensaje, () => {
    res.json({ Mensaje: "esto fue una prueba de push" });
  });
});

app.listen(PORT, () => {
  console.log("App listening at http://localhost/" + PORT);
});
