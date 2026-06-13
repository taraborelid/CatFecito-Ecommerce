import "./FeaturedCoffees.css";
import api from '../../services/api';
import { useState, useEffect } from "react";
import { resolveImage } from '../../utils/image.js';
import cafeLocalImg1 from "../../assets/img/1.png";
import cafeLocalImg2 from "../../assets/img/2.png";
import cafeLocalImg3 from "../../assets/img/3.png";
import coffeePlant from "../../assets/img/coffee-plant.jpg";
import { useNavigate } from "react-router-dom";

const FALLBACK_COFFEES = [
  {
    id: "static-1",
    name: "Café de especialidad Perú",
    type: "250 g",
    price: 11000,
    image: cafeLocalImg1,
  },
  {
    id: "static-2",
    name: "Café de especialidad Brasil",
    type: "250 g",
    price: 11000,
    image: cafeLocalImg2,
  },
  {
    id: "static-3",
    name: "Café de especialidad Colombia",
    type: "250 g",
    price: 11000,
    image: cafeLocalImg3,
  },
  { 
    id: "static-4", 
    name: "Café de especialidad Blend", // O el nombre que quieras
    type: "250 g", 
    price: 11000, 
    image: cafeLocalImg3,
  },
];

export function FeaturedCoffees() {
  // ✅ Fix principal: FALLBACK_COFFEES sin corchetes extra
  const [featuredProducts, setFeaturedProducts] = useState(FALLBACK_COFFEES);
  const navigate = useNavigate();
  const handleNavigateToProducts = () => {
    console.log('Navegando a products...');
    navigate('/products');
    console.log('Navigate ejecutado');
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await api.get('/products', { signal: controller.signal });
        const list = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        const mapped = list.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          image: resolveImage(p.image_url),
          stock: typeof p.stock === 'number' ? p.stock : 0,
          type: p.category_name || '',
        }));

        const inStock = mapped.filter((p) => p.stock > 0);

        if (inStock.length > 0) {
          const shuffled = inStock.sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        }
        // Si no hay productos del backend, el estado mantiene FALLBACK_COFFEES
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Error al traer productos destacados, usando estáticos:", err);
        }
        // En caso de error también mantenemos el fallback
      }
    };

    fetchFeaturedProducts();
    return () => controller.abort();
  }, []);

  return (
    <section className="featured-coffees">
      <div className="featured-layout-container">

        {/* COLUMNA IZQUIERDA */}
        <div className="featured-left-column">

          <div className="featured-header">
            <h2 className="featured-title">Cafés destacados</h2>
            <div className="featured-divider">
              <div className="featured-line" />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" fill="#6B3F1E" />
                <circle cx="8" cy="8" r="5.5" stroke="#6B3F1E" strokeWidth="1" fill="none" />
              </svg>
              <div className="featured-line" />
            </div>
          </div>

          <div className="featured-grid">
            {featuredProducts.map((product, index) => {
              const safeId = product?.id ?? `cafe-${index}`;
              const safePrice = Number(product?.price) || 0;

              return (
                <div key={safeId} className="coffee-card">
                  <div className="coffee-img-container">
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product?.name || "Café"}
                        className="coffee-img"
                      />
                    ) : (
                      <span className="coffee-placeholder">Sin imagen</span>
                    )}
                  </div>

                  <p className="coffee-name">{product?.name || "Producto sin nombre"}</p>
                  <p className="coffee-weight">{product?.type || ""}</p>
                  <p className="coffee-price">${safePrice.toLocaleString('es-CO')}</p>

                  <button button onClick={handleNavigateToProducts} className="coffee-btn">Ir a Tienda</button>
                </div>
              );
            })}
          </div>

          <div className="view-all-container">
            <button onClick={handleNavigateToProducts} className="view-all-btn">Ver todos los cafés</button>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="featured-right-column">
          <div className="origin-card">
            <img
              src={coffeePlant}
              alt="Granos de café en planta"
              className="origin-img"
            />
            <div className="origin-info">
              <p className="origin-title">
                Origen que<br />se siente
              </p>
              <p className="origin-desc">
                Trabajamos directamente con productores para garantizar
                frescura, calidad y sostenibilidad en cada grano.
              </p>
              <button className="origin-btn">Conoce más</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}