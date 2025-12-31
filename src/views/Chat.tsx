import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { ScreenName } from "../types";
import { IMAGES } from "../constants";
import { supabase } from "../supabaseClient";

interface ChatProps {
  navigate: (screen: ScreenName) => void;
  user?: any;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const ChatView: React.FC<ChatProps> = ({ navigate, user }) => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(50);

      if (data && data.length > 0) {
        setMessages(data.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === "assistant" ? "ai" : "user",
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } else {
        const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name || 'Atleta';
        setMessages([{
          id: "1",
          text: `¡Hola ${userName}! 👋 Soy tu coach Vitality. He analizado tus estadísticas recientes y estoy lista para ayudarte a optimizar tu día. ¿En qué puedo apoyarte hoy?`,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const saveMessage = async (text: string, role: 'user' | 'assistant') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      content: text,
      role: role,
      created_at: new Date().toISOString()
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    saveMessage(userText, 'user').catch(console.error);

    try {
      const savedStats = localStorage.getItem("vitality_user_stats");
      const stats = savedStats ? JSON.parse(savedStats) : { calories: 0, hydrationCurrent: 0 };
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });

      const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'el usuario';
      const systemInstruction = `Eres "Vitality Coach", una IA experta en salud y fitness. El usuario se llama ${userName}. Sus estadísticas actuales: ${JSON.stringify(stats)}. Sé motivadora, concisa (máximo 3 líneas) y usa emojis ocasionalmente. Habla en español.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-latest",
        contents: [
          ...messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
          { role: "user", parts: [{ text: userText }] },
        ],
        config: { systemInstruction },
      });

      const aiText = response.text || "Tuve un pequeño problema. Repite eso, por favor.";
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      saveMessage(aiText, 'assistant').catch(console.error);
    } catch (error: any) {
      console.error('Chat AI Error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: error?.message?.includes('API Key')
          ? '⚠️ No puedo responder ahora. Falta configurar la API key de Google AI en el archivo .env.local (revisa API_KEYS_SETUP_GUIDE.md)'
          : '😅 Ups, tuve un pequeño problema técnico. ¿Puedes repetir tu pregunta?',
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      {/* Header - Premium Glass */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-center bg-cover border-2 border-primary-500 shadow-sm"
                style={{ backgroundImage: `url("${IMAGES.AI_COACH}")` }}
              ></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-none mb-1">Coach Vitality</h2>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">En línea</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30">
        <div className="flex justify-center mb-8">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-1.5 rounded-full">Hoy</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-[1.5rem] text-[15px] font-medium leading-relaxed shadow-soft ${msg.sender === "user"
                ? "bg-primary-500 text-white rounded-tr-none"
                : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-tl-none"
                }`}>
                {msg.text}
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-2 px-1 uppercase tracking-tighter">{msg.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-800 flex gap-1.5 shadow-soft">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input - Modern Floating Style */}
      <footer className="p-6 pt-2 bg-white dark:bg-slate-950 safe-bottom">
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner group">
          <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-medium text-slate-900 dark:text-white placeholder-slate-400 py-3 px-1"
            placeholder="Pregúntale a tu coach..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inputText.trim() ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-100" : "text-slate-300 scale-90"
              }`}
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;
