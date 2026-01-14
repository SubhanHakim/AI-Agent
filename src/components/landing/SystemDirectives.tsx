export default function SystemDirectives() {
    return (
        <section id="directives" className="w-full max-w-6xl mx-auto mt-32 px-6">
            <div className="flex items-center gap-6 mb-16">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-slate-200 flex-1" />
                <h2 className="text-sm md:text-base font-mono font-bold text-slate-400 tracking-[0.3em] uppercase">System_Directives</h2>
                <div className="h-px bg-gradient-to-l from-transparent via-slate-300 to-slate-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rule 01 - Cold Efficiency */}
                <div className="relative group p-8 bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    {/* Hover Gradient Border Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 rounded-3xl transition-colors pointer-events-none" />

                    {/* Background Number Watermark */}
                    <div className="absolute -bottom-4 -right-4 text-9xl font-black text-slate-50 group-hover:text-blue-50/50 transition-colors select-none z-0">
                        01
                    </div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                            <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Cold Efficiency</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            Politeness primitives are disabled. The agent prioritizes <span className="text-slate-800 font-semibold">speed and density</span> of information over conversational fluff.
                        </p>
                    </div>
                </div>

                {/* Rule 02 - Total Extraction */}
                <div className="relative group p-8 bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/10 rounded-3xl transition-colors pointer-events-none" />

                    <div className="absolute -bottom-4 -right-4 text-9xl font-black text-slate-50 group-hover:text-indigo-50/50 transition-colors select-none z-0">
                        02
                    </div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                            <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Total Extraction</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            Designed to parse, strip, and restructure unstructured text into rigid <span className="text-slate-800 font-semibold">JSON schemas</span>. No ambiguity allowed.
                        </p>
                    </div>
                </div>

                {/* Rule 03 - Zero Hallucination */}
                <div className="relative group p-8 bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/10 rounded-3xl transition-colors pointer-events-none" />

                    <div className="absolute -bottom-4 -right-4 text-9xl font-black text-slate-50 group-hover:text-emerald-50/50 transition-colors select-none z-0">
                        03
                    </div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                            <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Zero Hallucination</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            Strict temperature controls and logit bias enforcement ensure the agent <span className="text-slate-800 font-semibold">never invents</span> data outside the source.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
