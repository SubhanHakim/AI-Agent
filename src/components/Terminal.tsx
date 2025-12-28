import { useState } from "react";
import { terrasuck } from "../agent/terrasuck";

export default function Terminal() {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<string[]>([]);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;

        setLogs((l) => [...l, `> ${input}`]);
        const output = await terrasuck(input);
        setLogs((l) => [...l, output]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-transparent text-gray-300 font-mono p-2 overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-2 space-y-1 scrollbar-hide">
                {logs.map((log, i) => (
                    <pre key={i} className="whitespace-pre-wrap break-all token-line">
                        {log}
                    </pre>
                ))}
            </div>

            <form onSubmit={submit} className="flex items-center pt-2">
                <span className="mr-2 text-orange-500 font-bold">$</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-700"
                    placeholder="Enter command..."
                />
            </form>
        </div>
    );
}
