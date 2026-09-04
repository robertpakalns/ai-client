export interface Icon {
  name: string;
  icon: string;
  host: string;
}

const KEYBIND = "F1";

const MENU_RADIUS = 38;
const INNER_RADIUS = 10;

const ICON_RADIUS = 23;
const LABEL_RADIUS = 31;

const createSvgElement = <K extends keyof SVGElementTagNameMap>(
  tag: K,
): SVGElementTagNameMap[K] => {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
};

const polarToCartesian = (
  radius: number,
  angle: number,
): { x: number; y: number } => {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: 50 + radius * Math.cos(radians),
    y: 50 + radius * Math.sin(radians),
  };
};

const createHitPath = (startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(100, startAngle);
  const end = polarToCartesian(100, endAngle);

  return [
    "M 50 50",
    `L ${start.x} ${start.y}`,
    `L ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

const createVisualPath = (startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(MENU_RADIUS, startAngle);
  const end = polarToCartesian(MENU_RADIUS, endAngle);

  const innerStart = polarToCartesian(INNER_RADIUS, startAngle);
  const innerEnd = polarToCartesian(INNER_RADIUS, endAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${start.x} ${start.y}`,
    `A ${MENU_RADIUS} ${MENU_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

export const createPanel = (items: Icon[]): void => {
  const panel = document.createElement("div");
  panel.classList.add("panel");
  document.body.appendChild(panel);

  const hitSvg = createSvgElement("svg");

  hitSvg.classList.add("hit-map");
  hitSvg.setAttribute("viewBox", "0 0 100 100");
  hitSvg.setAttribute("preserveAspectRatio", "none");

  const menuSvg = createSvgElement("svg");

  menuSvg.classList.add("menu");
  menuSvg.setAttribute("viewBox", "0 0 100 100");

  const menuItems: SVGElement[] = [];

  items.forEach((item, i) => {
    const sliceAngle = 360 / items.length;

    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    const middleAngle = startAngle + sliceAngle / 2;

    const hit = createSvgElement("path");

    hit.classList.add("hit-slice");

    hit.setAttribute("d", createHitPath(startAngle, endAngle));

    hit.setAttribute("role", "link");
    hit.setAttribute("tabindex", "0");

    hit.addEventListener("mouseenter", (): void => {
      menuItems.forEach((element, index) => {
        element.classList.toggle("hovered", index === i);
      });
    });

    hit.addEventListener("mouseleave", (): void => {
      menuItems.forEach((element) => {
        element.classList.remove("hovered");
      });
    });

    hit.addEventListener("click", (): void => {
      window.location.href = `https://${item.host}`;
    });

    hit.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (e.key !== "Enter" && e.key !== " ") {
        return;
      }

      e.preventDefault();
      window.location.href = `https://${item.host}`;
    });

    hitSvg.appendChild(hit);

    const group = createSvgElement("g");

    group.classList.add("menu-item");

    const wedge = createSvgElement("path");

    wedge.classList.add("menu-slice");

    wedge.setAttribute("d", createVisualPath(startAngle, endAngle));

    group.appendChild(wedge);

    const iconPosition = polarToCartesian(ICON_RADIUS, middleAngle);

    const img = createSvgElement("image");

    const svgEncoded = encodeURIComponent(item.icon)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");

    img.setAttribute("href", `data:image/svg+xml,${svgEncoded}`);

    img.setAttribute("x", `${iconPosition.x - 4}`);
    img.setAttribute("y", `${iconPosition.y - 4}`);
    img.setAttribute("width", "8");
    img.setAttribute("height", "8");

    img.setAttribute("pointer-events", "none");

    group.appendChild(img);

    const labelPosition = polarToCartesian(LABEL_RADIUS, middleAngle);

    const label = createSvgElement("text");

    label.classList.add("menu-label");

    label.setAttribute("x", `${labelPosition.x}`);
    label.setAttribute("y", `${labelPosition.y}`);

    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("pointer-events", "none");

    label.textContent = item.name;

    group.appendChild(label);

    menuSvg.appendChild(group);
    menuItems.push(group);
  });

  const dividers = createSvgElement("g");

  dividers.classList.add("menu-dividers");

  const sliceAngle = 360 / items.length;

  for (let i = 0; i < items.length; i++) {
    const angle = i * sliceAngle;

    const start = polarToCartesian(INNER_RADIUS, angle);

    const end = polarToCartesian(MENU_RADIUS, angle);

    const line = createSvgElement("line");

    line.classList.add("menu-divider");

    line.setAttribute("x1", `${start.x}`);
    line.setAttribute("y1", `${start.y}`);
    line.setAttribute("x2", `${end.x}`);
    line.setAttribute("y2", `${end.y}`);

    dividers.appendChild(line);
  }

  menuSvg.appendChild(dividers);

  const center = createSvgElement("circle");

  center.classList.add("menu-center");

  center.setAttribute("cx", "50");
  center.setAttribute("cy", "50");
  center.setAttribute("r", `${INNER_RADIUS}`);

  menuSvg.appendChild(center);

  panel.appendChild(menuSvg);
  panel.appendChild(hitSvg);

  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key !== KEYBIND) return;

    e.preventDefault();
    panel.classList.add("visible");
  });

  document.addEventListener("keyup", (e: KeyboardEvent): void => {
    if (e.key !== KEYBIND) return;

    e.preventDefault();
    panel.classList.remove("visible");
  });
};
