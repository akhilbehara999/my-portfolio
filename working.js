// RPG Portfolio JavaScript Interactivity

// Audio context for sound effects
let audioContext;

// Set initial theme
document.documentElement.setAttribute('data-theme', 'night');

// Check for browser support and add compatibility classes
function checkBrowserSupport() {
    // Add class to HTML element for browser-specific styling if needed
    const html = document.documentElement;
    
    // Check for older browsers
    if (!window.AudioContext && !window.webkitAudioContext) {
        html.classList.add('no-audio-context');
    }
    
    // Check for CSS Grid support
    if (!CSS.supports('display', 'grid')) {
        html.classList.add('no-css-grid');
    }
    
    // Check for CSS Custom Properties support
    if (!window.CSS || !CSS.supports('color', 'var(--fake-var)')) {
        html.classList.add('no-css-variables');
    }
    
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        html.classList.add('no-intersection-observer');
    }
    
    // Add class for touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        html.classList.add('touch-device');
    }
    
    // Add class for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        html.classList.add('reduce-motion');
    }
}

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    
    // Check browser support
    checkBrowserSupport();
    
    // Initialize audio context on first user interaction
    document.body.addEventListener('click', initAudioContext, { once: true });
    document.body.addEventListener('touchstart', initAudioContext, { once: true });
    
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    // Hide loading overlay after a short delay
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 1500);
    
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'night' ? 'day' : 'night';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save theme preference to localStorage
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                console.warn('LocalStorage not available');
            }
            playSound('click');
        });
    }
    
    // Class selection functionality
    const classToggle = document.getElementById('classToggle');
    const classDropdown = document.getElementById('classDropdown');
    
    if (classToggle && classDropdown) {
        classToggle.addEventListener('click', function() {
            classDropdown.classList.toggle('show');
            playSound('click');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!classToggle.contains(e.target) && !classDropdown.contains(e.target)) {
                classDropdown.classList.remove('show');
            }
        });
        
        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                classDropdown.classList.remove('show');
            }
        });
        
        // Class selection options
        const classOptions = document.querySelectorAll('.class-option');
        classOptions.forEach(option => {
            option.addEventListener('click', function() {
                const selectedClass = this.getAttribute('data-class');
                
                // Update class attribute
                document.documentElement.setAttribute('data-class', selectedClass);
                
                // Save class preference to localStorage
                try {
                    localStorage.setItem('rpgClass', selectedClass);
                } catch (e) {
                    console.warn('LocalStorage not available');
                }
                
                // Close dropdown
                classDropdown.classList.remove('show');
                
                // Play sound effect
                playSound('click');
                
                // Add visual feedback
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createParticleEffect(x, y, 15);
            });
        });
    }
    
    // Check for saved theme preference
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    // Check for saved class preference
    try {
        const savedClass = localStorage.getItem('rpgClass');
        if (savedClass) {
            document.documentElement.setAttribute('data-class', savedClass);
        }
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    // Initialize interactive items
    console.log("Initializing interactive items");
    initInteractiveItems();
    
    // Set up scroll listener for character stats and parallax effect
    window.addEventListener('scroll', function() {
        updateCharacterStats();
        updateParallaxEffect();
    });
    
    // Initialize parallax effect
    console.log("Initializing parallax effect");
    initParallaxEffect();
    
    // Initialize particle effects for special sections
    console.log("Initializing particle effects");
    initParticleEffects();
    
    // Initialize lazy loading
    console.log("Initializing lazy loading");
    initLazyLoading();
    
    // Initialize character stats
    console.log("Initializing character stats");
    setTimeout(updateCharacterStats, 100);
    
    // Set up Intersection Observer for HP/MP bars
    const hpMpContainer = document.querySelector('.hp-mp-container');
    
    if (hpMpContainer) {
        // Fallback for browsers without IntersectionObserver
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // When the HP/MP container is visible, animate the bars
                        // This will replay every time the element becomes visible again
                        animateBars();
                    }
                });
            }, { 
                threshold: 0.5 // Trigger when 50% of the container is visible
            });
            
            observer.observe(hpMpContainer);
        } else {
            // Fallback: animate immediately if IntersectionObserver not supported
            animateBars();
        }
    } else {
        // Fallback: animate immediately if container not found
        animateBars();
    }
    
    // Set up Intersection Observer for skill sections
    const skillSections = document.querySelectorAll('.skill-mastery, .soft-skills');
    skillSections.forEach(section => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // When the skill section is visible, animate the skill bars
                        // This will replay every time the element becomes visible again
                        animateSkillBars();
                    }
                });
            }, { 
                threshold: 0.1 // Trigger when 10% of the section is visible (earlier than before)
            });
            
            observer.observe(section);
        } else {
            // Fallback: animate immediately if IntersectionObserver not supported
            animateSkillBars();
        }
    });
    
    // Set up Intersection Observer for weapon mastery section (restored to match HP/MP)
    const weaponSection = document.querySelector('.weapon-mastery');
    if (weaponSection) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animate weapon XP bars
                        // This will replay every time the element becomes visible again
                        animateWeaponBars();
                    }
                });
            }, { 
                threshold: 0.5 // Changed from 0.1 to 0.5 to match HP/MP bars timing
            });
            
            observer.observe(weaponSection);
        } else {
            // Fallback: animate immediately if IntersectionObserver not supported
            animateWeaponBars();
        }
    }
    
    // Add background torches
    console.log("Adding torches");
    addTorches();
    
    // Add avatar hover effects
    const avatar = document.querySelector('.avatar');
    const avatarContainer = document.querySelector('.avatar-container');
    
    if (avatar && avatarContainer) {
        avatarContainer.addEventListener('mouseenter', function() {
            avatar.classList.add('wave');
            playSound('hover');
        });
        
        avatarContainer.addEventListener('mouseleave', function() {
            avatar.classList.remove('wave');
        });
        
        // Add focus support for accessibility
        avatarContainer.addEventListener('focus', function() {
            avatar.classList.add('wave');
            playSound('hover');
        });
        
        avatarContainer.addEventListener('blur', function() {
            avatar.classList.remove('wave');
        });
    }
    
    // Add hover effects to weapon items
    const weaponItems = document.querySelectorAll('.weapon-item');
    weaponItems.forEach(item => {
        // Add bounce effect on hover
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'bounce 0.5s';
            this.style.transform = 'translateY(-5px)';
            playSound('hover');
            
            // Get the fill percentage from the xp-bar width
            const xpBar = this.querySelector('.xp-bar');
            const fillPercentage = xpBar.style.width || '0%';
            
            // Create fill percentage popup
            const fillPopup = document.createElement('div');
            fillPopup.textContent = fillPercentage;
            fillPopup.className = 'fill-popup';
            fillPopup.style.position = 'absolute';
            fillPopup.style.bottom = '100%';
            fillPopup.style.left = '50%';
            fillPopup.style.transform = 'translateX(-50%)';
            fillPopup.style.background = 'rgba(0, 0, 0, 0.8)';
            fillPopup.style.color = 'white';
            fillPopup.style.padding = '5px 10px';
            fillPopup.style.border = '1px solid #ff9e00';
            fillPopup.style.borderRadius = '4px';
            fillPopup.style.fontSize = '0.7rem';
            fillPopup.style.whiteSpace = 'nowrap';
            fillPopup.style.opacity = '0';
            fillPopup.style.transition = 'opacity 0.3s ease';
            fillPopup.style.fontFamily = "'Press Start 2P', cursive";
            fillPopup.style.zIndex = '1000';
            fillPopup.style.marginBottom = '10px';
            
            this.appendChild(fillPopup);
            
            // Show the popup after a short delay
            setTimeout(() => {
                fillPopup.style.opacity = '1';
            }, 10);
        });
        
        item.addEventListener('animationend', function() {
            this.style.animation = '';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            
            // Remove the fill percentage popup
            const fillPopup = this.querySelector('.fill-popup');
            if (fillPopup) {
                fillPopup.style.opacity = '0';
                setTimeout(() => {
                    if (fillPopup.parentNode) {
                        fillPopup.parentNode.removeChild(fillPopup);
                    }
                }, 300);
            }
        });
        
        // Add keyboard support
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.dispatchEvent(new MouseEvent('mouseenter'));
            }
        });
        
        // Add focus support for accessibility
        item.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        item.addEventListener('blur', function() {
            this.dispatchEvent(new MouseEvent('mouseleave'));
        });
    });
    
    // Add bounce animation CSS
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(-5px); }
            40% { transform: translateY(-15px); }
            80% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(bounceStyle);
    
    // Add click effect to treasure chest
    const treasureChest = document.getElementById('downloadCV');
    if (treasureChest) {
        treasureChest.addEventListener('click', function() {
            alert('Your CV download would start now! (This is a demo)');
            // In a real implementation, this would trigger a file download
        });
        
        // Add keyboard support
        treasureChest.setAttribute('tabindex', '0');
        treasureChest.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus support for accessibility
        treasureChest.addEventListener('focus', function() {
            this.style.boxShadow = '0 12px 0 #8B7500, 0 0 15px rgba(255, 215, 0, 0.7)';
        });
        
        treasureChest.addEventListener('blur', function() {
            this.style.boxShadow = '0 8px 0 #8B7500';
        });
    }
    
    // Add form submission
    const contactForm = document.querySelector('.npc-contact-form');
    if (contactForm) {
        // Add typing effect to form labels
        const labels = contactForm.querySelectorAll('label');
        labels.forEach((label, index) => {
            const text = label.textContent;
            label.textContent = '';
            label.classList.add('typing-effect');
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    label.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                } else {
                    label.classList.remove('typing-effect');
                }
            };
            
            setTimeout(type, index * 1000);
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message sent to the NPC! (This is a demo)');
            contactForm.reset();
        });
        
        // Add keyboard support to form elements
        const formElements = contactForm.querySelectorAll('input, textarea, button');
        formElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });
    }
    
    // Level display remains static as Beginner → Intermediate
    
    // Add page transition effect on link clicks
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip external links
            const href = this.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel'))) {
                return;
            }
            
            e.preventDefault();
            
            // Create transition effect
            const transition = document.createElement('div');
            transition.className = 'page-transition';
            document.body.appendChild(transition);
            
            setTimeout(() => {
                transition.classList.add('active');
            }, 10);
            
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        });
        
        // Add keyboard support
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Animate skill bars
    console.log("Animating skill bars");
    animateSkillBars();
    
    // Add sparkle effect to unlocked achievements
    console.log("Adding sparkle effects to unlocked achievements");
    const unlockedAchievements = document.querySelectorAll('.achievement.unlocked');
    console.log("Found", unlockedAchievements.length, "unlocked achievements");
    unlockedAchievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', function() {
            // Remove any existing animations
            this.style.animation = '';
            // Apply only the sparkle animation
            this.style.animation = 'sparkle 0.5s';
        });
        
        achievement.addEventListener('animationend', function() {
            this.style.animation = '';
        });
        
        // Add keyboard support
        achievement.setAttribute('tabindex', '0');
        achievement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.dispatchEvent(new MouseEvent('mouseenter'));
            }
        });
        
        // Add focus support for accessibility
        achievement.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        achievement.addEventListener('blur', function() {
            this.style.animation = '';
        });
    });
    
    // Add shake effect to locked achievements
    console.log("Adding shake effects to locked achievements");
    const lockedAchievements = document.querySelectorAll('.achievement.locked');
    console.log("Found", lockedAchievements.length, "locked achievements");
    lockedAchievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', function() {
            this.style.animation = 'shake 0.5s';
        });
        
        achievement.addEventListener('animationend', function() {
            this.style.animation = '';
        });
        
        // Add keyboard support
        achievement.setAttribute('tabindex', '0');
        achievement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.dispatchEvent(new MouseEvent('mouseenter'));
            }
        });
        
        // Add focus support for accessibility
        achievement.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        achievement.addEventListener('blur', function() {
            this.style.animation = '';
        });
    });
    
    // Add interactivity to skill tree nodes
    console.log("Adding interactivity to skill tree nodes");
    const skillNodes = document.querySelectorAll('.skill-node');
    skillNodes.forEach(node => {
        node.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Play sound effect
            playSound('click');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Add particle effect
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createParticleEffect(x, y, 8);
        });
        
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            playSound('hover');
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add keyboard support
        node.setAttribute('tabindex', '0');
        node.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus support for accessibility
        node.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        node.addEventListener('blur', function() {
            this.dispatchEvent(new MouseEvent('mouseleave'));
        });
    });
    
    // Add sparkle and shake animations
    const achievementStyle = document.createElement('style');
    achievementStyle.textContent = `
        @keyframes sparkle {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5); }
            100% { transform: scale(1); filter: brightness(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(achievementStyle);
    
    // Show achievements after a short delay
    setTimeout(() => {
        const achievements = document.querySelectorAll('.achievement');
        achievements.forEach(achievement => {
            achievement.classList.add('show');
        });
    }, 100);
    
    // Add functionality to quest journal
    console.log("Initializing quest journal");
    const questEntries = document.querySelectorAll('.quest-entry');
    questEntries.forEach(entry => {
        const actionButton = entry.querySelector('.quest-action');
        const progressBar = entry.querySelector('.progress-fill');
        const progressText = entry.querySelector('.progress-text');
        
        if (actionButton) {
            actionButton.addEventListener('click', function() {
                const questStatus = entry.querySelector('.quest-status');
                const questId = entry.getAttribute('data-quest');
                
                if (entry.classList.contains('available')) {
                    // Accept the quest
                    entry.classList.remove('available');
                    entry.classList.add('in-progress');
                    if (questStatus) questStatus.textContent = 'In Progress';
                    actionButton.textContent = 'View Progress';
                    
                    // Update progress based on quest type
                    if (progressBar && progressText) {
                        switch(questId) {
                            case 'explore':
                                progressBar.style.width = '20%';
                                progressText.textContent = '1/5 sections';
                                break;
                            case 'skills':
                                progressBar.style.width = '0%';
                                progressText.textContent = '0/3 skills';
                                break;
                            case 'achievements':
                                progressBar.style.width = '0%';
                                progressText.textContent = '0/2 achievements';
                                break;
                        }
                    }
                    
                    playSound('click');
                } else if (entry.classList.contains('in-progress')) {
                    // View progress or complete quest
                    if (questId === 'contact') {
                        // Scroll to contact form
                        const contactSection = document.querySelector('.contact-section');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                            playSound('hover');
                        }
                    }
                }
            });
        }
        
        // Add hover effects
        entry.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            playSound('hover');
        });
        
        entry.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add keyboard support
        entry.setAttribute('tabindex', '0');
        entry.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (actionButton) actionButton.click();
            }
        });
        
        // Add focus support for accessibility
        entry.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        entry.addEventListener('blur', function() {
            this.dispatchEvent(new MouseEvent('mouseleave'));
        });
        
        // Add keyboard support to action button
        if (actionButton) {
            actionButton.setAttribute('tabindex', '0');
            actionButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
    
    // Add functionality to inventory items
    console.log("Initializing inventory");
    const inventoryItems = document.querySelectorAll('.inventory-item');
    inventoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.querySelector('.item-name').textContent;
            const itemDescription = this.querySelector('.item-description').textContent;
            
            // Show item details in an alert (in a real implementation, this could be a modal)
            alert(`Item: ${itemName}\n${itemDescription}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            playSound('click');
            
            // Track inventory item views for achievements
            trackAchievementProgress('collector');
        });
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            playSound('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add keyboard support
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus support for accessibility
        item.addEventListener('focus', function() {
            this.dispatchEvent(new MouseEvent('mouseenter'));
        });
        
        item.addEventListener('blur', function() {
            this.dispatchEvent(new MouseEvent('mouseleave'));
        });
    });
    
    // Initialize visitor achievements
    console.log("Initializing visitor achievements");
    initializeVisitorAchievements();
    
    // Initialize daily quest
    console.log("Initializing daily quest");
    initializeDailyQuest();
    
    // Add Easter egg functionality
    console.log("Initializing Easter eggs");
    initializeEasterEggs();
});

