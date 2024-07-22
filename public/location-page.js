  
  document.addEventListener('DOMContentLoaded', (event) => {
      const video1 = document.getElementById('video1');
      const video2 = document.getElementById('video2');
      const videocontainer = document.getElementById('video-container');
      const overlayImages = document.querySelectorAll('.overlayImage');
      const positions = [
        { x: 11, y: 41, label: 'CURRY WOLF' , additionalLabel: 'Steglitz',  additionalLabel2: 'Mehr Info' },

        { x: 23, y: 34, label: 'CURRY WOLF' , additionalLabel: 'Potsdam' , additionalLabel2: 'Mehr Info' },

        { x: 19, y: 26, label: 'CURRY WOLF' , additionalLabel: 'Brandenburger Tor' , additionalLabel2: 'Mehr Info'},

        { x: 25.5, y: 22.5, label: 'CURRY WOLF' , additionalLabel: 'Ku`damm' , additionalLabel2: 'Mehr Info' },

        { x: 30.5, y: 24, label: 'CURRY WOLF' , additionalLabel: 'Lichtenrade' , additionalLabel2: 'Mehr Info' }
      ];
  
      const overlayLabels = [];
      
      function positionOverlayImages() {
          const rect = videocontainer.getBoundingClientRect();
          overlayImages.forEach((image, index) => {
              const xPercentage = positions[index].x;
              const yPercentage = positions[index].y;
              const xPos = rect.left + (rect.width * xPercentage / 100) - (image.width / 2);
              const yPos = rect.top + (rect.height * yPercentage / 100) - (image.height / 2);
              
              const xPoss = rect.left + (rect.width * xPercentage / 100) - 60;
              const yPoss = rect.top + (rect.height * yPercentage / 100) - 240;
  
              image.style.left = `${xPercentage}%`;
              image.style.top = `${yPercentage}%`;
              image.style.transform = `translate(${xPos}px, ${yPos}px)`;
  
              const label = document.createElement('div');
              label.classList.add('overlayLabel');
              label.innerHTML = `
              <span class="mainLabel">${positions[index].label}</span>
              <span class="additionalLabel">${positions[index].additionalLabel}</span>
               <span class="additionalLabel2">${positions[index].additionalLabel2}</span>
          `;
          label.style.opacity = 0;
          videocontainer.appendChild(label);
          overlayLabels.push(label);
  
  
              label.style.position = 'absolute';
              label.style.left = `${xPercentage}%`;
              label.style.top = `${yPercentage}%`;
              label.style.transform = `translate(${xPoss}px, ${yPoss}px)`; 
  
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
                  overlayLabels[index].style.opacity = 1;
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
  });
  
  function detectMobile() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
          return true;
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return true;
      }
      return false;
  }
  
  if (detectMobile()) {
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
              const walk = (x - startX) * 2;
              parent.scrollLeft = scrollLeft - walk;
          });
      });
      console.log("This is a mobile device.");
  } else {
      console.log("This is not a mobile device.");
  }