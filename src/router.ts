import { initHome } from "./pages/home";
import { initChat } from "./pages/chat";

const routes = [
  {
    path: /\/home/,
    component: initHome,
  },
  {
    path: /\/chat/,
    component: initChat,
  },
];

export function initRouter(container: Element) {
  history.pushState({}, "", "/home");

  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }

  function handleRoute(route: string) {
    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.component({ goTo });

        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(el);
      }
    }
  }

  if (location.pathname == "/") {
    goTo("/home");
  }
  if (location.pathname == "/desafio-modulo-6-cap-4") {
    goTo("/home");
  } else {
    handleRoute(location.pathname);
  }
}
