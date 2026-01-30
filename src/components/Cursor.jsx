import React, { useEffect, useRef, useState, useCallback } from 'react';

// --- Configuration ---
const CONFIG = {
    spiderScale: 0.6,
    walkThreshold: 10,
    stepSpeed: 0.25,
    webColor: '255, 255, 255',
    spiderColor: '220, 220, 220',
    snapRadius: 80,
    interactionRadius: 150,
};

const Cursor = () => {
    const canvasRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Refs for simulation state (Mutable, accessible in loop)
    const state = useRef({
        mouse: { x: -100, y: -100 },
        spider: { x: -100, y: -100, angle: 0, vx: 0, vy: 0 },
        clicked: false,
        hovering: false,
    });

    // 8 Legs state
    const legs = useRef(Array(8).fill(null).map(() => ({
        x: 0, y: 0,
        stepping: false,
        lift: 0,
        startStep: { x: 0, y: 0 },
        t: 0
    })));

    const interactiveElements = useRef([]);
    const ripples = useRef([]);
    const activeWeb = useRef(null);

    // --- Caching Targets ---
    const updateTargets = useCallback(() => {
        try {
            const els = document.querySelectorAll('a, button, input, textarea, .interactive, .interactive-about');
            interactiveElements.current = Array.from(els).map(el => {
                const rect = el.getBoundingClientRect();
                const isAbout = el.classList.contains('interactive-about');
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    radius: isAbout ? Math.max(rect.width, rect.height) : Math.max(rect.width, rect.height) / 2, // Larger detection radius for containers
                    isAbout: isAbout
                };
            });
        } catch (e) {
            console.warn("Cursor target update failed", e);
        }
    }, []);

    useEffect(() => {
        updateTargets();
        const t = setInterval(updateTargets, 2000);
        window.addEventListener('resize', updateTargets);
        window.addEventListener('scroll', updateTargets, { passive: true });
        return () => {
            clearInterval(t);
            window.removeEventListener('resize', updateTargets);
            window.removeEventListener('scroll', updateTargets);
        };
    }, [updateTargets]);

    // --- Input Listeners ---
    useEffect(() => {
        const onMove = (e) => {
            state.current.mouse.x = e.clientX;
            state.current.mouse.y = e.clientY;
        };
        const onDown = () => {
            state.current.clicked = true;
            ripples.current.push({
                x: state.current.spider.x,
                y: state.current.spider.y,
                r: 0,
                opacity: 0.8
            });
        };
        const onUp = () => {
            state.current.clicked = false;
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    // --- Main Rendering Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rAF;
        let time = 0;

        // Offsets for legs relative to body centered at 0,0 facing right (0 rad)
        const legOffsets = [
            { x: 12, y: -8 }, { x: 4, y: -10 }, { x: -4, y: -10 }, { x: -12, y: -8 },  // Right
            { x: 12, y: 8 }, { x: 4, y: 10 }, { x: -4, y: 10 }, { x: -12, y: 8 }    // Left
        ].map(p => ({ x: p.x * 1.5, y: p.y * 1.5 }));

        const loop = () => {
            time += 0.05;

            // Safety check for handling resize or missing canvas
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const s = state.current; // Shortcut
            const mousePos = s.mouse;
            const spiderPos = s.spider;

            // 1. Physics & Movement
            // ---------------------

            // Magnetic Logic - find closest target
            let targetX = mousePos.x;
            let targetY = mousePos.y;
            let closest = null;
            let closestDist = Infinity;

            // Optimizing: only check if mouse is moving or close
            interactiveElements.current.forEach(t => {
                const dx = t.x - mousePos.x;
                const dy = t.y - mousePos.y;
                const d = Math.sqrt(dx * dx + dy * dy);

                // Prioritize 'About' section for special interaction
                if (t.isAbout && d < t.radius) {
                    closestDist = d;
                    closest = t;
                    // Spider slows down to "read"
                    spiderPos.vx *= 0.5;
                    spiderPos.vy *= 0.5;
                } else if (d < CONFIG.snapRadius && d < closestDist) {
                    closestDist = d;
                    closest = t;
                }
            });

            if (closest) {
                // If it's a normal target, snap to it. If it's the massive 'About' section, just drift near it but don't hard snap to center.
                if (closest.isAbout) {
                    targetX = mousePos.x; // Stay with mouse inside the box
                    targetY = mousePos.y;
                    activeWeb.current = closest; // Still draw webs
                } else {
                    targetX = closest.x;
                    targetY = closest.y;
                    activeWeb.current = closest;
                }
            } else {
                activeWeb.current = null;
            }

            // Smooth Damp (Lerp) towards target
            // Heavier damping if reading (isAbout is active/closest)
            const damping = (closest && closest.isAbout) ? 0.05 : 0.12;
            spiderPos.vx = (targetX - spiderPos.x) * damping;
            spiderPos.vy = (targetY - spiderPos.y) * damping;
            spiderPos.x += spiderPos.vx;
            spiderPos.y += spiderPos.vy;

            // Calculate Angle
            const speed = Math.sqrt(spiderPos.vx ** 2 + spiderPos.vy ** 2);
            if (speed > 0.5) {
                spiderPos.angle = Math.atan2(spiderPos.vy, spiderPos.vx);
            }

            // 2. Draw Webs
            // ------------
            if (closest && closestDist < (closest.isAbout ? closest.radius : CONFIG.interactionRadius)) {
                const t = closest;
                const dist = Math.sqrt((spiderPos.x - t.x) ** 2 + (spiderPos.y - t.y) ** 2);

                // --- Web Style for 'Reading' vs 'Snapping' ---
                if (t.isAbout) {
                    // Draw multiple anchor threads for stability feeling
                    for (let i = -1; i <= 1; i++) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${CONFIG.webColor}, ${Math.max(0, 0.3 - dist / 1000)})`; // Thinner, subtler
                        ctx.lineWidth = 0.5;

                        const anchorX = t.x + i * 20;
                        const sag = Math.sin(time * 3 + i) * 5;
                        const midX = (spiderPos.x + anchorX) / 2;
                        const midY = (spiderPos.y + t.y) / 2 + sag;

                        ctx.moveTo(spiderPos.x, spiderPos.y);
                        ctx.quadraticCurveTo(midX, midY, anchorX, t.y);
                        ctx.stroke();
                    }
                } else {
                    // Standard single web for buttons
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${CONFIG.webColor}, ${Math.max(0, 0.5 - dist / 200)})`;
                    ctx.lineWidth = 0.8;
                    const sag = Math.sin(time * 5) * 5 * (1 - dist / 200);
                    const midX = (spiderPos.x + t.x) / 2;
                    const midY = (spiderPos.y + t.y) / 2 + sag;
                    ctx.moveTo(spiderPos.x, spiderPos.y);
                    ctx.quadraticCurveTo(midX, midY, t.x, t.y);
                    ctx.stroke();
                }
            }


            // 3. Legs IK
            // ----------
            const cosA = Math.cos(spiderPos.angle);
            const sinA = Math.sin(spiderPos.angle);
            const scale = CONFIG.spiderScale;
            const clickSquish = s.clicked ? 1.4 : 1.0;

            legs.current.forEach((leg, i) => {
                // Current Body Offset (rotated)
                const off = legOffsets[i];
                const rX = off.x * cosA - off.y * sinA;
                const rY = off.x * sinA + off.y * cosA;

                // Where the leg attaches to body
                const bodyAttachX = spiderPos.x + rX * 0.3;
                const bodyAttachY = spiderPos.y + rY * 0.3;

                // Ideal Ground Position
                const idealX = spiderPos.x + rX * clickSquish;
                const idealY = spiderPos.y + rY * clickSquish;

                const distToIdeal = Math.sqrt((leg.x - idealX) ** 2 + (leg.y - idealY) ** 2);

                // Step Logic
                if (!leg.stepping) {
                    // Start step if too far
                    if (distToIdeal > CONFIG.walkThreshold * scale * clickSquish) {
                        leg.stepping = true;
                        leg.startStep.x = leg.x;
                        leg.startStep.y = leg.y;
                        leg.t = 0;
                    }
                } else {
                    // Animate Step
                    leg.t += CONFIG.stepSpeed;
                    if (leg.t >= 1) {
                        leg.t = 1;
                        leg.stepping = false;
                    }
                    const t = leg.t;
                    const ease = t * (2 - t); // Quad ease out
                    leg.x = leg.startStep.x + (idealX - leg.startStep.x) * ease;
                    leg.y = leg.startStep.y + (idealY - leg.startStep.y) * ease;
                    leg.lift = Math.sin(t * Math.PI) * 10 * scale;
                }

                // Drag feet slightly if idle to keep formation
                if (speed < 0.2 && !leg.stepping) {
                    leg.x += (idealX - leg.x) * 0.1;
                    leg.y += (idealY - leg.y) * 0.1;
                }

                // Draw Leg
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${CONFIG.spiderColor}, 0.9)`;
                ctx.lineWidth = 1.2 * scale;
                ctx.lineCap = 'round';

                // Knee calc (Artistic approximation)
                const midX = (bodyAttachX + leg.x) / 2;
                const midY = (bodyAttachY + leg.y) / 2;

                // Offset knee perpendicular to leg line
                // Front legs (0-3) vs Back legs (4-7) - Actually configured as Right(0-3)/Left(4-7)
                // Right side (i<4): Knee sticks out "Right" relative to body
                // Left side (i>=4): Knee sticks out "Left" relative to body

                // Simple perpendicular vector
                const dxL = leg.x - bodyAttachX;
                const dyL = leg.y - bodyAttachY;
                const len = Math.sqrt(dxL * dxL + dyL * dyL) || 1;
                const nx = -dyL / len;
                const ny = dxL / len;

                // Determine direction based on side
                const sideMult = (i < 4) ? 1 : -1;
                // Actually legOffsets already define side. p.y is negative for Right, positive for Left.
                // let's just push "Out"

                const kneeLift = 15 * scale - leg.lift;
                const kX = midX + nx * (i < 4 ? 1 : -1) * 5 * scale;
                const kY = midY + ny * (i < 4 ? 1 : -1) * 5 * scale - leg.lift * 0.5;

                ctx.moveTo(bodyAttachX, bodyAttachY);
                ctx.quadraticCurveTo(kX, kY, leg.x, leg.y);
                ctx.stroke();
            });

            // 4. Draw Body
            // -----------
            ctx.save();
            ctx.translate(spiderPos.x, spiderPos.y);
            ctx.rotate(spiderPos.angle);

            // Abdomen
            ctx.fillStyle = "#0a0a0a";
            ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
            ctx.lineWidth = 1;
            const breath = 1 + Math.sin(time * 3) * 0.05;

            ctx.beginPath();
            ctx.ellipse(-6 * scale, 0, 5 * scale * breath, 4 * scale * breath, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Head
            ctx.beginPath();
            ctx.fillStyle = "#111";
            ctx.ellipse(1 * scale, 0, 3 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.restore();

            // 5. Ripples
            // ----------
            for (let i = ripples.current.length - 1; i >= 0; i--) {
                const r = ripples.current[i];
                r.r += 2;
                r.opacity -= 0.02;
                if (r.opacity <= 0) {
                    ripples.current.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity})`;
                ctx.lineWidth = 1;
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
                ctx.stroke();
            }

            rAF = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(rAF);
    }, []);

    return (
        <>
            <style>{`
                @media (min-width: 768px) {
                    body, a, button, inputElement, textElement, .interactive { cursor: none !important; }
                    * { cursor: none !important; }
                }
            `}</style>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
            />
        </>
    );
};

export default Cursor;