// Function to initialize daily quest
function initializeDailyQuest() {
    const dailyQuestText = document.getElementById('dailyQuestText');
    const dailyQuestButton = document.getElementById('dailyQuestButton');
    
    if (!dailyQuestText || !dailyQuestButton) return;
    
    // Get daily quest from localStorage or generate new one
    let dailyQuest = null;
    let lastQuestDate = null;
    const today = new Date().toDateString();
    
    try {
        dailyQuest = localStorage.getItem('dailyQuest');
        lastQuestDate = localStorage.getItem('lastQuestDate');
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    // Define daily quests
    const dailyQuests = [
        "Find the hidden Easter egg on the page",
        "Click on 5 different interactive elements",
        "View all inventory items",
        "Complete one quest from the quest journal",
        "Explore all sections of the portfolio",
        "Unlock a new achievement",
        "Change the theme to day mode",
        "Select a different RPG class"
    ];
    
    // Check if we need to generate a new quest
    if (!dailyQuest || lastQuestDate !== today) {
        // Generate a random quest
        const randomIndex = Math.floor(Math.random() * dailyQuests.length);
        dailyQuest = dailyQuests[randomIndex];
        
        // Save to localStorage
        try {
            localStorage.setItem('dailyQuest', dailyQuest);
            localStorage.setItem('lastQuestDate', today);
            localStorage.setItem('dailyQuestCompleted', 'false');
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
    
    // Display the quest
    dailyQuestText.textContent = dailyQuest;
    
    // Check if quest is completed
    let isCompleted = false;
    try {
        isCompleted = localStorage.getItem('dailyQuestCompleted') === 'true';
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    if (isCompleted) {
        dailyQuestButton.textContent = 'Quest Completed!';
        dailyQuestButton.disabled = true;
        dailyQuestButton.style.opacity = '0.7';
    } else {
        dailyQuestButton.textContent = 'Accept Quest';
        dailyQuestButton.disabled = false;
        dailyQuestButton.style.opacity = '1';
        
        // Add event listener for accepting the quest
        dailyQuestButton.addEventListener('click', function() {
            // In a real implementation, you would track progress toward the quest
            // For now, we'll just mark it as completed when the button is clicked
            try {
                localStorage.setItem('dailyQuestCompleted', 'true');
            } catch (e) {
                console.warn('LocalStorage not available');
            }
            dailyQuestButton.textContent = 'Quest Completed!';
            dailyQuestButton.disabled = true;
            dailyQuestButton.style.opacity = '0.7';
            
            // Show achievement notification
            showAchievementNotification('Daily Quest');
            
            // Track achievement progress
            trackAchievementProgress('questMaster');
        });
    }
}

// Function to initialize Easter eggs
function initializeEasterEggs() {
    // Konami code easter egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Check if the pressed key matches the expected key in the sequence
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // If we've completed the sequence
            if (konamiIndex === konamiCode.length) {
                activateKonamiEasterEgg();
                konamiIndex = 0; // Reset for potential future use
            }
        } else {
            // Reset if wrong key is pressed
            konamiIndex = 0;
        }
    });
    
    // Secret click easter egg
    let secretClickCount = 0;
    const secretClickElement = document.querySelector('.character-name');
    
    if (secretClickElement) {
        secretClickElement.addEventListener('click', function() {
            secretClickCount++;
            
            if (secretClickCount === 5) {
                activateSecretClickEasterEgg();
                secretClickCount = 0; // Reset for potential future use
            }
        });
    }
}

// Function to activate Konami code easter egg
function activateKonamiEasterEgg() {
    // Show a special message
    alert("🎉 Konami Code Activated! You've unlocked the secret developer mode! 🎉");
    
    // Add a special effect to the page
    document.body.classList.add('konami-activated');
    
    // Add special CSS for the effect
    const konamiStyle = document.createElement('style');
    konamiStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .konami-activated {
            animation: rainbow 2s infinite linear;
        }
        
        .konami-activated .section-title {
            animation: rainbow 1s infinite linear;
        }
    `;
    document.head.appendChild(konamiStyle);
    
    // Track achievement
    trackAchievementProgress('questMaster');
}

// Function to activate secret click easter egg
function activateSecretClickEasterEgg() {
    // Show a special message
    alert("🧙 You've discovered the secret! Clicking the character name 5 times reveals this hidden message! 🧙");
    
    // Add a special effect to the character name
    const characterName = document.querySelector('.character-name');
    if (characterName) {
        characterName.style.animation = 'bounce 0.5s infinite';
        
        // Add bounce animation CSS if not already present
        if (!document.querySelector('#bounce-style')) {
            const bounceStyle = document.createElement('style');
            bounceStyle.id = 'bounce-style';
            bounceStyle.textContent = `
                @keyframes bounce {
                    0%, 20%, 60%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    80% { transform: translateY(-5px); }
                }
            `;
            document.head.appendChild(bounceStyle);
        }
    }
    
    // Track achievement
    trackAchievementProgress('questMaster');
}

// Function to track achievement progress
function trackAchievementProgress(achievementType) {
    // Get achievements from localStorage or initialize
    let achievements = null;
    try {
        achievements = JSON.parse(localStorage.getItem('visitorAchievements')) || {
            firstVisit: { unlocked: true, timestamp: new Date().toISOString() },
            explorer: { unlocked: false, progress: 0 },
            interactive: { unlocked: false, progress: 0 },
            questMaster: { unlocked: false, progress: 0 },
            collector: { unlocked: false, progress: 0 },
            nightOwl: { unlocked: false, timestamp: null }
        };
    } catch (e) {
        console.warn('LocalStorage not available');
        achievements = {
            firstVisit: { unlocked: true, timestamp: new Date().toISOString() },
            explorer: { unlocked: false, progress: 0 },
            interactive: { unlocked: false, progress: 0 },
            questMaster: { unlocked: false, progress: 0 },
            collector: { unlocked: false, progress: 0 },
            nightOwl: { unlocked: false, timestamp: null }
        };
    }
    
    // Update progress based on achievement type
    switch(achievementType) {
        case 'explorer':
            if (!achievements.explorer.unlocked) {
                achievements.explorer.progress = Math.min(achievements.explorer.progress + 1, 1);
                if (achievements.explorer.progress >= 1) {
                    achievements.explorer.unlocked = true;
                    achievements.explorer.timestamp = new Date().toISOString();
                    showAchievementNotification('Explorer');
                }
            }
            break;
            
        case 'interactive':
            if (!achievements.interactive.unlocked) {
                achievements.interactive.progress = Math.min(achievements.interactive.progress + 1, 5);
                if (achievements.interactive.progress >= 5) {
                    achievements.interactive.unlocked = true;
                    achievements.interactive.timestamp = new Date().toISOString();
                    showAchievementNotification('Interactive User');
                }
            }
            break;
            
        case 'questMaster':
            if (!achievements.questMaster.unlocked) {
                achievements.questMaster.progress = Math.min(achievements.questMaster.progress + 1, 3);
                if (achievements.questMaster.progress >= 3) {
                    achievements.questMaster.unlocked = true;
                    achievements.questMaster.timestamp = new Date().toISOString();
                    showAchievementNotification('Quest Master');
                }
            }
            break;
            
        case 'collector':
            if (!achievements.collector.unlocked) {
                achievements.collector.progress = Math.min(achievements.collector.progress + 1, 8);
                if (achievements.collector.progress >= 8) {
                    achievements.collector.unlocked = true;
                    achievements.collector.timestamp = new Date().toISOString();
                    showAchievementNotification('Collector');
                }
            }
            break;
            
        case 'nightOwl':
            const hour = new Date().getHours();
            if (hour >= 20 || hour <= 6) {
                if (!achievements.nightOwl.unlocked) {
                    achievements.nightOwl.unlocked = true;
                    achievements.nightOwl.timestamp = new Date().toISOString();
                    showAchievementNotification('Night Owl');
                }
            }
            break;
    }
    
    // Save updated achievements to localStorage
    try {
        localStorage.setItem('visitorAchievements', JSON.stringify(achievements));
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    // Update UI
    updateVisitorAchievementsUI(achievements);
}

// Function to show achievement notification
function showAchievementNotification(achievementName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="trophy-icon">🏆</div>
            <div class="notification-text">
                <h3>Achievement Unlocked!</h3>
                <p>${achievementName}</p>
            </div>
        </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid gold',
        borderRadius: '8px',
        padding: '15px',
        zIndex: '10000',
        color: 'white',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '0.8rem',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
        transform: 'translateX(100%)',
        transition: 'transform 0.5s ease'
    });
    
    // Style the content
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });
    
    const trophyIcon = notification.querySelector('.trophy-icon');
    Object.assign(trophyIcon.style, {
        fontSize: '2rem'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Function to update visitor achievements UI
function updateVisitorAchievementsUI(achievements) {
    const achievementElements = document.querySelectorAll('.visitor-achievements .achievement');
    
    achievementElements.forEach(element => {
        const achievementType = element.getAttribute('data-achievement');
        let achievementData;
        
        switch(achievementType) {
            case 'first-visit':
                achievementData = achievements.firstVisit;
                break;
            case 'explorer':
                achievementData = achievements.explorer;
                break;
            case 'interactive':
                achievementData = achievements.interactive;
                break;
            case 'quest-master':
                achievementData = achievements.questMaster;
                break;
            case 'collector':
                achievementData = achievements.collector;
                break;
            case 'night-owl':
                achievementData = achievements.nightOwl;
                break;
        }
        
        if (achievementData && achievementData.unlocked) {
            element.classList.remove('locked');
            element.classList.add('unlocked');
        }
    });
}

// Function to initialize visitor achievements
function initializeVisitorAchievements() {
    // Check if this is the first visit
    let achievements = null;
    try {
        achievements = JSON.parse(localStorage.getItem('visitorAchievements'));
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    if (!achievements) {
        // First visit - unlock the First Visit achievement
        achievements = {
            firstVisit: { unlocked: true, timestamp: new Date().toISOString() },
            explorer: { unlocked: false, progress: 0 },
            interactive: { unlocked: false, progress: 0 },
            questMaster: { unlocked: false, progress: 0 },
            collector: { unlocked: false, progress: 0 },
            nightOwl: { unlocked: false, timestamp: null }
        };
        
        // Show first visit notification
        showAchievementNotification('First Visit');
        
        // Save to localStorage
        try {
            localStorage.setItem('visitorAchievements', JSON.stringify(achievements));
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
    
    // Check for night owl achievement
    trackAchievementProgress('nightOwl');
    
    // Update UI
    updateVisitorAchievementsUI(achievements);
    
    // Initialize visitor counter
    initializeVisitorCounter();
    
    // Add scroll listener for explorer achievement
    let scrolledToBottom = false;
    window.addEventListener('scroll', function() {
        if (!scrolledToBottom) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                scrolledToBottom = true;
                trackAchievementProgress('explorer');
            }
        }
    });
    
    // Add click listener for interactive achievement
    let interactiveClicks = 0;
    document.addEventListener('click', function(e) {
        // Check if clicked element is interactive
        const interactiveElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', '.interactive-item', '.weapon-item', 
                                   '.skill-item', '.interest-item', '.quest', '.achievement', '.skill-node', 
                                   '.quest-entry', '.inventory-item'];
        
        for (let selector of interactiveElements) {
            if (e.target.matches(selector) || e.target.closest(selector)) {
                interactiveClicks++;
                if (interactiveClicks >= 5) {
                    trackAchievementProgress('interactive');
                }
                break;
            }
        }
    });
}

// Function to initialize visitor counter
function initializeVisitorCounter() {
    // Get visitor count from localStorage or initialize to 0
    let visitorCount = null;
    try {
        visitorCount = localStorage.getItem('visitorCount');
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    if (visitorCount === null) {
        // First visit for this user
        visitorCount = 1;
    } else {
        // Increment count for returning visitors
        visitorCount = parseInt(visitorCount) + 1;
    }
    
    // Save updated count
    try {
        localStorage.setItem('visitorCount', visitorCount);
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    
    // Update UI
    const counterElement = document.getElementById('visitorCount');
    if (counterElement) {
        counterElement.textContent = visitorCount;
    }
}

// Add CSS for achievement notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .achievement-notification {
        animation: slideIn 0.5s ease, slideOut 0.5s ease 2.5s forwards;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(notificationStyle);

// Add CSS for level progression animation
const style = document.createElement('style');
style.textContent = `
    @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); color: #ff9e00; }
        100% { transform: scale(1); }
    }
    
    .leveling-up {
        animation: levelUp 1s ease;
    }
    
    @keyframes popup {
        0% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -30px); }
    }
    
    @keyframes typing {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    
    .typing-effect::after {
        content: "|";
        animation: typing 1s infinite;
    }
    
    /* Page transition effect */
    .page-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9999;
        transform: scaleX(0);
        transform-origin: left;
    }
    
    .page-transition.active {
        animation: wipe 1s forwards;
    }
    
    @keyframes wipe {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
    }
    
    /* Reduced motion styles */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// Function to animate HP/MP bars
