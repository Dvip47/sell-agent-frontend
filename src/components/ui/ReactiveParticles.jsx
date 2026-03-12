import React, { useRef, useEffect } from 'react';

/**
 * ReactiveParticles - A high-performance canvas-based particle system
 * that drifts and reacts to mouse movement, creating that "gravity" feel.
 */
const ReactiveParticles = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 900;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 2.0; // Constant drift
                this.vy = (Math.random() - 0.5) * 2.0;
                this.color = ['#ccff00', '#ff00ff', '#00ffff', '#ffffff'][Math.floor(Math.random() * 4)];
                this.density = (Math.random() * 50) + 1;
            }

            update() {
                // Inherent drift
                this.x += this.vx;
                this.y += this.vy;

                // Mouse reaction
                let dx = mouseRef.current.x - this.x;
                let dy = mouseRef.current.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                let maxDistance = 300;
                if (distance < maxDistance) {
                    let force = (maxDistance - distance) / maxDistance;
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    this.x -= forceDirectionX * force * (this.density / 2);
                    this.y -= forceDirectionY * force * (this.density / 2);
                }

                // Wrap around screen
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.15,
                zIndex: 1
            }}
        />
    );
};

export default ReactiveParticles;
