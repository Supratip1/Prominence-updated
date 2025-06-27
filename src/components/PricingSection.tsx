import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const BookACallSection = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would integrate with your backend or email service
  };

  return (
    <section id="book-a-call" className="relative py-10 sm:py-16 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white text-black">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
          {/* Left: Heading and Professional Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <motion.h2
              className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight text-black mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Book a Call With Us
            </motion.h2>
            
            <motion.div
              className="space-y-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-lg sm:text-xl text-gray-800 leading-relaxed">
                Ready to be an early adopter? Get a personalized strategy session with our AI visibility experts.
              </p>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                During this 15-minute discovery call, we'll analyze your current AI search presence and provide a custom strategy to improve your brand's visibility in AI-powered search engines.
              </p>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Early access users receive lifetime pricing, priority support, and the opportunity to shape the future of AI visibility tools before they become mainstream.
              </p>
            </motion.div>
          </div>

          {/* Right: Enhanced Form */}
          <motion.div
            className="w-full lg:w-1/2 bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8 md:p-12 border border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Thank you!</h3>
                <p className="text-gray-600 mb-4">We'll be in touch within 24 hours to schedule your call.</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  <p className="font-medium">What's next?</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Check your email for confirmation</li>
                    <li>• Prepare your AI visibility questions</li>
                    <li>• We'll send calendar link within 24 hours</li>
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                <div className="text-center mb-2 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-1 sm:mb-2">Schedule Your Free Strategy Session</h3>
                  <p className="text-xs sm:text-sm text-gray-600">No commitment required - just valuable insights</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-black"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1">Work Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-black"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs sm:text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-black"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1">What are your main AI visibility goals?</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-black"
                    placeholder="e.g., Improve rankings in ChatGPT, track competitor mentions, optimize content for AI search..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-semibold bg-black text-white hover:bg-gray-900 transition-colors text-base sm:text-lg mt-2 shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Book Free Strategy Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <div className="text-center text-xs text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Calls typically last 15-20 minutes
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookACallSection; 