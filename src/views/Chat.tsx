import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { ScreenName } from "../types";
import { IMAGES } from "../constants";
import { supabase } from "../supabaseClient";

interface ChatProps {
  navigate: (screen: ScreenName) => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const ChatView: React.FC<ChatProps> = ({ navigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load History
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
        const history: Message[] = data.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === "assistant" ? "ai" : "user",
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(history);
      } else {
        // Default welcome message if no history
        setMessages([{
          id: "1",
          text: "¡Hola Maria! 👋 Soy tu entrenadora Vitality. Veo tus estadísticas de hoy. ¿En qué puedo ayudarte?",
          sender: "ai",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }]);
      }
    };
    loadHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    // Save User Message
    saveMessage(userText, 'user').catch(console.error);

    try {
      // 1. Get User Stats from LocalStorage to give context to AI
      const savedStats = localStorage.getItem("vitality_user_stats");
      const stats = savedStats
        ? JSON.parse(savedStats)
        : { calories: 0, hydrationCurrent: 0 };

      // 2. Initialize Gemini
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("Google API Key not configured");
      }
      const ai = new GoogleGenAI({ apiKey });

      // 3. Create System Prompt with Context
      const systemInstruction = `
        Eres "Vitality Coach", una entrenadora personal experta, nutricionista y motivadora para una app de iOS llamada Vitality.
        
        CONTEXTO DEL USUARIO (Maria):
        - Calorías quemadas hoy: ${stats.calories} (Meta: 1800)
        - Agua bebida: ${stats.hydrationCurrent}L (Meta: ${stats.hydrationGoal}L)
        - Minutos de actividad: ${stats.activityMin}
        
        REGLAS:
        1. Sé breve, enérgica y empática. Usa emojis.
        2. Si el usuario pregunta qué comer, sugiere algo saludable basado en sus calorías restantes.
        3. Si el usuario está cansado, sugiere yoga o meditación.
        4. Tienes acceso a sus datos, úsalos para personalizar la respuesta.
        5. Tus respuestas deben ser texto plano, no markdown complejo.
      `;

      // 4. Send Request
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-latest",
        contents: [
          ...messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
          { role: "user", parts: [{ text: userText }] },
        ],
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const aiText =
        response.text ||
        "Lo siento, tuve un problema conectando con mi cerebro digital. Intenta de nuevo.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      // Save AI Message
      saveMessage(aiText, 'assistant').catch(console.error);

    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, estoy teniendo problemas de conexión. Verifica tu API Key.",
        sender: "ai",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-surface-light dark:bg-surface-dark p-4 shadow-sm z-10 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <button className="mr-3" onClick={() => navigate(ScreenName.HOME)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-primary/20"
              style={{ backgroundImage: `url("${IMAGES.AI_COACH}")` }}
            ></div>
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white dark:border-surface-dark"></div>
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              Entrenadora IA
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
              Conectada con Gemini
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-gray-50 dark:bg-black/20">
        <div className="flex justify-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
            Hoy
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : ""
              }`}
          >
            {msg.sender === "ai" && (
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1"
                style={{ backgroundImage: `url("${IMAGES.AI_COACH}")` }}
              ></div>
            )}

            <div
              className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === "user" ? "items-end" : ""
                }`}
            >
              {msg.sender === "ai" && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  Entrenadora
                </span>
              )}

              <div
                className={`p-4 shadow-sm text-[15px] leading-relaxed ${msg.sender === "user"
                    ? "rounded-2xl rounded-tr-none bg-primary text-[#102210] font-medium"
                    : "rounded-2xl rounded-tl-none bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800"
                  }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-400 mx-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1"
              style={{ backgroundImage: `url("${IMAGES.AI_COACH}")` }}
            ></div>
            <div className="flex gap-1 bg-white dark:bg-surface-dark p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="shrink-0 bg-background-light dark:bg-background-dark pb-6 pt-2 px-4 relative z-20 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-end gap-2 bg-white dark:bg-surface-dark p-2 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
          <button className="flex items-center justify-center size-10 rounded-full text-gray-400 hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              add_photo_alternate
            </span>
          </button>
          <div className="flex-1 min-w-0 py-2">
            <input
              className="w-full bg-transparent border-0 focus:ring-0 p-0 text-base placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
              placeholder="Escribe tu duda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            className={`flex items-center justify-center size-10 rounded-full transition-colors shrink-0 shadow-sm ${inputText.trim()
                ? "bg-primary text-[#102210] hover:bg-green-400"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
              }`}
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5">
              send
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;
