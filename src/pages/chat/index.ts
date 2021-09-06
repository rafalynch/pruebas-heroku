import { state } from "../../state";
import map from "lodash/map";

export function initChat(param) {
  state.init();
  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";

  // Titulo
  const titleContainer = document.createElement("div");
  titleContainer.innerHTML = `
    <div class="title">Chat: ${state.getState().currentChat.roomToken}</div>
  `;
  chatContainer.appendChild(titleContainer);

  //Mensajes
  const chatHolder = document.createElement("div");
  chatContainer.appendChild(chatHolder);
  const messagesContainer = document.createElement("div");
  messagesContainer.className = "message-cont";

  function renderMensajes() {
    const mensajes = state.getState().currentChat.messages;
    messagesContainer.innerHTML = "";
    const arrayMensajes = map(mensajes);
    arrayMensajes.forEach((element) => {
      const unChat = document.createElement("div");
      unChat.classList.add("un-chat");
      if (element.from == state.getState().currentUser.email) {
        unChat.classList.add("propio");
        unChat.innerHTML = `
        ${element.mensaje}
      `;
      } else {
        unChat.classList.add("ajeno");
        unChat.innerHTML = `
        <label class="msg-label">${element.from}</label>
        <div class="inner-msg">${element.mensaje}</div>
      `;
      }
      messagesContainer.prepend(unChat);
    });
    chatHolder.appendChild(messagesContainer);
  }

  renderMensajes();
  state.subscribe(renderMensajes);

  // Input
  const textInput = document.createElement("form");
  textInput.innerHTML = `
    <label class="label">
      <input class="input" type="text" name="name"/>
    </label>
    <button class="boton">Enviar</button>
  `;
  textInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const target: any = e.target;
    state.pushMessage(target.name.value);
    target.name.value = "";
  });
  chatContainer.appendChild(textInput);

  // CSS
  const style = document.createElement("style");
  style.innerHTML = `
    .chat-container {
      padding: 15px;
      display: grid;
      gap: 25px
    }
    .title {
      font-size: 50px;
    }
    form {
      bottom: 25px;
      justify-self: center;
      display: grid;
      gap: 5px;
    }
    .boton {
      display: block;
      background-color: #9CBBE9;
      width: 312px;
      height: 55px;
      border-radius: 4px;
      font-size: 22px;
      border: none;
    }
    .un-chat{
      width: max-content;
      font-size: 18px;
      margin: 5px;
      border-radius: 3px;
    }
    .propio{
      background-color: #B9E97C;
      text-align: right;
      align-self: flex-end;
      padding: 15px;
    }
    .msg-label{
      font-size: 14px;
      color: #A5A5A5;
    }
    .inner-msg{
      background-color: #D8D8D8;
      padding: 15px;
    }
    .input {
      width: 312px;
      height: 55px;
      border-radius: 2px;
    }
    .message-cont{
      height: 350px;
      overflow: scroll;
      display: flex;
      flex-direction: column-reverse;
    }
    ::-webkit-scrollbar {
      display: none;
    }
  `;
  chatContainer.appendChild(style);

  // devolver el elemento
  return chatContainer;
}
