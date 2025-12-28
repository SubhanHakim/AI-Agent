import Terminal from '../Terminal';

export default function TerminalSection() {
    return (
        <div id="code" className="mt-20 w-full max-w-3xl mx-auto terminal-container">
            <div className="rounded-lg border border-gray-800 bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-indigo-900/20">
                {/* Fake 'tab' or header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-white/5">
                    <div className="text-xs font-mono text-gray-500">nexora-cli — 80x24</div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    </div>
                </div>

                {/* Terminal Component Content */}
                <div className="p-2 min-h-[300px]">
                    <Terminal />
                </div>

                {/* Footer instruction line */}
                <div className="px-4 py-3 border-t border-gray-800 bg-white/5 text-xs text-indigo-400 font-mono">
                    $ npx nexora init
                </div>
            </div>
        </div>
    );
}
