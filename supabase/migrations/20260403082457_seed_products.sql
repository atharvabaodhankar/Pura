
-- ============================================
-- PURA DATABASE SCHEMA — SEED DATA
-- ============================================

INSERT INTO public.products (id, name, slug, description, category, price, compare_price, stock, images, tags) VALUES
('b2a95c43-982e-4b44-9366-0746e537e5e1', 'Aloe & Green Tea Sanitizer', 'aloe-green-tea-sanitizer', 'Kills 99.9% germs with a refreshing burst of green tea and soothing aloe vera extract.', 'sanitizer', 149.00, NULL, 500, ARRAY['/products/san-aloe.png'], ARRAY['Bestseller']),
('d74652c7-0e6e-4e6f-8a48-a0c5cff6f759', 'Lavender & Rose Sanitizer', 'lavender-rose-sanitizer', 'A calming floral blend that sanitizes deeply while leaving hands smelling like a garden.', 'sanitizer', 149.00, NULL, 500, ARRAY['/products/san-lavender.png'], ARRAY[]::text[]),
('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 'Citrus & Vitamin E Sanitizer', 'citrus-vitamin-e-sanitizer', 'Zesty citrus energy paired with Vitamin E — protection that nourishes as it cleanses.', 'sanitizer', 169.00, NULL, 500, ARRAY['/products/san-citrus.png'], ARRAY['New']),
('e1d9afbb-8c34-4b41-b8d5-115f2122c262', 'Shea & Raw Honey Cream', 'shea-raw-honey-cream', 'Deep moisturizing formula with shea butter and raw honey. Repairs dry, cracked skin overnight.', 'cream', 199.00, NULL, 300, ARRAY['/products/cream-shea.png'], ARRAY['Top Rated']),
('8765e9fc-910f-48d6-9e66-6b2cbb13955b', 'Collagen & Hyaluronic Cream', 'collagen-hyaluronic-cream', 'Advanced anti-aging formula with collagen peptides and hyaluronic acid for plump, youthful hands.', 'cream', 249.00, NULL, 300, ARRAY['/products/cream-collagen.png'], ARRAY[]::text[]),
('7b3e2189-cdb2-4d51-87ab-8f9f72b7a428', 'Rose & Argan Oil Cream', 'rose-argan-oil-cream', 'Luxuriously rich formula with Moroccan argan oil and rose extract. Intensely nourishing for very dry hands.', 'cream', 229.00, NULL, 300, ARRAY['/products/cream-rose.png'], ARRAY[]::text[]),
('2cb8d0b2-7bc2-4afc-a2b8-935dfba03337', 'The Clean Hands Duo', 'clean-hands-duo', 'Sanitizer + Moisturizing Cream together — sanitize, then restore. The perfect daily hand care ritual.', 'bundle', 299.00, 348.00, 100, ARRAY['/products/bundle-duo.png'], ARRAY['Save 20%']),
('5bdf8e9d-c5f1-4df0-b8d7-5674c935ee52', 'Family Care Trio', 'family-care-trio', '3 products: Green Tea Sanitizer + Lavender Sanitizer + Shea Hand Cream. Everything a family needs.', 'bundle', 399.00, 497.00, 100, ARRAY['/products/bundle-trio.png'], ARRAY['Save 25%']);

-- Variants
INSERT INTO public.product_variants (product_id, variant_name, color_hex, size_ml, stock) VALUES
('b2a95c43-982e-4b44-9366-0746e537e5e1', 'Green Tea', '#7ab87f', 100, 200),
('b2a95c43-982e-4b44-9366-0746e537e5e1', 'Mint', '#a8c5aa', 100, 150),
('b2a95c43-982e-4b44-9366-0746e537e5e1', 'Cucumber', '#c4dfc4', 100, 150),
('d74652c7-0e6e-4e6f-8a48-a0c5cff6f759', 'Lavender', '#9b7ed4', 100, 250),
('d74652c7-0e6e-4e6f-8a48-a0c5cff6f759', 'Rose', '#e8b0c4', 100, 250),
('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 'Citrus', '#e8944a', 100, 200),
('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 'Lemon', '#f0c060', 100, 150),
('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 'Orange', '#f4a830', 100, 150),
('e1d9afbb-8c34-4b41-b8d5-115f2122c262', 'Original', '#e8b88a', 75, 200),
('e1d9afbb-8c34-4b41-b8d5-115f2122c262', 'Light', '#f4d4a4', 75, 100),
('8765e9fc-910f-48d6-9e66-6b2cbb13955b', 'Classic', '#70c8e0', 75, 200),
('8765e9fc-910f-48d6-9e66-6b2cbb13955b', 'Light', '#a8e0f0', 75, 100),
('7b3e2189-cdb2-4d51-87ab-8f9f72b7a428', 'Rose', '#f09098', 75, 150),
('7b3e2189-cdb2-4d51-87ab-8f9f72b7a428', 'Argan', '#c4a882', 75, 150);
;
