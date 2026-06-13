import {useState, useEffect, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import cafePacksImg from '../../assets/img/1000149940.jpg';
import capsulasImg from '../../assets/img/1000149943.jpg';
import "./HeroCarousel.css";

const slides = [
    {
    img: cafePacksImg,
    placeholder: "#6b4c30",
    title: "Café especialidad,",
    tittleAccent: "hecho para ti",
    desc: "Seleccionamos los mejores granos y trabajamos con productores locales para llevarte una experiencia unica en cada taza.",
    cta: "Descubre nuestros cafés",
    },
    {
    img: capsulasImg,
    placeholder: "#3a2a1a",
    title: "Despertá tus sentidos,",
    titleAccent: "cada mañana",
    desc: "Cápsulas y granos de origen único. Porque cada sorbo merece ser especial.",
    cta: "Ver cápsulas",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const handleNavigateToProducts = () => {
    console.log('Navegando a products...');
    navigate('/products');
    console.log('Navigate ejecutado');
  };

  const goTo = (index) => {
    setCurrent(index);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const s = slides[current];

  return (
    <section className="hero-carousel">
      {/* Slide */}
      <div 
        className="hero-slide" 
        style={{ backgroundColor: s.placeholder }}
      >
        <img src={s.img} alt="Café slide" className="hero-image" />
        
        {/* Overlay oscuro izquierdo (Corregido: clase hero-overlay) */}
        <div className="hero-overlay" />

        {/* Texto (Corregido: engloba h1, p y button) */}
        <div className="hero-content">
          <h1 className="hero-title">
            {s.title}
            <br />
            <span className="hero-title-accent">{s.titleAccent}</span>
          </h1>

          <p className="hero-desc">{s.desc}</p>
          
          <button onClick={handleNavigateToProducts} className="hero-cta">
            {s.cta}
          </button>
        </div>
      </div>

      {/* Indicadores - barras rectangulares (Corregido: ahora están fuera del hero-slide) */}
      <div className="hero-indicators-container">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`hero-indicator ${i === current ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}