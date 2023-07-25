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
    } else {
        userImg.src = './logo/ui.png'; // Replace with the original image path
    }
}

// Function to handle map icon click event
function handleMapIconClick() {
    const mapImg = mapIcon.querySelector('img');
    mapIconClicked = !mapIconClicked; // Toggle the icon state

    if (mapIconClicked) {
        mapImg.src = './logo/satellite-solid.png';
    } else {
        mapImg.src = './logo/map.png'; // Replace with the original image path
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

      if(id === 'sunOptions' || id === 'moonOptions') {
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
