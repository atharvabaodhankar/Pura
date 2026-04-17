# Pura — Premium Personal Care Design & Engineering

Pura is a next-generation personal care platform that bridges the gap between scientific manufacturing transparency and premium consumer experience. Specializing in high-performance hand sanitizers and intensive repair creams, Pura provides users with deep insights into the sourcing, extraction, and clinical efficacy of every ingredient.

---

## 🧪 The Pura Philosophy: "Ingredient Transparency"

Unlike traditional personal care brands, Pura's USP (Unique Selling Proposition) is the **Product Process Flow**. Every product in our lineup features a detailed, 6-7 step manufacturing journey—from the organic harvest in Rajasthan to the ISO-certified cleanroom filling.

### Our Signature Lineup
| Product Category | Key Variants | Core Benefits |
|---|---|---|
| **Hand Sanitizers** | Aloe & Green Tea, Lavender & Rose, Citrus & Vit E | 99.9% Germ Kill + Skin Soothing |
| **Repair Creams** | Shea & Raw Honey, Collagen & HA, Rose & Argan | 72hr Moisture Lock + Anti-Ageing |

---

## 🏗️ System Architecture

Pura is built as a modern, full-stack monorepo featuring a decoupled frontend and a secure, backend-driven architecture.

### Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS 4.0
- **Animations**: Framer Motion (Fluid transitions & Micro-interactions)
- **Backend**: Node.js + Express (RESTful API)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Payment Gateway**: Razorpay Integration
- **AI Integration**: Groq SDK (Llama 3 powered assistants)
- **Authentication**: Supabase Auth (JWT-based)

### Data Schema Overview
The system utilizes 7 core PostgreSQL tables managed via Supabase:
- `profiles`: Extended user data (Customer vs Admin roles).
- `products`: Master product catalog with pricing and stock.
- `product_variants`: Size and fragrance-specific variants.
- `orders` & `order_items`: Comprehensive transaction tracking.
- `reviews`: Moderated user feedback system.

---

## 🚀 Key Features

### 1. Cinematic "How It Works" Section
A high-fidelity visualization of the manufacturing process for every product. Users can track the exact steps like *Supercritical CO₂ Extraction* or *HPLC Quality Gates*.

### 2. Secure Checkout Flow
Integrated with **Razorpay**, providing a seamless payment experience for Indian and international customers.

### 3. Admin Power-Suite
A dedicated interface for administrators to:
- Manage live inventory.
- Track real-time order status (Pending → Delivered).
- Moderate product reviews.

### 4. AI-Driven Insights
Powered by Groq, providing real-time answers to ingredient-specific queries and personalized product recommendations.

---

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18+)
- Supabase Project & API Keys
- Razorpay API Credentials

### Backend Setup
```bash
cd pura-backend
npm install
# Create a .env file with:
# SUPABASE_URL, SUPABASE_ANON_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, GROQ_API_KEY
npm run dev
```

### Frontend Setup
```bash
cd pura-frontend
npm install
# Create a .env file with:
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_BACKEND_URL
npm run dev
```

---

## 📜 Project Documentation
For more detailed technical insights, please refer to:
- [`system-design.md`](file:///c:/Users/baodh/OneDrive/Desktop/4th%20Sem/Prototyping/Chem/Pura/system-design.md) — Full DB schema and RLS policies.
- [`pura-process-flows.md`](file:///c:/Users/baodh/OneDrive/Desktop/4th%20Sem/Prototyping/Chem/Pura/pura-process-flows.md) — Detailed manufacturing data.
- [`UI_SYSTEM.md`](file:///c:/Users/baodh/OneDrive/Desktop/4th%20Sem/Prototyping/Chem/Pura/UI_SYSTEM.md) — Design tokens and aesthetic guidelines.

---
**Developed with ❤️ for the 4th Semester Prototyping Final.**
