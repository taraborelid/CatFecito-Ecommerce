import "./NewsletterBanner.css"; // Importamos los estilos

const NEWSLETTER_BG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80";

export function NewsletterBanner() {
  return (
    <section className="newsletter-banner">
      {/* Imagen de fondo */}
      <img
        src={NEWSLETTER_BG}
        alt="Taza de café"
        className="newsletter-bg-img"
      />
      
      {/* Overlay */}
      <div className="newsletter-overlay" />
      
      {/* Contenido */}
      <div className="newsletter-content">
        <p className="newsletter-title">
          Suscribite y obtén
        </p>
        <p className="newsletter-highlight">
          10% de descuento
        </p>
        <p className="newsletter-desc">
          Recibí ofertas exclusivas, lanzamientos y consejos para disfrutar tu café al máximo.
        </p>
        
        {/* Formulario */}
        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="newsletter-input"
          />
          <button className="newsletter-btn">
            Suscribirme
          </button>
        </div>
      </div>
    </section>
  );
}