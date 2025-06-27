import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ProminenceChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!email || !message.trim()) return;
    
    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setEmail('');
      setMessage('');
      
      // Reset sent status after 3 seconds
      setTimeout(() => {
        setIsSent(false);
        setOpen(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat/help"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-white text-black rounded-2xl shadow-2xl p-6 animate-fade-in border border-gray-200">
          {!isSent ? (
            <>
              <div className="font-bold mb-2 text-black">Need help?</div>
              <p className="text-sm text-gray-600 mb-4">Ask us anything or leave your email and we'll get back to you!</p>
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-100 text-black mb-2 outline-none border border-gray-300" 
              />
              <textarea 
                placeholder="Your message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 rounded bg-gray-100 text-black mb-2 outline-none border border-gray-300" 
                rows={2} 
              />
              <button 
                className={`w-full py-2 rounded font-semibold transition ${
                  isSending 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                onClick={handleSend}
                disabled={isSending || !email || !message.trim()}
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <div className="font-bold text-black mb-2">Message sent!</div>
              <p className="text-sm text-gray-600">We'll get back to you soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProminenceChatWidget; 