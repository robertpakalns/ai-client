import { createPanel, type Icon } from "./panel";
import styles from "../assets/style.css" with { type: "text" };
import chatGTPIcon from "../assets/icons/chatgpt.svg" with { type: "text" };
import deepSeekIcon from "../assets/icons/deepseek.svg" with { type: "text" };
import grokIcon from "../assets/icons/grok.svg" with { type: "text" };

import { invoke } from "@tauri-apps/api/core";

const arr: Icon[] = [
  {
    name: "ChatGPT",
    svg: chatGTPIcon,
    host: "chatgpt.com",
  },
  {
    name: "DeepSeek",
    svg: deepSeekIcon,
    host: "chat.deepseek.com",
  },
  {
    name: "Grok",
    svg: grokIcon,
    host: "grok.com",
  },
];

// Monkey-patch fetch to block resources that are not needed for working with the LLMs
const blockRequests = async (): Promise<void> => {
  const _fetch = window.fetch;

  window.fetch = async (input, init) => {
    let url: URL;
    try {
      url = new URL(input.toString(), window.location.href);
    } catch (e) {
      return _fetch(input, init);
    }

    if (!arr.some((el) => el.host === url.host)) {
      return Promise.reject(new Error("Blocked by AI Client fetch filter"));
    }

    return _fetch(input, init);
  };
};

blockRequests();

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);

  createPanel(arr);

  document.addEventListener("click", async (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;

    const target = a.getAttribute("target");
    if (target === "_blank" || target === "_new") {
      e.preventDefault();
      await invoke("open_external", { url: a.href });
    }
  });
});
