(function() {
    var navToggle = document.getElementById("nav-toggle");
    if(!navToggle){
        return;
    }
    navToggle.addEventListener("click", function(e) {
        document.querySelector("body").classList.toggle("nav-active");
    });
    var navArrows = document.querySelectorAll(".nav-arrow");

    for (var i = 0; i < navArrows.length; i++) {
        var navArrow = navArrows[i];
        navArrow.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.parentElement.querySelector(".submenu").classList.toggle("active");
            e.currentTarget.classList.toggle("active");
        });
    }

    function toggleAll(selector, cssClass) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.toggle(cssClass);
        }
    }

    //polyfill for "closest"
    if (window.Element && !Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            debugger;
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i,
                el = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {}
            } while (i < 0 && (el = el.parentElement));
            return el;
        };
    }
})();



document.addEventListener("DOMContentLoaded", function () {
    let navLink = document.querySelector(".nav-military-and-government a.link");

    if (navLink) {
        navLink.textContent = navLink.textContent.replace(/\bMilitary And Government\b/g, "Military and Government");
    }
});