// Define variables for overlay, text elements, and video
const overlay = document.querySelector('.video-overlay');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const video = document.getElementById('bgVideo');
const header = document.querySelector('.header');

const hideElementsAfterDelay = () => {
    setTimeout(() => {
        hideElements([overlay, text1]);
        video.removeAttribute('loop');
        addTransparentClass(header);
    }, 2000);
};

// Function to handle video end event
const handleVideoEnd = () => {
    showElements([overlay, text2]);
    video.setAttribute('loop', 'loop');
    video.play();
    removeTransparentClass(header); // Remove transparent class when video ends
};

// Call function to hide elements after delay
hideElementsAfterDelay();

// Set up event listener for video end
video.addEventListener('ended', handleVideoEnd);

// Helper function to hide multiple elements
function hideElements(elements) {
    elements.forEach(element => {
        element.classList.add('hidden');
    });
}

// Helper function to show multiple elements
function showElements(elements) {
    elements.forEach(element => {
        element.classList.remove('hidden');
    });
}

// Helper function to add transparent class to an element
function addTransparentClass(element) {
    element.classList.add('transparent');
}

// Helper function to remove transparent class from an element
function removeTransparentClass(element) {
    element.classList.remove('transparent');
}
