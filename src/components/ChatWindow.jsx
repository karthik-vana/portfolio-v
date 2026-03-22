import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';

/* ─── Quick Actions ─── */
const QUICK_ACTIONS = [
    { label: "About Karthik", query: "Tell me about Karthik Vana in brief", icon: "👤" },
    { label: "Projects", query: "List Karthik's key projects briefly", icon: "🚀" },
    { label: "Skills", query: "What are Karthik's top skills?", icon: "⚡" },
    { label: "Experience", query: "Summarize Karthik's work experience", icon: "💼" },
    { label: "Resume", query: "Give me a quick summary of Karthik's resume", icon: "📄" },
];

/* ─── Social links ─── */
const SOCIALS = [
    { name: 'GitHub', url: 'https://github.com/karthik-vana', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/karthik-vana/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'Instagram', url: 'https://www.instagram.com/karthik_vana_/', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'X', url: 'https://x.com/karthikvana236', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
];

/* ─── Tool buttons for header dropdown ─── */
const HEADER_TOOLS = [
    {
        id: 'hero-intro', title: 'Play Hero Intro',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
        action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => window.location.reload(), 600); },
    },
    {
        id: 'scroll-top', title: 'Scroll to Top',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>,
        action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
        id: 'share', title: 'Share Portfolio',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
        action: () => {
            const url = window.location.origin || 'https://portfolio-v-smoky.vercel.app/';
            if (navigator.share) {
                navigator.share({ title: 'Karthik Vana — AI/ML Engineer', url }).catch(() => { });
            } else {
                navigator.clipboard.writeText(url).then(() => alert('Portfolio link copied to clipboard! 🔗'));
            }
        },
    },
    {
        id: 'download-resume', title: 'Download Resume',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
        action: () => {
            const link = document.createElement('a');
            link.href = '/KARTHIK VANA-CV.pdf';
            link.download = 'Karthik_Vana_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
    {
        id: 'contact', title: 'Email Karthik',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
        action: () => { window.open('mailto:karthikvana236@gmail.com?subject=Hi Karthik — Reaching out from your Portfolio', '_blank'); },
    },
];

/* ════════════════════════════════════════════════════════════════════
   PREMIUM NEURAL TTS ENGINE — Ultra-natural Indian female voice
   - PRIMARY: Neural TTS via /api/tts (en-IN-NeerjaNeural)
   - FALLBACK: Enhanced browser speechSynthesis
   - Sentence-level buffering (no word breaks)
   - Audio prefetching for zero-gap playback
   - Proper cancel/stop at any point
   - Streaming: speaks complete sentences as they arrive
════════════════════════════════════════════════════════════════════ */

class NovaTTSEngine {
    constructor() {
        this.queue = [];
        this.isSpeaking = false;
        this.isProcessing = false;
        this._stopped = false;
        this.onSpeakingChange = null;

        // Neural TTS (primary)
        this.currentAudio = null;
        this._apiAvailable = true;  // Assume API works until first failure
        this._prefetchCache = new Map(); // Prefetch audio for next sentences

        // Browser TTS (fallback)
        this.synth = window.speechSynthesis || null;
        this.browserVoice = null;
        this.keepAliveTimer = null;
        this._initBrowserVoices();
    }

    _initBrowserVoices() {
        if (!this.synth) return;
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            if (!voices.length) return;
            // Priority: Natural/Neural Indian → Indian → clear female
            this.browserVoice =
                voices.find(v => /neerja.*natural/i.test(v.name)) ||
                voices.find(v => /heera.*natural/i.test(v.name)) ||
                voices.find(v => /neerja/i.test(v.name)) ||
                voices.find(v => /heera/i.test(v.name)) ||
                voices.find(v => v.lang === 'en-IN' && /female/i.test(v.name)) ||
                voices.find(v => v.lang === 'en-IN') ||
                voices.find(v => /microsoft zira/i.test(v.name)) ||
                voices.find(v => /google.*english.*female/i.test(v.name)) ||
                voices.find(v => /samantha/i.test(v.name)) ||
                voices.find(v => /female/i.test(v.name) && v.lang.startsWith('en')) ||
                voices.find(v => v.lang.startsWith('en-') && !/male/i.test(v.name)) ||
                voices.find(v => v.lang.startsWith('en'));
            console.log('[Nova TTS] Browser voice:', this.browserVoice?.name);
        };
        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
        setTimeout(loadVoices, 300);
        setTimeout(loadVoices, 1500);
    }

    warmup() {
        // Warmup browser TTS
        if (this.synth) {
            const u = new SpeechSynthesisUtterance('');
            u.volume = 0;
            this.synth.speak(u);
        }
        // Pre-check API availability
        if (this._apiAvailable) {
            fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: 'Hello.' })
            }).then(r => {
                this._apiAvailable = r.ok;
                console.log('[Nova TTS] Neural API:', r.ok ? 'AVAILABLE ✓' : 'UNAVAILABLE ✗');
            }).catch(() => {
                this._apiAvailable = false;
                console.log('[Nova TTS] Neural API: UNAVAILABLE (network) — using browser fallback');
            });
        }
    }

    // ─── Text cleanup for speech ───
    _cleanForSpeech(text) {
        return text
            .replace(/<think>[\s\S]*?<\/think>/gi, '')  // Remove think blocks
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/[*_`#~]/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu, '')
            .replace(/[{}<>\[\]\\|@#$%^&=+~`"'◆•▪▸▶✔✓→–—·\/!;]/g, ' ')
            .replace(/^\s*[-]\s*/gm, '')
            .replace(/\n+/g, '. ')
            .replace(/\s+/g, ' ')
            .replace(/\.{2,}/g, '.')
            .replace(/,{2,}/g, ',')
            .replace(/\.\s*\./g, '.')
            .trim();
    }

    _splitIntoSentences(text) {
        const cleaned = this._cleanForSpeech(text);
        if (!cleaned) return [];
        const sentences = cleaned.match(/[^.!?]*[.!?]+(?:\s|$)/g) || [];
        return sentences.map(s => s.trim()).filter(s => s.length > 2);
    }

    _getTrailingText(text) {
        const cleaned = this._cleanForSpeech(text);
        if (!cleaned) return '';
        const sentences = cleaned.match(/[^.!?]*[.!?]+(?:\s|$)/g) || [];
        const matchedLen = sentences.join('').length;
        return cleaned.slice(matchedLen).trim();
    }

    // ─── NEURAL TTS: Fetch audio from /api/tts ───
    async _fetchNeuralAudio(text) {
        // Check prefetch cache first
        const cached = this._prefetchCache.get(text);
        if (cached) {
            this._prefetchCache.delete(text);
            return cached;
        }

        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error(`TTS API ${response.status}`);

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    // Prefetch audio for upcoming sentences (reduces gaps)
    _prefetch(text) {
        if (!this._apiAvailable || this._prefetchCache.has(text)) return;
        fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(r => r.ok ? r.blob() : null)
        .then(blob => {
            if (blob && !this._stopped) {
                this._prefetchCache.set(text, URL.createObjectURL(blob));
            }
        })
        .catch(() => {});
    }

    // Play neural audio
    _playNeuralAudio(url) {
        return new Promise((resolve) => {
            const audio = new Audio(url);
            this.currentAudio = audio;

            audio.onplay = () => {
                this.isSpeaking = true;
                this.onSpeakingChange?.(true);
            };

            audio.onended = () => {
                URL.revokeObjectURL(url);
                this.currentAudio = null;
                // Brief natural pause between sentences
                setTimeout(() => {
                    if (this.queue.length === 0) {
                        this.isSpeaking = false;
                        this.onSpeakingChange?.(false);
                    }
                    resolve();
                }, 120);
            };

            audio.onerror = () => {
                URL.revokeObjectURL(url);
                this.currentAudio = null;
                resolve();
            };

            audio.play().catch(() => {
                this.currentAudio = null;
                resolve();
            });
        });
    }

    // Speak via neural API
    async _speakNeural(text) {
        try {
            const audioUrl = await this._fetchNeuralAudio(text);
            if (this._stopped) {
                URL.revokeObjectURL(audioUrl);
                return;
            }
            await this._playNeuralAudio(audioUrl);
        } catch (err) {
            console.warn('[Nova TTS] Neural failed, switching to browser:', err.message);
            this._apiAvailable = false;
            await this._speakBrowser(text);
        }
    }

    // ─── BROWSER TTS FALLBACK ───
    _speakBrowser(text) {
        return new Promise((resolve) => {
            if (!this.synth || !text.trim()) { resolve(); return; }

            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.0;
            u.pitch = 1.1;
            u.volume = 0.8;
            u.lang = 'en-IN';
            if (this.browserVoice) u.voice = this.browserVoice;

            u.onstart = () => {
                this.isSpeaking = true;
                this.onSpeakingChange?.(true);
                this._startKeepAlive();
            };

            u.onend = () => {
                this._stopKeepAlive();
                setTimeout(() => {
                    if (!this.synth.speaking && !this.synth.pending && this.queue.length === 0) {
                        this.isSpeaking = false;
                        this.onSpeakingChange?.(false);
                    }
                    resolve();
                }, 80);
            };

            u.onerror = (e) => {
                this._stopKeepAlive();
                if (e.error !== 'interrupted' && e.error !== 'canceled') {
                    console.warn('[Nova TTS] Browser error:', e.error);
                }
                resolve();
            };

            this.synth.speak(u);
        });
    }

    _startKeepAlive() {
        this._stopKeepAlive();
        this.keepAliveTimer = setInterval(() => {
            if (this.synth?.speaking && !this.synth.paused) {
                this.synth.pause();
                setTimeout(() => { if (this.synth?.paused) this.synth.resume(); }, 50);
            }
        }, 10000);
    }

    _stopKeepAlive() {
        if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
        }
    }

    // ─── QUEUE PROCESSOR ───
    async _processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this._stopped = false;

        while (this.queue.length > 0 && !this._stopped) {
            const sentence = this.queue.shift();
            if (this._stopped) break;

            // Prefetch next sentence while current one plays
            if (this.queue.length > 0 && this._apiAvailable) {
                this._prefetch(this.queue[0]);
            }

            // Use neural API (primary) or browser TTS (fallback)
            if (this._apiAvailable) {
                await this._speakNeural(sentence);
            } else {
                await this._speakBrowser(sentence);
            }
        }

        this.isProcessing = false;
    }

    // ─── PUBLIC API ───
    speak(sentences) {
        if (!sentences.length) return;
        for (const s of sentences) {
            if (s.trim()) this.queue.push(s);
        }
        this._processQueue();
    }

    speakRemainder(text) {
        if (!text.trim() || text.length < 3) return;
        this.queue.push(text);
        this._processQueue();
    }

    stop() {
        this._stopped = true;
        this._stopKeepAlive();
        this.queue = [];
        this.isProcessing = false;

        // Stop neural audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        // Stop browser TTS
        if (this.synth) {
            this.synth.cancel();
        }

        // Clear prefetch cache
        for (const [, url] of this._prefetchCache) {
            URL.revokeObjectURL(url);
        }
        this._prefetchCache.clear();

        this.isSpeaking = false;
        this.onSpeakingChange?.(false);
    }

    destroy() {
        this.stop();
        this.onSpeakingChange = null;
    }
}

