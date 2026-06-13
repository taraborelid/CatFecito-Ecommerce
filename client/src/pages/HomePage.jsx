import "../styles/CustomBar.css";
import "../styles/index.css";
import "../styles/App.css";
import "animate.css";
import MetaData from "../components/ui/MetaData/MetaData";
import { NavBar } from "../components/CustomBarComponents/NavBar";
import { Header } from "../components/CustomBarComponents/Header";
import HeroCarousel from "../components/homePageComponent/HeroCarousel";
import { ValuesBanner } from "../components/ValuesBanner/ValuesBanner";
import { Footer } from "../components/FooterComponent/Footer";
import {FeaturedCoffees} from "../components/FeaturedCoffees/FeaturedCoffees"
import {NewsletterBanner} from "../components/NewsletterBanner/NewsletterBanner"
import {CategoriesSection} from "../components/CategoriesSection/CategoriesSection"

export const HomePage = ({
  cartItems,
  itemCount,
  isCartOpen,
  onOpenCart,
  onCloseCart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenAuthModal = null,
}) => {
  return (
    <>
      <MetaData title="Catfecito" />
      <div className="sticky-header-wrapper">
        <Header
              cartItems={cartItems}
              itemCount={itemCount}
              isCartOpen={isCartOpen}
              onOpenCart={onOpenCart}
              onCloseCart={onCloseCart}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onOpenAuthModal={onOpenAuthModal}
            />
      <NavBar />
      </div>
      
      <HeroCarousel/>
      <ValuesBanner/>
      <FeaturedCoffees/>
      <NewsletterBanner/>
      <CategoriesSection/>
      <Footer />
    </>
  );
};
