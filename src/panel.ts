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

const SVG_NS = "http://www.w3.org/2000/svg";

const svg = <K extends keyof SVGElementTagNameMap>(tag: K) =>
  document.createElementNS(SVG_NS, tag);

const point = (radius: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;

  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  };
};

const path = (radius: number, startAngle: number, endAngle: number): string => {
  const start = point(radius, startAngle);
  const end = point(radius, endAngle);

  return `M 50 50 L ${start.x} ${start.y} L ${end.x} ${end.y} Z`;
};

const slice = (startAngle: number, endAngle: number) => {
  const startOut = point(MENU_RADIUS, startAngle);
  const endOut = point(MENU_RADIUS, endAngle);
  const startIn = point(INNER_RADIUS, startAngle);
  const inEnd = point(INNER_RADIUS, endAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startIn.x} ${startIn.y}`,
    `L ${startOut.x} ${startOut.y}`,
    `A ${MENU_RADIUS} ${MENU_RADIUS} 0 ${largeArc} 1 ${endOut.x} ${endOut.y}`,
    `L ${inEnd.x} ${inEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${startIn.x} ${startIn.y}`,
    "Z",
  ].join(" ");
};

export const createPanel = (items: Icon[]): void => {
  const panel = document.createElement("div");
  panel.className = "panel";
  document.body.appendChild(panel);

  const menu = svg("svg");
  menu.classList.add("menu");
  menu.setAttribute("viewBox", "0 0 100 100");

  const hitMap = svg("svg");
  hitMap.classList.add("hit-map");
  hitMap.setAttribute("viewBox", "0 0 100 100");
  hitMap.setAttribute("preserveAspectRatio", "none");

  const menuItems: SVGGElement[] = [];
  const angle = 360 / items.length;

  const setHovered = (index: number | null) => {
    menuItems.forEach((item, i) => {
      item.classList.toggle("hovered", i === index);
    });
  };

  items.forEach((item, i) => {
    const start = i * angle;
    const end = start + angle;
    const middle = start + angle / 2;

    // Visual menu item
    const group = svg("g");
    group.classList.add("menu-item");

    const wedge = svg("path");
    wedge.classList.add("menu-slice");
    wedge.setAttribute("d", slice(start, end));
    group.appendChild(wedge);

    const iconPos = point(ICON_RADIUS, middle);
    const image = svg("image");

    image.setAttribute(
      "href",
      `data:image/svg+xml,${encodeURIComponent(item.icon)}`,
    );
    image.setAttribute("x", `${iconPos.x - 4}`);
    image.setAttribute("y", `${iconPos.y - 4}`);
    image.setAttribute("width", "10");
    image.setAttribute("height", "10");
    image.setAttribute("pointer-events", "none");

    group.appendChild(image);

    // const labelPos = point(LABEL_RADIUS, middle);
    // const label = svg("text");

    // label.classList.add("menu-label");
    // label.setAttribute("x", `${labelPos.x}`);
    // label.setAttribute("y", `${labelPos.y}`);
    // label.setAttribute("text-anchor", "middle");
    // label.setAttribute("dominant-baseline", "middle");
    // label.setAttribute("pointer-events", "none");

    // label.textContent = item.name;

    // group.appendChild(label);
    menu.appendChild(group);
    menuItems.push(group);

    // Clickable area
    const hit = svg("path");
    hit.classList.add("hit-slice");
    hit.setAttribute("d", path(100, start, end));
    hit.setAttribute("role", "link");
    hit.setAttribute("tabindex", "0");

    const navigate = () => {
      window.location.href = `https://${item.host}`;
    };

    hit.addEventListener("mouseenter", () => setHovered(i));
    hit.addEventListener("mouseleave", () => setHovered(null));
    hit.addEventListener("click", navigate);

    hit.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();
      navigate();
    });

    hitMap.appendChild(hit);
  });

  // Dividers
  const dividers = svg("g");
  dividers.classList.add("menu-dividers");

  for (let i = 0; i < items.length; i++) {
    const angle = i * (360 / items.length);
    const start = point(INNER_RADIUS, angle);
    const end = point(MENU_RADIUS, angle);

    const line = svg("line");
    line.classList.add("menu-divider");
    line.setAttribute("x1", `${start.x}`);
    line.setAttribute("y1", `${start.y}`);
    line.setAttribute("x2", `${end.x}`);
    line.setAttribute("y2", `${end.y}`);

    dividers.appendChild(line);
  }

  menu.appendChild(dividers);

  // Center
  const center = svg("circle");
  center.classList.add("menu-center");

  center.setAttribute("cx", "50");
  center.setAttribute("cy", "50");
  center.setAttribute("r", `${INNER_RADIUS}`);

  menu.appendChild(center);

  panel.append(menu, hitMap);

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
