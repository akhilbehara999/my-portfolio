// --- Theme Toggler ---
function setupThemeToggler() {
    const toggleCheckbox = document.getElementById('theme-toggle');
    if (!toggleCheckbox) return;

    // Initialize the checkbox checked state based on current document theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    toggleCheckbox.checked = (currentTheme === 'dark');

    toggleCheckbox.addEventListener('change', () => {
        const newTheme = toggleCheckbox.checked ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// --- Typing Effect ---
class TypeWriter {
    constructor(elementId, words, wait = 3000) {
        this.txtElement = document.getElementById(elementId);
        if (!this.txtElement) return;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert text into element
        this.txtElement.textContent = this.txt;

        // Initial Type Speed
        let typeSpeed = 80;

        if (this.isDeleting) {
            typeSpeed /= 2.5; // Erase faster
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before typing next word
            typeSpeed = 400;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// --- Mobile Navigation Menu ---
function setupMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// --- Intersection Observer for Scroll Reveals & Progress Bars ---
function setupScrollObserver() {
    const revealElements = document.querySelectorAll('.show-reveal');
    
    // Observer options
    const options = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // offset slightly
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skills container, animate the progress bars
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const targetPct = bar.getAttribute('data-pct');
                        bar.style.width = targetPct;
                    });
                }
                
                // Unobserve after animating in (keep clean DOM)
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Save globally so portfolio script can reuse it for dynamic items
    window.portfolioObserver = observer;

    revealElements.forEach(el => observer.observe(el));
}

// --- Active Nav Link Highlight on Scroll ---
function setupActiveNavLinkSync() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.bottom-nav-dock .nav-link, .nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            // Highlight link when user scrolls past 35% of the section top
            if (window.scrollY >= (secTop - 180)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// --- Toast Notifications Systems ---
class ToastNotification {
    constructor() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
            this.container = container;
        }
    }

    show(message, type = 'success', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Dynamic icons based on type
        const iconSvg = type === 'success' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-teal);"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-pink);"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

        toast.innerHTML = `
            ${iconSvg}
            <span class="toast-message" style="font-weight: 500; font-size: 0.9rem;">${message}</span>
        `;

        this.container.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('show'), 50);

        // Slide out and destroy
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for transition
        }, duration);
    }
}

// --- Contact Form Submission & Mocking ---
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const toaster = new ToastNotification();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Fetch inputs
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('form-submit-btn');

        // Simple validation check
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            toaster.show('Please fill in all fields.', 'error');
            return;
        }

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            toaster.show('Please enter a valid email address.', 'error');
            return;
        }

        // Mock Loading State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = `<span>Sending...</span>`;

        // Simulate AJAX request
        setTimeout(() => {
            // Show Success Notification
            toaster.show(`Thank you, ${nameInput.value}! Your message has been sent successfully (mocked).`, 'success');
            
            // Reset fields
            form.reset();
            
            // Restore button state
            submitBtn.removeAttribute('disabled');
            submitBtn.innerHTML = originalBtnText;
        }, 1500);
    });
}

// --- Footer Current Year ---
function setFooterYear() {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

// --- Preloader Timeout ---
function setupPreloader() {
    const loader = document.getElementById('loader-wrapper');
    const heroSection = document.querySelector('.hero-minimal');
    
    if (!loader) {
        if (heroSection) {
            heroSection.classList.add('start-animations');
        }
        return;
    }
    
    // Lock scrolling on page load
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.style.overflow = ''; // Unlock scrolling
        
        // Trigger the hero load animations as loading fades
        if (heroSection) {
            heroSection.classList.add('start-animations');
        }
        
        setTimeout(() => {
            loader.remove();
        }, 600); // Wait for transition
    }, 2000); // 2 seconds
}

