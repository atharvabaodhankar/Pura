import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useCartStore } from './stores/cartStore';

import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Toast from './components/Toast';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Products from './components/Products';
import Ingredients from './components/Ingredients';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import HowItWorks from './components/HowItWorks';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Preloader from './components/Preloader';

function LandingPage({ onAddToCart }) {
  return (
    <>
      <Hero />
      <Marquee />
      <Products onAddToCart={onAddToCart} />
      <Ingredients />
      <WhyUs />
      <Testimonials />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}

function App() {
  const [showToast, setShowToast] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    fetchCart();
    // Simulate loading for brand feel
    const timer = setTimeout(() => setIsLoading(false), 2400);
    return () => clearTimeout(timer);
  }, [fetchCart]);

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Preloader isLoading={isLoading} />
        <ScrollProgress />
        <Toast show={showToast} />
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ChatWidget />
        
        <Routes>
          <Route path="/" element={<LandingPage onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
