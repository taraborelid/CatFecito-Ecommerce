import "./CategoriesSection.css"; // Importamos los estilos
import categoriesImg1 from "../../assets/img/categoriesImg1.png";
import categoriesImg2 from "../../assets/img/categoriesImg2.png";
import categoriesImg3 from "../../assets/img/categoriesImg3.png";
import categoriesImg4 from "../../assets/img/categoriesImg4.png";

const categories = [
  { label: "Café en grano", img: categoriesImg1 /* catGrano */ },
  { label: "Cápsulas", img: categoriesImg2 /* catCapsulas */ },
  { label: "Cafeteras y accesorios", img: categoriesImg3 /* catCafeteras */ },
  { label: "Ofertas", img: categoriesImg4 /* catOfertas */ },
];

export function CategoriesSection() {
  return (
    <section className="categories-section">
      <h2 className="categories-title">
        Explora nuestras categorías
      </h2>
      
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.label}>
            
            <div className="category-img-container">
              <img
                src={cat.img}
                alt={cat.label}
                className="category-img"
              />
            </div>
            
            {/* Nombre de la categoría */}
            <p className="category-label">
              {cat.label}
            </p>
            
            {/* Botón */}
            <button className="category-btn">
              Ver productos
            </button>
            
          </div>
        ))}
      </div>
    </section>
  );
}