(function () {
    const numParticles = 500;
    const particleCount = {
        stage1: {count: 100, size: 4, stage: 1, color: "213, 213, 213"},
        stage2: {count: 85, size: 3, stage: 2, color: "168, 184, 205"},
        stage3: {count: 70, size: 3, stage: 3, color: "123, 159, 210"},
        stage4: {count: 50, size: 2, stage: 4, color: "84, 120, 156"},
        stage5: {count: 50, size: 2, stage: 5, color: "103, 75, 123"},
        stage6: {count: 40, size: 1, stage: 6, color: "49, 88, 120"},
    }

    const maxSize = 10;

    let canvasContainer,
        canvas,
        canvasLine,
        ctx,
        width,
        height,
        middle,
        stages = [],
        particles = []
    ;

    let active = false;

    function init() {
        canvas = document.getElementById("canvas");
        canvasContainer = document.getElementById("canvas-container");
        canvasLine = document.getElementById("canvas-line");
        ctx = canvas.getContext("2d");

        window.addEventListener("resize", handleResize);
        handleResize();
        addParticles();
        start();
    }


    function handleResize(e) {
        width = canvas.width = canvasContainer.clientWidth;
        height = canvas.height = canvasContainer.clientHeight;
        // middle = height * .5;
        middle = canvasLine.offsetTop;
        getStages();
    }

    function getStages() {

        const els = document.querySelectorAll('.stage-1, .stage-2, .stage-3, .stage-4, .stage-5, .stage-6');
        els.forEach(el => {
            stages.push(el.offsetTop);
        });
        // console.log(stages);
    }

    function addParticles() {
        for (const s in particleCount) {
            const stage = particleCount[s];
            for (let i = 1; i <= stage.count; i++) {
                particles.push(
                    new Particle({
                        startX: Math.random() * width,
                        startY: Math.random() * height - (height / 3),
                        size: stage.size + randomNumber(0, 2),
                        vy: randomNumber(0.8, 4),
                        vx: 0,
                        id: i,
                        opacity: randomNumber(.5, .9),
                        filterStage: stage.stage,
                        color: stage.color,
                    })
                );
            }
        }

    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (active) {
            particles.forEach(function (p) {
                p.draw();
            });

            //stage lines
            // stages.forEach(s => {
            //     ctx.strokeStyle = 'orange';
            //     ctx.beginPath();
            //     ctx.moveTo(0, s);
            //     ctx.lineTo(width, s);
            //     ctx.stroke();
            // })

            //top gradient
            const gradientHeight = height * .08;
            let gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(.5, '#ffffff00');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, gradientHeight);

            window.requestAnimationFrame(render);
        }
    }

    function start() {
        if (!active) {
            active = true;
            window.requestAnimationFrame(render);
        }
    }

    function stop() {
        active = false;
    }

    /**
     *  Particle 'class'
     * @param {object} config object
     */
    function Particle(config) {
        this.x = config.startX;
        this.y = config.startY;
        this.opacity = config.opacity || 1;
        this.vy = config.vy;
        this.vx = config.vx;
        this.id = null;
        this.filterStage = config.filterStage;
        this.filtered = null;
        this.size = config.size;
        this.color = config.color || "155,155,155";
    }

    Particle.prototype.reset = function () {
        this.y = -this.size;
        this.x = Math.random() * width;
        this.opacity = randomNumber(.5, .9);
        this.filtered = null;
    }

    /**
     * Draw particle
     */
    Particle.prototype.draw = function () {

        this.vx = clamp(this.vx + randomNumber(-0.1, 0.1), -0.3, 0.3);
        this.y += this.vy;
        this.x += this.vx;


        //reset at top
        if (this.y > height + this.size || this.opacity <= 0) {
            this.reset();
        }
        if (this.x < -this.size) {
            this.x = width //+ this.size;
        }
        if (this.x > width + this.size) {
            this.x = width - this.size;
        }

        if (this.filtered == 'yes') {
            this.opacity -= .07;
        }

        stages.forEach((s, index) => {

            if (this.filtered !== 'yes' && (this.filterStage === index + 1 && this.y > s)) {
                this.filtered = 'yes';
            }
        })
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 3);
        ctx.fill();
        ctx.closePath();
    };


    function clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }

    function randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    window.particlesStart = start;
    document.addEventListener("DOMContentLoaded", init);
})();