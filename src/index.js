import createPanel from "./panel";

const arr = [
  {
    name: "ChatGPT",
    image: "https://chatgpt.com/favicon.ico",
    url: "https://chatgpt.com",
  },
  {
    name: "DeepSeek",
    image: "https://www.deepseek.com/favicon.ico",
    url: "https://chat.deepseek.com",
  },
];

document.addEventListener("DOMContentLoaded", async () => {
  createPanel(arr);
});
