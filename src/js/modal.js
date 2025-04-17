document.addEventListener("DOMContentLoaded", function() {
    //vid modals
    Array.from(document.querySelectorAll("[data-vid]")).forEach(function(el) {
        el.addEventListener("click", function(event) {
            event.preventDefault();
            var vid = el.dataset.vid,
                modalHtml,
                embed,
                modal;

            modal = document.getElementById('modal') || document.createElement("div");
            modal.classList.add('modal');
            modal.id = 'modal';
            embed = '<div class="video-embed"><iframe width="560" height="315" src="//www.youtube.com/embed/' + vid + '?autoplay=1&modestbranding=1&rel=0&enablejsapi=1" frameborder="0" allowfullscreen></iframe></div>';
            modalHtml = '<div class="overlay" onclick="removeModal();"></div><div class="modal-content">' + embed + '<button title="Close" class="close-modal" onclick="removeModal();"></button></div>';
            modal.innerHTML = modalHtml;
            document.body.appendChild(modal);
        });
    });
});

function removeModal(){
    var modal = document.getElementById('modal');
    modal.parentNode.removeChild(modal);
}
