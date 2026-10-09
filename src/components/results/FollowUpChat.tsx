import React, { useState } from 'react';
import type { FoodScanResult, ChatMessage } from '../../types/nutrition';
import { answerFollowUpQuestion } from '../../services/chatService';
import { MessageSquare, Send, Sparkles, Bot, User, CornerDownRight, ShieldCheck } from 'lucide-react';

interface FollowUpChatProps {
  food: FoodScanResult;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ food }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I have analyzed the evidence for **${food.name}**. You can ask me to explain unfamiliar additives, break down sugar and sodium levels, or identify missing information on this label.`,
      timestamp: 'Just now',
      citations: ['Verified OCR & Nutritional Report']
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const suggestedQuestions = food.suggestedQuestions || [
    'How much sugar is in one serving?',
    'Explain unfamiliar additives in simple English',
    'Is this product suitable for nut allergies?',
    'What information is missing from this label?'
  ];

  const handleSend = async (questionText: string) => {
    const textToSend = questionText.trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await answerFollowUpQuestion(textToSend, food);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to analyze your question against this label right now. Please rephrase or verify manually.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unsupportedQueryWarning: true
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECEEEA] gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E4F0E5] flex items-center justify-center text-[#163D2B]">
            <MessageSquare size={16} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#163D2B]">
              Ask Gemma 4 About This Food
            </h2>
            <p className="text-xs text-[#68736B]">
              Conversational intelligence strictly grounded in extracted facts and citations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#3D7954] bg-[#E4F0E5] px-2.5 py-1 rounded-full font-semibold self-start sm:self-center">
          <ShieldCheck size={13} />
          <span>Non-Medical Grounding</span>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-[#68736B] tracking-wider block">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isSending}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-[#E2E8E0] bg-[#F6F4E9] hover:bg-[#E4F0E5] hover:text-[#163D2B] text-[#1D2921] transition-all text-left disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="border border-[#E2E8E0] rounded-xl p-4 bg-[#F6F4E9]/30 min-h-[220px] max-h-[380px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#163D2B] text-white'
                    : 'bg-[#E4F0E5] text-[#163D2B]'
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow-2xs ${
                  isUser
                    ? 'bg-[#163D2B] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E2E8E0] text-[#1D2921] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">
                  {m.text}
                </div>

                {/* Citations pill */}
                {m.citations && m.citations.length > 0 && (
                  <div className={`pt-2 border-t text-[10px] flex flex-wrap items-center gap-1.5 ${
                    isUser ? 'border-white/20 text-white/80' : 'border-[#ECEEEA] text-[#68736B]'
                  }`}>
                    <span className="font-bold flex items-center gap-1">
                      <CornerDownRight size={10} />
                      <span>Citations:</span>
                    </span>
                    {m.citations.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className={`px-1.5 py-0.5 rounded ${
                          isUser ? 'bg-white/20' : 'bg-[#F6F4E9] border border-[#E2E8E0]'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] text-right ${isUser ? 'text-white/60' : 'text-[#68736B]'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#68736B] p-2 bg-white rounded-lg border border-[#E2E8E0] max-w-xs">
            <Sparkles size={14} className="text-[#3D7954] animate-spin" />
            <span>Consulting extracted label text...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${food.name}... (e.g. "Is there high fructose corn syrup?")`}
          disabled={isSending}
          className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8E0] bg-white text-xs text-[#1D2921] focus:outline-none focus:border-[#163D2B] placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-5 py-3 rounded-xl bg-[#163D2B] text-white text-xs font-semibold hover:bg-[#0F2A1E] transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={14} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      <p className="text-[10px] text-center text-[#68736B] italic">
        Answers cite directly extracted label tokens. Not intended for clinical or medical decision making.
      </p>
    </div>
  );
};
