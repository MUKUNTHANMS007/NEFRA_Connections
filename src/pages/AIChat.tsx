import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // 1. IMPORT THIS
import { Send, Bot, User, Loader2, Cpu } from 'lucide-react';
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
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
            <Cpu className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">NEFRA AI</h2>
            <p className="text-[10px] text-emerald-400 font-mono tracking-tighter">STATUS: ONLINE</p>
          </div>
        </div>
        
        <div className="text-xs text-slate-400 space-y-4">
          <p>Powered by <span className="text-blue-400 font-bold">Gemini 2.5 Flash Lite</span>.</p>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 mt-6">
            <h3 className="text-[10px] font-black uppercase text-slate-500 mb-2">Instructions:</h3>
            <p className="text-slate-300 leading-relaxed">
              Ask about startups, coding, or business trends. The core is optimized for speed and accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* CHAT TERMINAL */}
      <div className="flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm">
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 max-w-[90%] md:max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              
              <div className={cn("flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg border", 
                msg.role === 'user' ? "bg-blue-600 border-blue-500" : "bg-slate-800 border-white/10")}>
                {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-blue-400" />}
              </div>

              <div className={cn("px-5 py-4 rounded-2xl text-sm shadow-md leading-relaxed", 
                msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none")}>
                
                {/* 2. RENDER MARKDOWN FOR AI RESPONSES */}
                {msg.role === 'ai' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10">
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
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-slate-800 text-slate-400 text-sm animate-pulse">
                Analyzing request...
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-6 bg-slate-900/40 border-t border-white/10">
          <div className="flex gap-4 max-w-5xl mx-auto w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your query..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}