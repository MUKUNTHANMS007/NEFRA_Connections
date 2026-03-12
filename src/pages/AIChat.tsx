import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // 1. IMPORT THIS
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../api';

interface AIMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'ai', content: 'NEFRA AI Core initialized. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      // Assuming your api base URL already includes /api/v1
      const response = await api.post('/ai/ask', { prompt: userText });
      setMessages(prev => [...prev, { role: 'ai', content: response.data }]);
    } catch (error) {
      console.error("AI_COMM_FAILURE:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Error: Connection to NEFRA AI Core failed. Please check the backend.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden border-t border-white/5 bg-transparent">
      
      {/* SIDEBAR */}
      <div className="hidden md:flex w-80 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex-col p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-white/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">NEFRA AI</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Uplink Active</p>
          </div>
        </div>
        
        <div className="text-xs text-slate-400 space-y-4">
          <p>
            Powered by <span className="text-slate-200 font-bold">Gemini</span>.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/20 border border-white/5 mt-6 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Instructions</h3>
            <p className="text-slate-300 leading-relaxed">
              Ask about startups, coding, or business trends. The core is optimized for speed and accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* CHAT TERMINAL */}
      <div className="flex-1 flex flex-col bg-slate-900/20 backdrop-blur-md">
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 max-w-[90%] md:max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              
              <div className={cn(
                "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md",
                msg.role === 'user' ? "bg-white/10" : "bg-indigo-500/10"
              )}>
                {msg.role === 'user'
                  ? <User className="h-5 w-5 text-white" />
                  : <Bot className="h-5 w-5 text-indigo-400" />
                }
              </div>

              <div className={cn(
                "px-5 py-4 rounded-2xl text-sm shadow-xl leading-relaxed border backdrop-blur-xl",
                msg.role === 'user'
                  ? "bg-white/10 border-white/10 text-white rounded-tr-none"
                  : "bg-slate-900/60 border-white/5 text-slate-300 rounded-tl-none"
              )}>
                
                {/* 2. RENDER MARKDOWN FOR AI RESPONSES */}
                {msg.role === 'ai' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950/60 prose-pre:border prose-pre:border-white/10">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-500/10 border border-white/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-slate-900/60 border border-white/5 text-slate-400 text-sm animate-pulse backdrop-blur-xl">
                Synthesizing response…
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-6 bg-slate-900/40 border-t border-white/10 backdrop-blur-xl">
          <div className="flex gap-4 max-w-5xl mx-auto w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your query..."
              disabled={isLoading}
              className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}