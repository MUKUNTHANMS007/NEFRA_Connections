import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../api';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeContact, setActiveContact] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]); // Inbox
  const [searchResults, setSearchResults] = useState<any[]>([]); // Global Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const stompClient = useRef<Stomp.Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userId');

  // 1. WebSocket Connection Logic
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS('http://localhost:8081/ws');
    const client = Stomp.over(socket);
    stompClient.current = client;
    client.debug = () => {}; // Silence logs

    client.connect({}, () => {
      setIsConnected(true);
      
      // Subscribe to personal absolute path
      client.subscribe(`/user/${currentUserId}/queue/messages`, (sdkEvent) => {
        const incomingMessage = JSON.parse(sdkEvent.body);
        
        setMessages((prev) => {
          // Prevent duplicates
          const isDuplicate = prev.some(m => 
            (m.id && m.id === incomingMessage.id) || 
            (m.content === incomingMessage.content && m.timestamp === incomingMessage.timestamp)
          );
          if (isDuplicate) return prev;
          return [...prev, incomingMessage];
        });
      });
    }, (error) => {
      console.error("COMM_LINK_FAILURE:", error);
      setIsConnected(false);
    });

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {});
      }
    };
  }, [currentUserId]);

  // 2. Load Inbox (Only people you've chatted with)
  useEffect(() => {
    if (!currentUserId) return;

    api.get('/chat/conversations', {
      headers: { 'X-User-Id': currentUserId }
    })
    .then(res => {
      setContacts(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => console.error("INBOX_ERROR:", err));
  }, [currentUserId]);

  // 3. Global Search (To find new people)
  useEffect(() => {
    if (searchQuery.length > 0) {
      api.get('/users') // In a real app, this would be /users/search?name=...
        .then(res => {
          const allUsers = Array.isArray(res.data) ? res.data : [];
          // Filter out yourself and match the search query
          const filtered = allUsers.filter((u: any) => 
            String(u.id) !== String(currentUserId) && 
            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        })
        .catch(err => console.error("SEARCH_ERROR:", err));
    }
  }, [searchQuery, currentUserId]);

  // 4. Load Chat History
  useEffect(() => {
    if (activeContact && currentUserId) {
      api.get(`/chat/history/${activeContact.id}`, {
        headers: { 'X-User-Id': currentUserId }
      })
      .then(res => setMessages(res.data))
      .catch(err => console.error("HISTORY_ERROR:", err));
    }
  }, [activeContact, currentUserId]);

  // 5. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !activeContact || !isConnected || !stompClient.current?.connected) return;

    const payload = {
      senderId: Number(currentUserId),
      receiverId: Number(activeContact.id),
      content: input,
    };

    stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(payload));
    setInput('');
  };

  const displayList = searchQuery.length > 0 ? searchResults : contacts;

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden border-t border-white/5 bg-transparent">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 opacity-70">
            {searchQuery.length > 0 ? 'Global_Registry' : 'Active_Links'}
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search registry to start chat..." 
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 px-3 custom-scrollbar">
          {displayList.length === 0 && (
             <div className="text-center text-xs text-slate-500 mt-10 uppercase tracking-widest font-bold">
               {searchQuery.length > 0 ? 'No Matches Found' : 'Inbox Empty'}
             </div>
          )}
          {displayList.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setActiveContact(contact);
                setSearchQuery(''); // Clear search when user is selected
              }}
              className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all", activeContact?.id === contact.id ? "bg-blue-600/10 border border-blue-500/30 shadow-lg" : "hover:bg-white/5")}
            >
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-black">
                {contact.fullName?.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{contact.fullName}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{contact.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm">
        {activeContact ? (
          <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-emerald-500 shadow-lg" : "bg-red-500")} />
                <h3 className="text-xl font-black text-white uppercase">{activeContact.fullName}</h3>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{isConnected ? 'ONLINE' : 'CONNECTING...'}</span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.filter(m => 
                (String(m.senderId) === String(activeContact.id) && String(m.receiverId) === String(currentUserId)) || 
                (String(m.senderId) === String(currentUserId) && String(m.receiverId) === String(activeContact.id))
              ).map((msg, idx) => (
                <div key={idx} className={cn("flex flex-col max-w-[75%]", String(msg.senderId) === String(currentUserId) ? "ml-auto items-end" : "items-start")}>
                  <div className={cn("px-4 py-3 rounded-2xl text-sm font-medium shadow-md transition-all", 
                    String(msg.senderId) === String(currentUserId) ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none")}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-2 uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900/40 border-t border-white/10">
              <div className="flex gap-4">
                <input
                  type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isConnected ? "Secure message..." : "Syncing..."}
                  disabled={!isConnected}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none"
                />
                <button onClick={handleSendMessage} disabled={!isConnected} className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 shadow-lg transition-transform active:scale-95">
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
            <MessageSquare className="h-12 w-12 text-slate-500 mb-6" />
            <h3 className="text-2xl font-black text-white uppercase tracking-widest">Select Node</h3>
          </div>
        )}
      </div>
    </div>
  );
}