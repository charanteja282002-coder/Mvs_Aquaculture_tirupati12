
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../AppContext';

export const ChatBot: React.FC = () => {
  const { products } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string, links?: { title: string, uri: string }[] }[]>([
    { 
      role: 'assistant', 
      text: "Hi! I'm your MVS Aqua AI Assistant. How can I help you with your aquarium today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Build context of products
      const productContext = products.map(p => 
        `Product: ${p.name}, Category: ${p.category}, Price: ₹${p.price}, Stock: ${p.stock}, SKU: ${p.sku}, Desc: ${p.description}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `You are the MVS Aqua AI Assistant, an expert in aquariums, fish care, and aquascaping. 
          Help users find products from our catalog and provide professional advice on tank maintenance.
          Be helpful, concise, and enthusiastic about the hobby.
          
          If a user asks how to login or about admin access, inform them that access is restricted to store employees only. 
          The admin panel can be reached via the user icon in the header or the link in the footer.

          Our current store inventory:
          ${productContext}`,
          tools: [{ googleSearch: {} }]
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const links = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Learn more',
        uri: chunk.web?.uri
      })).filter((link: any) => link.uri);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: aiText,
        links: links?.length > 0 ? links : undefined
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to the deep sea right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden mb-4 animate-fade-in-up">
          {/* Header */}
          <div className="bg-aqua-dark p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gold p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-aqua-dark" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">MVS Aqua AI</h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Expert Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-aqua-dark text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sources:</p>
                      {msg.links.map((link, lIdx) => (
                        <a 
                          key={lIdx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-xs text-aqua-light hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-aqua-dark mr-2" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Consulting the reef...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fish care or products..."
                className="w-full pl-4 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-aqua-dark transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-aqua-dark text-white rounded-xl hover:bg-aqua-light disabled:opacity-50 transition-all shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-aqua-dark text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative"
      >
        <MessageSquare className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 bg-gold h-4 w-4 rounded-full animate-ping opacity-75"></span>
        <span className="absolute -top-1 -right-1 bg-gold h-4 w-4 rounded-full"></span>
      </button>
    </div>
  );
};
