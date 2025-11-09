// Terminal Portfolio JavaScript

class TerminalPortfolio {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command-input');
        this.cursor = document.getElementById('cursor');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        
        // Portfolio data
        this.portfolioData = {
            name: "Pondara Akhil Behara",
            tagline: "Aspiring Game Developer & AI Maker",
            location: {
                current: "Vishakhapatnam (Vizag), Andhra Pradesh, India",
                permanent: "Baruva, Sompeta, Srikakulam, Andhra Pradesh, India"
            },
            interests: ["Game Development", "Artificial Intelligence", "Interactive Storytelling", "Open Source Contribution", "Tech Blogging"],
            hobbies: ["Playing online games", "Playing outdoor games like badminton and running", "Playing indoor games like chess and carrom", "Following tech news, especially in AI - I try new AI tools and test how well they perform and whether they're useful", "Reading books, particularly those focused on storytelling, inspiration, and problem-solving", "Communicating with others and understanding human emotions and feelings"],
            education: {
                degree: "BTech ",
                branch: "AI&DS",
                college: "Chaitanya Engineering College",
                graduation: "2028(expected)",
                inter:"MPC (Maths, Physics, Chemistry)",
                interCollege: "A.P Model College, Sompeta",
                interBoard: "AP State Board",
                interGpa: "7",
                school: "A.P Model School, Sompeta",
                schoolBoard: "AP State Board",
                schoolGpa: "8.5"
            },
            education: {
                degree: "BTech ",
                branch: "AI&DS",
                college: "Chaitanya Engineering College",
                graduation: "2028(expected)",
                inter: "MPC (Maths, Physics, Chemistry)",
                interCollege: "A.P Model College, Sompeta",
                interBoard: "AP State Board",
                interGpa: "7",
                school: "A.P Model School, Sompeta",
                schoolBoard: "AP State Board",
                schoolGpa: "8.5"
            },
            careerGoals: [
                "Create innovative games that use AI to provide personalized player experiences",
                "Build smart systems that combine human creativity with computer power",
                "Contribute to open-source projects that advance game development and AI",
                "Lead teams in creating technology that solves real-world problems"
            ],
            strengths: [
                "Creative Problem-Solving: Combine artistic vision with technical skills to develop unique solutions",
                "Fast Learning: Quickly master new technologies to stay current with industry trends",
                "Teamwork: Work effectively with others to deliver quality software products",
                "User Focus: Create experiences that truly engage and help end users"
            ],
            softSkills: [
                "Teamwork",
                "Problem-Solving",
                "Creativity",
                "Adaptability",
                "Communication",
                "Leadership"
            ],
            skills: {
                programming: ["JavaScript", "Python", "Java", "GDScript"],
                web: ["HTML", "CSS", "React", "Node.js","Mongo DB","Supabase"],
                ai: ["AI Experimentation", "Model Testing", "Performance Optimization"],
                tools: ["Git", "VS Code", "Godot"]
            },
            projects: [
                {
                    name: "ThinkRing Project with Supabase Integration",
                    description: "A full-stack web application that demonstrates modern web development practices with Supabase backend integration. Features user authentication, real-time data synchronization, and RESTful API interactions.",
                    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "REST API"],
                    github: "https://github.com/akhilbehara999/thinkring-project-with-supabase"
                },
                {
                    name: "ThinkRing Project (Without DB Integration)",
                    description: "A frontend-focused web application showcasing responsive design and interactive UI components. Built as a foundation for learning backend integration concepts.",
                    technologies: ["HTML", "CSS", "JavaScript"],
                    github: "https://github.com/akhilbehara999/thinkring-project-without-db-integration.git"
                },
                {
                    name: "ThinkRing Project (With MongoDB Integration)",
                    description: "An enhanced version of the ThinkRing project with MongoDB database integration for data persistence, featuring CRUD operations and data modeling.",
                    technologies: ["HTML", "CSS", "JavaScript", "MongoDB"],
                    github: "https://github.com/akhilbehara999/thinkring-project-with-mango-db-integration.git"
                },
                {
                    name: "2D Platformer Game Prototype",
                    description: "An engaging 2D platformer game developed using Godot engine, featuring character movement, collision detection, level design, and interactive gameplay mechanics.",
                    technologies: ["GDScript", "Godot Engine", "Game Physics", "2D Graphics"],
                    github: "https://github.com/akhilbehara999/game-dev.git"
                }
            ],
            contact: {
                email: "akhilbehara97@gmail.com",
                github: "https://github.com/akhilbehara999",
                linkedin: "https://www.linkedin.com/in/akhil-behara-016126381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                instagram: "https://www.instagram.com/akhil_majunu?igsh=MTdhcGxxcWZ4dGtzNw=="
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.input.focus();
    }
    
    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });
        
        document.querySelector('.terminal-body').addEventListener('click', () => {
            this.input.focus();
        });
    }
    
    processCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.displayCommand(command);
        this.input.value = '';
        this.executeCommand(command);
    }
    
    displayCommand(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line';
        commandLine.innerHTML = `<span class="prompt">pondara@portfolio:${this.currentPath}$</span> ${command}`;
        this.output.appendChild(commandLine);
        this.scrollToBottom();
    }
    
    executeCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch (cmd) {
            case '':
                break;
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'education':
                this.showEducation();
                break;
            case 'goals':
                this.showGoals();
                break;
            case 'echo':
                this.echo(args.join(' '));
                break;
            case 'theme':
                this.changeTheme(args[0]);
                break;
            case 'portfolio':
                this.switchToPortfolio();
                break;
            default:
                this.showCommandNotFound(cmd);
        }
        
        this.scrollToBottom();
    }
    
    showHelp() {
        const helpText = `
<span class="help-category">Available Commands:</span>
  <span class="help-command">help</span>      - Show this help message
  <span class="help-command">about</span>     - Display information about me
  <span class="help-command">education</span>  - Show my educational background
  <span class="help-command">goals</span>     - Display my career goals and strengths
  <span class="help-command">projects</span>  - List my projects
  <span class="help-command">skills</span>    - Show my technical skills
  <span class="help-command">contact</span>   - Display contact information
  <span class="help-command">echo</span>      - Print text to terminal
  <span class="help-command">theme</span>     - Change terminal theme (usage: theme [dark|hacker|matrix|rainbow])
  <span class="help-command">portfolio</span> - Switch to modern portfolio view
  <span class="help-command">clear</span>     - Clear the terminal screen
        `;
        
        this.displayOutput(helpText);
    }
    
    showAbout() {
        let aboutText = `
<span class="section-title">About Me</span>
<img src="mine1.png" alt="Pondara Akhil Behara" class="profile-image">
Hello! I'm <span class="command-highlight">${this.portfolioData.name}</span>, a passionate BTech student specializing in Artificial Intelligence and Data Science at Chaitanya Engineering College.

<span class="directory">Current Location:</span> ${this.portfolioData.location.current}
<span class="directory">Permanent Location:</span> ${this.portfolioData.location.permanent}

As an aspiring game developer and AI maker, I'm focused on creating innovative digital experiences that blend cutting-edge technology with creative design. My journey in computer science has equipped me with a strong foundation in programming, algorithms, and problem-solving.

<span class="skill-category">Technical Interests:</span>
`;
        
        this.portfolioData.interests.forEach(interest => {
            aboutText += `<div class="skill-list">• ${interest}</div>`;
        });
        
        aboutText += `
<span class="skill-category">Hobbies & Personal Interests:</span>
`;
        
        this.portfolioData.hobbies.forEach(hobby => {
            aboutText += `<div class="skill-list">• ${hobby}</div>`;
        });
        
        aboutText += `
I'm particularly excited about the intersection of artificial intelligence and interactive entertainment, where intelligent systems can create dynamic, personalized experiences for users. My goal is to contribute to projects that push the boundaries of what's possible in both gaming and AI applications.
`;
        
        this.displayOutput(aboutText);
    }
    
    showEducation() {
        const educationText = `<span class="section-title">Education</span><div class="directory">College:</div><div class="skill-list">${this.portfolioData.education.college}</div><div class="directory">Degree:</div><div class="skill-list">${this.portfolioData.education.degree} in ${this.portfolioData.education.branch}</div><div class="directory">Expected Graduation:</div><div class="skill-list">${this.portfolioData.education.graduation}</div><div class="directory">Intermediate:</div><div class="skill-list">${this.portfolioData.education.inter}</div><div class="skill-list">${this.portfolioData.education.interCollege}</div><div class="skill-list">${this.portfolioData.education.interBoard} - GPA: ${this.portfolioData.education.interGpa}</div><div class="directory">School:</div><div class="skill-list">${this.portfolioData.education.school}</div><div class="skill-list">${this.portfolioData.education.schoolBoard} - GPA: ${this.portfolioData.education.schoolGpa}</div>`;
        
        this.displayOutput(educationText);
    }
    
    showGoals() {
        let goalsText = `
<span class="section-title">Career Goals & Strengths</span>
<span class="skill-category">Career Aspirations:</span>
<div class="goal-description">As a passionate game developer and AI enthusiast, I aim to push the boundaries of interactive entertainment and intelligent systems.</div>
`;
        
        this.portfolioData.careerGoals.forEach(goal => {
            goalsText += `<div class="skill-list">• ${goal}</div>`;
        });
        
        goalsText += `
<span class="skill-category">Core Competencies:</span>
<div class="strength-description">My strengths combine technical proficiency with creative thinking to deliver innovative solutions.</div>
`;
        
        this.portfolioData.strengths.forEach(strength => {
            goalsText += `<div class="skill-list">• ${strength}</div>`;
        });
        
        this.displayOutput(goalsText);
    }
    
    showProjects() {
        let projectsText = `
<span class="section-title">Projects</span>
`;
        
        this.portfolioData.projects.forEach((project, index) => {
            projectsText += `<div class="project-item"><div class="project-title">${index + 1}. ${project.name}</div><div class="project-description">${project.description}</div><div class="skill-list">Technologies: ${project.technologies.join(', ')}</div><div class="project-github"><a href="${project.github}" target="_blank" class="github-link">View on GitHub</a></div></div>`;
        });
        
        this.displayOutput(projectsText);
    }
    
    showSkills() {
        let skillsText = `
<span class="section-title">Technical Skills</span>
<span class="skill-category">Programming Languages:</span>
<div class="skill-list">${this.portfolioData.skills.programming.join(', ')}</div>

<span class="skill-category">Web Technologies:</span>
<div class="skill-list">${this.portfolioData.skills.web.join(', ')}</div>

<span class="skill-category">AI/ML Technologies:</span>
<div class="skill-list">${this.portfolioData.skills.ai.join(', ')}</div>

<span class="skill-category">Tools & Platforms:</span>
<div class="skill-list">${this.portfolioData.skills.tools.join(', ')}</div>

<span class="skill-category">Soft Skills:</span>
<div class="skill-list">${this.portfolioData.softSkills.join(', ')}</div>
`;
        
        this.displayOutput(skillsText);
    }
    
    showContact() {
        const contactText = `
<span class="section-title">Contact Information</span>
<div class="contact-item"><i class="fas fa-envelope contact-icon"></i> <span class="contact-method">Email:</span> <a href="mailto:${this.portfolioData.contact.email}" target="_blank" class="contact-value">${this.portfolioData.contact.email}</a></div>
<div class="contact-item"><i class="fab fa-github contact-icon"></i> <span class="contact-method">GitHub:</span> <a href="${this.portfolioData.contact.github}" target="_blank" class="contact-value">${this.portfolioData.contact.github}</a></div>
<div class="contact-item"><i class="fab fa-linkedin contact-icon"></i> <span class="contact-method">LinkedIn:</span> <a href="${this.portfolioData.contact.linkedin}" target="_blank" class="contact-value">LinkedIn Profile</a></div>
<div class="contact-item"><i class="fab fa-instagram contact-icon"></i> <span class="contact-method">Instagram:</span> <a href="${this.portfolioData.contact.instagram}" target="_blank" class="contact-value">@akhil_majunu</a></div>
`;
        
        this.displayOutput(contactText);
    }
    
    echo(text) {
        this.displayOutput(text || '');
    }
    
    changeTheme(theme) {
        const terminal = document.querySelector('.terminal-container');
        
        // If no theme specified, show error and available options
        if (!theme) {
            this.displayOutput(`<span class="error">Error: Theme name required.</span>\nAvailable themes: <span class="command-highlight">theme dark</span>, <span class="command-highlight">theme hacker</span>, <span class="command-highlight">theme matrix</span>, <span class="command-highlight">theme rainbow</span>`);
            return;
        }
        
        // Remove existing theme classes
        terminal.classList.remove('dark-theme', 'hacker-theme', 'matrix-theme', 'rainbow-theme');
        
        switch(theme.toLowerCase()) {
            case 'hacker':
                terminal.classList.add('hacker-theme');
                this.displayOutput('<span class="success">Switched to hacker theme</span>');
                break;
            case 'matrix':
                terminal.classList.add('matrix-theme');
                this.displayOutput('<span class="success">Switched to matrix theme</span>');
                break;
            case 'rainbow':
                terminal.classList.add('rainbow-theme');
                this.displayOutput('<span class="success">Switched to rainbow theme</span>');
                break;
            case 'dark':
            default:
                terminal.classList.add('dark-theme');
                this.displayOutput('<span class="success">Switched to dark theme</span>');
                break;
        }
    }
    
    switchToPortfolio() {
        // Hide terminal interface
        document.querySelector('.terminal-container').style.display = 'none';
        
        // Create portfolio interface
        const portfolioDiv = document.createElement('div');
        portfolioDiv.id = 'portfolio-view';
        portfolioDiv.innerHTML = `
            <div class="portfolio-container">
                <button id="back-to-terminal" class="back-button">← Back to Terminal</button>
                <div class="portfolio-header">
                    <div class="profile-section">
                        <img src="mine1.png" alt="${this.portfolioData.name}" class="profile-image-large">
                        <div class="profile-info">
                            <h1 class="portfolio-title">${this.portfolioData.name}</h1>
                            <p class="portfolio-subtitle">Aspiring Game Developer & AI Tester</p>
                            <p class="portfolio-detail"><strong>Education:</strong> ${this.portfolioData.education.degree} in ${this.portfolioData.education.branch}</p>
                            <p class="portfolio-detail"><strong>Institution:</strong> ${this.portfolioData.education.college}</p>
                            <p class="portfolio-detail"><strong>Expected Graduation:</strong> ${this.portfolioData.education.graduation}</p>
                        </div>
                    </div>
                </div>
                <div class="portfolio-content">
                    <div class="portfolio-section">
                        <h2><i class="fas fa-bullseye"></i> Career Goals</h2>
                        <div class="goals-grid">
                            ${this.portfolioData.careerGoals.map(goal => `
                                <div class="goal-item">
                                    <i class="fas fa-check-circle goal-icon"></i>
                                    <span>${goal}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="portfolio-section">
                        <h2><i class="fas fa-code"></i> Technical Skills</h2>
                        <div class="skills-grid">
                            <div class="skill-category-card">
                                <h3>Programming Languages</h3>
                                <div class="skill-tags">
                                    ${this.portfolioData.skills.programming.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                            <div class="skill-category-card">
                                <h3>Web Technologies</h3>
                                <div class="skill-tags">
                                    ${this.portfolioData.skills.web.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                            <div class="skill-category-card">
                                <h3>AI Experimentation</h3>
                                <div class="skill-tags">
                                    ${this.portfolioData.skills.ai.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                            <div class="skill-category-card">
                                <h3>Tools & Platforms</h3>
                                <div class="skill-tags">
                                    ${this.portfolioData.skills.tools.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="skills-grid">
                            <div class="skill-category-card">
                                <h3>Soft Skills</h3>
                                <div class="skill-tags">
                                    ${this.portfolioData.softSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="portfolio-section">
                        <h2><i class="fas fa-project-diagram"></i> Projects</h2>
                        <div class="project-grid">
                            ${this.portfolioData.projects.map((project, index) => `
                                <div class="project-card">
                                    <h3>${project.name}</h3>
                                    <p class="project-description">${project.description}</p>
                                    <div class="project-technologies">
                                        <strong>Technologies:</strong> ${project.technologies.join(', ')}
                                    </div>
                                    <a href="${project.github}" target="_blank" class="project-link">View on GitHub</a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="portfolio-section">
                        <h2><i class="fas fa-envelope"></i> Contact</h2>
                        <div class="contact-info">
                            <p><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:${this.portfolioData.contact.email}" target="_blank">${this.portfolioData.contact.email}</a></p>
                            <p><i class="fab fa-github"></i> <strong>GitHub:</strong> <a href="${this.portfolioData.contact.github}" target="_blank">${this.portfolioData.contact.github}</a></p>
                            <p><i class="fab fa-linkedin"></i> <strong>LinkedIn:</strong> <a href="${this.portfolioData.contact.linkedin}" target="_blank">LinkedIn Profile</a></p>
                            <p><i class="fab fa-instagram"></i> <strong>Instagram:</strong> <a href="${this.portfolioData.contact.instagram}" target="_blank">@akhil_majunu</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(portfolioDiv);
        
        // Add event listener for back button
        document.getElementById('back-to-terminal').addEventListener('click', () => {
            document.getElementById('portfolio-view').remove();
            document.querySelector('.terminal-container').style.display = 'flex';
            // Refocus the terminal input
            document.getElementById('command-input').focus();
        });
    }
    
    showCommandNotFound(cmd) {
        this.displayOutput(`<span class="error">Command not found: ${cmd}</span>. Type <span class="command-highlight">help</span> to see available commands.`);
    }
    
    displayOutput(content) {
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.innerHTML = content;
        this.output.appendChild(outputLine);
        this.scrollToBottom();
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex];
    }
    
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
});