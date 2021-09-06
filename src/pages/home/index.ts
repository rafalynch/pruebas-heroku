import { state } from "../../state";

export function initHome(param) {
  const homeContainer = document.createElement("div");
  homeContainer.className = "home-container";

  // Titulo
  const titleContainer = document.createElement("div");
  titleContainer.innerHTML = `
    <div class="title">Bienvenidos</div>
  `;
  homeContainer.appendChild(titleContainer);

  // Input
  const textInput = document.createElement("form");
  textInput.innerHTML = `
    <label class="label">
      email
      <input class="input" type="text" name="email"/>
    </label>
    <label class="label">
      tu nombre
      <input class="input" type="text" name="name"/>
    </label>
    <label class="label">
      room
      <select class="selector" name="room">
        <option value="nuevo-room">Nuevo room</option>
        <option value="existente-room">Existente</option>
      </select>
    </label>
    <label style="display:none" class="label selector-label">
      room token
      <input class="input" type="text" name="roomToken"/>
    </label>
    <button class="boton">Comenzar</button>
  `;
  window.addEventListener("load", () => {
    const selector = document.querySelector(".selector");
    selector.addEventListener("change", (event) => {
      const target: any = event.target;
      if (target.value == "existente-room") {
        document
          .querySelector(".selector-label")
          .setAttribute("style", "display: block");
      } else {
        document
          .querySelector(".selector-label")
          .setAttribute("style", "display: none");
      }
    });
  });

  textInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const target: any = e.target;
    state.setCurrentUser(
      target.email.value,
      target.name.value,
      target.room.value,
      target.roomToken.value
    );
    state.subscribe((state) => {
      if (state.signedIn == true && window.location.href.includes("/home")) {
        param.goTo("/chat");
      } else {
      }
    });
  });
  homeContainer.appendChild(textInput);

  // CSS
  const style = document.createElement("style");
  style.innerHTML = `
    .home-container {
      padding: 15px;
      display: grid;
      justify-content: left;
      gap: 25px
    }
    .title {
      font-size: 50px;
    }
    .label {
      display: block;
      font-size: 25px;
      margin: 15px 0 15px 0;
    }
    .selector{
      display: block;
      width: 312px;
      height: 55px;
      border-radius: 2px;
      font-size: 25px;
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
    .input {
      font-size: 25px;
      display: block;
      width: 312px;
      height: 55px;
      border-radius: 2px;
    }
  `;
  homeContainer.appendChild(style);

  // devolver el elemento
  return homeContainer;
}
