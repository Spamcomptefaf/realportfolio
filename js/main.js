/* =====================================
   PORTFOLIO - SCRIPTS PRINCIPAUX
   ===================================== */

// ==================== DARK MODE ==================== 

function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon(true);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeToggleIcon(isDarkMode);
}

function updateThemeToggleIcon(isDarkMode) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ==================== TOAST NOTIFICATIONS ==================== 

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('remove');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== SCROLL TO TOP ==================== 

function initScrollToTop() {
    const button = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== DYNAMIC DURATION COUNTER ==================== 

function calculateDuration(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    let result = '';
    
    if (years > 0) {
        result += years + ' an' + (years > 1 ? 's' : '');
    }
    
    if (months > 0) {
        if (result) result += ' ';
        result += months + ' mois';
    }
    
    return result || '0 mois';
}

function updateOngoingExperiences() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        const companyEl = card.querySelector('.exp-company');
        const expTypeElement = card.querySelector('.exp-type');
        if (!companyEl || !expTypeElement) return;

        const company = companyEl.dataset.company || companyEl.textContent;

        if (company && company.includes("Burger'S")) {
            const burgersDuration = calculateDuration('2025-08-01');
            expTypeElement.textContent = 'en cours (' + burgersDuration + ')';
        } else if (company && company.includes('APR SECURITY')) {
            const aprDuration = calculateDuration('2024-12-01');
            expTypeElement.textContent = 'en cours (' + aprDuration + ')';
        }
    });
}

// ==================== NAVIGATION & SCROLL ==================== 

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
    });
});

// ==================== SMOOTH SCROLL ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== INTERSECTION OBSERVER ANIMATIONS ==================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .experience-card, .skill-group, .stat-card, .skills-category').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ==================== STAT COUNTERS ==================== 

function animateCounter(element, target, duration = 2000) {
    const startValue = 0;
    const increment = target / (duration / 16);
    let currentValue = startValue;

    const updateCounter = () => {
        currentValue += increment;
        if (currentValue < target) {
            element.textContent = Math.floor(currentValue) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card h3').forEach(element => {
    statsObserver.observe(element);
});

// ==================== CONTACT FORM ====================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showToast('Veuillez remplir tous les champs.', 'error');
            return;
        }

        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === 'true' || data.success === true) {
                showToast('Message envoyé avec succès !', 'success');
                contactForm.reset();
            } else {
                showToast('Erreur lors de l’envoi. Réessayez.', 'error');
            }
        })
        .catch(() => {
            showToast('Impossible d’envoyer le message. Vérifiez votre connexion.', 'error');
        });
    });
}

// ==================== PARALLAX EFFECT ==================== 

window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY;

    document.querySelectorAll('.project-image img').forEach(img => {
        img.style.transform = `translateY(${scrollPos * 0.1}px)`;
    });
});

// ==================== PROGRESS BARS ==================== 

const progressObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease';
                    bar.style.width = width;
                }, 100);
            });
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skills-category').forEach(element => {
    progressObserver.observe(element);
});

// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialisé avec succès!');
    initDarkMode();
    initScrollToTop();
    initContactForm();
    updateOngoingExperiences();
    setInterval(updateOngoingExperiences, 3600000);
});

    