// --- Mobile Click to Reveal Toolbox Cards ---
function setupToolboxCardsClick() {
  const mainContainers = document.querySelectorAll('.toolbox-card-wrapper .main');
  if (mainContainers.length === 0) return;

  mainContainers.forEach(main => {
    main.addEventListener('click', (e) => {
      const isActive = main.classList.contains('active');
      mainContainers.forEach(m => m.classList.remove('active'));
      if (!isActive) {
        main.classList.add('active');
      }
      e.stopPropagation();
    });

    main.addEventListener('touchstart', (e) => {
      const isActive = main.classList.contains('active');
      mainContainers.forEach(m => m.classList.remove('active'));
      if (!isActive) {
        main.classList.add('active');
      }
      e.stopPropagation();
    }, { passive: true });
  });

  document.addEventListener('click', (e) => {
    const inside = e.target.closest('.toolbox-card-wrapper .main');
    const projectBook = e.target.closest('.project-book');
    if (!inside && !projectBook && mainContainers.length > 0) {
      mainContainers.forEach(m => m.classList.remove('active'));
    }
  });
}

// --- Skill Name Display on Hover ---
function setupSkillNameDisplayHover() {
    const wrappers = document.querySelectorAll('.toolbox-card-wrapper');
    wrappers.forEach(wrapper => {
        const skillNameDisplay = wrapper.querySelector('.social-skill-name');
        const cards = wrapper.querySelectorAll('.card');
        
        if (!skillNameDisplay) return;
        
        cards.forEach(card => {
            const skillName = card.getAttribute('data-skill');
            if (!skillName) return;
            
            card.addEventListener('mouseenter', () => {
                skillNameDisplay.textContent = skillName;
                skillNameDisplay.classList.add('active');
            });
            
            card.addEventListener('mouseleave', () => {
                skillNameDisplay.classList.remove('active');
            });
            
            // Touch support for mobile
            card.addEventListener('touchstart', (e) => {
                skillNameDisplay.textContent = skillName;
                skillNameDisplay.classList.add('active');
                e.stopPropagation();
            });
        });
    });
}


// --- Mobile Click to Reveal Certificate Details ---
function setupMobileCertificatesClick() {
    const certCards = document.querySelectorAll('.cert-hover-card');
    if (certCards.length === 0) return;

    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if clicking the verify link (let the link be clickable)
            if (e.target.closest('.cert-verify-link')) return;

            // Toggle active class on the clicked card
            const isActive = card.classList.contains('active');
            
            // Close all cards first
            certCards.forEach(otherCard => {
                otherCard.classList.remove('active');
            });

            // Toggle target card state
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // Close active cards when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cert-hover-card')) {
            certCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
}


// --- Mobile Tap/Click Handler to Expand Witcher Cards ---
function setupMobileWitcherMarqueeClick() {
    const cards = document.querySelectorAll('.witcher-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const isActive = card.classList.contains('active');
            cards.forEach(c => c.classList.remove('active'));
            if (!isActive) {
                card.classList.add('active');
            }
            e.stopPropagation();
        });
    });
}

