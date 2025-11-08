import { createPanel, type llmArr } from "./panel";
import styles from "../assets/style.css" with { type: "text" };
import chatGTPIcon from "../assets/icons/chatgpt.svg" with { type: "text" };
import deepSeekIcon from "../assets/icons/deepseek.svg" with { type: "text" };
import grokIcon from "../assets/icons/grok.svg" with { type: "text" };

import { invoke } from "@tauri-apps/api/core";

const arr: llmArr[] = [
  {
    name: "ChatGPT",
    svg: chatGTPIcon,
    url: "https://chatgpt.com",
  },
  {
    name: "DeepSeek",
    svg: deepSeekIcon,
    url: "https://chat.deepseek.com",
  },
  {
    name: "Grok",
    svg: grokIcon,
    url: "https://grok.com",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);

  createPanel(arr);

  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;

    const target = a.getAttribute("target");
    if (target === "_blank" || target === "_new") {
      e.preventDefault();
      invoke("open_external", { url: a.href });
    }
  });
});
