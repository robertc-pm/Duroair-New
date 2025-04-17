(function() {
    var searchContainer = document.getElementById("search-container");
    var searchResults = document.getElementById("search-results");
    var searchField = document.getElementById("search-field");
    var searchForm = document.getElementById("search-form");
    var searchTriggers = document.querySelectorAll('[data-search-trigger]');
    var searchOpen = false;
    var loaderHtml = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
    if (!searchContainer) {
        return;
    }
    
    Array.from(searchTriggers).forEach(function(element) {
        element.addEventListener("click", function(e) {
            e.preventDefault();
            searchOpen = !searchOpen;
            element.classList.toggle("active", searchOpen);
            document.body.classList.toggle("search-active", searchOpen);
            searchField.focus();
        });
    });
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (searchField.value) {
            search(searchField.value);
        }
    });

    searchField.addEventListener("change", handleInput);
    searchField.addEventListener("keyup", handleInput);
    function handleInput(e) {
        e.preventDefault();
        if (!searchField.value) {
            hideSearchResults();
        }
    }
    // Detect all clicks on the document and close search results if outside
    document.addEventListener("click", function(event) {
        if (event.target.closest("#search")) return;
        hideSearchResults();
    });
    function hideSearchResults() {
        searchResults.classList.remove("active");
    }
    function clearSearchResults() {
        searchResults.innerHTML = "";
    }
    function showSearchResults(results, msg, term) {
        var html = "";
        console.log(term);
        clearSearchResults();
        if (results.length) {
            results.forEach(function(el, i) {
                if(el.path !== '//'){
                    // html += '<a href="' + el.path + '?s=' + encodeURIComponent(term)>' + el.title + "</a>";
                    html += `<a href="${el.path}?s=${encodeURIComponent(term)}">${el.title}</a>`;
                }
            });
        } else {
            html = '<div class="msg">No results found. Try a different search.</div>';
        }
        if (msg) {
            html = msg;
        }
        searchResults.innerHTML = html;
    }
    function search(query) {
        var url = "/.netlify/functions/search?search=";
        var xhr = new XMLHttpRequest();
        clearSearchResults();
        searchResults.innerHTML = loaderHtml;
        searchResults.classList.add("active", "searching");
        // Setup our listener to process completed requests
        xhr.onload = function() {
            searchResults.classList.remove("searching");
            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                //request is successful
                showSearchResults(JSON.parse(xhr.response),'',query);
            } else {
                showSearchResults([], '<div class="msg">There was a system problem. Try searching again later.</div>',query);
            }
        };
        xhr.open("POST", url + query);
        xhr.send();
    }
})();
