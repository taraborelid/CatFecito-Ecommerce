import "./ValuesBanner.css"; 
import valuesBannerImg1 from "../../assets/img/valuesBannerImg1.svg";
import valuesBannerImg2 from "../../assets/img/valuesBannerImg2.svg";
import valuesBannerImg3 from "../../assets/img/valuesBannerImg3.svg";
import valuesBannerImg4 from "../../assets/img/valuesBannerImg4.svg";

export function ValuesBanner() {
  const values = [
    {
      label: "100% Arábica",
      desc: "Granos seleccionados de la más alta calidad.",
      img: valuesBannerImg1
    },
    {
      label: "Comercio justo",
      desc: "Apoyamos a productores locales y prácticas sostenibles.",
      img: valuesBannerImg2
      
    },
    {
      label: "Tostado artesanal",
      desc: "Resaltamos los sabores únicos de cada origen.",
      img: valuesBannerImg3
    },
    {
      label: "Pasión felina",
      desc: "Inspirados en los gatos y en los amantes del buen café.",
      img: valuesBannerImg4
    },
  ];

  return (
    <section className="values-banner">
      <div className="values-grid">
        {values.map((v) => (
          <div key={v.label}>
            <div className="value-icon-container">
              <img 
                src={v.img} 
                alt={v.label} 
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <p className="value-title">
              {v.label}
            </p>
            <p className="value-desc">
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}