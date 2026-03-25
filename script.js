document.addEventListener("DOMContentLoaded", function () {

    /* ============================= */
    /* ELEMENT REFERENCES */
    /* ============================= */

    const logo = document.getElementById("logo");
    const overlay = document.querySelector(".scroll-overlay");
    const aboutSection = document.getElementById("about");
    const timeline = document.querySelector(".timeline");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section");

    let isAtTop = true;
    let isAnimating = false;
    let isHovering = false;

    /* ============================= */
    /* LOGO ANIMATION FUNCTION */
    /* ============================= */

    function animateLogoChange(newHTML) {
        if (!logo || isAnimating) return;

        isAnimating = true;
        logo.classList.add("fade-out");

        setTimeout(() => {
            logo.innerHTML = newHTML;
            logo.classList.remove("fade-out");
            logo.classList.add("fade-in");

            setTimeout(() => {
                logo.classList.remove("fade-in");
                isAnimating = false;
            }, 300);

        }, 250);
    }

    /* ============================= */
    /* SCROLL BEHAVIOR */
    /* ============================= */

    function handleScroll() {

        if (!aboutSection) return;

        const aboutRect = aboutSection.getBoundingClientRect();

        // When scrolling down past About section midpoint
        if (aboutRect.top <= window.innerHeight / 2 && isAtTop) {

            animateLogoChange("Ayush Patel's Portfolio");
            logo.classList.add("glow");

            if (overlay) overlay.classList.add("active");

            isAtTop = false;
        }

        // When scrolling back to top
        if (aboutRect.top > window.innerHeight / 2 && !isAtTop) {

            animateLogoChange("👋 Hello!");
            logo.classList.remove("glow");

            if (overlay) overlay.classList.remove("active");

            isAtTop = true;
        }

        highlightNav();
        animateTimeline();
    }

    window.addEventListener("scroll", handleScroll);

    /* ============================= */
    /* LOGO CLICK -> SCROLL TO TOP */
    /* ============================= */

    if (logo) {
        logo.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ============================= */
    /* LOGO HOVER INTERACTION */
    /* ============================= */

    if (logo) {
        logo.addEventListener("mouseenter", function () {
            if (isAtTop && !isHovering) {
                isHovering = true;
                logo.classList.add("glow");
                animateLogoChange('Explore My Work <span class="arrow">↓</span>');
            }
        });

        logo.addEventListener("mouseleave", function () {
            if (isAtTop && isHovering) {
                isHovering = false;
                logo.classList.remove("glow");
                animateLogoChange("👋 Hello!");
            }
        });
    }

    /* ============================= */
    /* SMOOTH NAV SCROLL */
    /* ============================= */

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {

            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            const offset = 80;
            const sectionPosition = targetSection.offsetTop - offset;

            window.scrollTo({
                top: sectionPosition,
                behavior: "smooth"
            });
        });
    });

    /* ============================= */
    /* NAV ACTIVE HIGHLIGHT */
    /* ============================= */

    function highlightNav() {

        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }

    /* ============================= */
    /* TIMELINE FILL ANIMATION */
    /* ============================= */

    function animateTimeline() {

        if (!timeline) return;

        const rect = timeline.getBoundingClientRect();

        if (rect.top < window.innerHeight - 100) {
            timeline.classList.add("fill");
        }
    }


    /* ============================= */
