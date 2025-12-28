export default function TrustArchitecture() {
    return (
        <section id="architecture" className="w-full max-w-5xl mx-auto mt-32 mb-20">
            <div className="flex items-center gap-4 mb-16">
                <div className="h-px bg-gray-800 flex-1" />
                <h2 className="text-xl font-mono text-gray-500 tracking-widest uppercase">Trust_Architecture</h2>
                <div className="h-px bg-gray-800 flex-1" />
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Left Side: Explainer */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                            Verifiable Inference
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Every inference cycle is cryptographically signed. The chain of thought is preserved in an immutable ledger, ensuring that the extraction process is audit-proof and tamper-resistant.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors">
                            <div className="mt-1 font-mono text-indigo-500 font-bold">01</div>
                            <div>
                                <h4 className="text-white font-medium">Input Sanitization</h4>
                                <p className="text-sm text-gray-500 mt-1">Malicious prompts are neutralized before they reach the core model.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors">
                            <div className="mt-1 font-mono text-blue-500 font-bold">02</div>
                            <div>
                                <h4 className="text-white font-medium">Isolated Execution</h4>
                                <p className="text-sm text-gray-500 mt-1">Running within ephemeral containers that self-destruct post-extraction.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors">
                            <div className="mt-1 font-mono text-red-500 font-bold">03</div>
                            <div>
                                <h4 className="text-white font-medium">Output Validation</h4>
                                <p className="text-sm text-gray-500 mt-1">JSON schemas are enforced strictly. Hallucinations trigger automatic retries.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual Abstraction */}
                <div className="flex-1 w-full relative">
                    <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-b from-gray-800 to-black">
                        <div className="bg-black rounded-xl p-6 border border-gray-800 space-y-2 font-mono text-sm">
                            {/* Code Visual */}
                            <div className="text-gray-500">{'// Trust Layer Validation'}</div>
                            <div>
                                <span className="text-purple-400">const</span> <span className="text-blue-400">verifyOutput</span> = <span className="text-yellow-400">async</span> (payload) ={'>'} {'{'}
                            </div>
                            <div className="pl-4">
                                <span className="text-purple-400">const</span> signature = <span className="text-blue-400">await</span> keypair.<span className="text-blue-300">sign</span>(payload);
                            </div>
                            <div className="pl-4">
                                <span className="text-purple-400">if</span> (!<span className="text-blue-300">verify</span>(signature)) {'{'}
                            </div>
                            <div className="pl-8 text-red-400">
                                throw new SecurityException("Tampering Detected");
                            </div>
                            <div className="pl-4">{'}'}</div>
                            <div className="pl-4 text-green-400">
                                return true;
                            </div>
                            <div>{'}'}</div>
                        </div>
                    </div>

                    {/* Decorative Glow Behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-3xl -z-10 rounded-full" />
                </div>
            </div>
        </section>
    );
}
