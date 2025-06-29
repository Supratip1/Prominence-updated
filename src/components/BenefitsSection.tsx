import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is Prominence and how does it work?",
    answer: "Prominence is an AI visibility analytics platform that helps you track, analyze, and optimize your brand's presence in AI-powered search engines and assistants. It discovers your digital footprint, benchmarks you against competitors, and provides actionable recommendations to improve your AI search ranking.",
  },
  {
    question: "How does Prominence find my competitors?",
    answer: "Prominence uses advanced AI models to identify and analyze your top competitors in the same industry or domain, providing you with real-time benchmarking and insights.",
  },
  {
    question: "What kind of recommendations will I get?",
    answer: "You'll receive AI-driven, actionable recommendations to improve your structured data, content quality, technical SEO, and overall AI search readiness.",
  },
  {
    question: "Is my data secure with Prominence?",
    answer: "Yes, your data is encrypted and handled securely. We do not share your analysis or results with third parties.",
  },
  {
    question: "Can I track my progress over time?",
    answer: "Absolutely! Prominence provides historical analytics and trend tracking so you can see your improvements and ROI over time.",
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up, enter your website, and Prominence will begin analyzing your AI search visibility and provide you with a comprehensive dashboard.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="key-benefits" className="relative py-10 sm:py-24 bg-[#181A20] text-white">
      <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-4 sm:mb-6">
            FAQ
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 font-normal">
            Everything you need to know about Prominence and AI visibility analytics.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#23242a] border border-gray-700 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none transition-colors"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="text-lg sm:text-xl font-normal text-white font-display">{faq.question}</span>
                <span className="ml-4 flex-shrink-0">
                  {openIndex === idx ? (
                    <Minus className="w-6 h-6 text-gray-300" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-300" />
                  )}
                </span>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`px-6 pb-5 text-gray-300 text-base sm:text-lg font-normal transition-all duration-300 ease-in-out ${openIndex === idx ? 'block' : 'hidden'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 