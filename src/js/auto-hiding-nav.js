(function() {
    var navBar = document.getElementById("header");
    if(!navBar){
        return;
    }
    var timeout = null;
    var startThreshold = navBar.clientHeight;

    var previousTop = 0,
        currentTop = 0,
        scrollDelta = 15,
        scrollOffset = 150;

    window.addEventListener("scroll", function(e) {
        //throttling
        if (!timeout) {
            timeout = setTimeout(function() {
                timeout = null;
                hideNav();
            }, 150);
        }
    });

    function hideNav() {
        if (document.body.classList.contains("nav-active")) {
            return;
        }
        currentTop = window.pageYOffset;

        navBar.classList.toggle("scrolled", currentTop > startThreshold);
        document.body.classList.toggle("nav-scrolled", currentTop > startThreshold);

        if (previousTop - currentTop > scrollDelta) {
            //if scrolling up...
            navBar.classList.add("show");
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            //if scrolling down...
            navBar.classList.remove("show");
            document.body.classList.remove("search-active");
        }
        previousTop = currentTop;
    }
})();
