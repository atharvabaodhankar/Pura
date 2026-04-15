import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Package, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  delivered: 'bg-emerald-100 text-emerald-700',
  shipped:   'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  pending:   'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

function OrderCard({ order }) {
  const orderNum = `#PURA-${order.id.slice(0, 8).toUpperCase()}`;
  const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const statusStyle = STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700';

  return (
    <div className="mt-2 rounded-2xl border border-glass-border bg-white/80 overflow-hidden text-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border bg-white/60">
        <div>
          <div className="font-bold text-charcoal">{orderNum}</div>
          <div className="text-xs text-text-muted">{date} · ₹{order.total_amount}</div>
        </div>
        <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle}`}>
          {order.status}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {order.order_items?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.products?.images?.[0] && (
              <img src={item.products.images[0]} alt={item.products.name} className="w-8 h-8 object-contain rounded-lg bg-black/5 p-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-charcoal truncate">{item.products?.name}</div>
              <div className="text-xs text-text-muted">Qty: {item.quantity} · ₹{item.unit_price}</div>
            </div>
            {item.products?.slug && (
              <Link to={`/product/${item.products.slug}`} className="text-sage-dark shrink-0">
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
        {order.order_items?.length > 2 && (
          <div className="text-xs text-text-muted">+{order.order_items.length - 2} more item(s)</div>
        )}
      </div>
      <div className="px-4 py-2 border-t border-glass-border bg-black/[0.02]">
        <Link to="/orders" className="text-xs font-bold text-sage-dark uppercase tracking-widest hover:underline flex items-center gap-1">
          View full order <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUser ? 'bg-charcoal' : 'bg-sage-dark'}`}>
        {isUser ? <User className="w-3.5 h-3.5 text-cream" /> : <Bot className="w-3.5 h-3.5 text-cream" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-charcoal text-cream rounded-tr-sm'
            : 'bg-white/80 border border-glass-border text-charcoal rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        {msg.orders?.map((order, i) => <OrderCard key={i} order={order} />)}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  'Where is my order?',
  'Show my recent orders',
  'What is your return policy?',
  'How long does shipping take?',
];

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Pura's support assistant. I can help you track orders, check status, or answer any questions. What can I help you with?",
      orders: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cachedOrders, setCachedOrders] = useState(null); // persist fetched orders for follow-ups
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, orders: null };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history for context (exclude orders data, just text)
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      let headers = { 'Content-Type': 'application/json' };

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: msg, history, cachedOrders })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }

      const data = await res.json();

      // Cache orders so follow-up questions can use them without re-fetching
      if (data.orders) setCachedOrders(data.orders);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        orders: data.orders
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.message === 'Failed to fetch'
          ? "I'm having trouble connecting right now. Please try again in a moment."
          : (err.message || "Something went wrong. Please try again."),
        orders: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-charcoal text-cream flex items-center justify-center shadow-2xl hover:bg-sage-dark transition-all duration-300 hover:scale-110 border-none cursor-pointer"
        aria-label="Open chat"
      >
        {open
          ? <X className="w-5 h-5" />
          : <MessageCircle className="w-5 h-5" />
        }
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-sage-dark rounded-full border-2 border-warm-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[199] w-[360px] max-h-[560px] flex flex-col rounded-[28px] overflow-hidden shadow-2xl border border-glass-border"
          style={{ background: 'rgba(250,247,242,0.97)', backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-glass-border bg-charcoal text-cream">
            <div className="w-9 h-9 rounded-full bg-sage-dark flex items-center justify-center">
              <Bot className="w-4 h-4 text-cream" />
            </div>
            <div>
              <div className="font-semibold text-sm">Pura Support</div>
              <div className="flex items-center gap-1.5 text-xs opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Online · Usually replies instantly
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto border-none bg-transparent cursor-pointer text-cream/60 hover:text-cream transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ maxHeight: '380px' }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-sage-dark flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-cream" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/80 border border-glass-border flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-sage-dark animate-spin" />
                  <span className="text-xs text-text-muted">Thinking...</span>
                </div>
              </div>
            )}

            {/* Not logged in notice */}
            {!user && messages.length === 1 && (
              <div className="text-xs text-center text-text-muted bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                <Link to="/login" className="text-sage-dark font-bold hover:underline">Sign in</Link> to ask about your orders
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (only at start) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-glass-border bg-white/60 text-charcoal hover:bg-sage-dark hover:text-cream hover:border-sage-dark transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-glass-border bg-white/40 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your orders..."
              rows={1}
              className="flex-1 resize-none bg-white/80 border border-glass-border rounded-2xl px-4 py-2.5 text-sm text-charcoal placeholder:text-text-muted focus:outline-none focus:border-sage-dark/40 transition-colors"
              style={{ maxHeight: '80px' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-charcoal text-cream flex items-center justify-center border-none cursor-pointer hover:bg-sage-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
