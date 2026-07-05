export interface Icon {
  name: string;
  icon: string;
  host: string;
}

const RADIUS = 150;
const CENTER_X = 200;
const CENTER_Y = 200;
const KEYBIND = "F1";

export const createPanel = (items: Icon[]): void => {
  const panel = document.createElement("div");
  panel.classList.add("panel");
  document.body.appendChild(panel);

  const circleContainer = document.createElement("div");
  circleContainer.classList.add("circle");
  panel.appendChild(circleContainer);

  items.forEach((item, i) => {
    const angle = (i / items.length) * 2 * Math.PI;
    const x = CENTER_X + RADIUS * Math.cos(angle) - 40;
    const y = CENTER_Y + RADIUS * Math.sin(angle) - 40;

    const link = document.createElement("div");
    link.classList.add("item");
    link.style.top = `${y}px`;
    link.style.left = `${x}px`;

    link.addEventListener("click", (): void => {
      window.location.href = `https://${item.host}`;
    });

    const img = document.createElement("img");
    const svgEncoded = encodeURIComponent(item.icon)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    img.src = `data:image/svg+xml,${svgEncoded}`;

    const label = document.createElement("div");
    label.textContent = item.name;

    link.appendChild(img);
    link.appendChild(label);
    circleContainer.appendChild(link);
  });

  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key !== KEYBIND) return;
    e.preventDefault();
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
  });

  document.addEventListener("keyup", (e: KeyboardEvent): void => {
    if (e.key !== KEYBIND) return;
    e.preventDefault();
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
  });
};
