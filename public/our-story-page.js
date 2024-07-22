if (document.querySelectorAll('.path-vert').length > 0) {
    var path = document.querySelector('.path-vert');
    var pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    function updateDashOffset() {
        var scrollPosition = window.scrollY; 
        var maxScroll = document.body.scrollHeight - window.innerHeight; 
        var dashOffset = Math.max(0, pathLength - (scrollPosition / maxScroll * pathLength));
        path.style.strokeDashoffset = dashOffset;
    }

    window.addEventListener('scroll', updateDashOffset);
    updateDashOffset();
    path.style.display = 'block';
}

if (document.querySelectorAll('.our-story-box').length) {
    document.querySelectorAll('.our-story-box').forEach((box, index) => {
        const img = box.querySelector('.img-one');
        const line = box.querySelector('.line');

        img.addEventListener('mouseenter', () => {
            line.style.opacity = '0';
        });

        img.addEventListener('mouseleave', () => {
            line.style.opacity = '1';
        });
    });
}

if (document.querySelectorAll('#line-path').length) {
    var path = document.querySelector('#line-path');
    var pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;
    path.getBoundingClientRect();
    window.addEventListener("scroll", function (e) {
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
