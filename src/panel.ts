import { invoke } from "@tauri-apps/api/core";

export interface Elements {
  name: string;
  svg: string;
  url: string;
}

export const createPanel = (items: Elements[]): void => {
  const panel = document.createElement("div");
  panel.classList.add("panel");
  document.body.appendChild(panel);

  const circleContainer = document.createElement("div");
  circleContainer.classList.add("circle");
  panel.appendChild(circleContainer);

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  items.forEach((item, i) => {
    const angle = (i / items.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - 40;
    const y = centerY + radius * Math.sin(angle) - 40;

    const link = document.createElement("div");
    link.classList.add("item");
    link.style.top = `${y}px`;
    link.style.left = `${x}px`;

    link.addEventListener(
      "click",
      (): Promise<void> => invoke("change_url", { url: item.url }),
    );

    const img = document.createElement("img");
    const svgEncoded = encodeURIComponent(item.svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    img.src = `data:image/svg+xml,${svgEncoded}`;

    const label = document.createElement("div");
    label.innerText = item.name;

    link.appendChild(img);
    link.appendChild(label);
    circleContainer.appendChild(link);
  });

  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key !== "F1") return;
    e.preventDefault();
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
  });

  document.addEventListener("keyup", (e: KeyboardEvent): void => {
    if (e.key !== "F1") return;
    e.preventDefault();
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
  });
};
