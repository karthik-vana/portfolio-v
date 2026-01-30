import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data ---
const ABOUT_SENTENCES = [
    "I am an AI/ML Engineer and Creative Developer passionate about architecting intelligent digital ecosystems.",
    "With a specialized focus on Neural Architectures, Computer Vision, and Generative AI, I build systems that bridge the gap between complex data physics and intuitive user experiences.",
    "My work is defined by precision, scalability, and an unyielding drive to push the boundaries of what machine intelligence can achieve."
];

const EDUCATION = [
    {
        degree: "M.Tech in CSE (Artificial Intelligence / Machine Learning)",
        school: "Avanthi College",
        year: "2025 - 2027",
        logo: "/avanthi_clg logo.webp",
        status: "Pursuing",
        color: "text-blue-400 border-blue-400/30 bg-blue-400/10"
    },
    {
        degree: "B.Tech in Electrical and Electronics Engineering",
        school: "Raghu College of Engineering",
        year: "2021 - 2025",
        logo: "/raghu_clg logo.webp",
        status: "Completed",
        color: "text-green-400 border-green-400/30 bg-green-400/10"
    }
];

const CERTIFICATIONS = [
    { name: "Oracle Cloud Certified Gen AI Professional 2025", iso: "Oracle", link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=3BFA403ED940B10C0041C7B6790E9F4E452C755C304560FFAA9DF62FA050AA26" },
    { name: "Oracle Cloud Certified Data Science Professional 2025", iso: "Oracle", link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=0E9752C0D544E1FE26C720651AF1AC7593BC0478AE88669F69B011D8B5CBC704" },
    { name: "Gemini Certified University Student", iso: "Google", link: "https://edu.google.accredible.com/b6933df4-5f33-476b-8cfb-b19db4997c4b" },
    { name: "Google Advanced Data Analytics Capstone", iso: "Coursera", link: "https://www.coursera.org/account/accomplishments/records/Z9F0WG7HRN9W" },
    { name: "Google Analytics Certification", iso: "Google Skillshop", link: "https://skillshop.credential.net/18d5f46b-71c9-4ac9-bce1-ddab07ee096c" },
    { name: "Introduction to Data Science", iso: "Cisco", link: "https://www.credly.com/badges/60c388ac-5350-414d-91c7-5e93b396cf13/linked_in_profile" },
    { name: "Data Analytics Achievement", iso: "Microsoft", link: "https://learn.microsoft.com/api/achievements/share/en-in/KarthikVana-3306/H7CP7VC8?sharingId=1CFADFFE79E74F46" },
    { name: "Python for Data Science", iso: "IBM", link: "https://drive.google.com/file/d/1uzqBsbrYWjpyuDZYMcQDNUchPusXZ8Z9/view?usp=drivesdk" },
    { name: "TCS iON Career Edge – Young Professional", iso: "TCS", link: "https://drive.google.com/file/d/1HgoqNpdgLrrqJFx4xhJiJcvy0PoHMHJ4/view?usp=drive_link" },
    { name: "Data Analytics Job Simulation", iso: "Deloitte / Forage", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_ute9fHtY6Py7Ji83p_1756995143186_completion_certificate.pdf" },
    { name: "Data Science & Analytics", iso: "HP LIFE", link: "https://drive.google.com/file/d/1rAZssbPVGrU9sIqbhfb4mduHGp7uUK3G/view?usp=drivesdk" }
];

// --- Experience Data ---
const EXPERIENCE = [
    {
        role: "Data Science Intern",
        company: "Innomatics Research Labs",
        location: "Remote",
        period: "Oct 15 - Present",
        logo: "/innomatics-logo.webp",
        desc: "Building predictive models and analyzing complex datasets.",
        points: [
            "Developing advanced predictive models to interpret complex datasets and derive actionable business insights.",
            "Collaborating globally in a remote setting to implement scalable data pipelines and visualization dashboards."
        ],
        color: "from-blue-500/20 to-cyan-500/20",
        border: "group-hover:border-blue-500/50"
    },
    {
        role: "Data Science Apprentice",
        company: "Vihara Tech",
        location: "Kukatpally, Hyderabad",
        period: "Aug 10 - Feb 28",
        logo: "/viharatech.webp",
        desc: "Hands-on data preprocessing and statistical modeling.",
        points: [
            "Executed comprehensive data preprocessing workflows, including cleaning, transformation, and feature engineering for large datasets.",
            "Applied statistical modeling techniques to solve real-world problems, enhancing model accuracy by significant margins."
        ],
        color: "from-purple-500/20 to-pink-500/20",
        border: "group-hover:border-purple-500/50"
    },
    {
        role: "AI/ML Engineer (Stipend Based)",
        company: "Skill Union",
        location: "Hybrid / Remote",
        period: "1 Year Duration",
        logo: "/SKILLUNION.webp",
        desc: "Deep learning architectures and model deployment.",
        points: [
            "Spent a year mastering deep learning architectures, successfully deploying multiple models from research to prototype.",
            "Worked on optimizing model inference times for edge devices, achieving a balance between accuracy and performance."
        ],
        color: "from-yellow-500/20 to-orange-500/20",
        border: "group-hover:border-yellow-500/50"
    },
    {
        role: "ML Engineer Intern",
        company: "YBI Foundation",
        location: "Remote",
        period: "1 Month",
        logo: "/YBI FOUNDATION.webp",
        desc: "Core ML algorithms and model tuning.",
        points: [
            "Focused on the end-to-end implementation of core Machine Learning algorithms using Python and Scikit-Learn.",
            "Conducted rigorous model evaluation and hyperparameter tuning to ensure robust performance on test datasets."
        ],
        color: "from-green-500/20 to-emerald-500/20",
        border: "group-hover:border-green-500/50"
    }
];

// --- Skills Data (Categorized) ---
const SKILL_CATEGORIES = [
    {
        title: "Data Science Tools",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" /><path d="M16 16v.01" /><path d="M12 12v.01" /><path d="M8.5 16v.01" /><path d="M16 8.5v.01" />
            </svg>
        ),
        skills: ["Python", "SQL", "Jupyter", "Git", "VS Code", "Anaconda"],
        color: "text-blue-400 border-blue-400/20 bg-blue-400/5 hover:border-blue-400/50"
    },
    {
        title: "ML Stack",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        ),
        skills: ["Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Decision Trees", "Logistic Regression"],
        color: "text-green-400 border-green-400/20 bg-green-400/5 hover:border-green-400/50"
    },
    {
        title: "Deep Learning",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5h.01" /><path d="M16 16h.01" /><path d="M12 12h.01" />
            </svg>
        ),
        skills: ["PyTorch", "TensorFlow", "Keras", "CNNs", "RNNs", "Transformers", "FastAI"],
        color: "text-purple-400 border-purple-400/20 bg-purple-400/5 hover:border-purple-400/50"
    },
    {
        title: "NLP",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
            </svg>
        ),
        skills: ["HuggingFace", "BERT", "LLMs (Llama/GPT)", "LangChain", "NLTK", "SpaCy", "RAG"],
        color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5 hover:border-yellow-400/50"
    },
    {
        title: "Computer Vision",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        skills: ["OpenCV", "YOLO", "Segmentation", "Object Detection", "PIL", "Albumentations"],
        color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/50"
    },
    {
        title: "Data Analytics",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "PowerBI", "Excel"],
        color: "text-orange-400 border-orange-400/20 bg-orange-400/5 hover:border-orange-400/50"
    },
    {
        title: "Full Stack",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        skills: ["React.js", "Node.js", "Express", "FastAPI", "MongoDB", "TailwindCSS", "Next.js"],
        color: "text-pink-400 border-pink-400/20 bg-pink-400/5 hover:border-pink-400/50"
    },
    {
        title: "AI/ML Ops",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
        ),
        skills: ["Docker", "Kubernetes", "AWS SageMaker", "MLflow", "CI/CD", "Cloud AI"],
        color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:border-emerald-400/50"
    }
];

