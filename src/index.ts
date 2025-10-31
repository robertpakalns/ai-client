import { createPanel, type llmArr } from "./panel";
import styles from "../assets/style.css?raw";
import chatGTPIcon from "../assets/icons/chatgpt.svg";
import deepSeekIcon from "../assets/icons/deepseek.svg";
import grokIcon from "../assets/icons/grok.svg";

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
});