function animateBars() {
    const hpBar = document.getElementById('hpBar');
    const mpBar = document.getElementById('mpBar');
    
    if (hpBar && mpBar) {
        // Reset widths to 0 first
        hpBar.style.width = '0';
        mpBar.style.width = '0';
        
        // Remove glowing class if it exists
        hpBar.classList.remove('glowing');
        mpBar.classList.remove('glowing');
        
        // Animate to final widths with glowing effect
        setTimeout(() => {
            hpBar.style.width = '99%';
            mpBar.style.width = '87%';
            
            // Add glowing class for extra effect after a delay
            setTimeout(() => {
                hpBar.classList.add('glowing');
                mpBar.classList.add('glowing');
            }, 2000);
        }, 50);
    }
}

// Function to animate Weapon Mastery bars (restored to match HP/MP animation)
function animateWeaponBars() {
    const xpBars = document.querySelectorAll('.xp-bar');
    xpBars.forEach(bar => {
        // Get the target width from the inline style
        let targetWidth = '0%';
        const styleAttr = bar.getAttribute('style');
        if (styleAttr) {
            const widthMatch = styleAttr.match(/width:\s*([^;]+)/i);
            if (widthMatch && widthMatch[1]) {
                targetWidth = widthMatch[1].trim();
            }
        }
        
        // Reset to 0 width first
        bar.style.width = '0';
        // Remove glowing class if it exists
        bar.classList.remove('glowing');
        
        // Force reflow to ensure the reset takes effect
        bar.offsetHeight;
        
        // Animate to target width with glowing effect (same timing as HP/MP bars)
        setTimeout(() => {
            bar.style.width = targetWidth;
            
            // Add glowing class for extra effect after a delay (same timing as HP/MP bars)
            setTimeout(() => {
                bar.classList.add('glowing');
            }, 2000);
        }, 50);
    });
}

