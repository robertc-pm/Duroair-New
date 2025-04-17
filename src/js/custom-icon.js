document.addEventListener("DOMContentLoaded", function () {
    const objectElements = document.querySelectorAll(".beyond-compliance-item-icon object");

    objectElements.forEach(objectElement => {
        objectElement.addEventListener("load", function () {
            const svgDoc = objectElement.contentDocument;
            if (svgDoc) {
                const pathElements = svgDoc.querySelectorAll("path"); // Select all <path> elements
                pathElements.forEach(path => {
                    path.classList.add("custom-path-class"); // Add class to each <path>
                    path.style.strokeWidth = "2px"; // Set stroke-width directly via JS
                });
            }
        });
    });
});

