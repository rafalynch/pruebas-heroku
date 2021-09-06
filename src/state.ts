import { Router } from "express";
import { initRouter } from "./router";
import { rtdb } from "./rtdb";

const API_BASE_URL = "https://dwf-m6-cap6.herokuapp.com";

export type Message = {
  user: string;
  message: string;
};

export const state = {
  data: {
    currentUser: {
      email: "",
      nombre: "",
      id: "",
    },
    currentChat: {
      roomId: "",
      roomToken: "",
      messages: [],
    },
    signedIn: false,
  },
  listeners: [],
  init() {
    const roomId = this.getState().currentChat.roomId;
    const chatroomsRef = rtdb.ref("/rooms/" + roomId + "/mensajes");
    const currentState = this.getState();

    chatroomsRef.on("value", (snapshot) => {
      const messageFromServer = snapshot.val();

      currentState.currentChat.messages = messageFromServer;
      this.setState(currentState);
    });
  },
  subscribe(cb) {
    this.listeners.push(cb);
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
  },
  setCurrentUser(email, nombre, room, token) {
    const currentState = this.getState();
    fetch(API_BASE_URL + "/signup", {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        email,
        nombre,
      }),
    })
      .then((r) => {
        r.json().then((data) => {
          currentState.currentUser.email = email;
          currentState.currentUser.nombre = nombre;
          currentState.currentUser.id = data.id;
          this.setState(currentState);
          if (room == "nuevo-room") {
            this.setNewRoom(data.id);
          } else {
            this.setExistingRoom(token, data.id);
          }
        });
      })
      .catch(() => {
        fetch(API_BASE_URL + "/auth", {
          headers: {
            "content-type": "application/json",
          },
          method: "post",
          body: JSON.stringify({
            email,
          }),
        }).then((r) => {
          r.json().then((data) => {
            currentState.currentUser.email = email;
            currentState.currentUser.nombre = nombre;
            currentState.currentUser.id = data.id;
            this.setState(currentState);
            if (room == "nuevo-room") {
              this.setNewRoom(data.id);
            } else {
              this.setExistingRoom(token, data.id);
            }
          });
        });
      });
  },
  setNewRoom() {
    const userId = this.data.currentUser.id;
    fetch(API_BASE_URL + "/rooms", {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        userId: userId,
      }),
    }).then((res) => {
      res.json().then((data) => {
        // const currentState = this.getState();
        // currentState.currentChat.roomToken = data.roomToken;
        // this.setState(currentState);
        this.setExistingRoom(data.roomToken, userId);
      });
    });
  },
  setExistingRoom(roomToken, userId) {
    fetch(API_BASE_URL + "/rooms/" + roomToken + "?userId=" + userId, {
      headers: {
        "content-type": "application/json",
      },
      method: "get",
    }).then((res) => {
      res
        .json()
        .then((data) => {
          const cs = this.getState();
          cs.currentChat.roomId = data.longRoomId;
          cs.currentChat.roomToken = roomToken;
          this.setState(cs);
        })
        .then(() => {
          const cs = this.getState();
          cs.signedIn = true;
          this.setState(cs);
        });
    });
  },
  pushMessage(message: string) {
    const nombre = this.data.currentUser.email;
    fetch(API_BASE_URL + "/messages", {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        mensaje: {
          from: nombre,
          mensaje: message,
        },
        roomId: this.getState().currentChat.roomId,
      }),
    });
  },
  pushMensajePropio(mensaje) {
    const currentState = this.getState();
    currentState.currentChat.messages.push(mensaje);
    this.setState(currentState);
  },
};
