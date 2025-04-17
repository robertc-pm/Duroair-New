/**
 * This a helper to toggle css classes when an element becomes visible in the viewport.
 *
 * data-on-view to start observing an element
 * data-css-remove to remove css classes when in view
 * data-css-add to add css classes when in view
 * data-js to call a js function when in view
 * data-play to start a video playing
 */
(function () {
    let debug = false;
    const urlParams = new URLSearchParams(window.location.search);
    const options = {
        // root: document,
        threshold: .4
    }
    if (urlParams.get('test')) {
        debug = true;
        document.body.classList.add('onview-debug');
    }

    // Get all the elements to toggle css class when in view
    const targets = document.querySelectorAll("[data-on-view]");

    document.querySelectorAll("[data-css-duration]").forEach(el => {
        const duration = el.dataset.cssDuration;
        if (duration) {
            el.style.setProperty("--duration", duration);
        }
    });

    // callback for IntersectionObserver
    const callback = function (entries) {
        entries.forEach(function (entry) {
            // check if element is in view
            if (entry.isIntersecting) {
                if (entry.target.dataset.cssRemove) {
                    removeClasses(entry.target.dataset.cssRemove, entry.target);
                }
                if (entry.target.dataset.cssAdd) {
                    addClasses(entry.target.dataset.cssAdd, entry.target);
                }
                if (entry.target.dataset.js && window[entry.target.dataset.js]) {
                    window[entry.target.dataset.js]();
                }

                if (entry.target.dataset.play) {
                    if (isVisible(entry.target)){
                        document.querySelector(entry.target.dataset.play).play();
                        console.log(entry.target, 'playing');
                    }else{
                        console.log(entry.target, 'hidden, not playing');
                    }
                }
                //no need to keep tracking
                observer.unobserve(entry.target);
                if (debug){
                    console.log(entry.intersectionRatio, entry.target, entry);
                }
            }
        });
    };

    // Set up a new observer
    const observer = new IntersectionObserver(callback, options);

    // Loop through each of the targets and intialize
    targets.forEach(function (target) {
        //hande css classes to be removed by first setting them
        if (target.dataset.cssRemove) {
            addClasses(target.dataset.cssRemove, target);
        }
        //add a default class or one from the data-on-view attribute
        target.classList.add(target.dataset.onView || 'on-view-ready');
        // Add the element to the observer
        observer.observe(target);
    });


    /**
     * Add to css classes
     * @param strClasses string of space separated css clasnames
     * @param target dom element
     */
    function addClasses(strClasses, target) {
        strClasses.split(" ").map((c) => target.classList.add(c));
    }

    /**
     * Remove css classes
     * @param strClasses string of space separated css clasnames
     * @param target dom element
     */
    function removeClasses(strClasses, target) {
        strClasses.split(" ").map((c) => target.classList.remove(c));
    }

    function isVisible (ele) {
        var style = window.getComputedStyle(ele);
        return  style.width !== "0" &&
            style.height !== "0" &&
            style.display!=='none' &&
            style.visibility!== 'hidden';
    }
})();
