import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Star } from "lucide-react"

// Pricing plans data
interface PricingPlan {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  buttonText: string
  popular: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: 0,
    period: "month",
    description: "Perfect for individuals and small projects",
    features: [
      "5 keywords tracked",
      "Weekly AI crawls",
      "Basic visibility dashboard",
      "Email notifications",
      "Community support",
    ],
    buttonText: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: 49,
    period: "month",
    description: "Ideal for growing businesses and teams",
    features: [
      "100 keywords tracked",
      "Daily AI crawls",
      "Advanced analytics & insights",
      "API access",
      "Custom reports",
      "Priority support",
      "Competitor analysis",
      "Historical data (12 months)",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited keywords",
      "Real-time AI crawls",
      "White-label reports",
      "Team collaboration",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security",
      "Custom training & onboarding",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
]

// Pricing Cards Component
function PricingCards({ plans }: { plans: PricingPlan[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length)
  }

  return (
    <div className="relative">
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {plans.map((plan, index) => (
              <div key={plan.name} className="w-full flex-shrink-0 px-4">
                <PricingCard plan={plan} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
          aria-label="Previous pricing plan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
          aria-label="Next pricing plan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {plans.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to pricing plan ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Pricing Card Component
function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      className={`relative p-8 pt-12 md:pt-8 rounded-2xl border ${
        plan.popular ? "border-green-400 bg-green-900/20" : "border-white/10 bg-white/5"
      } shadow-lg`}
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: plan.popular ? "0 20px 40px rgba(124, 252, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
    >
      {plan.popular && (
        <div className="absolute top-2 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-normal text-white mb-2">{plan.name}</h3>
        <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
        <div className="mb-2">
          <span className="text-4xl font-normal text-white">${plan.price}</span>
          <span className="text-gray-400">/{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
          plan.popular
            ? "bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400"
            : "border-2 border-white/30 text-white hover:bg-white/10"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {plan.buttonText}
        {plan.popular && <ArrowRight className="w-4 h-4 inline-block ml-2" />}
      </motion.button>
    </motion.div>
  )
}

const PricingSection = () => {
  return (
    <motion.section id="pricing" className="py-16 sm:py-20 relative z-10 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-6 sm:mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <PricingCards plans={pricingPlans} />
      </div>
    </motion.section>
  )
}

export default PricingSection 