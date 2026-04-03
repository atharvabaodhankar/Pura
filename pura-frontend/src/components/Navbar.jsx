import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cart = useCartStore(state => state.cart);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-[100] px-16 py-6 flex items-center justify-between transition-all duration-400 ${
        scrolled
          ? 'bg-warm-white/85 backdrop-blur-[20px] border-b border-glass-border shadow-sm'
          : ''
      }`}
      style={{ transition: 'background 0.4s, backdrop-filter 0.4s' }}
    >
      <Link
        to="/"
        className="font-heading text-[1.8rem] font-semibold tracking-[0.04em] text-charcoal no-underline block"
      >
        Pur<span className="text-sage-dark">a</span>
      </Link>

      <div className="flex items-center gap-12">
        <ul className="hidden lg:flex gap-10 list-none items-center m-0 p-0">
          {[
            { href: '/#products', label: 'Products' },
            { href: '/#ingredients', label: 'Ingredients' },
            { href: '/#how-it-works', label: 'How It Works' },
            { href: '/#why', label: 'Why Pura' },
            { href: '/#testimonials', label: 'Reviews' },
          ].map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="no-underline text-charcoal text-[0.82rem] font-bold tracking-[0.1em] uppercase relative transition-colors duration-300 hover:text-sage-dark group"
              >
                {link.label}
                <span className="absolute bottom-[-3px] left-0 w-0 h-px bg-sage-dark transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        
        {/* Cart & Auth */}
        <div className="flex items-center gap-6 border-l border-glass-border pl-6">
          <div className="relative">
            <button 
              onMouseEnter={() => setShowUserMenu(true)}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-charcoal hover:text-sage-dark transition-colors border-none bg-transparent cursor-pointer p-1"
            >
              <User className="w-[1.125rem] h-[1.125rem]" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div 
                onMouseLeave={() => setShowUserMenu(false)}
                className="absolute top-full right-0 mt-4 w-56 glass border-glass-border rounded-3xl shadow-xl p-4 animate-fade-card z-50"
              >
                {user ? (
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-3 border-b border-glass-border mb-2">
                      <div className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1 opacity-50">Account</div>
                      <div className="font-semibold text-charcoal truncate">{user.user_metadata?.full_name || user.email}</div>
                    </div>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 text-sm text-charcoal transition-colors">
                      <Package className="w-4 h-4 text-sage-dark" />
                      Order History
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 text-sm text-charcoal transition-colors">
                        <ShieldCheck className="w-4 h-4 text-sage-dark" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-sm text-red-500 transition-colors border-none bg-transparent cursor-pointer text-left w-full mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" className="btn-primary justify-center text-sm py-2.5 h-10">Log In</Link>
                    <Link to="/signup" className="text-center text-xs font-bold text-sage-dark uppercase tracking-widest py-2 hover:underline">Create Account</Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            className="flex items-center text-charcoal hover:text-sage-dark transition-colors relative border-none bg-transparent cursor-pointer p-1"
            onClick={onCartClick}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-sage-dark text-white text-[0.55rem] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-warm-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