// --- Draggable Education & Milestones Marquee ---
function setupWitcherDraggableMarquee() {
    const viewport = document.querySelector('.witcher-marquee-viewport');
    const track = document.querySelector('.witcher-marquee-track');
    if (!viewport || !track) return;

    const ARROW_STEP_CARD = 4;
    const AUTO_RESUME_DELAY = 1200;

    let pointerDown = false;
    let startPointerX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;
    let velocity = 0;
    let prevPointerX = 0;
    let prevTime = 0;
    let arrowShiftRemain = 0;
    let autoPaused = false;
    let autoResumeTimer = null;

    const cards = () => Array.from(track.children).filter(el => el.classList.contains('witcher-card'));
    const cardWidth = () => {
        const c = cards();
        if (!c.length) return 0;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;
        return c[0].getBoundingClientRect().width + gap;
    };

    const setTranslate = (value, className) => {
        currentTranslate = value;
        track.style.transform = `translate3d(${value.toFixed(2)}px, 0, 0)`;
        if (className) track.classList.add(className);
    };

    const clearTransformClass = (className) => track.classList.remove(className);
    const pauseAuto = () => {
        track.classList.add('paused');
        autoPaused = true;
    };
    const resumeAutoSoon = () => {
        clearTimeout(autoResumeTimer);
        autoResumeTimer = setTimeout(() => {
            if (!pointerDown) {
                clearTransformClass('paused');
                autoPaused = false;
                arrowShiftRemain = 0;
            }
        }, AUTO_RESUME_DELAY);
    };

    const clampAndWrap = (value) => {
        const single = cardWidth() * cards().length;
        if (!single) return value;
        let v = value % single;
        if (v > 0) v -= single;
        if (v < -single) v += single;
        return v;
    };

    // Pointer drag
    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.witcher-nav')) return;
        pointerDown = true;
        viewport.setPointerCapture(e.pointerId);
        startPointerX = e.clientX;
        prevPointerX = e.clientX;
        prevTime = Date.now();
        startTranslate = currentTranslate;
        velocity = 0;
        track.classList.add('dragging');
        pauseAuto();
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!pointerDown) return;
        const dx = e.clientX - startPointerX;
        const now = Date.now();
        const dt = now - prevTime;
        if (dt > 0) velocity = (e.clientX - prevPointerX) / dt;
        prevPointerX = e.clientX;
        prevTime = now;
        setTranslate(startTranslate + dx);
    });

    const endDrag = () => {
        if (!pointerDown) return;
        pointerDown = false;
        track.classList.remove('dragging');

        let settle = currentTranslate - velocity * 120;
        settle = clampAndWrap(settle);
        setTranslate(settle, 'arrow-shift');
        setTimeout(() => clearTransformClass('arrow-shift'), 360);
        resumeAutoSoon();
    };

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // Arrow buttons
    viewport.querySelectorAll('.witcher-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            pauseAuto();
            arrowShiftRemain += btn.classList.contains('witcher-nav-right') ? -1 : 1;
            const step = (btn.classList.contains('witcher-nav-right') ? -1 : 1) * cardWidth() * (ARROW_STEP_CARD || 4);
            let target = currentTranslate + step;
            target = clampAndWrap(target);
            setTranslate(target, 'arrow-shift');
            setTimeout(() => clearTransformClass('arrow-shift'), 360);
            resumeAutoSoon();
        });
    });

    // Keep seamless loop as track translates continuously
    let last = performance.now();
    let autoOffset = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reducedMotion ? 18 : 35;

    const tick = (time) => {
        const dt = Math.min(time - last, 250);
        last = time;
        if (!autoPaused && !pointerDown) {
            if (!reducedMotion) {
                autoOffset -= (speed * dt) / 1000;
                if (arrowShiftRemain) {
                    autoOffset += arrowShiftRemain * (speed * dt) / 1000 * 2;
                    if (Math.abs(autoOffset) >= cardWidth()) {
                        const delta = autoOffset > 0 ? -1 : 1;
                        arrowShiftRemain += delta;
                        autoOffset += delta * cardWidth();
                    }
                }
                setTranslate(clampAndWrap(autoOffset));
            }
        } else if (autoPaused && !pointerDown && !arrowShiftRemain && reducedMotion) {
            // no-op for reduced motion while paused
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Recalculate on resize
    window.addEventListener('resize', () => {
        autoOffset = clampAndWrap(autoOffset);
        currentTranslate = autoOffset;
        track.style.transform = `translate3d(${currentTranslate.toFixed(2)}px, 0, 0)`;
    });

    // Ensure transform is under JS control from first frame.
    if ('transform' in track.style) {
        track.style.transform = 'translate3d(0px, 0, 0)';
    }
}

// --- Projects Section Popup ---
function setupProjectsPopup() {
    const panel = document.querySelector('.project-popup-panel');
    if (!panel) return;

    const openPanel = () => {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
    };

    const closePanel = () => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
    };

    document.addEventListener('click', (e) => {
        const insideProjects = e.target.closest('#projects');
        if (!insideProjects) {
            closePanel();
        }
    });
}

// --- About My Journey Focus Popup ---
function setupAboutBranchToggle() {
    const tooltipContainer = document.querySelector('.tooltip-container');
    const aboutTrigger = document.querySelector('.about-trigger');
    const aboutPopup = document.querySelector('.about-popup');
    if (!aboutTrigger || !aboutPopup) return;

    const openMobile = () => {
        if (window.innerWidth <= 1024 && !aboutPopup.classList.contains('visible')) {
            aboutPopup.classList.add('visible');
            aboutPopup.setAttribute('aria-hidden', 'false');
        }
    };

    const closeAll = () => {
        aboutPopup.classList.remove('visible');
        if (tooltipContainer) tooltipContainer.classList.remove('active');
        aboutPopup.setAttribute('aria-hidden', 'true');
    };

    aboutTrigger.addEventListener('click', (e) => {
        const isOpen = aboutPopup.classList.contains('visible');
        if (isOpen) {
            closeAll();
        } else {
            openMobile();
        }
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        const inside = aboutTrigger.contains(e.target) || aboutPopup.contains(e.target);
        if (!inside) closeAll();
    });
}

