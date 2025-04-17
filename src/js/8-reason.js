document.addEventListener("DOMContentLoaded", function () {
    let accordionItems = document.querySelectorAll(".reasons-accrdn-card");
    let sliderItems = document.querySelectorAll(".reasonert-navfor-slider-inr-item");
    let navItems = document.querySelectorAll(".reason-slider-nav-item");

    function activateItem(index) {
        // Remove "active" class from all items
        accordionItems.forEach((el) => {
            el.classList.remove("active");
            el.querySelector(".reasonsaccr-body").style.display = "none"; // Hide content
        });
        sliderItems.forEach((el) => el.classList.remove("active"));
        navItems.forEach((el) => el.classList.remove("active"));

        // Add "active" class to the clicked index
        accordionItems[index].classList.add("active");
        accordionItems[index].querySelector(".reasonsaccr-body").style.display = "block"; // Show content
        sliderItems[index].classList.add("active");
        navItems[index].classList.add("active");

        // Show the corresponding image
        sliderItems.forEach((el) => el.style.display = "none"); // Hide all images first
        let activeImage = document.querySelector(`.reasonert-navfor-slider-inr-item[data-index='${index + 1}']`);
        if (activeImage) {
            activeImage.style.display = "block"; // Show only the selected image
        }
    }

    // Accordion Click Event
    accordionItems.forEach((item, index) => {
        item.addEventListener("click", () => activateItem(index));
    });

    // Thumbnail Click Event
    navItems.forEach((item, index) => {
        item.addEventListener("click", () => activateItem(index));
    });
});
