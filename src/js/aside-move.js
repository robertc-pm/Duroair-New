$(document).ready(function(){
    var $section = $(".section.blog-section");
    var $aside = $("aside");
    var $firstChild = $section.children().first(); // Get the first child

    if ($firstChild.length) {
        $aside.insertAfter($firstChild); // Move <aside> to be the second child
    }
});
