let glide = null;

// function typeWriter(el, copy = "", time = 95) {
//     if (!copy) {
//         copy = el.innerHTML;
//     }
//     const textArray = copy.split('');
//     el.innerHTML = '';
//     textArray.forEach((letter, i) => setTimeout(() => (el.innerHTML += letter), time * i));
// }

// const heroHeadline = document.querySelector('.jumbotron-headline');
// typeWriter(heroHeadline, null, 40);
// document.addEventListener('DOMContentLoaded', e => {});



const span = (text, index) => {
    const node = document.createElement('span')

    node.textContent = text
    node.style.setProperty('--index', index)

    return node
}

const byLetter = text =>
    [...text].map(span)

    const splitTargets = document.querySelectorAll('.jumbotron-headline')

    splitTargets.forEach(node => {
        let nodes = byLetter(node.innerText)

        if (nodes)
            node.firstChild.replaceWith(...nodes)
    })

document.querySelectorAll('[data-replay-btn]').forEach(el => {
    el.addEventListener('ended', (event) => {
        console.log('ended', event);

        if (el.parentElement.querySelector('.replay-btn')) {
            el.parentElement.querySelector('.replay-btn').classList.add('active');

        }
    });
});


// animate a number counting up
function counter(selector) {

    const el = document.querySelector(selector);

    const updateCount = () => {
        const target = el.dataset.target;
        const count = +el.innerText;
        const increment = parseInt(el.dataset.increment, 10) || 1;
        const speed = parseInt(el.dataset.speed, 10) || 50; // 1000 millisecond => 1 second;

        if (count < target) {
            el.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, speed);
        } else {
            el.innerText = target;
        }
    };
    updateCount();
}

// function triggered by onview.js viewport observing
startPercent = function () {
    counter('.number span');
}

startBottomPercent = function () {
    counter('#bottom-percent');
}
startCarousel = function () {
    glide.play(3000);
}

//carousell
glide = new Glide('.glide', {
    type: "carousel",
    focusAt: "center",
    startAt: 3,
    perView: 3, // autoplay: 2600,
    // gap:90
    breakpoints:{
        768:{
            perView: 1
        }
    }


}).mount();


//filter component
const hoverBlocks = document.querySelectorAll('.filter-component div');
hoverBlocks.forEach(el => {
    el.addEventListener('mouseover', hoverBlockOver);
    el.addEventListener('mouseout', removeHovers);
});

function removeHovers() {
    hoverBlocks.forEach(el => {
        el.classList.remove('active');
    });
}

function hoverBlockOver(event) {
    removeHovers();
    event.currentTarget.classList.add('active');
}
