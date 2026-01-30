import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fonts = {
  header: 'font-syne',
  body: 'font-satoshi'
};

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [isMuted, setIsMuted] = useState(false); // Default to NOT muted (try to autoplay)
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const audioRef = useRef(null);

  // Initial Playback & Audio Autoplay Logic
  useEffect(() => {
    // Video 1 Autoplay
    if (video1Ref.current) {
      video1Ref.current.play().catch(e => console.log("Video auto-play blocked", e));
    }

    // Audio Autoplay
    const playAudio = () => {
      if (audioRef.current && currentVideo === 1) {
        audioRef.current.volume = 1;
        audioRef.current.currentTime = 0; // Forced reset to start

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio autoplay prevented. Waiting for interaction.", error);
            // Optional fallback: User hasn't interacted yet.
            setIsMuted(true);
          });
        }
      }
    };

    playAudio();

    // Fallback: If browser blocked it, play on first click anywhere
    const handleInteraction = () => {
      // Only if still in video 1
      if (audioRef.current && currentVideo === 1) {
        if (audioRef.current.paused || isMuted) {
          setIsMuted(false);
          audioRef.current.volume = 1;
          audioRef.current.currentTime = video1Ref.current ? video1Ref.current.currentTime : 0; // Sync to video
          audioRef.current.play().catch(() => { });
        }
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);

  }, [currentVideo]); // Depend on currentVideo to only try playing if frame 1

  const handleVideo1Ended = () => {
    // Stop audio IMMEDIATELY and precisely when walking stops
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Switch to Video 2
    setCurrentVideo(2);

    // Play Video 2
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(e => console.log("V2 play error", e));
    }
  };

  const handleVideo2Ended = () => {
    // Loop Video 2
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play();
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      setIsMuted(false);
      if (currentVideo === 1) audioRef.current.play();
    } else {
      setIsMuted(true);
      audioRef.current.pause();
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-grid-white/[0.02]">
      {/* Background Videos Container */}
      <div className="absolute inset-0 z-0">
        {/* Video 1 */}
        <motion.video
          ref={video1Ref}
          src="/hero-video1.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted // Video must be muted to autoplay reliably
          playsInline
          onEnded={handleVideo1Ended}
          initial={{ opacity: 1 }}
          animate={{ opacity: currentVideo === 1 ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Video 2 */}
        <motion.video
          ref={video2Ref}
          src="/hero-video2.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          onEnded={handleVideo2Ended}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentVideo === 2 ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />

        {/* Audio Element - Looping to ensure continuous sound during the walk */}
        <audio
          ref={audioRef}
          src="/footsteps.mp3"
          preload="auto"
          loop
        />
      </div>

      {/* Content Frame */}
      <div className="relative z-20 h-full flex flex-col justify-between p-8 md:p-16 max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            {/* Logo Video Menu - Click to Reset Sequence */}
            <button
              onClick={() => {
                // RESET LOGIC
                setCurrentVideo(1);
                // We don't force unmute here to respect user choice, 
                // but we DO ensure it plays if enabled.

                // Reset Video 1
                if (video1Ref.current) {
                  video1Ref.current.currentTime = 0;
                  video1Ref.current.play().catch(() => { });
                }

                // Reset Audio
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.volume = 1; // Ensure volume is up
                  // Only play if not muted state
                  if (!isMuted) audioRef.current.play().catch(() => { });
                }
              }}
              className="relative group cursor-pointer"
            >
              <video
                src="/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-16 h-16 object-cover rounded-full border border-white/10 hover:border-white/50 transition-colors"
              />
              {/* Tooltip */}
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 text-white/50 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                RESTART
              </span>
            </button>
            {/* Name */}
            <div className="text-white font-bold tracking-tighter text-xl mix-blend-difference hidden md:block">
              KARTHIK VANA
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-sm md:text-base font-satoshi text-white/90">
            <a
              href="https://www.linkedin.com/in/karthik-vana/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://wa.me/919398517097?text=Hi%20Karthik,%20I%20saw%20your%20portfolio..."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-2"
            >
              {/* WhatsApp Icon */}
              <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-3.104-5.348-1.504-12.217 3.522-15.003 5.01-2.778 11.2 0 13.916 5.023 2.705 5.01 1.432 11.39-3.518 14.162-2.31 1.294-4.888 1.488-7.394.636l-6.155 1.545 2.193-4.148c-1.34-2.502-1.62-5.462-.482-8.216 1.932-4.664 7.21-6.732 11.777-4.613 4.575 2.122 6.643 7.6 4.673 12.26-1.92 4.54-7.054 6.65-11.66 4.71-1.63-.687-3.036-1.745-4.135-3.058l-4.42 1.862zm3.32-6.505c.877 1.482 2.162 2.65 3.69 3.323 3.903 1.638 8.16-.704 9.53-4.084 1.36-3.376-.52-7.23-4.38-8.913-3.86-1.682-8.084.6-9.52 3.988-.587 1.385-.71 2.87-.367 4.29l-1.353 2.56.333-.67c.394-.852.888-1.66 1.47-2.434l-1.405 2.66.495-1.036z" /></svg>
              Get in Touch
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 translate-y-[-10%]">
          <h1 className={`${fonts.header} text-6xl md:text-9xl font-bold leading-none tracking-tighter text-white mix-blend-overlay`}>
            AI/ML<br />ENGINEER
          </h1>

          <div className="max-w-xs md:max-w-sm flex flex-col gap-4">
            <p className={`${fonts.body} text-lg md:text-xl text-gray-200 leading-relaxed font-light`}>
              Building intelligent systems using advanced orchestration and state-of-the-art models.
            </p>

            <div className="h-px w-full bg-white/20 mt-4" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
