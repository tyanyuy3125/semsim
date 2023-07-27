// Get UI elements
const timeSpeedSlider = document.getElementById('timeSpeed');
const timeSpeedUnit = document.getElementById('timeUnit');
const timeBarSlider = document.getElementById('timeBar');
const povCheckbox = document.getElementById('pov');
const solarEclipseRadio = document.getElementById('solarEclipse');
const lunarEclipseRadio = document.getElementById('lunarEclipse');
const eclipseTypeSelect = document.getElementById('eclipseType');
const viewModeSelect = document.getElementById('viewMode');

// Get UI values
let timeSpeed = timeSpeedSlider.value;
let timeUnit = timeSpeedUnit.value;
let currentTime = timeBarSlider.value;
let povEnabled = povCheckbox.checked;
let eclipseType = eclipseTypeSelect.value;
let viewMode = viewModeSelect.value;

// Event listeners
timeSpeedSlider.addEventListener('input', (event) => {
  timeSpeed = event.target.value;
  // update timeSpeed in your app
});

timeSpeedUnit.addEventListener('change', (event) => {
  timeUnit = event.target.value;
  // update timeUnit in your app
});

timeBarSlider.addEventListener('input', (event) => {
  currentTime = event.target.value;
  // update currentTime in your app
});

povCheckbox.addEventListener('change', (event) => {
  povEnabled = event.target.checked;
  // update povEnabled in your app
});

eclipseTypeSelect.addEventListener('change', (event) => {
  eclipseType = event.target.value;
  // update eclipseType in your app
});

viewModeSelect.addEventListener('change', (event) => {
  viewMode = event.target.value;
  // update viewMode in your app
});


const solarEclipseOptions = ["日全食", "日环食", "日偏食"];
const lunarEclipseOptions = ["月全食", "月偏食"];

function updateEclipseTypeOptions(options) {
  // clear all options
  eclipseTypeSelect.innerHTML = '';
  // add new options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.text = option;
    eclipseTypeSelect.appendChild(optionElement);
  });
}

solarEclipseRadio.addEventListener('change', (event) => {
  if (event.target.checked) {
    updateEclipseTypeOptions(solarEclipseOptions);
  }
});

lunarEclipseRadio.addEventListener('change', (event) => {
  if (event.target.checked) {
    updateEclipseTypeOptions(lunarEclipseOptions);
  }
});

// init
function init() {
  // add your code here
}

init();