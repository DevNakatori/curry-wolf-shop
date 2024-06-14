
// location page animation 

    document.addEventListener('DOMContentLoaded', (event) => {
      setTimeout(function() {   
      const video1 = document.getElementById('video1');
      const video2 = document.getElementById('video2');
      const videocontainer = document.getElementById('video-container');

      const overlayImages = document.querySelectorAll('.overlayImage');
      const positions = [{
              x: 11,
              y: 41
          },
          {
              x: 23,
              y: 34
          },
          {
              x: 19,
              y: 26
          },
          {
              x: 25.5,
              y: 22.5
          },
          {
              x: 30.5,
              y: 24
          }
      ];

      function positionOverlayImages() {   
          const rect = videocontainer.getBoundingClientRect();
          overlayImages.forEach((image, index) => {
              const xPercentage = positions[index].x;
              const yPercentage = positions[index].y;
              const xPos = rect.left + (rect.width * xPercentage / 100) - (image.width / 2);
              const yPos = rect.top + (rect.height * yPercentage / 100) - (image.height / 2);
              /*image.style.left = `${xPos}px`;
              image.style.top = `${yPos}px`;*/

              image.style.left = `${xPercentage}%`;
              image.style.top = `${yPercentage}%`;
              image.style.transform = `translate(${xPos}px, ${yPos}px)`;

            
              image.addEventListener('mouseenter', () => {
                  image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(-10px)`;
              });
              
              image.addEventListener('mouseleave', () => {
                  image.style.transform = `translate(${xPos}px, ${yPos}px) translateY(0px)`;
              });
          });
      }

      function showImagesSequentially() {
          overlayImages.forEach((image, index) => {
              setTimeout(() => {
                  image.style.opacity = 1;
              }, index * 500);
          });
      }

      positionOverlayImages();
      setTimeout(function() {
          showImagesSequentially();
      }, 2000);

      video1.addEventListener('ended', () => {
          video1.style.display = 'none';
          video2.style.display = 'block';
          video2.play();
      });

      window.addEventListener('resize', () => {
          positionOverlayImages();
          showImagesSequentially();
      });
    }, 2000);

    // for mobile and tablet /
function detectMobile() 
{
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
        return true;
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }
    return false;
}

if (detectMobile()) 
{
    document.addEventListener('DOMContentLoaded', () => {
        const parent = document.querySelector('.thereedmainsection');
        const child = document.querySelector('.video-container');
        let isDown = false;
        let startX;
        let scrollLeft;
        parent.addEventListener('touchstart', (e) => {
            isDown = true;
            child.style.cursor = 'grabbing';
            startX = e.touches[0].pageX - child.offsetLeft;
            scrollLeft = parent.scrollLeft;
        });
        parent.addEventListener('touchend', () => {
            isDown = false;
            child.style.cursor = 'grab';
        });
        parent.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - child.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scrolling speed
            parent.scrollLeft = scrollLeft - walk;
        });
    });
    console.log("This is a mobile device.");
} else {
    console.log("This is not a mobile device.");
}
// for mobile and tablet /

    });

// location page end 

AOS.init({
  duration: 1000,
})

const handleScroll = () => {
};

window.addEventListener('scroll', handleScroll);

window.addEventListener('scroll', function() {
    const videoOverlay = document.getElementById('videoOverlay');

    // Get the scroll position
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;

    // Handle overlay opacity
    if (scrollPosition > 100) {
    //    videoOverlay.style.opacity = 1;
    } else {
     //   videoOverlay.style.opacity = 0;
    }   
});

if (window.innerWidth < 768) {
  setTimeout(function() {   
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dots-container');
    const totalSlides = slides.length;
    let currentIndex = 1;
  
    if (window.innerWidth < 768) {
      const firstSlideClone = slides[0].cloneNode(true);
      const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
  
      sliderWrapper.appendChild(firstSlideClone);
      sliderWrapper.insertBefore(lastSlideClone, sliderWrapper.firstChild);
    }
  
    const allSlides = document.querySelectorAll('.slide');
  
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => {
        currentIndex = i + 1;
        sliderWrapper.style.transition = 'transform 0.5s ease';
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  
    function updateDots() {
      const dots = dotsContainer.children;
      Array.from(dots).forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex - 1) {
          dot.classList.add('active');
        }
      });
    }
  
    function updateSlider() {
      const newTransform = -(currentIndex * 33.33) + 33.33;
      sliderWrapper.style.transform = `translateX(${newTransform}%)`;
      Array.from(allSlides).forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentIndex) {
          slide.classList.add('active');
        }
      });
      updateDots();
    }
  
    sliderWrapper.addEventListener('transitionend', () => {
      if (currentIndex >= totalSlides + 1) {
        sliderWrapper.style.transition = 'none';
        currentIndex = 1;
        updateSlider();
        setTimeout(() => {
          sliderWrapper.style.transition = 'transform 0.5s ease';
        }, 50);
      } else if (currentIndex <= 0) {
        sliderWrapper.style.transition = 'none';
        currentIndex = totalSlides;
        updateSlider();
        setTimeout(() => {
          sliderWrapper.style.transition = 'transform 0.5s ease';
        }, 50);
      }
    });
  
    updateSlider();
}, 2000);
}
// document.addEventListener("DOMContentLoaded", function() {
//   function equalHeight(group) {
//       var tallest = 0;
      
//       // Calculate the tallest height
//       group.forEach(function(element) {
//           var thisHeight = element.offsetHeight;
//           if (thisHeight > tallest) {
//               tallest = thisHeight;
//           }
//       });
      
//       // Set all elements to the tallest height
//       group.forEach(function(element) {
//           element.style.height = tallest + 'px';
//       });
//   }

//   // Select elements and convert NodeList to an array
//   var equalHeightElements = Array.prototype.slice.call(document.querySelectorAll(".products-grid .product-g-wrap h4"));

//   equalHeight(equalHeightElements);
// });


