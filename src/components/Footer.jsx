import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Footer = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Parallax & Opacity effects
    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

    const socialLinks = [
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/karthik-vana/",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            color: "hover:text-[#0077b5]"
        },
        {
            name: "Instagram",
            url: "https://www.instagram.com/karthik_vana_",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.3c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
            ),
            color: "hover:text-[#E1306C]"
        },
        {
            name: "X (Twitter)",
            url: "https://x.com/@karthikvana236",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: "hover:text-white"
        },
        {
            name: "YouTube",
            url: "https://www.youtube.com/@KarthikVana",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
            ),
            color: "hover:text-[#FF0000]"
        },
        {
            name: "Email",
            url: "mailto:karthikvana236@gmail.com",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: "hover:text-[#FFA500]" // Gold/Orange for Email
        }
    ];

    return (
        <section ref={containerRef} className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-24">

            {/* 1. Animated Radial Glow Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-screen" />
            </div>

            <motion.div
                style={{ y, opacity, scale }}
                className="relative z-10 text-center px-4"
            >
                {/* 2. Main "Let's Connect" Text with Gradient & Mask */}
                <h2 className="text-6xl md:text-9xl font-syne font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white/80 to-white/20 select-none">
                    LET'S<br />CONNECT
                </h2>

                <p className="text-white/40 text-lg md:text-2xl font-mono max-w-2xl mx-auto mb-16 tracking-wide">
                    READY TO BUILD THE IMPOSSIBLE?
                </p>

                {/* 3. Social Media Links Row */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`group relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 ${link.color} overflow-hidden`}
                        >
                            {/* Hover Shine Effect */}
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                {link.icon}
                                <span className="text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-8 group-hover:relative group-hover:bottom-0">
                                    {link.name}
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>

            </motion.div>

            {/* 4. Bottom Footer Creds */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8 md:px-16 text-xs text-white/20 font-mono uppercase tracking-widest">
                <span>© 2026 Karthik Vana</span>
                <span>Designed & Engineered</span>
            </div>
        </section>
    );
};

export default Footer;
