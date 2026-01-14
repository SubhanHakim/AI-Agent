export default function InitializeSection() {
    return (
        <section className="w-full max-w-4xl mx-auto mt-20 mb-32 text-center">
            <div className="p-8 md:p-12 rounded-2xl border border-slate-200 bg-white shadow-xl relative overflow-hidden group">

                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Join the Neural Network
                    </h2>
                    <p className="text-slate-600 max-w-lg mx-auto text-lg">
                        Stay updated on the latest extraction protocols and governance.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <a href="https://x.com/nexora_key" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center group shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            Follow Updates
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
