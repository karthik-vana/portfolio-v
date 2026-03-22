import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Inline Markdown ─── */
const renderInline = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const codeMatch = remaining.match(/`(.+?)`/);

        let firstMatch = null;
        let firstIdx = remaining.length;

        if (boldMatch && boldMatch.index < firstIdx) { firstMatch = 'bold'; firstIdx = boldMatch.index; }
        if (codeMatch && codeMatch.index < firstIdx) { firstMatch = 'code'; firstIdx = codeMatch.index; }

        if (!firstMatch) { parts.push(remaining); break; }
        if (firstIdx > 0) parts.push(remaining.slice(0, firstIdx));

        if (firstMatch === 'bold') {
            parts.push(<strong key={key++} className="font-semibold text-white">{boldMatch[1]}</strong>);
            remaining = remaining.slice(firstIdx + boldMatch[0].length);
        } else {
            parts.push(
                <code key={key++} className="bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-cyan-500/10">
                    {codeMatch[1]}
                </code>
            );
            remaining = remaining.slice(firstIdx + codeMatch[0].length);
        }
    }
    return parts;
};

/* ─── Block Markdown ─── */
const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = '';

    lines.forEach((line, idx) => {
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${idx}`} className="bg-black/50 rounded-xl p-3 my-2 text-[11px] font-mono overflow-x-auto text-cyan-300 border border-cyan-500/15">
                        <code>{codeContent.trim()}</code>
                    </pre>
                );
                codeContent = '';
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }
        if (inCodeBlock) { codeContent += line + '\n'; return; }

        // Headers
        if (line.startsWith('### ')) {
            elements.push(<h4 key={idx} className="font-bold text-[13px] mt-2.5 mb-1 text-cyan-400">{line.slice(4)}</h4>);
            return;
        }
        if (line.startsWith('## ')) {
            elements.push(<h3 key={idx} className="font-bold text-sm mt-2.5 mb-1 text-cyan-400">{line.slice(3)}</h3>);
            return;
        }

        // Bullets
        if (line.trim().match(/^[-•*]\s/)) {
            const content = line.trim().slice(2);
            elements.push(
                <div key={idx} className="flex gap-2 ml-1 my-0.5">
                    <span className="text-cyan-500/70 mt-[3px] text-[8px] shrink-0">◆</span>
                    <span className="flex-1 leading-relaxed">{renderInline(content)}</span>
                </div>
            );
            return;
        }

        // Numbered lists
        const numMatch = line.trim().match(/^(\d+)\.\s(.+)/);
        if (numMatch) {
            elements.push(
                <div key={idx} className="flex gap-2 ml-1 my-0.5">
                    <span className="text-cyan-400/60 font-bold text-[11px] min-w-[16px] shrink-0">{numMatch[1]}.</span>
                    <span className="flex-1 leading-relaxed">{renderInline(numMatch[2])}</span>
                </div>
            );
            return;
        }

        // Empty
        if (line.trim() === '') { elements.push(<div key={idx} className="h-1.5" />); return; }

        // Paragraph
        elements.push(<p key={idx} className="my-0.5 leading-relaxed">{renderInline(line)}</p>);
    });

    return elements;
};

/* ─── Typing Indicator ─── */
const TypingIndicator = () => (
    <div className="flex items-center gap-3 py-2 px-1">
        <div className="relative flex items-center gap-1.5">
            {/* Scanning bar */}
            <motion.div
                className="absolute -inset-y-2 w-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full z-10"
                animate={{ x: [0, 70, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-cyan-400/80 text-[10px] tracking-[0.2em] font-mono mr-1">
                ANALYZING
            </span>
            <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        className="w-1 h-3 bg-cyan-500/60 rounded-full"
                        animate={{ scaleY: [1, 2.2, 1], backgroundColor: ['rgba(6,182,212,0.4)', 'rgba(6,182,212,1)', 'rgba(6,182,212,0.4)'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    />
                ))}
            </div>
        </div>
    </div>
);

/* ─── Message Bubble ─── */
const MessageBubble = memo(({ message, index }) => {
    const isUser = message.role === 'user';
    const isStreaming = message.role === 'assistant' && message.content === '';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-[88%]`}>
                {/* Nova label + copy */}
                {!isUser && (
                    <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
                        <div className="flex items-center gap-2">
                            <div className="w-[18px] h-[18px] rounded-full overflow-hidden ring-1 ring-cyan-500/30">
                                <video src="/jarivs.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-cyan-400/60">Nova</span>
                        </div>
                        {!isStreaming && (
                            <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleCopy}
                                className="text-cyan-400/30 hover:text-cyan-400 transition-colors"
                                title="Copy">
                                {copied ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </motion.button>
                        )}
                    </div>
                )}

                {/* Bubble */}
                <div className={`relative overflow-hidden ${isUser ? 'rounded-2xl rounded-br-lg' : 'rounded-2xl rounded-bl-lg'}`}>
                    {/* Left accent line for Nova */}
                    {!isUser && !isStreaming && (
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyan-400/50 via-cyan-400/25 to-transparent" />
                    )}

                    <div className={`px-4 py-3 text-[13px] leading-relaxed ${isUser
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/25 text-white'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/90'
                        }`}>
                        {isStreaming ? (
                            <TypingIndicator />
                        ) : (
                            <div className="jarvis-msg-content">{renderMarkdown(message.content)}</div>
                        )}
                    </div>

                    {/* Shimmer effect */}
                    {!isUser && !isStreaming && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.04] to-transparent pointer-events-none"
                        />
                    )}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                    <span className={`text-[9px] text-white/20 mt-1 block ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
                        {message.timestamp}
                    </span>
                )}
            </div>
        </motion.div>
    );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;
