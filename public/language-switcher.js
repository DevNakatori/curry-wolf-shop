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
  