/* PROJECT SCROLL REVEAL */
/* ============================= */

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {

    revealElements.forEach((el, index) => {

        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight - 100) {

            // Stagger effect
            setTimeout(() => {
                el.classList.add("show");
            }, index * 150);

        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


/* ============================= */
/* MAGNETIC SKILL BADGES */
/* ============================= */

const skillBadges = document.querySelectorAll(".skill-badge");

skillBadges.forEach(badge => {

    badge.addEventListener("mousemove", (e) => {

        const rect = badge.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / 12;
        const moveY = (y - centerY) / 12;

        badge.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    badge.addEventListener("mouseleave", () => {
        badge.style.transform = "translate(0, 0)";
    });

});




/* ============================= */
/* NETWORK BACKGROUND ANIMATION */
/* ============================= */



/*Game:*/
/* ============================= */
/* SNAKE GAME */
/* ============================= */

const snakeCanvas = document.getElementById("snakeCanvas");
if (snakeCanvas) {
    const sCtx    = snakeCanvas.getContext("2d");
    const CELL    = 21;
    const COLS    = Math.floor(snakeCanvas.width  / CELL);
    const ROWS    = Math.floor(snakeCanvas.height / CELL);

    const scoreEl      = document.getElementById("scoreDisplay");
    const highScoreEl  = document.getElementById("highScoreDisplay");
    const levelEl      = document.getElementById("levelDisplay");
    const overlay      = document.getElementById("gameOverlay");
    const overlayTitle = document.getElementById("overlayTitle");
    const overlayMsg   = document.getElementById("overlayMsg");
    const startBtn     = document.getElementById("startBtn");

    let snake, dir, nextDir, food, bonusFood, score, highScore, level, gameLoop, foodEaten, running;

    highScore = parseInt(localStorage.getItem("snakeHS") || "0");
    highScoreEl.textContent = highScore;

    function rand(max) { return Math.floor(Math.random() * max); }

    function randomCell(exclude = []) {
        let pos;
        do { pos = { x: rand(COLS), y: rand(ROWS) }; }
        while (exclude.some(e => e.x === pos.x && e.y === pos.y));
        return pos;
    }

    function popStat(el) {
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
        setTimeout(() => el.classList.remove("pop"), 300);
    }

    function initGame() {
        snake     = [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }];
        dir       = { x: 1, y: 0 };
        nextDir   = { x: 1, y: 0 };
        food      = randomCell(snake);
        bonusFood = null;
        score     = 0;
        level     = 1;
        foodEaten = 0;
        running   = true;

        scoreEl.textContent = 0;
        levelEl.textContent = 1;
        overlay.classList.add("hidden");

        clearInterval(gameLoop);
        gameLoop = setInterval(tick, getSpeed());
    }

    function getSpeed() { return Math.max(80, 200 - (level - 1) * 18); }

    function tick() {
        dir = { ...nextDir };
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        if (
            head.x < 0 || head.x >= COLS ||
            head.y < 0 || head.y >= ROWS ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) { endGame(); return; }

        snake.unshift(head);

        let ate = false;

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            foodEaten++;
            ate   = true;
            food  = randomCell(snake);

            if (!bonusFood && Math.random() < 0.25) {
                bonusFood = randomCell(snake);
                setTimeout(() => { bonusFood = null; }, 5000);
            }

            if (foodEaten % 5 === 0) {
                level++;
                levelEl.textContent = level;
                popStat(levelEl);
                clearInterval(gameLoop);
                gameLoop = setInterval(tick, getSpeed());
            }

            scoreEl.textContent = score;
            popStat(scoreEl);
        }

        if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
            score += 30;
            bonusFood = null;
            ate = true;
            scoreEl.textContent = score;
            popStat(scoreEl);
        }

        if (!ate) snake.pop();

        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem("snakeHS", highScore);
            popStat(highScoreEl);
        }

        draw();
    }

    function draw() {
        sCtx.fillStyle = "rgba(10,15,28,0.95)";
        sCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        sCtx.strokeStyle = "rgba(0,245,255,0.04)";
        sCtx.lineWidth = 0.5;
        for (let x = 0; x <= COLS; x++) {
            sCtx.beginPath();
            sCtx.moveTo(x * CELL, 0);
            sCtx.lineTo(x * CELL, snakeCanvas.height);
            sCtx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            sCtx.beginPath();
            sCtx.moveTo(0, y * CELL);
            sCtx.lineTo(snakeCanvas.width, y * CELL);
            sCtx.stroke();
        }

        drawGlowCircle(food.x, food.y, "#ff6b6b", "#ff4444");
        if (bonusFood) drawGlowCircle(bonusFood.x, bonusFood.y, "#ffd700", "#ffaa00");

        snake.forEach((seg, i) => {
            const alpha = 1 - (i / snake.length) * 0.6;
            const radius = i === 0 ? 7 : 6;

            sCtx.beginPath();
            sCtx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, radius);
            sCtx.fillStyle = i === 0
                ? `rgba(0,245,255,${alpha})`
                : `rgba(0,191,166,${alpha})`;
            sCtx.fill();

            if (i === 0) {
                sCtx.shadowColor = "rgba(0,245,255,0.8)";
                sCtx.shadowBlur  = 14;
                sCtx.fill();
                sCtx.shadowBlur  = 0;
            }
        });
    }

    function drawGlowCircle(gx, gy, color, glowColor) {
        const cx = gx * CELL + CELL / 2;
        const cy = gy * CELL + CELL / 2;
        sCtx.shadowColor = glowColor;
        sCtx.shadowBlur  = 16;
        sCtx.beginPath();
        sCtx.arc(cx, cy, CELL / 2 - 3, 0, Math.PI * 2);
        sCtx.fillStyle = color;
        sCtx.fill();
        sCtx.shadowBlur = 0;
    }

    function endGame() {
        running = false;
        clearInterval(gameLoop);
        overlayTitle.textContent = "Game Over!";
        overlayMsg.textContent   = `You scored ${score} pts. Try to beat it!`;
        startBtn.textContent     = "Play Again";
        overlay.classList.remove("hidden");
    }

    const DIRS = {
        ArrowUp:    { x: 0, y:-1 }, w: { x: 0, y:-1 }, W: { x: 0, y:-1 },
        ArrowDown:  { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft:  { x:-1, y: 0 }, a: { x:-1, y: 0 }, A: { x:-1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };

    document.addEventListener("keydown", (e) => {
        const d = DIRS[e.key];
        if (!d || !running) return;
        if (d.x === -dir.x && d.y === -dir.y) return;
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
        nextDir = d;
    });

    const mobileMap = {
        mUp: { x:0, y:-1 }, mDown: { x:0, y:1 },
        mLeft: { x:-1, y:0 }, mRight: { x:1, y:0 },
    };
    Object.entries(mobileMap).forEach(([id, d]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => {
            if (!running) return;
            if (d.x === -dir.x && d.y === -dir.y) return;
            nextDir = d;
        });
    });

    startBtn.addEventListener("click", initGame);
    
}

/* ============================= */
/* CONTACT FORM → GMAIL REDIRECT */
/* ============================= */

const contactForm = document.getElementById("contactForm");
const formStatus  = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name    = document.getElementById("contactName").value.trim();
        const email   = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill in all fields.";
            formStatus.className   = "form-status error";
            return;
        }

        const subject = encodeURIComponent("Portfolio Contact from " + name);
        const body    = encodeURIComponent(
            "Hi Ayush,\n\n" +
            "My name is " + name + " and my email is " + email + ".\n\n" +
            message + "\n\n" +
            "Best,\n" + name
        );

        const gmailURL = "https://mail.google.com/mail/?view=cm&to=ayushpatel.dev@outlook.com&su=" + subject + "&body=" + body;

        const submitBtn = contactForm.querySelector(".contact-submit");
        submitBtn.textContent = "Opening Gmail...";
        submitBtn.disabled    = true;

        setTimeout(function() {
            window.open(gmailURL, "_blank");
            formStatus.textContent = "✅ Gmail opened with your message pre-filled!";
            formStatus.className   = "form-status success";
            submitBtn.textContent  = "Send Message ↗";
            submitBtn.disabled     = false;
            contactForm.reset();
        }, 800);

    });
}