const ChatWindow = ({ isOpen, onClose, messages, isLoading, sendMessage, clearChat }) => {
    const [input, setInput] = useState('');
    const [showTools, setShowTools] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const voiceEnabledRef = useRef(true);
    const messagesRef = useRef(messages);

    // TTS Engine refs
    const ttsEngineRef = useRef(null);
    const spokenSentenceCountRef = useRef(0);
    const ttsMessageIndexRef = useRef(-1);

    // Initialize TTS Engine once
    useEffect(() => {
        const engine = new NovaTTSEngine();
        engine.onSpeakingChange = (speaking) => setIsSpeaking(speaking);
        ttsEngineRef.current = engine;
        return () => engine.destroy();
    }, []);

    // Sync refs
    useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Warmup TTS on first interaction
    const warmupTTS = useCallback(() => {
        ttsEngineRef.current?.warmup();
    }, []);

    /* ════════════════════════════════════════════════════════════════
       STREAMING TTS — Speak complete sentences as they arrive
       Key improvements:
       1. Only speaks COMPLETE sentences (no word breaks)
       2. Queues sentences sequentially (smooth flow)
       3. Handles remainder text when streaming finishes
       4. Chrome keepalive prevents long-text cutoff
    ════════════════════════════════════════════════════════════════ */
    useEffect(() => {
        const engine = ttsEngineRef.current;
        if (!engine) return;

        if (!voiceEnabled) {
            engine.stop();
            return;
        }

        const msgs = messages;
        const lastIdx = msgs.length - 1;
        if (lastIdx < 0) return;
        const last = msgs[lastIdx];

        // If last message is from user, reset TTS state
        if (last.role !== 'assistant') {
            if (ttsMessageIndexRef.current !== lastIdx) {
                engine.stop();
                spokenSentenceCountRef.current = 0;
                ttsMessageIndexRef.current = -1;
            }
            return;
        }

        // New assistant message detected — reset counters
        if (ttsMessageIndexRef.current !== lastIdx) {
            engine.stop();
            spokenSentenceCountRef.current = 0;
            ttsMessageIndexRef.current = lastIdx;
        }

        const text = last.content || '';
        const sentences = engine._splitIntoSentences(text);

        // Speak only NEW complete sentences
        const newSentences = sentences.slice(spokenSentenceCountRef.current);
        if (newSentences.length > 0) {
            engine.speak(newSentences);
            spokenSentenceCountRef.current = sentences.length;
        }

        // When streaming is done, speak any trailing text
        if (!isLoading) {
            const trailing = engine._getTrailingText(text);
            if (trailing && trailing.length > 2) {
                engine.speakRemainder(trailing);
                spokenSentenceCountRef.current++;
            }
        }
    }, [messages, isLoading, voiceEnabled]);

    const stopSpeaking = useCallback(() => {
        ttsEngineRef.current?.stop();
        spokenSentenceCountRef.current = 0;
        ttsMessageIndexRef.current = -1;
    }, []);

    // Wrap clearChat to also stop voice
    const handleClearChat = useCallback(() => {
        stopSpeaking();
        clearChat();
    }, [clearChat, stopSpeaking]);

    // Wrap onClose to also stop voice
    const handleCloseChat = useCallback(() => {
        stopSpeaking();
        onClose();
    }, [onClose, stopSpeaking]);

    // Focus input when opened + warmup TTS
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 500);
            warmupTTS();
        }
    }, [isOpen, warmupTTS]);

    // Close toolbox on outside click
    useEffect(() => {
        if (showTools) {
            const handler = () => setShowTools(false);
            setTimeout(() => document.addEventListener('click', handler), 50);
            return () => document.removeEventListener('click', handler);
        }
    }, [showTools]);

    const handleSubmit = useCallback((e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        warmupTTS();
        sendMessage(input);
        setInput('');
    }, [input, isLoading, sendMessage, warmupTTS]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const handleQuickAction = useCallback((query) => {
        warmupTTS();
        sendMessage(query);
    }, [sendMessage, warmupTTS]);

    /* ─── Voice Input (Web Speech API) — Continuous Mode ─── */
    const stopVoice = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current._manualStop = true;
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    const toggleVoice = useCallback(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Voice input is not supported in this browser. Please use Chrome.');
            return;
        }

        warmupTTS();

        if (isListening) {
            stopVoice();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';
        recognition._manualStop = false;

        const baseInputRef = { current: input.trim() ? input.trim() + ' ' : '' };
        const currentFinalRef = { current: '' };

        recognition.onresult = (event) => {
            let finalStr = '';
            let interimStr = '';
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalStr += event.results[i][0].transcript + ' ';
                } else {
                    interimStr += event.results[i][0].transcript;
                }
            }

            currentFinalRef.current = finalStr;
            const text = (baseInputRef.current + finalStr + interimStr).trim();
            setInput(text);

            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 80) + 'px';
                inputRef.current.scrollTop = inputRef.current.scrollHeight;
            }
        };

        recognition.onend = () => {
            if (!recognition._manualStop) {
                baseInputRef.current = (baseInputRef.current + currentFinalRef.current).trim() + ' ';
                currentFinalRef.current = '';
                try { recognition.start(); } catch { /* ignore */ }
            } else {
                setIsListening(false);
            }
        };

        recognition.onerror = (e) => {
            if (e.error === 'no-speech' || e.error === 'aborted') return;
            stopVoice();
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isListening, stopVoice, warmupTTS, input]);

    // Window animation
    const windowVariants = {
        hidden: { opacity: 0, scale: 0.4, y: 80, borderRadius: '50%', filter: 'blur(12px)' },
        visible: {
            opacity: 1, scale: 1, y: 0, borderRadius: '24px', filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 180, damping: 20, mass: 0.8 },
        },
        exit: {
            opacity: 0, scale: 0.3, y: 100, borderRadius: '50%', filter: 'blur(12px)',
            transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={windowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="jarvis-chat fixed bottom-[5.5rem] md:bottom-24 right-3 md:right-8 z-[9999]
                        w-[calc(100vw-1.5rem)] sm:w-[400px] md:w-[440px]"
                    style={{ transformOrigin: 'bottom right', height: 'min(620px, calc(100vh - 120px))' }}
                >
                    {/* ═══ Main Shell ═══ */}
                    <div className="relative flex flex-col w-full h-full rounded-[1.5rem] overflow-hidden
                        bg-[#060a12] border border-cyan-500/20
                        shadow-[0_0_80px_rgba(6,182,212,0.12),0_8px_32px_rgba(0,0,0,0.6)]">

                        {/* Scan line */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-50"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-[1.5rem] pointer-events-none z-40" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-[1.5rem] pointer-events-none z-40" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-[1.5rem] pointer-events-none z-40" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-[1.5rem] pointer-events-none z-40" />

                        {/* Subtle inner glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-cyan-500/[0.04] blur-3xl pointer-events-none" />

                        {/* ═══ HEADER ═══ */}
                        <div className="relative shrink-0 px-4 py-3 border-b border-cyan-500/10 z-30 bg-[#060a12]">
                            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                            <div className="flex items-center justify-between">
                                {/* Left — Identity */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/20">
                                            <video src="/jarivs.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060a12]">
                                            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-cyan-400/80">Karthik Vana</span>
                                        <span className="text-white font-bold text-[13px] tracking-wide font-syne leading-tight">NOVA AI</span>
                                        <span className="text-emerald-400/80 text-[8px] font-medium tracking-wider uppercase flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-emerald-400 rounded-full" />Online
                                        </span>
                                    </div>
                                </div>

                                {/* Right — Controls */}
                                <div className="flex items-center gap-0.5">
                                    {/* Hero Intro */}
                                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        onClick={HEADER_TOOLS[0].action}
                                        className="p-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors text-white/30 hover:text-cyan-400"
                                        title="Play Hero Intro">
                                        {HEADER_TOOLS[0].icon}
                                    </motion.button>

                                    {/* Voice Response Toggle */}
                                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            if (isSpeaking) {
                                                stopSpeaking();
                                                setVoiceEnabled(false);
                                            } else {
                                                setVoiceEnabled(!voiceEnabled);
                                            }
                                        }}
                                        className={`p-1.5 rounded-lg transition-colors ${isSpeaking ? 'bg-cyan-500/15 text-cyan-400' : voiceEnabled ? 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                                        title={isSpeaking ? 'Mute Nova' : voiceEnabled ? 'Voice ON — click to mute' : 'Voice OFF — click to unmute'}>
                                        {isSpeaking ? (
                                            <motion.svg animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></motion.svg>
                                        ) : voiceEnabled ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                        )}
                                    </motion.button>

                                    {/* Profile Card Toggle */}
                                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowProfile(!showProfile)}
                                        className={`p-1.5 rounded-lg transition-colors ${showProfile ? 'bg-cyan-500/15 text-cyan-400' : 'text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                                        title="Karthik's Card">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </motion.button>

                                    {/* Tools Menu */}
                                    <div className="relative">
                                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); setShowTools(!showTools); }}
                                            className={`p-1.5 rounded-lg transition-colors ${showTools ? 'bg-cyan-500/15 text-cyan-400' : 'text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                                            title="Tools">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                        </motion.button>
                                        <AnimatePresence>
                                            {showTools && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-[#0a0f1a] border border-cyan-500/20 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
                                                    onClick={(e) => e.stopPropagation()}>
                                                    {HEADER_TOOLS.map((tool) => (
                                                        <button key={tool.id}
                                                            onClick={() => { tool.action(); setShowTools(false); }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors text-left text-[12px]">
                                                            <span className="text-cyan-400/60">{tool.icon}</span>
                                                            {tool.title}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                                    {/* Clear */}
                                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
                                        onClick={handleClearChat} disabled={messages.length === 0}
                                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all ${messages.length > 0 ? 'text-white/40 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/20' : 'text-white/10 border-transparent cursor-not-allowed'}`}
                                        title="Clear conversation">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        <span className="text-[9px] uppercase tracking-widest font-bold">Clear</span>
                                    </motion.button>

                                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                                    {/* Close */}
                                    <motion.button whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                        onClick={handleCloseChat}
                                        className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* ═══ PROFILE CARD ═══ */}
                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="shrink-0 overflow-hidden z-20 bg-[#060a12] border-b border-cyan-500/10"
                                >
                                    <div className="px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/20">
                                                    <img src="/profile_photo.jpg" alt="Karthik Vana" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-[#060a12]">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-sm font-syne">Karthik Vana</h3>
                                                <p className="text-cyan-400/70 text-[11px] font-medium">AI/ML Engineer</p>
                                                <p className="text-white/30 text-[10px] mt-0.5">Building production-grade AI systems</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            {SOCIALS.map((social) => (
                                                <motion.a
                                                    key={social.name}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.15, y: -2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center
                                                        hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all group"
                                                    title={social.name}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                                                        className="text-white/40 group-hover:text-cyan-400 transition-colors">
                                                        <path d={social.icon} />
                                                    </svg>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ MESSAGES ═══ */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar overscroll-contain"
                            style={{ minHeight: 0 }}
                            data-lenis-prevent
                        >
                            {messages.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                    className="flex flex-col items-center justify-center h-full py-2">
                                    <motion.div
                                        animate={{ boxShadow: ['0 0 20px rgba(6,182,212,0.15)', '0 0 40px rgba(6,182,212,0.3)', '0 0 20px rgba(6,182,212,0.15)'] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-cyan-500/30 mb-4">
                                        <video src="/jarivs.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                        className="text-center mb-4">
                                        <h4 className="text-white font-bold text-base font-syne mb-1">
                                            Hello! I'm <span className="text-cyan-400">Nova</span>
                                        </h4>
                                        <p className="text-white/40 text-[12px] leading-relaxed max-w-[260px] mx-auto">
                                            Ask me anything — about Karthik, AI, coding, or just chat.
                                        </p>
                                    </motion.div>

                                    <div className="flex flex-wrap gap-2 justify-center max-w-[340px]">
                                        {QUICK_ACTIONS.map((action, i) => (
                                            <motion.button key={i}
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + i * 0.08 }}
                                                whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.5)' }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleQuickAction(action.query)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] text-white/60 text-[11px]
                                                    hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all duration-300 bg-white/[0.02]">
                                                <span className="text-[10px]">{action.icon}</span>
                                                {action.label}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                                        className="mt-5 flex items-center gap-2">
                                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/10" />
                                        <span className="text-[7px] text-white/15 tracking-[0.2em] uppercase font-medium">Powered by Groq</span>
                                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/10" />
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg, idx) => (
                                        <MessageBubble key={idx} message={msg} index={idx} />
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ═══ QUICK ACTIONS BAR (in conversation) ═══ */}
                        {messages.length > 0 && (
                            <div className="shrink-0 px-3 py-1.5 border-t border-cyan-500/[0.06] overflow-x-auto no-scrollbar z-20 bg-[#060a12]">
                                <div className="flex gap-1.5 w-max">
                                    {QUICK_ACTIONS.map((action, i) => (
                                        <button key={i} onClick={() => handleQuickAction(action.query)}
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-white/30 hover:text-cyan-400
                                                hover:bg-cyan-500/[0.06] border border-transparent hover:border-cyan-500/20 transition-all whitespace-nowrap">
                                            <span className="text-[9px]">{action.icon}</span>{action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══ INPUT BAR ═══ */}
                        <div className="shrink-0 px-4 py-3 border-t border-cyan-500/10 z-20 bg-[#060a12] relative">
                            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

                            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                                <div className="flex-1 relative group">
                                    <div className="absolute -inset-1 rounded-2xl bg-cyan-500/0 group-focus-within:bg-cyan-500/[0.04] transition-all duration-500 blur-sm" />
                                    <textarea
                                        ref={inputRef}
                                        rows={1}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isListening ? "🎤 Listening... Speak now" : "Ask Nova anything..."}
                                        disabled={isLoading}
                                        className={`relative w-full bg-white/[0.05] border rounded-xl px-4 py-2.5 text-[13px] text-white
                                            placeholder:text-white/25 focus:outline-none focus:bg-white/[0.08] resize-none
                                            focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-500 disabled:opacity-40
                                            no-scrollbar overflow-y-auto
                                            ${isListening ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] placeholder:text-red-400/50' : 'border-white/[0.1] focus:border-cyan-500/40'}`}
                                        style={{ height: 'auto', maxHeight: '80px' }}
                                    />
                                </div>

                                {/* Mic Button */}
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleVoice}
                                    className={`relative p-2.5 rounded-xl overflow-hidden shrink-0 transition-all duration-300
                                        ${isListening ? 'text-white' : 'text-white/40 hover:text-cyan-400'}`}
                                    title={isListening ? 'Stop listening' : 'Voice input'}
                                >
                                    {isListening && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 bg-red-500/30 rounded-xl"
                                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            <motion.div
                                                className="absolute -inset-1 bg-red-500/20 rounded-xl blur-md"
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                            />
                                        </>
                                    )}
                                    <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke={isListening ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="23" />
                                        <line x1="8" y1="23" x2="16" y2="23" />
                                    </svg>
                                </motion.button>

                                {/* Send Button */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="relative p-2.5 rounded-xl overflow-hidden shrink-0 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <div className={`absolute inset-0 transition-all duration-500 ${input.trim() && !isLoading
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30' : 'bg-white/[0.06]'
                                        }`} />
                                    {isLoading ? (
                                        <motion.svg animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                            className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                                        </motion.svg>
                                    ) : (
                                        <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                        </svg>
                                    )}
                                </motion.button>
                            </form>

                            <div className="flex items-center justify-center gap-2 mt-1.5">
                                <span className="text-[7px] text-white/10 tracking-[0.15em] uppercase">Nova AI • Karthik Vana</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWindow;
