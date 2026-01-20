import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      titlePart1: "Power Your",
      titlePart2: "World with",
      titlePart3: "Smart Electronics",
      description: "Discover premium earphones, AirPods, chargers, cables, and headsets built for speed, sound, and style — all in one place.",
      buttonText: "Browse Products",
      image: "/bg.avif"
    },
    {
      id: 2,
      titlePart1: "Premium",
      titlePart2: "Audio Experience",
      titlePart3: "Unmatched Quality",
      description: "Immerse yourself in crystal-clear sound with our high-end headphones and earphones. Perfect for music lovers and professionals.",
      buttonText: "Shop Audio",
      image: "/headphone.avif"
    },
    {
      id: 3,
      titlePart1: "Fast Charging",
      titlePart2: "Cables &",
      titlePart3: "Accessories",
      description: "Stay powered up with our durable, high-speed charging cables and accessories designed for all your devices.",
      buttonText: "View Accessories",
      image: "/charging-cable.avif"
    },
    {
      id: 4,
      titlePart1: "Wireless",
      titlePart2: "Freedom with",
      titlePart3: "Latest Tech",
      description: "Experience true wireless freedom with our cutting-edge AirPods and Bluetooth devices. No cords, no limits.",
      buttonText: "Explore Wireless",
      image: "/wireless.avif"
    }
  ];

  // Auto slide function
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Manual slide selection
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Slides container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className="w-full h-full shrink-0 relative"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>

            {/* Text content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg animate-fadeIn">
                <span className='text-cyan-400'>{slide.titlePart1}</span> {slide.titlePart2} <br /> {slide.titlePart3}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white mb-8 drop-shadow-md max-w-2xl animate-slideUp">
                {slide.description}
              </p>
              <div className="flex gap-4 flex-wrap justify-center animate-slideUp">
                <Link
                  to="/products"
                  className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-cyan-500 hover:border-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-cyan-400 w-10' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;