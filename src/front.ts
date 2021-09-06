import { initRouter } from "./router";
import { state } from "./state";
import "./components/header";

function main() {
  initRouter(document.querySelector(".root"));
}

main();
