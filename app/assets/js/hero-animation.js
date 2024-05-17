window.addEventListener('scroll', function() {
    const videoOverlay = document.getElementById('videoOverlay');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const indexWrapper = document.querySelector('.index-wrapper');
    // Get the scroll position
    let scrollPosition = window.scrollY;
      let windowHeight = window.innerHeight;
      console.log(scrollPosition);
    // Handle overlay opacity
    if (scrollPosition > 100) {
        videoOverlay.style.opacity = 1;
    } else {
        videoOverlay.style.opacity = 0;
    }

   // Handle text1 display
   if (scrollPosition > 300 && scrollPosition < windowHeight) {
        text1.classList.add('visible');
        text1.classList.remove('hidden');
    } else {
        text1.classList.add('hidden');
        text1.classList.remove('visible');
    }

    // Handle text2 display
    if (scrollPosition > windowHeight) {
        text2.classList.add('visible');
        text2.classList.remove('hidden');
    } else {
        text2.classList.add('hidden');
        text2.classList.remove('visible');
    }
});