//pseudo links
(function () {
    var pseudoLinks = document.querySelectorAll("[data-href]");
    Array.from(pseudoLinks).forEach(function (link) {
        link.addEventListener("click", function (event) {
            // event.preventDefault();
            if (link.dataset.href) {
                document.location = link.dataset.href;
            }
        });
    });

    var headings = document.querySelectorAll("h3, .ruled");
    Array.from(headings).forEach(function (h) {
        h.classList.add("animated", "show-on-scroll");
    });

    Array.from(document.querySelectorAll("[data-toggle]")).forEach(function (el) {
        el.addEventListener("click", function (event) {
            event.preventDefault();
            var target = document.querySelector(el.dataset.toggle);
            var cssClass = el.dataset.toggleClass || "active";
            target.classList.toggle(cssClass);
            el.classList.toggle(cssClass);
        });
    });
    //responsive article tables
    Array.from(document.querySelectorAll("article table")).forEach(function (el) {
        // create wrapper container
        var wrapper = document.createElement('div');
        wrapper.classList.add('responsive-table');

        // insert wrapper before el in the DOM tree
        el.parentNode.insertBefore(wrapper, el);

        // move el into wrapper
        wrapper.appendChild(el);
    });

    //industrial lead source
    var ils = new IndustrialLeadSource(document);
    var promoDiv = document.getElementById("promo");
    if (promoDiv) {
        var label = promoDiv.dataset.label;
        var campaign_id = promoDiv.dataset.campaignId;


        document.addEventListener("DOMContentLoaded", function () {
            //get promo cookie - promo cookie only exists if it has been manually dismissed
            var promoDismissed = ils.getCookie('p.dismissed.' + campaign_id);
            var helloBarDismissed = ils.getCookie('p.hellobar.' + campaign_id);
            if (promoDismissed !== "true") {
                addPromo();
            }

            if (helloBarDismissed !== "true") {
                // addHelloBar();  uncomment to show hello bar
            }
        });
    }

    window.addEventListener("load", function () {
        var animatedSvgs = Array.from(document.querySelectorAll("[data-animate-svg]"));
        if (animatedSvgs && animatedSvgs.length) {
            animatedSvgs.forEach(function (item) {
                var id = item.dataset.animateSvg;
                document.getElementById(id).style.visibility = 'hidden';
                new Vivus(id, {
                    duration: 100,
                    onReady: function (myVivus) {
                        myVivus.parentEl.style.visibility = 'inherit';
                    }
                });
            });
        }
    });

    function addHelloBar() {
        // return
        if (document.location.href.indexOf('fabtech') !== -1 || document.location.href.indexOf('whitepapers') !== -1) {
            return;
        }
        var label = 'Fabtech 2019';
        var d = document.createElement('div');
        var container = document.querySelector('body');
        d.classList.add('hello-bar');
        d.id = 'hello-bar';
        d.innerHTML = 'Visit Us at Space Tech Expo 2022 in Long Beach, California | Booth #6043 <a href="/aerodef-2020?utm_source=website&utm_medium=hello_bar&utm_campaign=aerodef-2020&utm_content=landing-page-CTA" id="fab-tech-btn" class="btn btn-outline light">more</a><button id="hello-bar-close"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g stroke="#FFF" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M1.905 1.952l14.142 14.143M16.095 1.952L1.953 16.095"/></g></svg></button>';

        container.insertBefore(d, document.getElementById('header'));
        container.classList.add('hello-bar-active');

        document.getElementById('fab-tech-btn').addEventListener("click", function (e) {
            window.dataLayer.push({'event': 'gaEvent', 'category': 'HelloBar', 'action': 'Dismiss', 'label': label});
        });

        document.getElementById('hello-bar-close').addEventListener("click", function (e) {
            d.parentNode.removeChild(d);
            container.classList.remove('hello-bar-active');
            window.dataLayer.push({'event': 'gaEvent', 'category': 'HelloBar', 'action': 'Dismiss', 'label': label});
            ils.setCookie('p.hellobar.' + campaign_id, 'true', 60);
        });
        window.dataLayer.push({'event': 'gaEvent', 'category': 'HelloBar', 'action': 'Reveal', 'label': label});
    }

    // promo popup
    function addPromo(params) {
        if (window.indNoPromo) {
            return;
        }
        setTimeout(function () {
            promoDiv.classList.add("active");
            window.dataLayer.push({'event': 'gaEvent', 'category': 'Modal', 'action': 'Reveal', 'label': label});
        }, 500);

        document.getElementById('modal-dismiss').addEventListener("click", function (e) {
            promoDiv.parentNode.removeChild(promoDiv);
            window.dataLayer.push({'event': 'gaEvent', 'category': 'Modal', 'action': 'Dismiss', 'label': label});
            ils.setCookie('p.dismissed.' + campaign_id, 'true', 1440 * 30 * 2);
        });

        var promoButton = document.getElementById('promo-buddon');
        promoButton.addEventListener('click', function () {
            ils.setCookie('p.dismissed.' + campaign_id, 'true', 1440 * 30 * 2);
            window.dataLayer.push({'event': 'gaEvent', 'category': 'Button', 'action': 'Click', 'label': label + ' - ' + promoButton.innerText});
        })
    }


    if (isTouchEnabled()) {
        document.body.classList.add('touch-enabled');
    }

})();

function getGAClientId() {
    let foundClientID = '';
    try {
        var cookie = {};
        document.cookie.split(';').forEach(function (el) {
            var splitCookie = el.split('=');
            var key = splitCookie[0].trim();
            var value = splitCookie[1];
            cookie[key] = value;
        });
        foundClientID = cookie["_ga"].substring(6);
    } catch (e) {
        console.warn("no ga cookie found");
    }


    if (foundClientID) {
        return foundClientID
    } else {
        const d = new Date();
        return crypto.randomUUID() + '.' + (Math.round(d.getTime() / 1000));
    }

}

function isTouchEnabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}
