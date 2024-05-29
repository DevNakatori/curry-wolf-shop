document.addEventListener("DOMContentLoaded", () => {
    const imgOnes = document.querySelectorAll('.img-one');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Adjust this value as needed
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const index = Array.from(imgOnes).indexOf(entry.target);

            if (entry.isIntersecting) {
                switch(index) {
                    case 0:
                        entry.target.classList.remove('animate__rotateOutDownLeft');
                        entry.target.classList.add('animate__animated', 'animate__rotateInDownLeft');
                        break;
                    case 1:
                        entry.target.classList.remove('animate__rotateOutUpLeft');
                        entry.target.classList.add('animate__animated', 'animate__rotateInUpLeft');
                        break;
                    case 2:
                        entry.target.classList.remove('animate__rotateOutDownRight');
                        entry.target.classList.add('animate__animated', 'animate__rotateInDownRight');
                        break;
                }
            } else {
                switch(index) {
                    case 0:
                        entry.target.classList.remove('animate__rotateInDownLeft');
                        entry.target.classList.add('animate__animated', 'animate__rotateOutDownLeft');
                        break;
                    case 1:
                        entry.target.classList.remove('animate__rotateInUpLeft');
                        entry.target.classList.add('animate__animated', 'animate__rotateOutUpLeft');
                        break;
                    case 2:
                        entry.target.classList.remove('animate__rotateInDownRight');
                        entry.target.classList.add('animate__animated', 'animate__rotateOutDownRight');
                        break;
                }
            }
        });
    }, observerOptions);

    imgOnes.forEach(item => {
        observer.observe(item);
    });
});

 
 
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

