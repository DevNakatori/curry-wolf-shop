document.addEventListener("DOMContentLoaded", function() {
  const dropdownToggle = document.getElementById("dropdownToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  if (!dropdownToggle || !dropdownMenu || !dropdownItems.length) {
      console.error("Dropdown elements not found");
      return;
  }

  dropdownToggle.addEventListener("click", function(event) {
      console.log("Dropdown toggle clicked");
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
      dropdownToggle.classList.toggle("active");
  });

  dropdownItems.forEach(item => {
      item.addEventListener("click", function(event) {
          console.log("Dropdown item clicked:", this.textContent);
          dropdownToggle.textContent = this.textContent;
          dropdownToggle.setAttribute("data-value", this.getAttribute("data-value"));
          dropdownMenu.style.display = "none";

          const currentUrl = window.location.href;
          const baseUrl = window.location.origin;
          const pathName = window.location.pathname;
          const pathSegments = pathName.split('/').filter(segment => segment.length > 0);
          const selectedLanguage = this.getAttribute("data-value");

          let newUrl;
          const languageCodes = ["de-de", "en-de"];
          let containsLanguageCode = false;

          for (let i = 0; i < pathSegments.length; i++) {
              if (languageCodes.includes(pathSegments[i])) {
                  pathSegments[i] = selectedLanguage;
                  containsLanguageCode = true;
                  break;
              }
          }
          if (!containsLanguageCode) {
              pathSegments.unshift(selectedLanguage);
          }

          newUrl = `${baseUrl}/${pathSegments.join('/')}`;

          window.location.href = newUrl;
      });
  });

  document.addEventListener("click", function(event) {
      if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.style.display = "none";
      }
  });
});


// language switcher end 

// Animation STARt
AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
    })

// Animation STARt


document.addEventListener("DOMContentLoaded", function() {

    if (window.location.href.indexOf('en-de') !== -1) {
        setTimeout(function() {  
        dropdownToggle.textContent = 'EN';
        }, 200);
        const links = document.querySelectorAll('a[href*="/en"]');
        links.forEach(link => {
            const newHref = link.href.replace('/en', '/en-de');
            link.setAttribute('data-new-href', newHref);
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
                window.location.href = newHref; 
            });
        });
    }
  
    else if (window.location.href.indexOf('de-de') !== -1) {
        setTimeout(function() {  
        dropdownToggle.textContent = 'DE';
        }, 200);
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.href.indexOf('/de-de') === -1 && link.href.indexOf('/en') === -1) {
                const newHref = link.href.replace(window.location.origin, window.location.origin + '/de-de');
                link.setAttribute('data-new-href', newHref);
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.location.href = newHref; 
                });
            }
        });
    }
    
    else {
        setTimeout(function() {  
        dropdownToggle.textContent = 'DE';
        }, 200);
        const newUrl = window.location.href.replace(window.location.origin, window.location.origin + '/de-de');
        window.history.replaceState(null, '', newUrl);
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.href.indexOf('/de-de') === -1 && link.href.indexOf('/en') === -1) {
                const newHref = link.href.replace(window.location.origin, window.location.origin + '/de-de');
                link.setAttribute('data-new-href', newHref);
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.location.href = newHref;
                });
            }
        });
    }
});

// url replace

if(document.querySelectorAll('#popup').length) {
var showPopup = function() {
  document.getElementById('popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
};

var hidePopup = function() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
};

document.getElementById('clickBtn').addEventListener('click', function(event) {
  event.preventDefault();
  showPopup();
});

document.getElementById('closeBtn').addEventListener('click', function() {
  hidePopup();
});

document.getElementById('overlay').addEventListener('click', function() {
  hidePopup();
});
}

// location page animation 

document.addEventListener('DOMContentLoaded', (event) => {
setTimeout(function() {   
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const videocontainer = document.getElementById('video-container');

const overlayImages = document.querySelectorAll('.overlayImage');
const positions = [{
    x: 11,
    y: 35
},
{
    x: 23,
    y: 29
},
{
    x: 19,
    y: 20
},
{
    x: 25.5,
    y: 17.5
},
{
    x: 30.5,
    y: 19
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

if (window.innerWidth < 768) {
setTimeout(function() {
const sliderContainer = document.querySelector('.ref-wrap');
const slides = document.querySelectorAll('.ref-box');
let currentIndex = 0;
let slidesToShow = 1; 

function updateSlider() {
if (window.innerWidth < 768) {
slidesToShow = 2;
} else {
slidesToShow = 1; 
}

const width = sliderContainer.clientWidth / slidesToShow;
slides.forEach(slide => {
slide.style.minWidth = `${width}px`;
});
sliderContainer.style.transform = `translateX(${-width * currentIndex}px)`;
}

function nextSlide() {
if (currentIndex < slides.length - slidesToShow) {
currentIndex += 1;
} else {
currentIndex = 0;
}
updateSlider();
}

function startAutoplay() {
setInterval(nextSlide, 3000);
} 

function resetAutoplay() {
clearInterval(autoplayInterval);
startAutoplay();
}

window.addEventListener('resize', function() {
updateSlider();
currentIndex = 0; 
});

updateSlider(); 

startAutoplay(); 
    }, 2000);
}


// catering Mobile Slider END



//  Home page Animation Start
const handleScroll = () => {
};

window.addEventListener('scroll', handleScroll);
if(document.querySelectorAll('#videoOverlay').length) {
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
}

// Home Page animation END

// Home pahe slider start
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

// Home page slider END
if(document.querySelectorAll('#line-path').length) {
var path = document.querySelector('#line-path');
var pathLength = path.getTotalLength();
path.style.strokeDasharray = pathLength + ' ' + pathLength;
path.style.strokeDashoffset = pathLength;
path.getBoundingClientRect();
window.addEventListener("scroll", function(e) {
var scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
var drawLength = pathLength * scrollPercentage;
path.style.strokeDashoffset = pathLength - drawLength;
if (scrollPercentage >= 0.99) {
path.style.strokeDasharray = "none";

} else {
path.style.strokeDasharray = pathLength + ' ' + pathLength;
}

});
}

