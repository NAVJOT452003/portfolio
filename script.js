// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('.navbar ul');
    
    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // 2. Scroll Animation Observer (Fade In / Slide Up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
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
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Auto-close mobile menu if open
                if (navUl && navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
});

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
            document.getElementById('success-modal').classList.add('show');
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
    document.getElementById('success-modal').classList.remove('show');
}
