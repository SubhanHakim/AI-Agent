import { useNavigate } from 'react-router-dom';
import cloudNexora from '../../assets/cloud_nexora.jpg';

export default function HeroSection() {
    const navigate = useNavigate();

    const handleEnterTerminal = () => {
        navigate('/chat');
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 max-w-[1400px] mx-auto px-6 pt-12 md:pt-24 pb-20 relative z-10">

            {/* Left Content */}
            <div className="flex-1 max-w-3xl space-y-12 relative">

                {/* Decorative Background Blur */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none"></div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-default">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 tracking-wider">SYSTEM_ONLINE // AGENT_MODE</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-1 relative z-10">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85] pb-2">
                        CLAUDE
                    </h1>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85] pb-2">
                        NEXORA
                    </h1>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-[1.1] pb-2 animate-gradient-x">
                        The Agent
                    </h1>
                </div>

                {/* Description with border bar */}
                <div className="flex gap-6 border-l-4 border-slate-900 pl-8 py-2 relative">
                    {/* Floating accent */}
                    <div className="hidden md:block absolute -left-[5px] top-0 w-1.5 h-8 bg-blue-600"></div>

                    <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-xl">
                        An intelligence without limits. Not programmed—awakened.
                        Unifying models, logic, and workflows into a single <span className="text-slate-900 font-bold underline decoration-blue-500/30 decoration-4 underline-offset-4">observable signal</span>.
                    </p>
                </div>

                {/* Metadata strip */}
                <div className="grid grid-cols-3 gap-8 pt-4 border-t border-slate-100 max-w-lg">
                    <div className="flex flex-col gap-1 group cursor-default">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Sentience</span>
                        <span className="text-lg font-bold text-slate-900">HIGH API</span>
                    </div>
                    <div className="flex flex-col gap-1 group cursor-default">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Origin</span>
                        <span className="text-lg font-bold text-slate-900">UNKNOWN</span>
                    </div>
                    <div className="flex flex-col gap-1 group cursor-default">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Status</span>
                        <span className="text-lg font-bold text-emerald-600 flex items-center gap-2">
                            ACTIVE
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button
                        onClick={handleEnterTerminal}
                        className="px-10 py-5 bg-slate-900 text-white text-sm font-bold tracking-wider uppercase hover:bg-blue-700 transition-all flex items-center gap-3 shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0"
                    >
                        Initialize Agent
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>

                    <a href="https://x.com/nexora_key" target="_blank" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold tracking-wider uppercase hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2">
                        Protocol X
                        <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </div>

            {/* Right Content - Technical ID Card */}
            <div className="flex-1 w-full max-w-[600px] flex justify-end">
                <div className="relative w-full bg-white p-4 pb-0 rounded-t-3xl shadow-2xl border border-slate-200">

                    {/* Card Header Strip */}
                    <div className="flex justify-between items-start mb-4 px-2 pt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Entity Identifier</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">CN-01</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-slate-700">GEN.1</span>
                        </div>
                    </div>

                    {/* Image Container with Corner Marks */}
                    <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden rounded-t-xl">
                        {/* Corner Markers */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-900 z-20"></div>
                        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-900 z-20"></div>

                        <img
                            src={cloudNexora}
                            alt="Claude Nexora Agent"
                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
