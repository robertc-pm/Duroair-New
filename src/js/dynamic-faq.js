document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".faq-tab-head ul li");
    const faqItems = document.querySelectorAll(".faq-inr-item");

    filters.forEach(filter => {
        filter.addEventListener("click", function () {
            let filterValue = this.getAttribute("data-filter");

            // Remove active class from all tabs and add to the clicked one
            filters.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            // Show/Hide FAQ items based on category
            faqItems.forEach(item => {
                if (filterValue === "all" || item.classList.contains(filterValue)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});
