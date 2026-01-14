
import { useState, useEffect, useRef } from "react";
import { terrasuck } from "../agent/terrasuck";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { playSound } from "../utils/audio";
import cloudNexora from "../assets/cloud_nexora.jpg";

// Type definitions for chat history
interface Message {
    role: 'user' | 'assistant';
    content: string;
    attachment?: string | null; // Base64 image
}

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: Message[];
}

const DEFAULT_SYSTEM_PROMPT = "You are CLAUDE NEXORA. High-performance AI agent. Precise. Helpful. Intelligent. Focus on accurate extraction and analysis.";

// Component for Message with potential Typewriter effect (simplified for Markdown compatibility)
const MessageContent = ({ content, isLatestAssistant }: { content: string, isLatestAssistant: boolean }) => {
    return (
        <div className={`prose prose-slate max-w-none text-slate-700 ${isLatestAssistant ? 'animate-in fade-in duration-700' : ''}`}>
            <ReactMarkdown
                components={{
                    // Style Headers
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4 border-b border-slate-200 pb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-800 mt-5 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2" {...props} />,

                    // Style Paragraphs
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed custom-line-height" {...props} />,

                    // Style Lists
                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2 marker:text-blue-600" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 marker:text-blue-600" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,

                    // Style Code Blocks
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <div className="rounded-xl overflow-hidden my-6 border border-slate-200 shadow-md">
                                <div className="bg-slate-900 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-800 flex justify-between items-center">
                                    <span className="uppercase tracking-wider font-bold text-blue-400">{match[1]}</span>
                                    <span className="text-[10px] opacity-70">RAW CODE</span>
                                </div>
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, background: '#0f172a', padding: '1.5rem', fontSize: '0.9rem' }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-pink-600 font-mono text-sm mx-1 font-bold" {...props}>
                                {children}
                            </code>
                        )
                    },
                    img: (props: any) => (
                        <div className="relative group inline-block my-4">
                            <img
                                {...props}
                                className="rounded-xl border border-slate-200 shadow-lg max-w-full h-auto bg-white"
                            />
                            <a
                                href={props.src}
                                download={`claude_nexora_art_${Date.now()}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md border border-slate-200"
                                title="Download High-Res"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </a>
                        </div>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default function ChatPage() {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings modal state

    // Model & System Prompt State

    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        // Scroll to bottom when messages change with a slight delay
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to recalculate
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);



    // Session Management
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isStorageLoaded, setIsStorageLoaded] = useState(false); // Safety flag

    // Load sessions from local storage (Guest Mode Only)
    useEffect(() => {
        const storageKey = `terrasuck_sessions_guest`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSessions(parsed);
            } catch (e) {
                setSessions([]);
            }
        } else {
            setSessions([]);
        }

        // Reset view for new context, but don't wipe sessions
        setMessages([]);
        setCurrentSessionId(null);
        setIsStorageLoaded(true); // Mark as loaded
    }, []);

    // Save sessions whenever they change
    useEffect(() => {
        if (!isStorageLoaded) return; // BLOCK SAVING UNTIL LOADED

        const storageKey = `terrasuck_sessions_guest`;

        if (sessions.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(sessions));
        } else {
            localStorage.removeItem(storageKey);
        }
    }, [sessions, isStorageLoaded]);

    const createNewSession = () => {
        playSound('click');
        setMessages([]);
        setCurrentSessionId(null);
        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile
    };

    const loadSession = (session: ChatSession) => {
        playSound('click');
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile
    };

    const deleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        playSound('click');
        if (window.confirm("Delete this extraction log?")) {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (currentSessionId === sessionId) {
                setMessages([]);
                setCurrentSessionId(null);
            }
        }
    };

    const exportSession = () => {
        if (!messages.length) return;
        playSound('click');
        const text = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n\n`).join('---');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cloud_nexora_extraction_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateSession = (sessionId: string, newMessages: Message[]) => {
        setSessions(prev => {
            const exists = prev.find(s => s.id === sessionId);
            if (exists) {
                return prev.map(s => s.id === sessionId ? { ...s, messages: newMessages } : s);
            } else {
                const newSession: ChatSession = {
                    id: sessionId,
                    title: newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : ''),
                    timestamp: Date.now(),
                    messages: newMessages
                };
                return [newSession, ...prev];
            }
        });
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Allow sending if text OR image exists
        if ((!input && !selectedImage) || isLoading) return;

        playSound('send');
        const userMessage = input;
        const newMsg: Message = { role: 'user', content: userMessage, attachment: selectedImage };
        const newHistoryUser = [...messages, newMsg];

        let activeSessionId = currentSessionId;
        if (!activeSessionId) {
            activeSessionId = Date.now().toString();
            setCurrentSessionId(activeSessionId);
        }

        setInput("");
        setMessages(newHistoryUser);
        updateSession(activeSessionId, newHistoryUser);
        setIsLoading(true);

        try {
            const output = await terrasuck(userMessage, selectedImage, systemPrompt);
            clearImage();
            playSound('receive');
            const newHistoryAssistant = [...newHistoryUser, { role: 'assistant', content: output } as Message];
            setMessages(newHistoryAssistant);
            updateSession(activeSessionId, newHistoryAssistant);
        } catch (error) {
            playSound('error');
            const errorMsg = [...newHistoryUser, { role: 'assistant', content: "Error: Protocol failure. Connection severed." } as Message];
            setMessages(errorMsg);
            updateSession(activeSessionId, errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden animate-fade-in">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar - Mobile & Desktop */}
            <aside className={`
          fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-5 flex items-center justify-between border-b border-slate-100">
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            <img src={cloudNexora} alt="Claude Nexora" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-800 tracking-tight">Claude Nexora</span>
                    </a>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-800">
                    <button
                        onClick={createNewSession}
                        className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm font-medium mb-8 group"
                    >
                        <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-xs group-hover:bg-white group-hover:text-slate-900 transition-colors">+</div>
                        New Extraction
                    </button>

                    <div className="flex items-center justify-between px-3 py-2 mb-2">
                        <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">History</div>
                        {messages.length > 0 && (
                            <button onClick={exportSession} title="Export Current Log" className="text-xs text-gray-600 hover:text-indigo-500">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        {sessions.map(session => (
                            <div key={session.id} className="relative group/item">
                                <button
                                    onClick={() => loadSession(session)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all truncate pr-8 ${currentSessionId === session.id
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {session.title || "Untitled Session"}
                                </button>
                                <button
                                    onClick={(e) => deleteSession(e, session.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-700 italic">No logs found.</div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm cursor-default">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            OP
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold truncate text-slate-900">
                                Operator
                            </div>
                            <div className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Guest Access
                            </div>
                        </div>
                    </div>

                    {/* Mobile Disconnect Button (Visible only when wallet is connected) */}

                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative h-full bg-slate-50 w-full">

                {/* Top Header Floating - Mobile Optimized */}
                <div className="absolute top-0 left-0 right-0 p-3 md:p-6 flex justify-between items-center z-20 pointer-events-none">
                    {/* Gradient Mask for Smooth Scroll under Header */}
                    <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-slate-50 via-slate-50/90 to-transparent -z-10 pointer-events-none"></div>

                    {/* Left Side: Mobile Menu */}
                    <div className="pointer-events-auto md:hidden mr-2 flex-shrink-0">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>

                    {/* Center: Model Selector (Fixed) */}
                    <div className="mx-auto bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full border border-slate-200 flex items-center gap-3 shadow-lg pointer-events-auto relative z-50">
                        <span className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            CLAUDE NEXORA-1.0
                        </span>
                        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                        <span className="text-[10px] text-blue-600 font-black tracking-widest px-1 hidden sm:inline bg-blue-50 py-0.5 rounded">GOD MODE</span>
                    </div>

                    {/* Right Side: Settings & Wallet */}
                    <div className="pointer-events-auto flex items-center gap-2 ml-2 flex-shrink-0">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {/* Added extra padding bottom to account for auto-growing input */}
                    <div className="max-w-3xl mx-auto flex flex-col pt-24 md:pt-28 pb-32 md:pb-64">

                        {/* Empty State ... (No changes needed logic wise, just existing structure) */}
                        {/* Empty State */}
                        {messages.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 select-none px-4 min-h-[50vh]">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-4 border border-slate-100">
                                    <img src={cloudNexora} alt="Claude Nexora" className="w-full h-full rounded-3xl object-cover opacity-90" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl md:text-3xl font-black tracking-tight text-slate-900">System Ready</h2>
                                    <p className="max-w-xs md:max-w-lg text-sm md:text-base text-slate-500 mx-auto leading-relaxed">
                                        Awaiting input from <span className="text-slate-900 font-bold bg-slate-200 px-1 py-0.5 rounded text-xs font-mono">GUEST_NODE_01</span>.
                                        <br />Configure persona settings if required.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-sm md:max-w-2xl">
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group text-left" onClick={() => setInput("Analyze current market sentiment")}>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 group-hover:text-blue-500">Command</div>
                                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Analyze Market &rarr;</div>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group text-left" onClick={() => setInput("/image ")}>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 group-hover:text-purple-500">Creative</div>
                                        <div className="text-sm font-bold text-slate-800 group-hover:text-purple-600">Generate Image &rarr;</div>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group text-left" onClick={() => setInput("Extract key entities from text")}>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 group-hover:text-emerald-500">Task</div>
                                        <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600">Extract Entities &rarr;</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`group w-full`}>
                                <div className="flex gap-4 md:gap-6 p-2 md:p-0 text-sm md:text-base m-auto md:max-w-3xl">
                                    <div className={`flex-shrink-0 flex flex-col relative items-end pt-1`}>
                                        <div className={`relative h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${msg.role === 'assistant'
                                            ? 'bg-white border border-slate-200'
                                            : 'bg-slate-900 border border-slate-800'
                                            }`}>
                                            {msg.role === 'assistant' ?
                                                <img src={cloudNexora} alt="CN" className="w-full h-full object-cover" />
                                                :
                                                <div className="text-white text-xs font-bold">You</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="relative flex-1 overflow-hidden min-w-0">
                                        {msg.role === 'user' ? (
                                            <div className="font-medium text-slate-800">
                                                <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                                                    You
                                                </div>
                                                {msg.attachment && (
                                                    <div className="mb-3">
                                                        <img src={msg.attachment} alt="Attachment" className="max-h-48 md:max-h-64 rounded-xl border border-slate-200 shadow-md object-contain bg-white" />
                                                    </div>
                                                )}
                                                {msg.content && <div className="whitespace-pre-wrap break-words bg-indigo-50 px-4 py-3 rounded-2xl rounded-tl-none inline-block text-slate-800">{msg.content}</div>}
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-wider">
                                                    Claude Nexora
                                                </div>
                                                <MessageContent content={msg.content} isLatestAssistant={i === messages.length - 1} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="w-full">
                                <div className="flex gap-4 md:gap-6 p-2 md:p-0 text-base m-auto md:max-w-3xl">
                                    <div className="flex-shrink-0 flex flex-col relative items-end pt-1">
                                        <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm overflow-hidden">
                                            <img src={cloudNexora} alt="CN" className="w-full h-full object-cover grayscale opacity-50" />
                                        </div>
                                    </div>
                                    <div className="relative flex-1 overflow-hidden pt-2">
                                        <div className="flex gap-1.5 items-center">
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Fixed Input Area - Light Mode */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pt-12 pb-6 md:pb-8 px-2 md:px-0 z-30">
                    <div className="max-w-3xl mx-auto px-1 md:px-4">
                        <div className="relative group">
                            {/* Blue Glow on Active */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>

                            <form onSubmit={submit} className="relative flex flex-col w-full bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 focus-within:border-blue-500/30 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all overflow-hidden">

                                {/* Image Preview Integrated */}
                                {selectedImage && (
                                    <div className="p-3 pb-0 animate-fade-in-up">
                                        <div className="relative inline-block group/preview">
                                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                                                <img src={selectedImage} alt="Preview" className="h-20 w-auto object-cover bg-slate-100" />
                                                <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-all"></div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-2 -right-2 bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-200 rounded-full p-1 shadow-md transform scale-90 group-hover/preview:scale-100 transition-all opacity-0 group-hover/preview:opacity-100"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-end w-full">

                                    {/* Attach Button */}
                                    <div className="pl-3 pb-3 md:pb-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`p-2.5 rounded-full transition-all duration-300 transform active:scale-95 hover:bg-slate-100 ${selectedImage ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                                            title="Attach Image"
                                        >
                                            <svg className="w-5 h-5 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </button>
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        className="flex-1 max-h-[150px] md:max-h-[200px] m-0 w-full resize-none border-0 bg-transparent py-4 md:py-5 px-3 focus:ring-0 focus-visible:ring-0 text-slate-800 placeholder-slate-400 text-sm md:text-base scrollbar-thin scrollbar-thumb-slate-300 font-medium leading-relaxed"
                                        placeholder={selectedImage ? "Add a caption..." : "Ask Claude Nexora anything..."}
                                        rows={1}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                submit(e as any);
                                            }
                                        }}
                                    />

                                    {/* Send Button */}
                                    <div className="pr-3 pb-3 md:pb-4">
                                        <button
                                            disabled={(!input && !selectedImage) || isLoading}
                                            type="submit"
                                            className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${(!input && !selectedImage) || isLoading ? 'text-slate-300 bg-slate-100 cursor-not-allowed' : 'text-white bg-slate-900 hover:bg-slate-800 hover:shadow-md'}`}
                                        >
                                            {isLoading ? (
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : (
                                                <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="mt-3 text-center hidden md:block">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Claude Nexora v1.0 // Authorized Access Only</span>
                        </div>
                    </div>
                </div>

            </main>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                System Configuration
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-1 hover:bg-slate-100 rounded-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agent Persona (System Prompt)</label>
                                <textarea
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner"
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="Define how the AI should behave..."
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <button
                                    onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Reset Default
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSettingsOpen(false);
                                        playSound('click');
                                    }}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
