import { useState } from 'react';
import Header from './homeComp/header';
import MainContentCont from './homeComp/mainContentCont';
import Footer from './homeComp/footer';

const Home = ({
  cart,
  isCartOpen,
  setIsCartOpen,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedPromo,
  setAppliedPromo,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleExploreClick = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeaturedClick = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-cont min-h-screen bg-[#070406] text-white">
      <Header
        onExploreClick={handleExploreClick}
        onFeaturedClick={handleFeaturedClick}
      />
      <MainContentCont
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onAddToCart={onAddToCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      <Footer />
    </div>
  );
};

export default Home;

