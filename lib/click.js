/*
Click.js
Maintaining UI clicking interactions.

Note: For state initailization, please MANUALLY add your code to Init() function in the end.
*/

import TIME from "../app/time";
import * as APP from "../app/app";

// Event listeners for clicking on the eye, sun, and moon icons to show the options
eyeIcon.addEventListener('click', (event) => {
  const eyeOptions = document.getElementById('eyeOptions');
  eyeOptions.classList.toggle('show');
  event.stopPropagation(); // prevent the event from bubbling up to the document
});

sunIcon.addEventListener('click', (event) => {
  const sunOptions = document.getElementById('sunOptions');
  sunOptions.classList.toggle('show');
  event.stopPropagation(); // prevent the event from bubbling up to the document
});

moonIcon.addEventListener('click', (event) => {
  const moonOptions = document.getElementById('moonOptions');
  moonOptions.classList.toggle('show');
  event.stopPropagation(); // prevent the event from bubbling up to the document
});

// Variables to keep track of the icon states
let userIconClicked = false;
let mapIconClicked = false;

// Function to handle user icon click event
function handleUserIconClick() {
  const userImg = userIcon.querySelector('img');
  userIconClicked = !userIconClicked; // Toggle the icon state

  if (userIconClicked) {
    userImg.src = './logo/no_ui.png';
    controlPanel.style.display = "none";
    eyeIcon.style.display = "none";
    sunIcon.style.display = "none";
    moonIcon.style.display = "none";
    mapIcon.style.display = "none";
    pauseButton.style.display = "none";
  }
  else {
    userImg.src = './logo/ui.png'; // Replace with the original image path
    controlPanel.style.display = "flex";
    eyeIcon.style.display = "flex";
    sunIcon.style.display = "flex";
    moonIcon.style.display = "flex";
    mapIcon.style.display = "flex";
    pauseButton.style.display = "flex";
  }
}

// Function to handle map icon click event
function handleMapIconClick() {
  const mapImg = mapIcon.querySelector('img');
  mapIconClicked = !mapIconClicked; // Toggle the icon state

  if (mapIconClicked) {
    mapImg.src = './logo/satellite-solid.png';
    APP.mapSwitch();
  } else {
    mapImg.src = './logo/map.png'; // Replace with the original image path
    APP.mapSwitch();
  }
}

// Event listeners for clicking on the user and map icons to change their images
userIcon.addEventListener('click', handleUserIconClick);
mapIcon.addEventListener('click', handleMapIconClick);

// Add click event listeners to the options for the eye, sun, and moon icons
['eyeOptions', 'sunOptions', 'moonOptions'].forEach(id => {
  const options = document.getElementById(id);
  const optionElements = options.querySelectorAll('.option');

  optionElements.forEach(option => {
    option.addEventListener('click', (event) => {
      // Reset all options' background color
      optionElements.forEach(opt => {
        if (opt !== event.target) {
          opt.style.backgroundColor = 'transparent';
        }
      });

      if (id === 'sunOptions' || id === 'moonOptions') {
        // Toggle clicked option's background color for sunOptions and moonOptions
        if (event.target.style.backgroundColor === 'rgb(99, 99, 102)') { // RGB value for #636366
          event.target.style.backgroundColor = 'transparent';
        } else {
          event.target.style.backgroundColor = '#636366';
        }
      } else {
        // Set clicked option's background color for eyeOptions
        event.target.style.backgroundColor = '#636366';
      }

      event.stopPropagation(); // Prevent the click event from bubbling up to the document
    });
  });

  options.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the document
  });
});

// Event listener to close the options list when clicking outside the icons and options
document.addEventListener('click', () => {
  const eyeOptions = document.getElementById('eyeOptions');
  const sunOptions = document.getElementById('sunOptions');
  const moonOptions = document.getElementById('moonOptions');

  eyeOptions.classList.remove('show');
  sunOptions.classList.remove('show');
  moonOptions.classList.remove('show');
});

// Pause and Play
const pauseButton = document.getElementById("pauseButton");
const pauseIcon = "./logo/pause.png";
const playIcon = "./logo/play.png";
let isPlaying = true;

pauseButton.addEventListener("click", function () {
  const logoImg = pauseButton.querySelector("img");
  isPlaying = !isPlaying; // Toggle the play/pause state

  if (isPlaying) {
    logoImg.src = pauseIcon;
    // TODO: resume the animation or any other action when the simulation is resumed
    timeSpeedInput.value = startValue;
    timeSpeedInput.disabled = false;
    speedValueElement.textContent = `${startValue} ${unit} / S`;
    TIME.timespeed = startValue * 1000 * getSeconds();
  } else {
    logoImg.src = playIcon;
    // TODO: pause the animation or any other action when the simulation is paused
    timeSpeedInput.value = middleValue;
    timeSpeedInput.disabled = true;
    speedValueElement.textContent = `${middleValue} ${unit} / S`;
    TIME.timespeed = middleValue * 1000 * getSeconds();
  }
});

