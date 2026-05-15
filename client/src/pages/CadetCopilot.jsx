import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Send, Bot, User, Loader2, Sparkles, ShieldAlert, ChevronRight } from 'lucide-react';

const CadetCopilot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Operational Greetings, Cadet. I am the Command AI Copilot. How can I assist your training today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiResponse = "Intelligence scan complete. Based on NCC Directorate guidelines, you should focus on Section 4: Weapon Training for your B-Certificate exam.";
      
      if (input.toLowerCase().includes('camp')) {
        aiResponse = "Current deployments include CATC-I and RDC selection trials. You are eligible to apply via the Camp Portal.";
      } else if (input.toLowerCase().includes('drill')) {
        aiResponse = "Standard Drill Command (Savdhan): Ensure heels are together at 30 degrees, knees locked, and chest out. Would you like a video demonstration?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">AI Command Copilot</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Neural Training Assistant | v1.0.4</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-gold/10 border border-accent-gold/20 rounded-full">
          <Sparkles size={14} className="text-accent-gold" />
          <span className="text-[10px] font-orbitron font-bold text-accent-gold uppercase tracking-widest">Neural Link Stable</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden relative">
          {/* Subtle Background Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <Cpu size={400} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                    ${msg.role === 'user' ? 'bg-accent-gold/20 border-accent-gold/30' : 'bg-primary-green/20 border-primary-green/30'}
                  `}>
                    {msg.role === 'user' ? <User size={16} className="text-accent-gold" /> : <Bot size={16} className="text-primary-green" />}
                  </div>
                  <div className={`p-4 rounded-2xl font-poppins text-sm leading-relaxed
                    ${msg.role === 'user' ? 'bg-accent-gold text-primary-navy font-medium' : 'bg-white/5 border border-white/10 text-slate-300'}
                  `}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Loader2 size={16} className="animate-spin text-primary-green" />
                  <span className="text-xs font-orbitron text-slate-500 uppercase tracking-widest">Processing Intelligence...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-black/20">
            <div className="relative flex items-center gap-4">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Drill, Camps, or Training Manuals..."
                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-4 px-6 text-white text-sm font-poppins focus:outline-none focus:border-accent-gold/50 transition-all"
              />
              <button 
                type="submit"
                className="bg-accent-gold text-primary-navy p-4 rounded-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Knowledge Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-slate-400">Quick Directives</h3>
            <div className="space-y-2">
              {[
                'Explain RDC Selection',
                'Drill Savdhan Position',
                'B-Certificate Syllabus',
                'Weapon Training Basics'
              ].map((text, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(text)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/5 text-[10px] font-orbitron text-slate-400 hover:text-accent-gold hover:border-accent-gold/30 transition-all flex items-center justify-between group"
                >
                  {text} <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-primary-green/10 border border-primary-green/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-primary-green" />
              <p className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">Safety Protocol</p>
            </div>
            <p className="text-[10px] text-slate-400 font-poppins leading-relaxed">
              AI Copilot is for training guidance only. For operational orders, always follow your ANO and Battalion circulars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadetCopilot;
