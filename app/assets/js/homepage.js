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

const handleVideoEnd = () => {
    showElements([overlay, text2]);
    video.setAttribute('loop', 'loop');
    video.play();
    removeTransparentClass(header); 
};

hideElementsAfterDelay();

video.addEventListener('ended', handleVideoEnd);

function hideElements(elements) {
    elements.forEach(element => {
        element.classList.add('hidden');
    });
}

function showElements(elements) {
    elements.forEach(element => {
        element.classList.remove('hidden');
    });
}

function addTransparentClass(element) {
    element.classList.add('transparent');
}

function removeTransparentClass(element) {
    element.classList.remove('transparent');
}
