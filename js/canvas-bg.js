class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;

        // Theme colors configurations
        this.colors = {
            dark: {
                particle: 'rgba(139, 92, 246, 0.4)', // Violet-500
                line: 'rgba(99, 102, 241, 0.08)',    // Indigo-500
                accentParticle: 'rgba(20, 184, 166, 0.5)' // Teal-500
            },
            light: {
                particle: 'rgba(79, 70, 229, 0.25)',  // Indigo-600
                line: 'rgba(79, 70, 229, 0.05)',     // Indigo-600
                accentParticle: 'rgba(13, 148, 136, 0.3)' // Teal-600
            }
        };

        this.init();
        this.bindEvents();
        this.animate();
    }

    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        // Responsive particle count based on screen width
        const area = this.canvas.width * this.canvas.height;
        const baseDensity = 12000; // Pixels per particle
        const particleCount = Math.min(Math.floor(area / baseDensity), 120);

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 2 + 1.5;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const vx = (Math.random() - 0.5) * 0.4;
            const vy = (Math.random() - 0.5) * 0.4;
            // 20% particles will be accent particles
            const isAccent = Math.random() < 0.2;

            this.particles.push({
                x,
                y,
                vx,
                vy,
                radius: size,
                isAccent
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Listen for custom theme change event if any, or just update dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    // Force refresh colors if needed, canvas draws them frame by frame
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const theme = this.getTheme();
        const currentColors = this.colors[theme];

        // Draw and update particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse displacement physics (slight push away)
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    // Push direction
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * force * 1.5;
                    p.y += Math.sin(angle) * force * 1.5;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.isAccent ? currentColors.accentParticle : currentColors.particle;
            this.ctx.fill();
        }

        // Draw connections (lines between close particles)
        const lineDistLimit = 115;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < lineDistLimit) {
                    const alpha = (1 - dist / lineDistLimit) * 0.15;
                    this.ctx.strokeStyle = theme === 'dark' 
                        ? `rgba(99, 102, 241, ${alpha})` 
                        : `rgba(79, 70, 229, ${alpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Also connect to mouse if close
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const p = this.particles[i];
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const alpha = (1 - dist / this.mouse.radius) * 0.2;
                    this.ctx.strokeStyle = theme === 'dark'
                        ? `rgba(20, 184, 166, ${alpha})` // Teal for dark
                        : `rgba(13, 148, 136, ${alpha})`; // Teal for light
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialise canvas on window load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('bg-canvas');
});