// Function to animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        // Reset width to 0 first
        bar.style.width = '0';
        // Get the target width from CSS variable
        const targetWidth = getComputedStyle(bar).getPropertyValue('--target-width');
        // Animate to target width after a small delay
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 50);
    });
}

// Function to update character stats based on scroll position
function updateCharacterStats() {
    // Set the exact values that should be displayed to match the HTML
    const experience = 1250;
    const questsCompleted = 3;
    const skillsMastered = 7;
    const achievements = 3;
    
    // Update stats display
    const experienceStat = document.getElementById('experienceStat');
    const questsStat = document.getElementById('questsStat');
    const skillsStat = document.getElementById('skillsStat');
    const achievementsStat = document.getElementById('achievementsStat');
    
    if (experienceStat) experienceStat.textContent = experience + ' XP';
    if (questsStat) questsStat.textContent = questsCompleted;
    if (skillsStat) skillsStat.textContent = skillsMastered;
    if (achievementsStat) achievementsStat.textContent = achievements;
}

// Function to initialize interactive items
function initInteractiveItems() {
    const interactiveItems = document.querySelectorAll('.interactive-item');
    
    interactiveItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Play sound effect (if implemented)
            playSound('click');
        });
        
        // Add keyboard support
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus support for accessibility
        item.addEventListener('focus', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(255, 158, 0, 0.3)';
            this.style.borderColor = 'var(--highlight-color)';
        });
        
        item.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.style.borderColor = 'var(--border-color)';
        });
    });
    
    // Add click effects to achievements
    const achievements = document.querySelectorAll('.achievement');
    achievements.forEach(achievement => {
        achievement.addEventListener('click', function() {
            // Add a visual feedback effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Play sound effect
            playSound('click');
        });
        
        // Add keyboard support
        achievement.setAttribute('tabindex', '0');
        achievement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus support for accessibility
        achievement.addEventListener('focus', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.2)';
        });
        
        achievement.addEventListener('blur', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize audio context
function initAudioContext() {
    if (!audioContext) {
        // Try standard AudioContext first, then webkitAudioContext for Safari
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }
}

// Function to play sound effects
function playSound(type) {
    // Initialize audio context if not already done
    initAudioContext();
    
    // Check if audio context is available
    if (!audioContext) {
        console.log("Audio not supported in this browser");
        return;
    }
    
    try {
        // Create oscillator for sound generation
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set sound parameters based on type
        switch (type) {
            case 'click':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'hover':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'sparkle':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(1760, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            default:
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
        }
    } catch (e) {
        console.log("Sound play failed:", e);
    }
}

// Function to create particle effects
function createParticleEffect(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle sparkle';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Function to initialize particle effects for special sections
function initParticleEffects() {
    console.log("Initializing particle effects");
    
    // Add particle effects to achievements section
    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        console.log("Found achievements section");
        achievementsSection.addEventListener('mouseenter', function(e) {
            console.log("Mouse entered achievements section");
            const rect = this.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            createParticleEffect(x, y, 15);
            playSound('sparkle');
        });
    } else {
        console.log("Achievements section not found");
    }
    
    // Add particle effects to skill mastery section
    const skillSections = document.querySelectorAll('.skill-mastery, .soft-skills');
    skillSections.forEach(section => {
        section.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            createParticleEffect(x, y, 8);
        });
    });
}

