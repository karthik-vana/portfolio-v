// Vercel Serverless Function — Neural TTS via Microsoft Edge
// Uses en-IN-NeerjaNeural: Natural Indian female voice
// Free, no API key needed — uses Microsoft's Edge speech service

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text, rate, pitch, volume } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
    }

    // Limit text length to prevent abuse
    const cleanText = text.trim().slice(0, 2000);

    try {
        const tts = new MsEdgeTTS();
        await tts.setMetadata(
            "en-IN-NeerjaNeural",
            OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
        );

        // Generate SSML with prosody controls for natural speech
        const speechRate = rate || "0%";      // "-10%" slower, "+10%" faster
        const speechPitch = pitch || "+2%";   // Slight warmth
        const speechVolume = volume || "0%";

        const ssml = `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-IN">
  <voice name="en-IN-NeerjaNeural">
    <prosody rate="${speechRate}" pitch="${speechPitch}" volume="${speechVolume}">
      ${cleanText}
    </prosody>
  </voice>
</speak>`.trim();

        // Use toStream for the text (msedge-tts builds SSML internally)
        const readable = tts.toStream(cleanText);
        const chunks = [];

        await new Promise((resolve, reject) => {
            readable.on('data', (chunk) => {
                // Handle chunked audio data
                if (chunk && chunk.audio) {
                    chunks.push(Buffer.from(chunk.audio));
                } else if (Buffer.isBuffer(chunk)) {
                    chunks.push(chunk);
                }
            });
            readable.on('end', resolve);
            readable.on('error', reject);
            // Timeout after 8 seconds
            setTimeout(() => reject(new Error('TTS generation timed out')), 8000);
        });

        if (chunks.length === 0) {
            throw new Error('No audio data generated');
        }

        const audioBuffer = Buffer.concat(chunks);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(audioBuffer);
    } catch (error) {
        console.error('[TTS Error]:', error.message);
        res.status(500).json({
            error: 'Voice generation failed',
            message: error.message
        });
    }
}
