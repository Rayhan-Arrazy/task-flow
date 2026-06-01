"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI productivity assistant. How can I help you with your tasks today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          // Pass history excluding the very first greeting if we want, but passing all is fine
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was a network error communicating with the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col max-w-[800px] mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2 text-[28px] font-extrabold"
      >
        AI Assistant
      </motion.h1>
      <p className="mb-6 text-[15px] text-muted-foreground">
        Chat with your personal AI productivity coach powered by Gemini.
      </p>

      <Card className="flex flex-col flex-1 overflow-hidden border-white/10 bg-[rgba(26,26,46,0.8)] backdrop-blur-[30px]">
        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6c5ce7]/20 text-[#6c5ce7]">
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                    msg.role === "user" 
                      ? "bg-[#6c5ce7] text-white rounded-br-sm" 
                      : "bg-white/5 border border-white/10 text-foreground rounded-bl-sm"
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6c5ce7]/20 text-[#6c5ce7]">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-foreground rounded-bl-sm flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">AI is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about your tasks..."
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full bg-[#6c5ce7] hover:bg-[#7c6df7] text-white transition-all disabled:opacity-50"
                disabled={!input.trim() || isLoading}
              >
                <Send size={16} className={input.trim() && !isLoading ? "ml-1" : ""} />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
