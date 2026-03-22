import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   FLOATING SKILLS — Physics-based interactive bubble UI
   - Canvas-rendered floating bubbles with skill logos
   - Cursor repulsion (bubbles flee from mouse)
   - Click to expand skill details
   - Glow effects, smooth animations, 60fps
═══════════════════════════════════════════════════════════ */

// Icon URLs from devicons CDN + simpleicons
const SKILLS_DATA = [
    // Languages & Core
    { name: "Python", color: "#3776AB", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "SQL", color: "#F29111", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg" },
    { name: "HTML/CSS", color: "#E34F26", category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    // AI/ML
    { name: "Machine Learning", color: "#FF6F61", category: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
    { name: "Deep Learning", color: "#9B59B6", category: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "Generative AI", color: "#00D4AA", category: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openal/openal-original.svg" },
    { name: "LLMs", color: "#667EEA", category: "AI/ML", emoji: "🧠" },
    { name: "NLP", color: "#F093FB", category: "AI/ML", emoji: "💬" },
    { name: "Computer Vision", color: "#4ECDC4", category: "AI/ML", emoji: "👁️" },
    { name: "RAG", color: "#45B7D1", category: "AI/ML", emoji: "🔗" },
    { name: "Agentic AI", color: "#96CEB4", category: "AI/ML", emoji: "🤖" },
    { name: "Prompt Eng.", color: "#DDA0DD", category: "AI/ML", emoji: "✍️" },
    // Frameworks
    { name: "PyTorch", color: "#EE4C2C", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "TensorFlow", color: "#FF8F00", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    { name: "Scikit-learn", color: "#F7931E", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
    { name: "LangChain", color: "#1C3C3C", category: "Frameworks", emoji: "🦜" },
    { name: "Hugging Face", color: "#FFD21E", category: "Frameworks", emoji: "🤗" },
    { name: "FastAPI", color: "#009688", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    { name: "Flask", color: "#AAAAAA", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name: "React", color: "#61DAFB", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Streamlit", color: "#FF4B4B", category: "Frameworks", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg" },
    // Tools
    { name: "Pandas", color: "#150458", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    { name: "NumPy", color: "#4DABCF", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
    { name: "MLflow", color: "#0194E2", category: "Tools", emoji: "📊" },
    { name: "Docker", color: "#2496ED", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Git", color: "#F05032", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    // Cloud & DB
    { name: "AWS", color: "#FF9900", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    { name: "GCP", color: "#4285F4", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
    { name: "MongoDB", color: "#47A248", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "PostgreSQL", color: "#336791", category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    // Viz
    { name: "Power BI", color: "#F2C811", category: "Viz", emoji: "📈" },
    { name: "Tableau", color: "#E97627", category: "Viz", emoji: "📉" },
];

const CATEGORY_COLORS = {
    "Languages": "#3B82F6",
    "AI/ML": "#8B5CF6",
    "Frameworks": "#EC4899",
    "Tools": "#06B6D4",
    "Cloud": "#F59E0B",
    "Viz": "#10B981",
};

// Preload all skill images
const imageCache = new Map();

function preloadImages(skills) {
    for (const skill of skills) {
        if (skill.icon && !imageCache.has(skill.name)) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = skill.icon;
            img.onload = () => { imageCache.set(skill.name, img); };
            img.onerror = () => { imageCache.set(skill.name, null); };
        }
    }
}

// Call preload immediately
preloadImages(SKILLS_DATA);

class Bubble {
    constructor(x, y, radius, skill, index) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.skill = skill;
        this.index = index;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.baseRadius = radius;
        this.targetRadius = radius;
        this.opacity = 0;
        this.targetOpacity = 0.9;
        this.glowIntensity = 0;
        this.phase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.2 + Math.random() * 0.3;
        this.floatAmplitude = 0.2 + Math.random() * 0.4;
        this.isHovered = false;
    }

    update(width, height, mouseX, mouseY, deltaTime) {
        // Floating motion
        this.phase += this.floatSpeed * deltaTime * 0.04;
        this.vy += Math.sin(this.phase) * this.floatAmplitude * deltaTime * 0.008;
        this.vx += Math.cos(this.phase * 0.7) * this.floatAmplitude * 0.4 * deltaTime * 0.008;

        // Mouse repulsion + hover detection
        this.isHovered = false;
        if (mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 130;

            // Check hover
            if (dist <= this.radius) {
                this.isHovered = true;
                this.targetRadius = this.baseRadius * 1.2;
                this.glowIntensity = Math.min(1, this.glowIntensity + 0.1);
            } else {
                this.targetRadius = this.baseRadius;
            }

            if (dist < repelRadius && dist > 0) {
                const force = (repelRadius - dist) / repelRadius;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 2.0;
                this.vy += Math.sin(angle) * force * 2.0;
                this.glowIntensity = Math.min(1, this.glowIntensity + force * 0.2);
            }
        } else {
            this.targetRadius = this.baseRadius;
        }

        // Apply velocity with damping
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.988;
        this.vy *= 0.988;

        // Boundary bounce with soft padding
        const pad = this.radius + 5;
        if (this.x < pad) { this.x = pad; this.vx = Math.abs(this.vx) * 0.5; }
        if (this.x > width - pad) { this.x = width - pad; this.vx = -Math.abs(this.vx) * 0.5; }
        if (this.y < pad) { this.y = pad; this.vy = Math.abs(this.vy) * 0.5; }
        if (this.y > height - pad) { this.y = height - pad; this.vy = -Math.abs(this.vy) * 0.5; }

        // Smooth radius transition
        this.radius += (this.targetRadius - this.radius) * 0.1;
        // Smooth opacity fade in
        this.opacity += (this.targetOpacity - this.opacity) * 0.05;
        // Glow decay
        this.glowIntensity *= 0.94;
    }

    draw(ctx) {
        if (this.opacity < 0.01) return;

        const color = this.skill.color;
        const r = this.radius;
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Outer glow
        if (this.glowIntensity > 0.05) {
            const glowGradient = ctx.createRadialGradient(
                this.x, this.y, r * 0.5,
                this.x, this.y, r * 2.5
            );
            glowGradient.addColorStop(0, `${color}${Math.floor(this.glowIntensity * 50).toString(16).padStart(2, '0')}`);
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Main bubble — darker, more solid
        const gradient = ctx.createRadialGradient(
            this.x - r * 0.25, this.y - r * 0.25, 0,
            this.x, this.y, r
        );
        gradient.addColorStop(0, `${color}50`);
        gradient.addColorStop(0.6, `${color}30`);
        gradient.addColorStop(1, `${color}18`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Border — brighter on hover
        ctx.strokeStyle = this.isHovered ? `${color}AA` : `${color}55`;
        ctx.lineWidth = this.isHovered ? 2 : 1.5;
        ctx.stroke();

        // Glass highlight
        const highlightGradient = ctx.createRadialGradient(
            this.x - r * 0.3, this.y - r * 0.4, 0,
            this.x - r * 0.1, this.y - r * 0.2, r * 0.55
        );
        highlightGradient.addColorStop(0, 'rgba(255,255,255,0.12)');
        highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();

        // ─── Draw icon/emoji (top portion of bubble) ───
        const iconSize = r * 0.55;
        const iconY = this.y - r * 0.18;
        const cachedImg = imageCache.get(this.skill.name);

        if (cachedImg) {
            // Draw loaded SVG/PNG icon
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, r - 2, 0, Math.PI * 2);
            ctx.clip();
            try {
                ctx.drawImage(
                    cachedImg,
                    this.x - iconSize / 2,
                    iconY - iconSize / 2,
                    iconSize,
                    iconSize
                );
            } catch (e) { /* ignore draw errors */ }
            ctx.restore();
        } else if (this.skill.emoji) {
            // Draw emoji as fallback
            const emojiSize = Math.max(12, r * 0.45);
            ctx.font = `${emojiSize}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.skill.emoji, this.x, iconY);
        } else {
            // Letter initial fallback
            const initialSize = Math.max(14, r * 0.5);
            ctx.font = `bold ${initialSize}px 'Syne', 'Inter', sans-serif`;
            ctx.fillStyle = `${color}CC`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.skill.name[0], this.x, iconY);
        }

        // ─── Skill name text (below icon) ───
        const fontSize = Math.max(8, Math.min(11, r * 0.3));
        const textY = this.y + r * 0.38;
        ctx.font = `600 ${fontSize}px 'Syne', 'Inter', sans-serif`;
        ctx.fillStyle = '#ffffffDD';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `${color}80`;
        ctx.shadowBlur = 3;
        ctx.fillText(this.skill.name, this.x, textY);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    isPointInside(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        return (dx * dx + dy * dy) <= (this.radius * this.radius);
    }
}

// Bubble-to-bubble collision resolution
function resolveBubbleCollisions(bubbles) {
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
            const a = bubbles[i];
            const b = bubbles[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.radius + b.radius + 4;

            if (dist < minDist && dist > 0) {
                const overlap = (minDist - dist) * 0.5;
                const nx = dx / dist;
                const ny = dy / dist;
                a.x -= nx * overlap;
                a.y -= ny * overlap;
                b.x += nx * overlap;
                b.y += ny * overlap;

                // Elastic impulse
                const relVx = a.vx - b.vx;
                const relVy = a.vy - b.vy;
                const impulse = (relVx * nx + relVy * ny) * 0.25;
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;
            }
        }
    }
}

const FloatingSkills = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const bubblesRef = useRef([]);
    const mouseRef = useRef({ x: null, y: null });
    const animFrameRef = useRef(null);
    const lastTimeRef = useRef(0);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredSkills = useMemo(() => {
        if (!selectedCategory) return SKILLS_DATA;
        return SKILLS_DATA.filter(s => s.category === selectedCategory);
    }, [selectedCategory]);

    const categories = useMemo(() => [...new Set(SKILLS_DATA.map(s => s.category))], []);

    // Initialize bubbles
    const initBubbles = useCallback((width, height) => {
        const skills = filteredSkills;
        const count = skills.length;

        // Calculate radius based on available space — bigger for fewer items
        const area = width * height;
        const maxRadius = Math.min(58, Math.max(32, Math.sqrt(area / count) * 0.4));
        const minRadius = maxRadius * 0.7;

        const bubbles = skills.map((skill, i) => {
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const cols = Math.ceil(Math.sqrt(count * (width / height)));
            const rows = Math.ceil(count / cols);
            const cellW = width / cols;
            const cellH = height / rows;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.35;
            const y = cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.35;

            return new Bubble(
                Math.max(radius + 10, Math.min(width - radius - 10, x)),
                Math.max(radius + 10, Math.min(height - radius - 10, y)),
                radius,
                skill,
                i
            );
        });

        // Staggered fade-in
        bubbles.forEach((b, i) => {
            b.opacity = 0;
            b.targetOpacity = 0.9;
            setTimeout(() => { b.targetOpacity = 0.9; }, i * 30);
        });

        bubblesRef.current = bubbles;
    }, [filteredSkills]);

    // Canvas setup and animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let width, height;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (bubblesRef.current.length === 0 || bubblesRef.current.length !== filteredSkills.length) {
                initBubbles(width, height);
            }
        };

        resize();
        window.addEventListener('resize', resize);

        // Animation loop
        const animate = (time) => {
            const dt = Math.min(32, time - (lastTimeRef.current || time));
            lastTimeRef.current = time;

            ctx.clearRect(0, 0, width, height);

            const bubbles = bubblesRef.current;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (const bubble of bubbles) {
                bubble.update(width, height, mx, my, dt);
            }

            resolveBubbleCollisions(bubbles);

            // Draw subtle connection lines between nearby bubbles
            ctx.save();
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    const a = bubbles[i];
                    const b = bubbles[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 120;
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.06 * Math.min(a.opacity, b.opacity);
                        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();

            for (const bubble of bubbles) {
                bubble.draw(ctx);
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [filteredSkills, initBubbles]);

    // Re-init bubbles when category changes
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            initBubbles(rect.width, rect.height);
        }
    }, [selectedCategory, initBubbles]);

    // Mouse tracking
    const handleMouseMove = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
    }, []);

    // Touch support
    const handleTouchMove = useCallback((e) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas || !touch) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
    }, []);

    const handleTouchEnd = useCallback(() => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
    }, []);

    // Click handler
    const handleClick = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (const bubble of bubblesRef.current) {
            if (bubble.isPointInside(x, y)) {
                setSelectedSkill(prev => prev?.name === bubble.skill.name ? null : bubble.skill);
                // Pulse the clicked bubble
                bubble.targetRadius = bubble.baseRadius * 1.35;
                setTimeout(() => { bubble.targetRadius = bubble.baseRadius; }, 500);
                bubble.glowIntensity = 1;
                return;
            }
        }
        setSelectedSkill(null);
    }, []);

    return (
        <section className="py-16 md:py-24 px-4 md:px-6 relative z-10" id="skills">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 md:mb-8 justify-center">
                    <span className="w-8 md:w-12 h-[1px] bg-white/20" />
                    <h3 className="text-2xl md:text-3xl font-bold font-syne text-white uppercase tracking-widest text-center">
                        Technical Arsenal
                    </h3>
                    <span className="w-8 md:w-12 h-[1px] bg-white/20" />
                </div>

                <p className="text-center text-white/30 text-xs md:text-sm mb-6 md:mb-8 max-w-lg mx-auto">
                    Move your cursor over the bubbles to interact • Click any skill to learn more
                </p>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 justify-center mb-6 md:mb-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border transition-all
                            ${!selectedCategory
                                ? 'bg-white/10 border-white/30 text-white shadow-lg'
                                : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                            }`}
                    >
                        All Skills
                    </motion.button>
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border transition-all
                                ${selectedCategory === cat
                                    ? 'border-white/30 text-white shadow-lg'
                                    : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                                }`}
                            style={selectedCategory === cat ? {
                                backgroundColor: `${CATEGORY_COLORS[cat]}20`,
                                borderColor: `${CATEGORY_COLORS[cat]}50`,
                                color: CATEGORY_COLORS[cat]
                            } : {}}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Canvas Container */}
                <div
                    ref={containerRef}
                    className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm"
                    style={{ height: 'clamp(380px, 55vw, 580px)' }}
                >
                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={handleClick}
                        className="absolute inset-0 cursor-pointer"
                        style={{ touchAction: 'none' }}
                    />

                    {/* Gradient edges */}
                    <div className="absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-x-0 top-0 h-8 md:h-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-8 md:h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

                    {/* Selected Skill Detail Card */}
                    <AnimatePresence>
                        {selectedSkill && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-20
                                    bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 md:p-5 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                                        style={{ backgroundColor: `${selectedSkill.color}25`, border: `1.5px solid ${selectedSkill.color}50` }}
                                    >
                                        {selectedSkill.icon ? (
                                            <img
                                                src={selectedSkill.icon}
                                                alt={selectedSkill.name}
                                                className="w-7 h-7 object-contain"
                                                crossOrigin="anonymous"
                                            />
                                        ) : selectedSkill.emoji ? (
                                            <span className="text-xl">{selectedSkill.emoji}</span>
                                        ) : (
                                            <span className="text-lg font-bold" style={{ color: selectedSkill.color }}>
                                                {selectedSkill.name[0]}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm font-syne">{selectedSkill.name}</h4>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider"
                                            style={{ color: CATEGORY_COLORS[selectedSkill.category] || '#06B6D4' }}
                                        >
                                            {selectedSkill.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${selectedSkill.color}60, ${selectedSkill.color})` }}
                                    />
                                </div>
                                <p className="text-white/40 text-[10px] mt-2 text-right font-mono">Production Ready</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Skill Count Legend */}
                <div className="flex justify-center mt-4 md:mt-6 gap-4 md:gap-6 flex-wrap">
                    {categories.map(cat => {
                        const count = SKILLS_DATA.filter(s => s.category === cat).length;
                        return (
                            <div key={cat} className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                                <span className="text-white/30 text-[10px] md:text-xs font-mono">
                                    {cat} <span className="text-white/50">({count})</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FloatingSkills;
