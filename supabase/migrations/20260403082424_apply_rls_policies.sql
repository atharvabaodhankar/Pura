
-- ============================================
-- PURA DATABASE SCHEMA — RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Admins can view and update all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.get_my_role() = 'admin');
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.get_my_role() = 'admin');

-- Products & Variants: Public read for active products
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product variants" ON public.product_variants FOR SELECT USING (true);
-- Admins full access
CREATE POLICY "Admins full access products" ON public.products FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Admins full access variants" ON public.product_variants FOR ALL USING (public.get_my_role() = 'admin');

-- Orders & Order Items: Users view their own orders
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Admins full access to orders
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Admins full access order items" ON public.order_items FOR ALL USING (public.get_my_role() = 'admin');

-- Reviews: Public read approved reviews
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
-- Users can view their own unapproved reviews and create reviews
CREATE POLICY "Users view own unapproved reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admins full access to reviews
CREATE POLICY "Admins full access reviews" ON public.reviews FOR ALL USING (public.get_my_role() = 'admin');

-- Cart: Users full access to their own cart
CREATE POLICY "Users own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);
;
