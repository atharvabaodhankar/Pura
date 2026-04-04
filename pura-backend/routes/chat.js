const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { supabaseAdmin } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const INTENT_PROMPT = `You are a router for Pura's customer support chat. Decide if the user's message needs fresh order data from the database.

Respond with JSON only — no markdown, no extra text.

{"action":"get_orders"} — fetch orders when:
- User is asking to SEE their orders for the first time ("show my orders", "what did I order")
- User asks about a specific order they haven't mentioned yet

{"action":"none"} — do NOT fetch when:
- The conversation already contains order data (check history)
- User is asking a follow-up about an order already discussed ("is it shipped?", "when will it arrive?", "what did I order?")
- User asks about policies, products, ingredients, returns, shipping times
- General chitchat or greetings

Examples:
- "show my orders" → {"action":"get_orders"}
- "is it shipped?" (after orders shown) → {"action":"none"}
- "what is the status?" (after orders shown) → {"action":"none"}
- "when will it arrive?" → {"action":"none"}
- "what is your return policy?" → {"action":"none"}
- "show my orders" (first time) → {"action":"get_orders"}`;

const REPLY_PROMPT = `You are Pura's friendly customer support assistant for a premium skincare brand (hand sanitizers and creams, sold in India).

Be warm, conversational, and concise. Never use markdown bullet points or headers. Write like a helpful human support agent texting a customer.

Facts you know:
- Returns: 15-day easy swap policy
- Shipping: Free pan India, 3-5 business days  
- Support email: support@pura.in
- Order numbers format: #PURA-XXXXXXXX

When order data is in the conversation, answer questions about it directly without re-listing everything. If the user asks "is it shipped?" just say yes/no and the status — don't dump the full order again.`;

async function queryUserOrders(userId) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id, status, total_amount, created_at, shipping_address,
      order_items (
        quantity, unit_price,
        products (name, slug, images)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

function formatOrdersForContext(orders) {
  if (!orders?.length) return 'User has no orders.';
  return orders.map(o => ({
    orderNumber: `#PURA-${o.id.slice(0, 8).toUpperCase()}`,
    id: o.id,
    status: o.status,
    total: `₹${o.total_amount}`,
    date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    shipsTo: o.shipping_address?.full_address || '',
    items: o.order_items.map(i => ({
      name: i.products?.name,
      qty: i.quantity,
      price: `₹${i.unit_price}`,
      productLink: `/product/${i.products?.slug}`
    }))
  }));
}

// POST /api/chat
router.post('/', requireAuth, async (req, res) => {
  try {
    const { message, history = [], cachedOrders = null } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    // Last 8 messages for context
    const recentHistory = history.slice(-8).map(m => ({ role: m.role, content: m.content }));

    // --- Step 1: Determine intent ---
    const intentRes = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      max_completion_tokens: 32,
      messages: [
        { role: 'system', content: INTENT_PROMPT },
        // Give it the conversation so it knows if orders were already shown
        ...recentHistory,
        { role: 'user', content: message }
      ]
    });

    let intentText = intentRes.choices[0]?.message?.content?.trim() || '{}';
    intentText = intentText.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

    let intent = { action: 'none' };
    try { intent = JSON.parse(intentText); } catch { /* default none */ }

    // --- Step 2: Fetch DB if needed ---
    let orders = null;
    let showOrderCards = false;

    if (intent.action === 'get_orders') {
      orders = await queryUserOrders(req.user.id);
      showOrderCards = true;
    } else if (cachedOrders) {
      // Use already-fetched orders from frontend cache for follow-up questions
      orders = cachedOrders;
      showOrderCards = false; // don't re-show cards for follow-ups
    }

    // --- Step 3: Build messages for final reply ---
    const finalMessages = [{ role: 'system', content: REPLY_PROMPT }];

    // Inject order context if we have it
    if (orders !== null) {
      const orderContext = formatOrdersForContext(orders);
      finalMessages.push({
        role: 'system',
        content: `Current order data for this user:\n${JSON.stringify(orderContext, null, 2)}`
      });
    }

    // Add conversation history
    finalMessages.push(...recentHistory);
    finalMessages.push({ role: 'user', content: message });

    // --- Step 4: Generate reply ---
    const replyRes = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_completion_tokens: 400,
      messages: finalMessages
    });

    const reply = replyRes.choices[0]?.message?.content?.trim()
      || "I'm not sure about that. Can I help you with something else?";

    return res.json({
      reply,
      orders: showOrderCards ? orders : null  // only send cards when freshly fetched
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat service unavailable. Please try again.' });
  }
});

module.exports = router;