// PIP mode
// Function to handle click events for sun and moon options
function handleSunMoonOptionClick(event) {
  const selectedOption = event.target;
  const isSelected = selectedOption.classList.contains('selected');

  // Reset all options' background color
  const optionElements = event.currentTarget.querySelectorAll('.option');
  optionElements.forEach(option => {
    option.classList.remove('selected');
  });

  // Toggle clicked option's background color
  if (!isSelected) {
    selectedOption.classList.add('selected');
  }

  // Hide the options list after selecting an option
  event.currentTarget.classList.remove('show');
  event.stopPropagation(); // Prevent the click event from bubbling up to the document

  // Call the function to display the video in the Picture-in-Picture view
  displayVideoInPiP(selectedOption.textContent);
}

// Function to display the video in the Picture-in-Picture view
function displayVideoInPiP(selectedOptionText) {
  // Check the selected option and display the corresponding video
  const povView = document.getElementById('povView');

  // Remove any existing video from the Picture-in-Picture view
  povView.innerHTML = '';

  // Create the video element
  const video = document.createElement('video');
  video.width = 300;
  video.height = 200;
  video.controls = true;
  video.autoplay = true;

  // Set the video source based on the selected option
  if (selectedOptionText === '日全食') {
    video.src = './videos/solar_eclipse.mp4';
  } else if (selectedOptionText === '日环食') {
    video.src = './videos/solar_annular_eclipse.mp4';
  } else if (selectedOptionText === '日偏食') {
    video.src = './videos/solar_partial_eclipse.mp4';
  } else if (selectedOptionText === '月全食') {
    video.src = './videos/lunar_eclipse.mp4';
  } else if (selectedOptionText === '月偏食') {
    video.src = './videos/lunar_partial_eclipse.mp4';
  }

  // Append the video element to the Picture-in-Picture view
  povView.appendChild(video);
}

// Add click event listeners to the options for the sun and moon icons
['sunOptions', 'moonOptions'].forEach(id => {
  const options = document.getElementById(id);
  options.addEventListener('click', handleSunMoonOptionClick);
});

// Change the opacity of the logo part when mouse enters
const logo = document.getElementById('logo');
const team = document.getElementById('team').querySelector('img');
const title = document.getElementById('title');
const credit = document.getElementById('credit');
const vecline = document.getElementById('vecline');

// Add event listeners for mouse enter and mouse leave
logo.addEventListener('mouseenter', () => {
  team.style.opacity = 1;
  title.style.opacity = 1;
  credit.style.opacity = 1;
  vecline.style.opacity = 1;
});

logo.addEventListener('mouseleave', () => {
  team.style.opacity = 0.4;
  title.style.opacity = 0.4;
  credit.style.opacity = 0.4;
  vecline.style.opacity = 0.4;
});


const speedValueElement = document.getElementById("speedValue");
const buttons = document.getElementById("buttons");
const timeSpeedInput = document.getElementById("timeSpeed");

const middleValue = 0;
const startValue = 1;
let unit = "DAY";

function getSeconds() {
  if (unit == "SEC") return 1;
  if (unit == "MIN") return 60;
  if (unit == "HOUR") return 60 * 60;
  if (unit == "DAY") return 24 * 60 * 60;
  if (unit == "MON") return 30 * 24 * 60 * 60;
  if (unit == "YEAR") return 365 * 24 * 60 * 60;
}

// Add click event listener to buttons
buttons.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    unit = target.textContent;

    // Set the slider value to the proper value
    if (isPlaying) {
      timeSpeedInput.value = startValue;
      speedValueElement.textContent = `${startValue} ${unit} / S`;
      TIME.timespeed = startValue * 1000 * getSeconds();
    } else {
      timeSpeedInput.value = middleValue;
      speedValueElement.textContent = `${middleValue} ${unit} / S`;
      TIME.timespeed = middleValue * 1000 * getSeconds();
    }
  }
});

// Add input event listener to timeSpeedInput
timeSpeedInput.addEventListener("input", (event) => {
  const value = event.target.value;
  speedValueElement.textContent = `${value} ${unit} / S`;
  TIME.timespeed = value * 1000 * getSeconds();

  // console.log(TIME.timespeed, "!");
});

init();

function init() {
  let isPlaying = true;
  timeSpeedInput.value = startValue;
  timeSpeedInput.disabled = false;
  speedValueElement.textContent = `${startValue} ${unit} / S`;
  TIME.timespeed = startValue * 1000 * getSeconds();
}