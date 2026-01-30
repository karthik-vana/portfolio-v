import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Credit Card Failure Prediction",
        category: "Machine Learning / Fraud Detection",
        description: "A robust predictive model to identify potential credit card failures and fraudulent transactions using advanced classification algorithms.",
        tech: ["Python", "Scikit - Learn", "Pandas"],
        color: "from-red-500/20 to-pink-500/20",
        id: "01",
        link: "https://github.com/karthik-vana/CREDIT-CARD_PREDICTION-"
    },
    {
        title: "COVID-19 Forecasting",
        category: "Time Series Analysis",
        description: "Data-driven forecasting model to predict COVID-19 spread trends, utilizing historical data for accurate future projections.",
        tech: ["Python", "Time Series", "Matplotlib"],
        color: "from-blue-500/20 to-cyan-500/20",
        id: "02",
        link: "https://github.com/karthik-vana/COVID-19_Forecasting"
    },
    {
        title: "Pizza Store Analysis",
        category: "Data Analysis / Visualization",
        description: "Comprehensive analysis of pizza store delivery times and operational efficiency to optimize service performance.",
        tech: ["Python", "Seaborn", "Data Viz"],
        color: "from-yellow-500/20 to-orange-500/20",
        id: "03",
        link: "https://github.com/karthik-vana/PIZZA-STORE-Delivery-Time-Analysis"
    },
    {
        title: "UIDAI Data Hackathon 2026",
        category: "Hackathon / Data Science",
        description: "Innovative solution developed for the UIDAI Hackathon, leveraging data science to solve complex identity and verification challenges.",
        tech: ["Python", "ML", "Big Data"],
        color: "from-emerald-500/20 to-teal-500/20",
        id: "04",
        link: "https://github.com/karthik-vana/UIDAI-Data-Hackathon-2026"
    },
    {
        title: "Telecom Retention System",
        category: "Predictive Modeling / Churn",
        description: "Customer churn prediction system for the telecom industry, designed to identify at-risk customers and improve retention strategies.",
        tech: ["Python", "XGBoost", "Analytics"],
        color: "from-purple-500/20 to-indigo-500/20",
        id: "05",
        link: "https://github.com/karthik-vana/Telecom-Customer-Retention-System"
    },
    {
        title: "Car Price Prediction",
        category: "ML / Predictive Modeling",
        description: "Intelligent car valuation system achieving 97.3% accuracy using Extra Trees Regressor. Helps users make data-driven buying and selling decisions.",
        tech: ["Python", "Flask", "Scikit-Learn"],
        color: "from-fuchsia-500/20 to-purple-600/20",
        id: "06",
        link: "https://github.com/karthik-vana/Car-Price-Prediction"
    }
];

const ProjectCard = ({ project }) => {
    return (
        <div className={`relative flex-shrink-0 w-[85vw] md:w-[60vw] h-[60vh] md:h-[70vh] rounded-[3rem] overflow-hidden border border-white/10 bg-gradient-to-br ${project.color} backdrop-blur-sm group`}>
            {/* Background Noise/Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />

            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <span className="text-6xl md:text-8xl font-syne font-bold text-white/5">{project.id}</span>
                    <div className="flex gap-2">
                        {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/60 uppercase tracking-wider bg-black/20 backdrop-blur">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="max-w-2xl">
                    <h3 className="text-sm md:text-base text-white/50 mb-2 uppercase tracking-widest font-mono">{project.category}</h3>
                    <h2 className="text-4xl md:text-6xl font-syne font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-colors">
                        {project.title}
                    </h2>
                    <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-lg">
                        {project.description}
                    </p>
                </div>

                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 transition-transform hover:scale-105 duration-300">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                        View Repository
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = sectionRef.current;

            // Function to calculate scroll distance
            const getScrollAmount = () => {
                // Scroll strictly to the end of the container (which now includes right padding)
                return -(container.scrollWidth - window.innerWidth);
            };

            const tween = gsap.to(container, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "+=4000", // Slower, more deliberate scroll
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });
        }, triggerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={triggerRef} className="relative h-screen bg-black overflow-hidden">
            {/* Header Absolute */}
            <div className="absolute top-12 left-8 md:left-24 z-20 mix-blend-difference pointer-events-none">
                <h2 className="text-white text-xl md:text-2xl font-mono uppercase tracking-widest flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-white"></span>
                    Selected Works
                </h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div ref={sectionRef} className="h-full flex items-center px-8 md:px-24 gap-8 md:gap-16 w-max">
                {projects.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}

                {/* End Card */}
                {/* End Card */}
                <div className="flex-shrink-0 w-[85vw] md:w-[60vw] h-[60vh] md:h-[70vh] flex items-center justify-center">
                    <a
                        href="https://github.com/karthik-vana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 cursor-pointer"
                    >
                        <h2 className="text-4xl md:text-6xl text-white/20 group-hover:text-white transition-colors duration-500 font-syne font-bold">
                            More on GitHub
                        </h2>
                        <span className="text-4xl md:text-6xl text-white/20 group-hover:text-white group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500 font-syne font-bold">
                            ↗
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;
