# Pura: Technical Project Report

**Date:** April 15, 2026  
**Subject:** Prototyping Final Submission  
**Status:** Phase 2 (Backend Integration Complete)

---

## 1. Abstract
Pura is a personal care brand concept and digital platform designed to solve the "trust deficit" in the beauty and hygiene industry. By combining a premium aesthetic with rigorous scientific transparency, the project demonstrates how technical documentation (process flows, ingredient sourcing) can be transformed into a core consumer feature.

## 2. Problem Statement
Most personal care products provide a list of ingredients but offer zero visibility into:
1.  **Sourcing Ethics**: Where did the Aloe vera come from?
2.  **Extraction Purity**: Was it extracted using heat (degrading nutrients) or cold-press?
3.  **Scientific Validation**: What specific tests (HPLC, GC-MS) ensure the product's safety?

## 3. The Pura Solution
Pura addresses these issues through a "Digital Product Passport" approach. Every product is mapped to a unique multi-step process flow that details every "Quality Gate" from farm to bottle. This data is exposed through a cinematic React interface, making safety and quality a visual experience.

## 4. Technical Architecture

### 4.1 Frontend Layer
- **Framework**: React 19 (using the latest features like `use` and improved HMR).
- **Styling**: Tailwind CSS 4.0 for a utility-first approach with a custom design system defined in [`UI_SYSTEM.md`](file:///c:/Users/baodh/OneDrive/Desktop/4th%20Sem/Prototyping/Chem/Pura/UI_SYSTEM.md).
- **Animations**: Framer Motion for scroll-linked animations and smooth component transitions.
- **State**: Zustand for lightweight global state management (Cart & Auth).

### 4.2 Backend Layer
- **Environment**: Node.js with Express.
- **API Strategy**: Moved from direct client-side Supabase calls to a secure server-side implementation.
- **Security**: JWT verification via Supabase and CORS protection.
- **Payments**: Integrated with Razorpay's Node.js SDK for secure transaction handling.

### 4.3 Database (Schema Design)
The PostgreSQL database (via Supabase) follows a normalized structure:
- **`profiles`**: Linked to Auth for role-based access control.
- **`products`**: JSONB support for image arrays and tags.
- **`orders`**: Transactional data linked to multiple `order_items`.
- **`RLS Policies`**: Row Level Security ensures users can only access their own data while admins have global visibility.

## 5. Manufacturing Process Flow Engineering
A significant portion of the project involved documenting the manufacturing journey of 6 distinct products.
- **Sanitizers**: Focused on Ethanol purity and antimicrobial efficacy (EN 1500 standards).
- **Creams**: Developed flows for 72-hour moisture lock and Vitamin C stability.
- *Refer to*: [`pura-process-flows.md`](file:///c:/Users/baodh/OneDrive/Desktop/4th%20Sem/Prototyping/Chem/Pura/pura-process-flows.md) for the raw data.

## 6. Key Implementation Milestones
1.  **UI Scaffolding**: Translation of high-fidelity designs into responsive React components.
2.  **Supabase Migration**: Automating table creation and schema updates using MCP servers.
3.  **Auth Integration**: Implementing protected routes for the Admin dashboard and User profile.
4.  **Payment Sandbox**: Successful integration and testing of the Razorpay checkout flow.

## 7. Conclusion & Future Scope
The current prototype successfully demonstrates the feasibility of a transparency-first e-commerce platform. Future iterations will include:
- **Blockchain Traceability**: Storing batch codes on-chain for tamper-proof sourcing.
- **AR Experience**: Allowing users to scan physical bottles to see the "Process Flow" in Augmented Reality.
- **Personalized Chemist AI**: A chatbot that analyzes skin types and recommends specific ingredient-to-benefit matches.

---
**Author:** Antigravity AI (Project Assistant)  
**Collaborator:** User  
**Repository:** `atharvabaodhankar/Pura`
