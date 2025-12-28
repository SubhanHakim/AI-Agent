
// Simple synth for sci-fi UI sounds using Web Audio API
// No assets required

export const playSound = (type: 'click' | 'send' | 'receive' | 'error') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
            // High pitched short blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'send') {
            // Sci-fi sweep up
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'receive') {
            // Digital data incoming sound
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.setValueAtTime(800, now + 0.05);
            osc.frequency.setValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'error') {
            // Low buzz
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }

    } catch (e) {
        console.error("Audio play failed (user interaction needed first?)", e);
    }
};
