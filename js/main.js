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

function initSectionAnimations() {
    document.querySelectorAll('.project-card, .experience-card, .skill-group, .stat-card, .skills-category').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

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
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            event.preventDefault();
            showToast('Veuillez remplir tous les champs.', 'error');
            return;
        }

        // Validation email basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            event.preventDefault();
            showToast('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        showToast('Envoi en cours...', 'info');
        // Le formulaire sera soumis normalement à Web3Forms
    });
}

const projectsData = [
    {
        title: 'BiblioTech — Gestion de bibliothèque',
        subtitle: 'Laravel · PHP · SQLite',
        shortDescription: 'Application web de gestion de bibliothèque avec emprunts, réservations et dashboard admin.',
        fullDescription: 'Application web de gestion de bibliothèque (livres, emprunts, réservations) développée avec Laravel en architecture MVC. Ce projet permet de maîtriser le framework Laravel tout en ajoutant des fonctionnalités avancées pour rendre l’application complète et réaliste.',
        features: [
            'Gestion des livres',
            'Emprunts / retours',
            'Réservations',
            'Comptes avec rôles',
            'Avis et notes',
            'Dashboard admin',
            'Notifications email'
        ],
        technologies: ['Laravel', 'PHP', 'SQLite', 'Blade', 'Bootstrap'],
        skills: ['MVC', 'base de données', 'backend', 'sécurité'],
        image: 'https://via.placeholder.com/900x600.png?text=BiblioTech',
        link: ''
    },
    {
        title: 'AI Mood Tracker',
        subtitle: 'HTML · CSS · JavaScript · API · Supabase',
        shortDescription: 'Application interactive pour évaluer et exprimer son humeur avec stockage en ligne.',
        fullDescription: 'Application web permettant aux utilisateurs d’évaluer et d’exprimer leur humeur à travers une interface simple et interactive basée sur l’intelligence artificielle. Les utilisateurs peuvent sélectionner leur état émotionnel et ajouter un commentaire.',
        features: [
            'Sélection de l’humeur (emoji / état émotionnel)',
            'Ajout de commentaires personnels',
            'Interface interactive',
            'Stockage des données en base',
            'Site accessible en ligne'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Supabase', 'API REST', 'GitHub', 'Netlify/Vercel'],
        skills: ['Frontend', 'API', 'base de données', 'déploiement', 'projet full-stack'],
        image: 'https://via.placeholder.com/900x600.png?text=AI+Mood+Tracker',
        link: 'https://emoji-ai-mood.lovable.app'
    },
    {
        title: 'Boussou Fragrances — Site e-commerce',
        subtitle: 'HTML · CSS · JavaScript · PHP',
        shortDescription: 'Site web de vente en ligne de parfums avec panier et commandes.',
        fullDescription: 'Site web de vente en ligne de parfums avec toutes les fonctionnalités essentielles d’une boutique e-commerce. Ce projet représente mon premier projet concret orienté professionnel et permet de comprendre le parcours complet d’un site de vente en ligne.',
        features: [
            'Catalogue de produits (parfums)',
            'Page produit détaillée',
            'Panier d’achat',
            'Système de commande',
            'Interface utilisateur simple et fluide'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP'],
        skills: ['Création de site e-commerce', 'gestion de produits', 'logique backend', 'interface utilisateur'],
        image: 'https://via.placeholder.com/900x600.png?text=Boussou+Fragrances',
        link: ''
    },
    {
        title: 'Assistant Météo Intelligent',
        subtitle: 'Python · API REST · Mistral AI · OpenWeatherMap',
        shortDescription: 'Assistant météo intelligent utilisant une IA et une API externe pour afficher des données en temps réel.',
        fullDescription: 'Développement d’un assistant intelligent capable de fournir la météo en temps réel grâce à l’interaction entre une intelligence artificielle (LLM) et une API externe. Ce projet montre la connexion d’une IA à des données réelles et une application dynamique.',
        features: [
            'Recherche météo en temps réel par ville',
            'Réponses générées par une IA (Mistral AI)',
            'Interface simple de requête utilisateur',
            'Affichage des données météo (température, conditions, etc.)'
        ],
        technologies: ['Python', 'API Mistral AI', 'OpenWeatherMap', 'variables d’environnement (.env)', 'API REST'],
        skills: ['Intégration d’API', 'intelligence artificielle', 'gestion de données en temps réel', 'sécurité des clés API', 'bonnes pratiques RGPD'],
        image: 'https://via.placeholder.com/900x600.png?text=Assistant+M%C3%A9t%C3%A9o+Intelligent',
        link: ''
    }
];

function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projectsData.map((project, index) => {
        const techTags = project.technologies.slice(0, 4).map(tech => `<span>${tech}</span>`).join('');

        return `
            <div class="project-card" data-project-index="${index}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <span>Voir les détails</span>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-subtitle">${project.subtitle}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.shortDescription}</p>
                    <div class="project-tech">${techTags}</div>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const project = projectsData[parseInt(this.dataset.projectIndex, 10)];
            openProjectModal(project);
        });
    });

    initSectionAnimations();
}

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalSubtitle').textContent = project.subtitle;
    document.getElementById('modalDescription').textContent = project.fullDescription;
    document.getElementById('modalFeatures').innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
    document.getElementById('modalTechnologies').innerHTML = project.technologies.map(tech => `<span>${tech}</span>`).join('');
    document.getElementById('modalSkills').innerHTML = project.skills.map(skill => `<span>${skill}</span>`).join('');

    const linkButton = document.getElementById('modalLink');
    if (project.link) {
        linkButton.href = project.link;
        linkButton.style.display = 'inline-flex';
    } else {
        linkButton.style.display = 'none';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeButton = document.getElementById('projectModalClose');

    if (!modal || !closeButton) return;

    closeButton.addEventListener('click', closeProjectModal);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProjectModal();
        }
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
    renderProjects();
    initProjectModal();
    updateOngoingExperiences();
    setInterval(updateOngoingExperiences, 3600000);
});

    
