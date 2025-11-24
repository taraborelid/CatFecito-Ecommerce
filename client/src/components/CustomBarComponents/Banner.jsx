import React, { useState, useEffect } from 'react';
import './Banner.css';
import { useNavigate } from 'react-router-dom';

import cafePacksImg from '../../assets/img/1000149940.jpg';
import capsulasImg from '../../assets/img/1000149943.jpg';

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    { 
      src: cafePacksImg, 
      alt: "Banner principal con café y arte de gato",
      clickable: true 
    },
    { 
      src: capsulasImg, 
      alt: "Paquetes de café Catfecito",
      clickable: true
    },
  ];

  const totalSlides = slides.length;

  const showSlide = (index) => {
    const normalizedIndex = ((index % totalSlides) + totalSlides) % totalSlides;
    setCurrentSlide(normalizedIndex);
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    showSlide(currentSlide + 1);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    showSlide(currentSlide - 1);
  };

  const goToSlide = (index) => {
    showSlide(index);
  };

  const handleImageClick = () => {
    if (slides[currentSlide].clickable) {
      navigate('/products');
    }
  };

  // Auto-advance carousel cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="hero-slider">
      <div className="slider-images" onClick={handleImageClick} style={{ cursor: slides[currentSlide].clickable ? 'pointer' : 'default' }}>
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.src}
            alt={slide.alt}
            className={index === currentSlide ? 'active' : ''}
          />
        ))}
        
        {/* Controles del Slider */}
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};