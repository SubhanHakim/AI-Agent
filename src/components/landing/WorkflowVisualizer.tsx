import { useState, useEffect } from 'react';

import cloudNexora from '../../assets/cloud_nexora.jpg';

export default function WorkflowVisualizer() {
    const [step, setStep] = useState(0);

    // Animation loop for the visualization
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4); // 4 steps logic
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="code" className="mt-32 w-full max-w-6xl mx-auto px-4">
            <div className="relative p-10 rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden min-h-[450px] flex flex-col items-center justify-center">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[80px] -z-10 pointer-events-none" />

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center w-full z-10 relative">

                    {/* Step 1: Raw Input */}
                    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col gap-4 ${step === 0 || step === 3 ? 'border-blue-500 bg-white shadow-[0_8px_30px_rgba(59,130,246,0.15)] scale-105' : 'border-slate-100 bg-slate-50 grayscale opacity-60'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg shadow-sm ${step === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-800">Raw Data Stream</h3>
                        </div>

                        {/* Fake Terminal */}
                        <div className="mt-2 bg-slate-900 rounded-lg p-4 font-mono text-xs leading-relaxed shadow-inner border border-slate-800 overflow-hidden relative">
                            <div className="absolute top-2 right-2 flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-1 pt-2">
                                <div className="flex gap-2">
                                    <span className="text-slate-500">$</span>
                                    <span className="text-blue-300">stream</span>
                                    <span className="text-slate-300">--source=solana</span>
                                </div>
                                <div className="text-slate-400">Scanning mempool...</div>
                                <div className="text-emerald-400 font-bold bg-emerald-500/10 inline-block px-1 rounded animate-pulse">
                                    &gt; NEW PAIR DETECTED
                                </div>
                                <div className="text-slate-300 truncate">Token: $NEXORA (CA: 8xP...)</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Processing (Center) */}
                    <div className="flex flex-col items-center justify-center relative py-8">
                        {/* Connecting Lines (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-[-10%] right-[-10%] h-[2px] bg-slate-100 -z-10 overflow-hidden rounded-full">
                            <div className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-transform duration-1000 ease-in-out ${step === 1 ? 'translate-x-[200%]' : '-translate-x-full'}`} />
                        </div>

                        {/* Arrows (Mobile) */}
                        <div className="md:hidden py-4 text-slate-300">
                            <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </div>

                        {/* Central Node */}
                        <div className={`relative z-10 w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 bg-white overflow-hidden ${step === 1 ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-110' : 'border-slate-100 shadow-sm'}`}>
                            {step === 1 && (
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin z-20"></div>
                            )}
                            <div className="absolute inset-1 rounded-full overflow-hidden z-10">
                                <img src={cloudNexora} alt="Claude Nexora" className={`w-full h-full object-cover transition-all duration-500 ${step === 1 ? 'scale-110' : 'grayscale opacity-50'}`} />
                            </div>
                        </div>
                        <div className={`mt-6 text-xs font-black tracking-[0.2em] uppercase transition-colors ${step === 1 ? 'text-blue-600' : 'text-slate-300'}`}>
                            {step === 1 ? 'PROCESSING...' : 'CLAUDE NEXORA'}
                        </div>
                    </div>

                    {/* Step 3: Structured Output */}
                    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col gap-4 ${step === 2 || step === 3 ? 'border-emerald-500 bg-white shadow-[0_8px_30px_rgba(16,185,129,0.15)] scale-105' : 'border-slate-100 bg-slate-50 grayscale opacity-60'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg shadow-sm ${step === 2 || step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-800">Alpha Signal</h3>
                        </div>

                        {/* Code Block */}
                        <div className="mt-2 bg-slate-50 rounded-lg p-4 font-mono text-xs border border-slate-200 shadow-inner">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-slate-400 text-[10px]">
                                    <span>output.json</span>
                                    <span>24ms</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-purple-600 font-bold">{"{"}</span>
                                </div>
                                <div className="pl-4 space-y-1">
                                    <div><span className="text-slate-500">"token":</span> <span className="text-blue-600 font-bold">"$NEXORA"</span>,</div>
                                    <div><span className="text-slate-500">"sentiment":</span> <span className="text-emerald-600 font-bold">"BULLISH"</span>,</div>
                                    <div><span className="text-slate-500">"confidence":</span> <span className="text-amber-500 font-bold">99.9%</span></div>
                                </div>
                                <div>
                                    <span className="text-purple-600 font-bold">{"}"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Progress Bar Container */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="text-center mt-8 space-y-2">
                <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
                    System Architecture v1.0
                </p>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Real-time visualization of the autonomous extraction and analysis pipeline.
                </p>
            </div>
        </div>
    );
}
