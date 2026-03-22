import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import useChat from '../hooks/useChat';
import ChatWindow from './ChatWindow';

const JarvisBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const { messages, isLoading, sendMessage, clearChat } = useChat();

    // Drag state
    const constraintsRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [snappedSide, setSnappedSide] = useState('right');

    // Floating animation
    const floatY = useMotionValue(0);
    const ringRotation = useMotionValue(0);

    useEffect(() => {
        animate(floatY, [0, -10, 0], {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        });
        animate(ringRotation, [0, 360], {
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
        });
    }, [floatY, ringRotation]);

    const handleOrbClick = useCallback(() => {
        if (isDragging) return;
        setIsOpen(prev => !prev);
        if (!hasInteracted) setHasInteracted(true);
    }, [isDragging, hasInteracted]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleDragEnd = useCallback((event, info) => {
        setTimeout(() => setIsDragging(false), 100);
        const windowWidth = window.innerWidth;
        if (info.point.x < windowWidth / 2) {
            setSnappedSide('left');
        } else {
            setSnappedSide('right');
        }
    }, []);

    const showNotification = !isOpen && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant';

    return (
        <>
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9990]" />

            {/* Floating Jarvis Orb */}
            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={true}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onClick={handleOrbClick}
                style={{ y: isOpen ? 0 : floatY }}
                className={`fixed bottom-6 z-[9998] select-none touch-none
          ${snappedSide === 'right' ? 'right-4 md:right-8' : 'left-4 md:left-8'}`}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
            >
                {/* Outer rotating ring */}
                <motion.div
                    className="absolute -inset-3 rounded-full"
                    style={{ rotate: ringRotation }}
                >
                    <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20" />
                    {/* Orbit dots */}
                    {[0, 90, 180, 270].map((deg) => (
                        <div
                            key={deg}
                            className="absolute w-1.5 h-1.5 bg-cyan-400/60 rounded-full"
                            style={{
                                top: '50%', left: '50%',
                                transform: `rotate(${deg}deg) translateY(-32px) translate(-50%, -50%)`,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Pulse rings */}
                {!isOpen && (
                    <>
                        <motion.div
                            className="absolute -inset-4 rounded-full border border-cyan-400/15"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                        />
                        <motion.div
                            className="absolute -inset-6 rounded-full border border-cyan-400/10"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                        />
                    </>
                )}

                {/* Glow backdrop */}
                <div className={`absolute -inset-2 rounded-full blur-xl transition-all duration-700 ${isOpen ? 'bg-red-500/20' : 'bg-cyan-500/25'
                    }`} />

                {/* Main Orb */}
                <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden cursor-pointer
            transition-all duration-500 ring-2 ${isOpen
                        ? 'ring-red-500/60 shadow-lg shadow-red-500/30'
                        : 'ring-cyan-400/40 shadow-lg shadow-cyan-500/40'
                    }`}
                >
                    {/* Jarvis jarivs.mp4 */}
                    <video
                        src="/jarivs.mp4"
                        autoPlay loop muted playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Glass shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

                    {/* Close overlay */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="absolute inset-0 bg-red-600/70 rounded-full flex items-center justify-center"
                            >
                                <motion.svg
                                    initial={{ rotate: -90, scale: 0.5 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    exit={{ rotate: 90, scale: 0.5 }}
                                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </motion.svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notification badge */}
                {showNotification && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-black shadow-lg shadow-cyan-400/50"
                    >
                        <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-40" />
                        <span className="text-black text-[8px] font-black relative z-10">1</span>
                    </motion.div>
                )}

                {/* "Ask Jarvis" tooltip */}
                {!isOpen && !hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, x: snappedSide === 'right' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.5 }}
                        className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap
              ${snappedSide === 'right' ? 'right-full mr-4' : 'left-full ml-4'}`}
                    >
                        <div className="relative bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl px-4 py-2 shadow-xl shadow-cyan-500/10">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-cyan-400">
                                Ask <span className="text-white">Nova</span>
                            </span>
                            {/* Arrow */}
                            <div className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-black/90 border border-cyan-500/30 rotate-45
                ${snappedSide === 'right' ? '-right-1.5 border-l-0 border-b-0' : '-left-1.5 border-r-0 border-t-0'}`} />
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Chat Window */}
            <ChatWindow
                isOpen={isOpen}
                onClose={handleClose}
                messages={messages}
                isLoading={isLoading}
                sendMessage={sendMessage}
                clearChat={clearChat}
            />
        </>
    );
};

export default JarvisBot;