/* ============================= */
/* FOOTER */
/* ============================= */

// Auto year
const footerYear = document.getElementById("footerYear");
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// Back to top
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    backToTop.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* About profile card parallax */
const profileCardAbout = document.getElementById("profileCardAbout");

if (profileCardAbout) {
    profileCardAbout.addEventListener("mousemove", function(e) {
        const rect = profileCardAbout.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -(y - rect.height / 2) / 18;
        const rotateY =  (x - rect.width  / 2) / 18;
        profileCardAbout.style.transform =
            "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
    });

    profileCardAbout.addEventListener("mouseleave", function() {
        profileCardAbout.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

/* ============================= */
/* HAMBURGER MENU */
/* ============================= */

const hamburger = document.getElementById("hamburger");
const navLinksMenu = document.getElementById("navLinks");

if (hamburger) {
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("open");
        navLinksMenu.classList.toggle("open");
    });

    // Close menu when a link is clicked
    navLinksMenu.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("click", function() {
            hamburger.classList.remove("open");
            navLinksMenu.classList.remove("open");
        });
    });
}

/* ============================= */
/* ROLE CYCLE TYPEWRITER */
/* ============================= */

const roles = [
    "Software Developer",
    "Frontend Developer",
    "UI/UX Developer",
    "Game Development Enthusiast",
    "Computer Science Student",
    "AI/ML Enthusiast",
    "Video Editor"
];

const roleEl = document.getElementById("roleCycle");

if (roleEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const current = roles[roleIndex];

        if (isDeleting) {
            roleEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            // Pause at end
            speed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeRole, speed);
    }

    typeRole();
}
    /* Initial Run */
    handleScroll();

});