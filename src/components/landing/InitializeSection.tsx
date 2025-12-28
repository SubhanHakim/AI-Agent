export default function InitializeSection() {
    return (
        <section className="w-full max-w-4xl mx-auto mt-20 mb-32 text-center">
            <div className="p-8 md:p-12 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black backdrop-blur relative overflow-hidden group">

                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Initialize Extraction Protocol
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto text-lg">
                        Join the network of autonomous extraction nodes. Start mining intelligence from raw chaos today.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-90 text-white font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95">
                            Get Access Keys
                        </button>
                        <button className="px-8 py-3.5 rounded-lg border border-gray-700 hover:border-white text-gray-300 hover:text-white font-medium bg-black/50 transition-all hover:bg-white/5">
                            Read Protocol Specs
                        </button>
                    </div>

                    <div className="pt-8 flex justify-center items-center gap-2 text-xs font-mono text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Total Nodes Active: 1,420
                    </div>
                </div>
            </div>
        </section>
    );
}
