import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error: signUpError } = await signUp(email, password, fullName);
    
    if (signUpError) {
      setError(signUpError.message);
    } else {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-6 relative overflow-hidden pt-24">
      {/* Background blobs */}
      <div className="absolute opacity-45 animate-morph-blob" style={{ width: 600, height: 600, filter: 'blur(60px)', background: 'radial-gradient(circle, #e8d5b8, #c4a88266)', top: -100, right: -80, zIndex: 0 }} />
      <div className="absolute opacity-45 animate-morph-blob" style={{ width: 400, height: 400, filter: 'blur(60px)', background: 'radial-gradient(circle, #b8d4b9, #7a9e7e44)', bottom: -50, left: -100, zIndex: 0, animationDelay: '-5s' }} />

      <div className="glass-card w-full max-w-md p-10 relative z-10 fade-up visible">
        <div className="text-center mb-8">
          <h1 className="font-heading text-[2.5rem] text-charcoal font-semibold mb-2">Create Account</h1>
          <p className="text-text-muted">Join the Pura family</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-light transition-all"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-light transition-all"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-glass-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-light transition-all"
              required 
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-sage-dark hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
