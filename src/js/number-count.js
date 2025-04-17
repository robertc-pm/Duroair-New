document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".numbercount");
    let observerTriggered = false;

    function animateCounters() {
        const maxTarget = Math.max(...Array.from(counters, counter => +counter.innerText));
        const duration = 2000; // Animation duration in milliseconds
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;

        counters.forEach(counter => {
            const target = +counter.innerText;
            let count = 0;
            const increment = target / totalFrames;
            let frame = 0;

            function updateCounter() {
                frame++;
                count += increment;
                counter.innerText = Math.floor(count);

                if (frame < totalFrames) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target; // Ensure final value is exact
                }
            }
            updateCounter();
        });
    }

    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !observerTriggered) {
                observerTriggered = true;
                animateCounters();
            }
        });
    }

    const observer = new IntersectionObserver(onIntersection, { threshold: 0.5 });
    observer.observe(document.querySelector(".why-choose-duroair"));
});
