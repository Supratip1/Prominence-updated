import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#181824] to-[#0f0f23] px-4">
      <div className="w-full max-w-md bg-white/5 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10 flex flex-col items-center">
        {/* Optional logo */}
        {/* <img src="/logo.svg" alt="Prominence Logo" className="h-10 mb-6" /> */}
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-white mb-2 text-center">Get Early Access</h1>
        <p className="text-gray-300 text-base md:text-lg mb-8 text-center font-sans">Sign up to unlock your AI visibility dashboard.</p>
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-sans">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/20 text-white font-sans focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-sans">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/20 text-white font-sans focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-display font-semibold rounded-2xl px-8 py-4 text-xl md:text-2xl shadow-lg transition-transform duration-200 relative overflow-hidden"
            style={{ boxShadow: '0 0 24px #a855f7' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Start with AI'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup; 