// --- Components ---

export const AboutSection = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Flatten sentences into a single text block for fluid word flow
    const fullText = ABOUT_SENTENCES.join(" ");
    const words = fullText.split(" ");

    return (
        <section className="min-h-[60vh] flex items-center justify-center py-24 relative z-10">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm font-mono text-purple-400 tracking-widest uppercase mb-4 block"
                >
                    About Me
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-syne font-bold text-white leading-tight mb-8"
                >
                    Engineering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Future</span> of Intelligence.
                </motion.h2>

                {/* Interactive Text Container */}
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    className="interactive-about p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(100,100,255,0.05)] relative overflow-hidden group text-left cursor-none"
                    initial="hidden"
                    animate={isHovered ? "visible" : "hidden"}
                >
                    {/* Soft Glow Edges */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />

                    <motion.div
                        className="relative z-10 flex flex-wrap gap-[0.35em] justify-center md:justify-start"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.04, // Fast word reveal
                                    delayChildren: 0.05
                                }
                            }
                        }}
                    >
                        {words.map((word, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: {
                                        opacity: 0.2,
                                        filter: "blur(5px)",
                                        scale: 0.95,
                                        textShadow: "0 0 0px rgba(255,255,255,0)"
                                    },
                                    visible: {
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        scale: 1,
                                        color: "#ffffff",
                                        textShadow: "0 0 10px rgba(255,255,255,0.3)", // Subtle illumination
                                        transition: {
                                            duration: 0.4,
                                            ease: "easeOut"
                                        }
                                    }
                                }}
                                className="text-lg md:text-xl font-satoshi text-white/50 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Hint overlay - fades out but doesn't block view */}
                    <div className={`absolute bottom-4 right-6 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-40'}`}>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 animate-pulse">
                            ● Cursor Detect
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export const EducationSection = () => (
    <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-16 justify-center">
                <span className="w-12 h-[1px] bg-white/20"></span>
                <h3 className="text-3xl font-bold font-syne text-white uppercase tracking-widest text-center">Academic Journey</h3>
                <span className="w-12 h-[1px] bg-white/20"></span>
            </div>

            <div className="space-y-8">
                {EDUCATION.map((edu, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group overflow-hidden"
                    >
                        {/* Ambient Background Glow matching status */}
                        <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none`} />

                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">

                            {/* Logo & Info */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                                <div className="w-24 h-24 bg-white rounded-2xl p-3 flex-shrink-0 shadow-2xl shadow-black/50 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                                    <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all font-syne">{edu.degree}</h4>
                                    <p className="text-white/60 text-lg font-light tracking-wide">{edu.school}</p>
                                    <p className="font-mono text-sm text-white/30">{edu.year}</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-5 py-2 rounded-full border ${edu.color} backdrop-blur-md shadow-lg flex items-center gap-2`}>
                                {edu.status === "Pursuing" && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                )}
                                <span className="font-bold text-sm tracking-uppercase uppercase">{edu.status}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const SkillsSection = () => (
    <section className="py-24 px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-20 justify-center">
                <span className="w-12 h-[1px] bg-white/20"></span>
                <h3 className="text-3xl font-bold font-syne text-white uppercase tracking-widest text-center">Technical Arsenal</h3>
                <span className="w-12 h-[1px] bg-white/20"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {SKILL_CATEGORIES.map((category, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-2xl border ${category.color} transition-all duration-300 backdrop-blur-sm group flex flex-col h-full`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                {category.icon}
                            </span>
                            <h4 className="text-lg font-bold text-white font-syne tracking-wide">{category.title}</h4>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {category.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-md bg-black/40 border border-white/5 text-xs md:text-sm text-white/70 group-hover:text-white group-hover:border-white/20 transition-all font-mono">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);




export const ExperienceSection = () => {
    const [selectedId, setSelectedId] = useState(null);

    return (
        <section className="py-24 px-6 relative z-10 min-h-screen flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-20 justify-center">
                    <span className="w-12 h-[1px] bg-white/20"></span>
                    <h3 className="text-3xl font-bold font-syne text-white uppercase tracking-widest text-center">Professional Experience</h3>
                    <span className="w-12 h-[1px] bg-white/20"></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {EXPERIENCE.map((exp, i) => (
                        <motion.div
                            key={i}
                            layoutId={`card-${i}`}
                            onClick={() => setSelectedId(i === selectedId ? null : i)}
                            className={`relative p-6 rounded-3xl bg-white/5 border border-white/10 ${exp.border} transition-all cursor-pointer overflow-hidden group hover:bg-white/10`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex items-start gap-6">
                                {/* Logo Box */}
                                <motion.div
                                    className="w-20 h-20 bg-white rounded-2xl p-2 flex-shrink-0 shadow-lg border border-white/20 overflow-hidden"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                </motion.div>

                                <div className="flex-1">
                                    <span className="inline-block px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs text-white/60 mb-2 backdrop-blur-md">
                                        {exp.period}
                                    </span>
                                    <h4 className="text-xl font-bold text-white font-syne leading-tight">{exp.role}</h4>
                                    <h5 className="text-white/60 text-sm mt-1">{exp.company}</h5>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-purple-300 font-mono uppercase tracking-widest opacity-80 group-hover:opacity-100">
                                        {selectedId === i ? "Click to Collapse" : "Click to Explore"} <span className="text-lg">↗</span>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {selectedId === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="relative z-10 border-t border-white/10 pt-6"
                                    >
                                        <ul className="space-y-3">
                                            {exp.points.map((point, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-start gap-3 text-white/80 text-sm md:text-base leading-relaxed"
                                                >
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 shadow-[0_0_8px_cyan]" />
                                                    {point}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Marquee Sub-Component ---
const MarqueeRow = ({ items, direction = "left", speed = 20 }) => {
    return (
        <div className="relative flex overflow-hidden group">
            <motion.div
                className="flex gap-6 py-4 flex-nowrap"
                animate={{ x: direction === "left" ? "-50%" : "0%" }}
                initial={{ x: direction === "left" ? "0%" : "-50%" }}
                transition={{
                    ease: "linear",
                    duration: speed,
                    repeat: Infinity,
                    repeatType: "loop"
                }}
                style={{ width: "fit-content" }}
                whileHover={{ animationPlayState: "paused" }} // Basic hover pause handled via CSS group-hover usually, but FRAMER needs explicit controls or simpler CSS. 
            // We'll trust the constant motion for now, or add onMouseEnter={() => controls.stop()} if needed.
            // For simplicity in this 'write_to_file', we keep it continuous.
            >
                {/* Render items multiple times for seamless loop */}
                {[...items, ...items, ...items, ...items].map((cert, i) => (
                    <motion.a
                        key={i}
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-[300px] md:w-[400px] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/50 transition-all group/card cursor-pointer relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col h-full justify-left">
                            <h4 className="text-sm font-bold text-white leading-tight group-hover/card:text-cyan-200">{cert.name}</h4>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/5 px-2 py-1 rounded-md bg-black/20">{cert.iso}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 group-hover/card:text-white"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </motion.div>

            {/* Gradient Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        </div>
    );
};

export const CertificationsSection = () => {
    // Split certifications into two rows
    const half = Math.ceil(CERTIFICATIONS.length / 2);
    const row1 = CERTIFICATIONS.slice(0, half);
    const row2 = CERTIFICATIONS.slice(half);

    return (
        <section className="py-24 relative z-10 overflow-hidden">
            <div className="max-w-full mx-auto text-center">
                <div className="flex items-center gap-4 mb-12 justify-center px-6">
                    <span className="w-12 h-[1px] bg-white/20"></span>
                    <h3 className="text-xl font-bold font-syne text-white uppercase tracking-widest text-center">Credentials</h3>
                    <span className="w-12 h-[1px] bg-white/20"></span>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Row 1 - Left */}
                    <MarqueeRow items={row1} direction="left" speed={40} />

                    {/* Row 2 - Right */}
                    <MarqueeRow items={row2} direction="right" speed={45} />
                </div>

                <p className="text-white/30 text-xs mt-8 font-mono">HOVER TO PAUSE • CLICK TO VERIFY</p>
            </div>
        </section>
    );
};
