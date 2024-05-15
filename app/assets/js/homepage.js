
const overlay = document.querySelector('.video-overlay');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const video = document.getElementById('bgVideo');
const handleClickText1 = () => {
    hideElements([overlay, text1]);
    video.removeAttribute('loop');
};
const handleVideoEnd = () => {
    showElements([overlay, text2]);
    video.setAttribute('loop', 'loop');
    video.play();
};
text1.addEventListener('click', handleClickText1);
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