// Function to initialize parallax effect
function initParallaxEffect() {
    // Create parallax layers
    const parallaxLayer1 = document.createElement('div');
    parallaxLayer1.className = 'parallax-layer parallax-layer-1';
    document.body.appendChild(parallaxLayer1);
    
    const parallaxLayer2 = document.createElement('div');
    parallaxLayer2.className = 'parallax-layer parallax-layer-2';
    document.body.appendChild(parallaxLayer2);
}

// Function to update parallax effect based on scroll position
function updateParallaxEffect() {
    const scrollPosition = window.pageYOffset;
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translateY(${yPos}px)`;
    });
}

// Function to initialize lazy loading
function initLazyLoading() {
    // Get all elements that should be lazy loaded
    const lazyElements = document.querySelectorAll('.lazy-load');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        // Set up Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1 
        });
        
        lazyElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback: load all elements immediately if IntersectionObserver not supported
        lazyElements.forEach(element => {
            element.classList.add('loaded');
        });
    }
}

// Function to add background torches
function addTorches() {
    // Add torches to corners of the page
    const positions = [
        { top: '20px', left: '20px' },
        { top: '20px', right: '20px' },
        { bottom: '20px', left: '20px' },
        { bottom: '20px', right: '20px' }
    ];
    
    positions.forEach(pos => {
        const torch = document.createElement('div');
        torch.className = 'torch';
        Object.assign(torch.style, {
            position: 'fixed',
            ...pos
        });
        document.body.appendChild(torch);
    });
}