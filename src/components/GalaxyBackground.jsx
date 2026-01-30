import React, { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let shootingStars = [];
        let animationFrameId;

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars = [];
            shootingStars = [];
            const numStars = Math.floor((width * height) / 3500); // Gentle density

            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    vx: (Math.random() - 0.5) * 0.3, // Slow subtle drift
                    vy: (Math.random() - 0.5) * 0.3,
                    alpha: Math.random(),
                    color: getRandomColor()
                });
            }
        };

        const createShootingStar = () => {
            const startX = Math.random() * width;
            const startY = Math.random() * height * 0.5;

            // Randomize trajectory: mostly diagonal, some vertical
            let angle;
            if (Math.random() > 0.7) {
                angle = Math.PI / 2 + (Math.random() - 0.5) * 0.1; // Vertical-ish
            } else {
                angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Diagonal
            }

            const speed = 4 + Math.random() * 4; // Slow, elegant speed
            const length = 100 + Math.random() * 50;

            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length: length,
                radius: 1.5,
                color: '#d4fbff',
                life: 1.0,
                opacity: 0, // Start invisible for fade-in
                spawning: true,
                decay: 0.005 + Math.random() * 0.005
            });
        };

        const getRandomColor = () => {
            const colors = ['#ffffff', '#ffe9c4', '#d4fbff'];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        const drawNebula = (ctx, x, y, color, radius) => {
            const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grd.addColorStop(0, color + '22'); // Very subtle (13%)
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Deep Space Background Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#050214'); // Deep purple/blue midnight
            gradient.addColorStop(1, '#020005');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Nebula / Milky Way Gas (Subtle)
            ctx.globalCompositeOperation = 'screen';
            drawNebula(ctx, width * 0.2, height * 0.5, '#4c1d95', 300); // Purple
            drawNebula(ctx, width * 0.8, height * 0.3, '#0e7490', 400); // Cyan/Blue
            drawNebula(ctx, width * 0.5, height * 0.8, '#be185d', 350); // Pinkish

            ctx.globalCompositeOperation = 'source-over';

            // Draw Ambient Stars
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.alpha * 0.7 + 0.3;
                ctx.fill();

                // Update position
                star.x += star.vx;
                star.y += star.vy;

                // Wrap around screen
                if (star.x < 0) star.x = width;
                if (star.x > width) star.x = 0;
                if (star.y < 0) star.y = height;
                if (star.y > height) star.y = 0;

                // Twinkle
                if (Math.random() > 0.995) {
                    star.alpha = Math.random();
                }
            });

            // Draw Shooting Stars (Tail Stars)
            // Occasional spawn (Calm)
            if (Math.random() < 0.007) {
                createShootingStar();
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];

                // Update Life Cycle (Fade In / Fade Out)
                if (s.spawning) {
                    s.opacity += 0.05;
                    if (s.opacity >= 1) {
                        s.opacity = 1;
                        s.spawning = false;
                    }
                } else {
                    s.life -= s.decay;
                    s.opacity = s.life;
                }

                if (s.life <= 0 || s.x < -100 || s.x > width + 100 || s.y > height + 100) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                // Calculate geometry
                const tailX = s.x - s.vx * (s.length / Math.sqrt(s.vx ** 2 + s.vy ** 2));
                const tailY = s.y - s.vy * (s.length / Math.sqrt(s.vx ** 2 + s.vy ** 2));

                // Draw Tail (Gradient for soft glow)
                const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
                grad.addColorStop(0, `rgba(212, 251, 255, ${s.opacity})`); // Bright head end
                grad.addColorStop(1, 'rgba(212, 251, 255, 0)'); // Fade to transparent

                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = grad;
                ctx.lineWidth = s.radius;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Draw Head (Glowing)
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                ctx.shadowBlur = 10; // Glow effect
                ctx.shadowColor = "rgba(212, 251, 255, 0.8)";
                ctx.fill();
                ctx.shadowBlur = 0; // Reset for other draws (performance)

                // Update Position
                s.x += s.vx;
                s.y += s.vy;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            init();
        };

        init();
        draw();

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
            style={{ background: '#000000' }}
        />
    );
};

export default GalaxyBackground;
