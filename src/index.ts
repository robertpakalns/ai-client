import { createPanel, type Icon } from "./panel";
import styles from "../assets/style.css" with { type: "text" };

// Icons
import chatGTPIcon from "../assets/icons/chatgpt.svg" with { type: "text" };
import claudeIcon from "../assets/icons/claude.svg" with { type: "text" };
import deepSeekIcon from "../assets/icons/deepseek.svg" with { type: "text" };
import geminiIcon from "../assets/icons/gemini.svg" with { type: "text" };
import grokIcon from "../assets/icons/grok.svg" with { type: "text" };

const arr: Icon[] = [
  {
    name: "ChatGPT",
    icon: chatGTPIcon,
    host: "chatgpt.com",
  },
  {
    name: "DeepSeek",
    icon: deepSeekIcon,
    host: "chat.deepseek.com",
  },
  {
    name: "Grok",
    icon: grokIcon,
    host: "grok.com",
  },
  {
    name: "Claude",
    icon: claudeIcon,
    host: "claude.ai",
  },
  {
    name: "Gemini",
    icon: geminiIcon,
    host: "gemini.google.com",
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

const injectStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);
};

document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  createPanel(arr);
});
