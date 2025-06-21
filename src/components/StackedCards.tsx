"use client";
import { motion } from "framer-motion";

interface Card {
  title: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
}

const cards: Card[] = [
  {
    title: "Discover",
    description: "Automatically discover and fetch your digital assets from websites, social media, and other online sources.",
    image: "/screenshots/Assetfetching.png",
  },
  {
    title: "Track",
    description: "Monitor your discovered assets in real-time with comprehensive tracking and status monitoring.",
    image: "/screenshots/fetched.png",
  },
  {
    title: "Integrate",
    description: "Seamlessly integrate with your existing workflow tools like Jira for project management and collaboration.",
    image: "/screenshots/jira.png",
  },
  {
    title: "Optimize",
    description: "Get intelligent optimization suggestions to improve your content's AI search visibility and performance.",
    image: "/screenshots/optimization.png",
  },
  {
    title: "Analyze",
    description: "View comprehensive analytics and scoring dashboards to track your AI visibility performance over time.",
    image: "/screenshots/score.png",
  },
];

export default function StackedCards() {
  return (
    <section className="relative flex justify-center py-24">
      <div className="relative w-full max-w-5xl">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="absolute inset-0 mx-auto w-full max-w-3xl
                       p-8 bg-white/10 rounded-2xl backdrop-blur-lg
                       shadow-2xl border border-white/20
                       flex flex-col"
            /* stack the cards – 32 px lower each layer         */
            style={{ top: i * 32, zIndex: cards.length - i }}
            /* entrance animation */
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            /* subtle lift on hover */
            whileHover={{ y: -12, scale: 1.03 }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="h-48 w-full object-contain rounded mb-6"
            />
            <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-white/80 leading-relaxed">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 