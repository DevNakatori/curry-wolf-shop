document.addEventListener("DOMContentLoaded", () => {
    const imgOnes = document.querySelectorAll('.img-one');
    let scrollTimeout;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Adjust this value as needed
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const animationClass = entry.target.getAttribute('data-animation');
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', animationClass);
                entry.target.style.opacity = 1;
            } else {
                entry.target.classList.remove('animate__animated', animationClass);
                entry.target.style.opacity = 0;
            }
        });
    }, observerOptions);

    imgOnes.forEach(item => observer.observe(item));

    const handleScroll = () => {
        imgOnes.forEach(item => {
            const animationClass = item.getAttribute('data-animation');
            item.classList.add('animate__animated', animationClass);
            item.style.opacity = 1;
        });

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            imgOnes.forEach(item => {
                const animationClass = item.getAttribute('data-animation');
                item.classList.remove('animate__animated', animationClass);
                item.style.opacity = 1; // Maintain visibility
            });
        }, 400); // Adjust delay as needed
    };

    window.addEventListener('scroll', handleScroll);
});

window.addEventListener('scroll', function() {
    const videoOverlay = document.getElementById('videoOverlay');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const indexWrapper = document.querySelector('.index-wrapper');
    const textElement = document.getElementById('inner-text1');

    // Get the scroll position
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;
    // console.log(scrollPosition);

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
        textElement.classList.add('animate__rollIn');
        textElement.classList.remove('animate__rollOut');
    } else if (scrollPosition > windowHeight) {
        textElement.classList.add('animate__rollOut');
        textElement.classList.remove('animate__rollIn');
    } else {
        text1.classList.add('hidden');
        text1.classList.remove('visible');
        textElement.classList.remove('animate__rollOut');
        textElement.classList.remove('animate__rollIn');
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