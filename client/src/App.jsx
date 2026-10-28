import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Home from './home';
import About from './about';
import Services from './services';
import Contact from './contact';
import { AuthModal } from './components/AuthModal';
import { checkHealth, getSavedUser, clearAuth } from './services/api';
import './App.css';

const App = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('carnage_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => getSavedUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('carnage_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    checkHealth()
      .then((h) => setIsConnected(h.database === 'connected'))
      .catch(() => setIsConnected(false));
  }, []);

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        const nextQty = Math.min(product.inStock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.inStock, quantity) }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(item.product.inStock, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Nav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isConnected={isConnected}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              appliedPromo={appliedPromo}
              setAppliedPromo={setAppliedPromo}
              currentUser={currentUser}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  );
};

export default App;
