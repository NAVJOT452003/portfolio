// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('.navbar ul');
    
    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.addEventListener('click', () => {
            const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !expanded);
            navUl.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Close menu when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (navUl && navUl.classList.contains('active') && mobileMenuBtn) {
            if (!navUl.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navUl.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // 2. Scroll Animation Observer (Fade In / Slide Up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // 3. Smooth Scrolling for Internal Anchor Links
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href*="index.html#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const hash = href.includes('#') ? href.substring(href.indexOf('#')) : null;
            
            if (hash && hash !== '#') {
                // If it is on the same page, do smooth scroll
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Auto-close mobile menu if open
                    if (navUl && navUl.classList.contains('active')) {
                        navUl.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // Handle initial load hash scroll
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    // 4. Custom Interactive Canvas Particle Network Background
    initParticles();
});

// Particles System
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;

    // Mouse interactive coordinates
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas to match screen dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call

    // Particle constructor
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update positions & check mouse distance
        update() {
            // Screen edge check
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw it
            this.draw();
        }
    }

    // Populate particles array
    function init() {
        particlesArray = [];
        // Calculate dynamic count based on window size
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 0.5;
            const x = Math.random() * (canvas.width - size * 2) + size;
            const y = Math.random() * (canvas.height - size * 2) + size;
            
            // Random direction values between -0.4 and 0.4
            const directionX = (Math.random() * 0.8) - 0.4;
            const directionY = (Math.random() * 0.8) - 0.4;
            
            // Soft glowing color (blend of primary rose and secondary cyan)
            const color = Math.random() > 0.5 ? 'rgba(255, 51, 102, 0.15)' : 'rgba(0, 242, 254, 0.15)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Interactive mouse connection
            if (mouse.x !== null && mouse.y !== null) {
                const dxMouse = particlesArray[a].x - mouse.x;
                const dyMouse = particlesArray[a].y - mouse.y;
                const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distanceMouse < mouse.radius) {
                    const mouseOpacity = 1 - (distanceMouse / mouse.radius);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${mouseOpacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// Background Email Form Submission Logic
async function sendEmail(event, type) {
    event.preventDefault(); // Stop page from refreshing
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    let name, email, message, subject = '';
    
    if (type === 'hire') {
        name = document.getElementById('name').value;
        email = document.getElementById('email').value;
        message = document.getElementById('message').value;
        subject = "New Project Hire Request";
    } else if (type === 'contact') {
        name = document.getElementById('contact-name').value;
        email = document.getElementById('contact-email').value;
        subject = document.getElementById('contact-subject').value;
        message = document.getElementById('contact-message').value;
    }

    try {
        const response = await fetch('https://formsubmit.co/ajax/navjotr220@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message,
                _captcha: "false" // Avoids captcha page
            })
        });

        if (response.status === 200) {
            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
            }
            event.target.reset(); // Clear form
        } else {
            alert("Error sending message. Please try again later.");
        }
    } catch(error) {
        alert("Network error. Please try again.");
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}
