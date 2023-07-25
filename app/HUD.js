import TIME from "./time";

const hud = document.getElementById("hud");
hud.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-size: 20px;
    font-family: arial, helvetica, sans-serif;
    z-index: 1;
  `;
hud.innerHTML = "";

// update the HUD
const updateHUD = function () {
  hud.innerHTML = `
    TIME: ${TIME.current.toLocaleString()}
    `;
};

export { updateHUD };
