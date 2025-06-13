import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateWidth() {
      if (carouselRef.current) {
        setWidth(carouselRef.current.offsetWidth);
      }
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden" ref={carouselRef}>
      <motion.div
        className="flex"
        animate={{ x: -currentIndex * width }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="min-w-full px-4"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{testimonial.content}</p>
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TestimonialCarousel; 