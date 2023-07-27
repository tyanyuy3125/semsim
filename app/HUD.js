import TIME from "./time";

const dateElement = document.querySelector("#hud .date");
const timeElement = document.querySelector("#hud .time");

dateElement.style.cssText = `
    position: absolute;
    top: 82.5%;
    left: 37%;
    color: white;
    font-size: 18px;
    font-family: arial, helvetica, sans-serif;
    z-index: 1;
  `;
dateElement.innerHTML = "";

timeElement.style.cssText = `
    position: absolute;
    top: 82.5%;
    left: 58%;
    color: white;
    font-size: 18px;
    font-family: arial, helvetica, sans-serif;
    z-index: 1;
  `;
timeElement.innerHTML = "";

// update the HUD
const updateHUD = function () {
  const currentDate = TIME.current.toLocaleDateString(); // Get the date component
  const currentTime = TIME.current.toLocaleTimeString(); // Get the time component

  dateElement.innerHTML = `${currentDate}`;
  timeElement.innerHTML = `${currentTime}`;
};

export { updateHUD };