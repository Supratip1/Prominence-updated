import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ProminenceChatWidget = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-gradient-to-br from-purple-500 to-green-400 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat/help"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-black/90 text-white rounded-2xl shadow-2xl p-6 animate-fade-in">
          <div className="font-bold mb-2">Need help?</div>
          <p className="text-sm text-gray-300 mb-4">Ask us anything or leave your email and we'll get back to you!</p>
          <input type="email" placeholder="Your email" className="w-full p-2 rounded bg-white/10 text-white mb-2 outline-none" />
          <textarea placeholder="Your message" className="w-full p-2 rounded bg-white/10 text-white mb-2 outline-none" rows={2} />
          <button className="w-full bg-gradient-to-r from-green-400 to-purple-500 text-white py-2 rounded font-semibold hover:opacity-90 transition">Send</button>
        </div>
      )}
    </div>
  );
};

export default ProminenceChatWidget; 