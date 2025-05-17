-- Seed data for categories
INSERT INTO public.categories (name, description)
VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Home & Kitchen', 'Products for your home and kitchen'),
  ('Sports & Outdoors', 'Sporting goods and outdoor equipment'),
  ('Fashion', 'Clothing, shoes, and accessories'),
  ('Health & Personal Care', 'Health and beauty products');

-- Seed data for products
INSERT INTO public.products (name, description, price, category_id, image_url, in_stock, stock_quantity)
VALUES
  ('Smart Watch', 'Advanced fitness tracking smart watch with heart rate monitoring and GPS', 199.99, 1, 'https://example.com/images/watch.jpg', TRUE, 50),
  ('Wireless Earbuds', 'High-quality noise cancelling earbuds with long battery life', 149.99, 1, 'https://example.com/images/earbuds.jpg', TRUE, 75),
  ('Smart Home Hub', 'Central control for all your smart devices with voice control', 129.99, 1, 'https://example.com/images/hub.jpg', TRUE, 30),
  ('Wireless Charger', 'Fast wireless charging pad for smartphones and other devices', 49.99, 1, 'https://example.com/images/charger.jpg', TRUE, 100),
  ('Bluetooth Speaker', 'Portable waterproof bluetooth speaker with 20 hours of playtime', 79.99, 1, 'https://example.com/images/speaker.jpg', TRUE, 45),
  ('Coffee Maker', 'Programmable coffee maker with thermal carafe', 89.99, 2, 'https://example.com/images/coffee.jpg', TRUE, 25),
  ('Air Fryer', 'Digital air fryer with multiple cooking functions', 129.99, 2, 'https://example.com/images/airfryer.jpg', TRUE, 20),
  ('Yoga Mat', 'Non-slip eco-friendly yoga mat with carrying strap', 39.99, 3, 'https://example.com/images/yogamat.jpg', TRUE, 60),
  ('Running Shoes', 'Lightweight running shoes with responsive cushioning', 109.99, 4, 'https://example.com/images/shoes.jpg', TRUE, 40),
  ('Vitamin C Serum', 'Antioxidant-rich vitamin C serum for brighter skin', 29.99, 5, 'https://example.com/images/serum.jpg', TRUE, 80); 