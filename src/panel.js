export default createPanel = () => {
  const panel = document.createElement("div");

  Object.assign(panel.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    zIndex: "9999",
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    opacity: "0",
    visibility: "hidden",
    transition: "0.05s ease-in",
  });

  document.body.appendChild(panel);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "F1") return;

    e.preventDefault();
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
  });

  document.addEventListener("keyup", (e) => {
    if (e.key !== "F1") return;

    e.preventDefault();
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
  });
};
