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
        videoOverlay.style.opacity = 1;
    } else {
        videoOverlay.style.opacity = 0;
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
