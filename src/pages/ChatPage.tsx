import { useState, useEffect } from "react";
import { terrasuck } from "../agent/terrasuck";

// Type definitions for chat history
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: Message[];
}

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Session Management
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Load sessions from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('terrasuck_sessions');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSessions(parsed);
            } catch (e) {
                console.error("Failed to load sessions", e);
            }
        }
    }, []);

    // Save sessions whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('terrasuck_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // Create a new session
    const createNewSession = () => {
        setMessages([]);
        setCurrentSessionId(Date.now().toString());
    };

    // Load a specific session
    const loadSession = (session: ChatSession) => {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
    };

    // Save/Update current session
    const updateSession = (newMessages: Message[]) => {
        if (!currentSessionId) {
            // If no session ID, create one (first message)
            const newId = Date.now().toString();
            setCurrentSessionId(newId);
            const newSession: ChatSession = {
                id: newId,
                title: newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : ''),
                timestamp: Date.now(),
                messages: newMessages
            };
            setSessions(prev => [newSession, ...prev]);
        } else {
            // Update existing session
            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, messages: newMessages };
                }
                return s;
            }));
        }
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input || isLoading) return;

        const userMessage = input;
        const newHistoryUser = [...messages, { role: 'user', content: userMessage } as Message];

        setInput("");
        setMessages(newHistoryUser);
        updateSession(newHistoryUser); // Save user message immediately
        setIsLoading(true);

        try {
            const output = await terrasuck(userMessage);
            const newHistoryAssistant = [...newHistoryUser, { role: 'assistant', content: output } as Message];
            setMessages(newHistoryAssistant);
            updateSession(newHistoryAssistant); // Save assistant response
        } catch (error) {
            const errorMsg = [...newHistoryUser, { role: 'assistant', content: "Error: Protocol failure. Connection severed." } as Message];
            setMessages(errorMsg);
            updateSession(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans selection:bg-orange-500/30 selection:text-orange-200">

            {/* Sidebar */}
            <aside className="w-[260px] bg-[#050505] border-r border-white/5 hidden md:flex flex-col">
                <div className="p-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group">
                        <span className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                            T
                        </span>
                        <span className="font-bold text-gray-200 group-hover:text-white transition-colors">[TERRASUCK]</span>
                    </a>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <button
                        onClick={createNewSession}
                        className="w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 hover:bg-white/5 transition-colors text-sm text-gray-300 mb-6 border border-white/10 hover:border-orange-500/30 group"
                    >
                        <div className="w-5 h-5 rounded-full border border-gray-500 group-hover:border-orange-500 flex items-center justify-center text-xs group-hover:text-orange-500 transition-colors">+</div>
                        New Extraction
                    </button>

                    <div className="text-xs font-bold text-gray-600 px-3 py-2 uppercase tracking-widest mb-2">History</div>
                    <div className="space-y-1">
                        {sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => loadSession(session)}
                                className={`w-full text-left px-3 py-2.5 rounded text-sm transition-all truncate ${currentSessionId === session.id
                                        ? 'bg-white/10 text-white shadow-inner'
                                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                            >
                                {session.title || "Untitled Session"}
                            </button>
                        ))}
                        {sessions.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-700 italic">No previous extractions found.</div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-orange-500/50">
                            OP
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium truncate text-gray-300">Operator</div>
                            <div className="text-xs text-green-500 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                System Active
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative h-full bg-black">

                {/* Top Header Floating */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 pointer-events-none">
                    <div className="md:hidden pointer-events-auto">
                        <a href="/" className="font-bold text-lg">[TERRASUCK]</a>
                    </div>
                    <div className="mx-auto bg-[#1a1a1a]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-3 shadow-lg">
                        <span className="text-sm font-medium text-gray-300">Model: Llama v3.3</span>
                        <div className="h-3 w-px bg-white/10"></div>
                        <span className="text-xs text-orange-500 font-bold tracking-wider">EXTRACTION_MODE</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="max-w-3xl mx-auto h-full flex flex-col pt-24 pb-40">

                        {messages.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 opacity-40 select-none">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                    <span className="text-5xl text-gray-500">❖</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">System Ready</h2>
                                    <p className="max-w-md text-gray-400">
                                        Awaiting input vector. Protocol initialized.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                                    <div className="p-3 border border-white/10 rounded hover:border-orange-500/50 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setInput("Analyze current market sentiment")}>
                                        <div className="text-xs text-gray-500 mb-1">Command</div>
                                        <div className="text-sm font-medium text-gray-300">Analyze market sentiment &rarr;</div>
                                    </div>
                                    <div className="p-3 border border-white/10 rounded hover:border-orange-500/50 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setInput("Extract key entities from text")}>
                                        <div className="text-xs text-gray-500 mb-1">Task</div>
                                        <div className="text-sm font-medium text-gray-300">Extract key entities &rarr;</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`group w-full text-gray-100 ${msg.role === 'assistant' ? 'bg-transparent' : 'bg-transparent'
                                }`}>
                                <div className="flex gap-6 p-4 md:px-0 text-base m-auto md:max-w-3xl">
                                    <div className={`flex-shrink-0 flex flex-col relative items-end pt-1`}>
                                        <div className={`relative h-8 w-8 rounded-lg flex items-center justify-center shadow-lg ${msg.role === 'assistant'
                                                ? 'bg-gradient-to-br from-orange-600 to-orange-800'
                                                : 'bg-gradient-to-br from-gray-700 to-gray-900'
                                            }`}>
                                            {msg.role === 'assistant' ?
                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                                :
                                                <span className="text-xs font-bold">YOU</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="relative flex-1 overflow-hidden">
                                        {msg.role === 'user' ? (
                                            <div className="font-medium text-gray-200">{msg.content}</div>
                                        ) : (
                                            <div className="prose prose-invert prose-orange max-w-none leading-7 tracking-wide text-gray-300">
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="w-full text-gray-100">
                                <div className="flex gap-6 p-4 md:px-0 text-base m-auto md:max-w-3xl">
                                    <div className="flex-shrink-0 flex flex-col relative items-end pt-1">
                                        <div className="relative h-8 w-8 rounded-lg flex items-center justify-center bg-transparent border border-orange-500/30">
                                            <span className="flex w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                                        </div>
                                    </div>
                                    <div className="relative flex-1 overflow-hidden pt-1">
                                        <span className="animate-pulse text-gray-500 font-mono text-sm">PROCESSING_VECTOR...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Input Area */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black to-transparent pt-12 pb-8">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <form onSubmit={submit} className="relative flex items-center w-full bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden focus-within:border-orange-500/40 focus-within:bg-[#1f1f1f] transition-all">
                                <textarea
                                    className="flex-1 max-h-[200px] m-0 w-full resize-none border-0 bg-transparent py-4 pl-4 pr-12 focus:ring-0 focus-visible:ring-0 text-white placeholder-gray-500 leading-6"
                                    placeholder="Transmission content..."
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            submit(e as any);
                                        }
                                    }}
                                    autoFocus
                                    style={{ minHeight: '56px' }}
                                />
                                <button
                                    disabled={!input || isLoading}
                                    type="submit"
                                    className="absolute bottom-2.5 right-2 p-2 rounded-xl text-gray-400 hover:bg-orange-600 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </form>
                        </div>
                        <div className="mt-3 text-center">
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest">Encrypted // End-to-End // V1.0.4</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
