document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".dod-btn");
    let cardHead = document.querySelector("#dod-main-head");
    let cardBody = document.querySelector("#dod-main-body");

    buttons.forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link action
            
            let newHead = this.getAttribute("data-head");
            let newDesc = this.getAttribute("data-desc");

            // Update the main card content
            if (cardHead && cardBody) {
                cardHead.textContent = newHead;
                cardBody.innerHTML = newDesc; // Properly rendering markdown
            }
        });
    });
});