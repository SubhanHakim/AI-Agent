export default function SystemDirectives() {
    return (
        <section id="directives" className="w-full max-w-5xl mx-auto mt-32">
            <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-gray-800 flex-1" />
                <h2 className="text-xl font-mono text-gray-500 tracking-widest uppercase">System_Directives</h2>
                <div className="h-px bg-gray-800 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rule 01 */}
                <div className="p-6 border border-gray-800 bg-black/50 backdrop-blur hover:border-indigo-500/50 transition-colors group">
                    <div className="text-4xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 transition-all">01</div>
                    <h3 className="text-lg font-bold text-white mb-2">Cold Efficiency</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Politeness primitives are disabled. The agent prioritizes speed and density of information over conversational fluff.
                    </p>
                </div>

                {/* Rule 02 */}
                <div className="p-6 border border-gray-800 bg-black/50 backdrop-blur hover:border-blue-500/50 transition-colors group">
                    <div className="text-4xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">02</div>
                    <h3 className="text-lg font-bold text-white mb-2">Total Extraction</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Designed to parse, strip, and restructure unstructured text into rigid JSON schemas. No ambiguity allowed.
                    </p>
                </div>

                {/* Rule 03 */}
                <div className="p-6 border border-gray-800 bg-black/50 backdrop-blur hover:border-red-500/50 transition-colors group">
                    <div className="text-4xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-red-600 transition-all">03</div>
                    <h3 className="text-lg font-bold text-white mb-2">Zero Hallucination</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Strict temperature controls and logit bias enforcement ensure the agent never invents data outside the source.
                    </p>
                </div>
            </div>
        </section>
    );
}