// --- Interactive Hero Parallax ---
function setupHeroParallax() {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    // Disable parallax on mobile/tablet screens
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024) return;

    heroSection.addEventListener('mousemove', (e) => {
        const { width, height, left, top } = heroSection.getBoundingClientRect();
        // Calculate mouse position relative to center of the hero section (-0.5 to 0.5)
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        // Scale the offsets (max 20px translation)
        const maxOffset = 20; 
        const mx = (x * maxOffset).toFixed(2);
        const my = (y * maxOffset).toFixed(2);
        
        heroSection.style.setProperty('--mx', `${mx}px`);
        heroSection.style.setProperty('--my', `${my}px`);
    });
    
    // Reset positions when mouse leaves the hero section
    heroSection.addEventListener('mouseleave', () => {
        heroSection.style.setProperty('--mx', '0px');
        heroSection.style.setProperty('--my', '0px');
    });
}

// --- AI Engineer Width Sync ---
function setupAIEngineerHover() {
    const btn = document.querySelector('.hero-row-solid.button');
    if (!btn) return;

    const syncWidth = () => {
        btn.style.setProperty('--btn-width', `${btn.offsetWidth}px`);
    };

    // Sync on load and resize
    syncWidth();
    window.addEventListener('resize', syncWidth);
}

// --- Resume Download Action Trigger ---
function setupResumeButton() {
    const checkbox = document.querySelector('.hero-actions-centered .resume-input');
    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            // Trigger download/view at 75% of the 3.5s animation progress (2625ms)
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'assets/docs/resume.pdf';
                link.download = 'resume.pdf';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 2625);

            // Auto-reset checkbox state after completed sequence (6000ms)
            setTimeout(() => {
                checkbox.checked = false;
            }, 6000);
        }
    });
}

// Skills hover is handled via pure CSS


// --- Magnetic Elements ---
function setupMagneticElements() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticElements = document.querySelectorAll('.btn, .floating-logo, .theme-switch__circle-container, .hero-arrow-badge, .hero-btn-solid, .hero-btn-outline');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Pull element slightly toward cursor
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });
}

// --- macOS Dock Hover Effect ---
function setupDockHoverEffect() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dock = document.querySelector('.bottom-nav-dock .flex');
    if (!dock) return;

    const items = dock.querySelectorAll('.nav-link');
    
    dock.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemX);
            
            // Proximity scaling
            if (distance < 140) {
                const scale = 1 + (140 - distance) / 140 * 0.4;
                item.style.transform = `scale(${scale})`;
            } else {
                item.style.transform = 'scale(1)';
            }
        });
    });

    dock.addEventListener('mouseleave', () => {
        items.forEach(item => {
            item.style.transform = 'scale(1)';
        });
    });
}

// --- Staggered Scroll Reveals ---
function setupStaggeredReveals() {
    const parentClasses = ['.stats-branch-grid', '.toolbox-container', '.project-books-grid', '.skills-category-card', '.timeline-card'];
    parentClasses.forEach(selector => {
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
            const children = Array.from(container.children).filter(el => !el.classList.contains('social-main-back'));
            children.forEach((child, idx) => {
                child.style.transitionDelay = `${idx * 0.08}s`;
            });
        });
    });
}

// --- Initialize All Behaviours ---
document.addEventListener('DOMContentLoaded', () => {
    setupPreloader();
    setupThemeToggler();
    setupMobileNav();
    setupScrollObserver();
    setupActiveNavLinkSync();
    setupContactForm();
    setupToolboxCardsClick();
    setupSkillNameDisplayHover();
    setupMobileCertificatesClick();
    setupMobileWitcherMarqueeClick();
    setupWitcherDraggableMarquee();
    setupAboutBranchToggle();
    setupProjectsPopup();
    setupHeroParallax();
    setupAIEngineerHover();
    setupResumeButton();
    setupMagneticElements();
    setupDockHoverEffect();
    setupStaggeredReveals();
    setFooterYear();
});
