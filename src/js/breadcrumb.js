document.addEventListener("DOMContentLoaded", function () {
    const breadcrumbContainer = document.getElementById("breadcrumb");
    if (!breadcrumbContainer) return;

    const pathArray = window.location.pathname.split('/').filter(Boolean);

    // Hide breadcrumb on the homepage
    if (pathArray.length === 0) {
        breadcrumbContainer.style.display = "none";
        return;
    }

    let breadcrumbHTML = `<a href="/">Home</a>`;
    let path = "";

    function formatText(text) {
        return text
            .replace(/-/g, " ") // Replace hyphens with spaces
            // .replace(/\bsolutions\b/g, "Applications") // Change "Solution" to "Application"
            .replace(/\bfaq\b/g, "FAQ") // Change "Solution" to "Application"
            .split(" ") // Split into words
            .map(word => (word.toLowerCase() === "and" ? "and" : word.charAt(0).toUpperCase() + word.slice(1))) // Capitalize except "and"
            .join(" "); // Rejoin words
    }

    pathArray.forEach((segment, index) => {
        if (!isNaN(segment) || (pathArray[0] === "blog" && index > 0)) return;

        path += `/${segment}`;
        const isLast = index === pathArray.length - 1;
        const text = formatText(decodeURIComponent(segment));

        breadcrumbHTML += ` &raquo; ${
            isLast ? `<span>${text}</span>` : `<a href="${path}/">${text}</a>`
        }`;
    });

    breadcrumbContainer.innerHTML = breadcrumbHTML;
});

