import { useState } from 'react';
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

function App() {
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <>
      <ScrollProgress />
      <Toast show={showToast} />
      <Navbar />
      <Hero />
      <Marquee />
      <Products onAddToCart={handleAddToCart} />
      <Ingredients />
      <WhyUs />
      <Testimonials />
      <HowItWorks />
      <CtaBanner />
      <Footer />
    </>
  );
}

export default App;
