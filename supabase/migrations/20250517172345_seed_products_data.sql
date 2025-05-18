-- Seed data for categories
INSERT INTO public.categories (name, description)
VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Home & Kitchen', 'Products for your home and kitchen'),
  ('Sports & Outdoors', 'Sporting goods and outdoor equipment'),
  ('Fashion', 'Clothing, shoes, and accessories'),
  ('Health & Personal Care', 'Health and beauty products');

-- Seed data for products
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, in_stock)
VALUES
  -- Electronics
  ('Wireless Noise-Cancelling Headphones', 'Immersive sound quality with active noise cancellation. Long-lasting battery.', 199.99, 1, 'https://picsum.photos/seed/headphones/600/400', 50, TRUE),
  ('Smartwatch Series 7', 'Track your fitness, stay connected, and monitor your health. Sleek design.', 349.00, 1, 'https://picsum.photos/seed/smartwatch/600/400', 30, TRUE),
  ('4K Ultra HD Smart TV 55"', 'Stunning 4K picture quality with smart features. Access all your favorite streaming apps.', 499.99, 1, 'https://picsum.photos/seed/smarttv/600/400', 20, TRUE),
  ('Portable Bluetooth Speaker', 'Compact and powerful speaker with rich sound. Waterproof and dustproof.', 79.50, 1, 'https://picsum.photos/seed/bluetoothspeaker/600/400', 100, TRUE),
  ('Gaming Laptop XTreme', 'High-performance gaming laptop with dedicated graphics card and fast refresh rate display.', 1299.00, 1, 'https://picsum.photos/seed/gaminglaptop/600/400', 15, TRUE),

  -- Home & Kitchen
  ('Robotic Vacuum Cleaner', 'Smart vacuum that cleans your floors automatically. Wi-Fi connected.', 249.99, 2, 'https://picsum.photos/seed/robovacuum/600/400', 40, TRUE),
  ('Espresso Machine Deluxe', 'Brew barista-quality espresso at home. Includes milk frother.', 179.00, 2, 'https://picsum.photos/seed/espresso/600/400', 25, TRUE),
  ('Air Fryer XL', 'Cook healthier meals with less oil. Large capacity for families.', 89.99, 2, 'https://picsum.photos/seed/airfryer/600/400', 60, TRUE),
  ('Non-Stick Cookware Set (10-Piece)', 'Durable and versatile cookware set for all your cooking needs.', 120.75, 2, 'https://picsum.photos/seed/cookware/600/400', 35, TRUE),
  ('Memory Foam Mattress Topper - Queen', 'Add an extra layer of comfort to your bed. Improves sleep quality.', 99.00, 2, 'https://picsum.photos/seed/mattresstopper/600/400', 50, TRUE),

  -- Sports & Outdoors
  ('Yoga Mat Premium', 'Non-slip, eco-friendly yoga mat for all types of practice.', 29.95, 3, 'https://picsum.photos/seed/yogamat/600/400', 150, TRUE),
  ('Adjustable Dumbbell Set', 'Space-saving dumbbell set with adjustable weights. Perfect for home gyms.', 199.00, 3, 'https://picsum.photos/seed/dumbbells/600/400', 20, TRUE),
  ('Camping Tent (4-Person)', 'Durable and weather-resistant tent for outdoor adventures.', 130.50, 3, 'https://picsum.photos/seed/campingtents/600/400', 45, TRUE),
  ('Mountain Bike Pro', 'Lightweight and sturdy mountain bike for off-road trails.', 599.99, 3, 'https://picsum.photos/seed/mountainbike/600/400', 10, TRUE),
  ('Insulated Water Bottle (32 oz)', 'Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.', 24.99, 3, 'https://picsum.photos/seed/waterbottle/600/400', 200, TRUE),

  -- Fashion
  ('Men''s Classic Fit Jeans', 'Comfortable and stylish jeans for everyday wear. Various sizes.', 49.90, 4, 'https://picsum.photos/seed/mensjeans/600/400', 80, TRUE),
  ('Women''s Summer Floral Dress', 'Lightweight and breathable dress perfect for warm weather.', 35.75, 4, 'https://picsum.photos/seed/womansdress/600/400', 70, TRUE),
  ('Leather Ankle Boots', 'Stylish and durable ankle boots. Suitable for all seasons.', 85.00, 4, 'https://picsum.photos/seed/ankleboots/600/400', 40, FALSE), -- Example of out of stock
  ('Running Shoes - Unisex', 'Comfortable and supportive running shoes for athletes.', 75.20, 4, 'https://picsum.photos/seed/runningshoes/600/400', 90, TRUE),
  ('Designer Sunglasses', 'Protect your eyes in style. UV400 protection.', 150.00, 4, 'https://picsum.photos/seed/sunglasses/600/400', 60, TRUE),

  -- Health & Personal Care
  ('Electric Toothbrush SonicClean', 'Advanced cleaning technology for healthier gums and whiter teeth.', 69.99, 5, 'https://picsum.photos/seed/toothbrush/600/400', 120, TRUE),
  ('Organic Vitamin C Serum', 'Brightens skin and reduces signs of aging. Natural ingredients.', 22.50, 5, 'https://picsum.photos/seed/vitamincserum/600/400', 75, TRUE),
  ('Essential Oil Diffuser', 'Create a relaxing atmosphere with your favorite essential oils. Ultrasonic.', 39.95, 5, 'https://picsum.photos/seed/oildiffuser/600/400', 55, TRUE),
  ('Digital Body Weight Scale', 'Accurate and easy-to-read scale for tracking your weight.', 19.99, 5, 'https://picsum.photos/seed/bodyscale/600/400', 100, TRUE),
  ('Beard Grooming Kit for Men', 'Includes beard oil, balm, comb, and scissors. All-natural.', 34.00, 5, 'https://picsum.photos/seed/beardkit/600/400', 65, TRUE);

-- Adding many more products
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, in_stock)
VALUES
  -- More Electronics
  ('Ultra-Thin Laptop 13"', 'Lightweight and powerful for productivity on the go.', 899.99, 1, 'https://picsum.photos/seed/ultrathinlaptop/600/400', 25, TRUE),
  ('Wireless Earbuds Pro', 'Crystal clear sound with long battery life and comfortable fit.', 129.00, 1, 'https://picsum.photos/seed/wirelessearbuds/600/400', 150, TRUE),
  ('Curved Gaming Monitor 27"', 'Immersive gaming experience with high refresh rate.', 320.00, 1, 'https://picsum.photos/seed/curvedmonitor/600/400', 18, TRUE),
  ('Digital Camera DSLR Kit', 'Capture stunning photos and videos with professional quality.', 750.50, 1, 'https://picsum.photos/seed/dslrcamera/600/400', 12, TRUE),
  ('Smart Home Hub Gen 3', 'Control all your smart home devices with voice commands.', 99.99, 1, 'https://picsum.photos/seed/smarthomehub/600/400', 60, TRUE),
  ('E-Reader Paperwhite', 'Read your favorite books glare-free, even in bright sunlight. Waterproof.', 119.00, 1, 'https://picsum.photos/seed/ereader/600/400', 70, TRUE),
  ('Portable Power Bank 20000mAh', 'High-capacity power bank to charge your devices multiple times.', 45.99, 1, 'https://picsum.photos/seed/powerbank/600/400', 200, TRUE),
  ('Mechanical Keyboard RGB', 'Tactile and responsive keyboard for gaming and typing.', 85.00, 1, 'https://picsum.photos/seed/mechanicalkeyboard/600/400', 40, TRUE),
  ('VR Headset Advanced', 'Step into virtual reality with stunning visuals and interactive experiences.', 399.00, 1, 'https://picsum.photos/seed/vrheadset/600/400', 10, FALSE),
  ('Drone with 4K Camera', 'Capture breathtaking aerial footage with this easy-to-fly drone.', 499.00, 1, 'https://picsum.photos/seed/drone4k/600/400', 15, TRUE),

  -- More Home & Kitchen
  ('Stand Mixer Pro', 'Powerful stand mixer for baking enthusiasts. Multiple attachments.', 299.00, 2, 'https://picsum.photos/seed/standmixer/600/400', 20, TRUE),
  ('Blender High-Speed', 'Create smoothies, soups, and sauces with ease. Powerful motor.', 129.99, 2, 'https://picsum.photos/seed/blenderhs/600/400', 50, TRUE),
  ('Coffee Maker Drip (12-Cup)', 'Programmable coffee maker for your daily brew.', 59.50, 2, 'https://picsum.photos/seed/coffeemakerdrip/600/400', 80, TRUE),
  ('Slow Cooker (6-Quart)', 'Prepare delicious meals with minimal effort. Multiple settings.', 49.00, 2, 'https://picsum.photos/seed/slowcooker/600/400', 60, TRUE),
  ('Food Processor Multi-Function', 'Chop, slice, shred, and puree ingredients quickly.', 79.95, 2, 'https://picsum.photos/seed/foodprocessor/600/400', 30, TRUE),
  ('Electric Kettle Glass', 'Fast boiling kettle with blue LED illumination.', 34.99, 2, 'https://picsum.photos/seed/electrickettle/600/400', 100, TRUE),
  ('Toaster Oven Compact', 'Versatile toaster oven for toast, bake, and broil.', 65.00, 2, 'https://picsum.photos/seed/toasteroven/600/400', 45, TRUE),
  ('Dish Rack Stainless Steel', 'Durable and stylish dish rack with utensil holder.', 28.75, 2, 'https://picsum.photos/seed/dishrack/600/400', 90, TRUE),
  ('Kitchen Scale Digital', 'Accurate food scale for precise measurements in cooking and baking.', 15.99, 2, 'https://picsum.photos/seed/kitchenscale/600/400', 120, TRUE),
  ('Cutlery Set (20-Piece) Silverware', 'Elegant and durable silverware set for everyday use and special occasions.', 70.00, 2, 'https://picsum.photos/seed/cutleryset/600/400', 50, TRUE),

  -- More Sports & Outdoors
  ('Resistance Bands Set (5-Piece)', 'Versatile resistance bands for strength training and physical therapy.', 19.99, 3, 'https://picsum.photos/seed/resistancebands/600/400', 250, TRUE),
  ('Sleeping Bag (3-Season)', 'Comfortable and warm sleeping bag for camping and backpacking.', 55.00, 3, 'https://picsum.photos/seed/sleepingbag/600/400', 70, TRUE),
  ('Hiking Backpack (50L)', 'Spacious and durable backpack for multi-day hikes.', 89.90, 3, 'https://picsum.photos/seed/hikingbackpack/600/400', 40, TRUE),
  ('Fitness Tracker Watch', 'Monitor your steps, heart rate, sleep, and workouts.', 49.99, 3, 'https://picsum.photos/seed/fitnesstracker/600/400', 110, TRUE),
  ('Jump Rope Speed Cable', 'Adjustable speed rope for cardio and fitness training.', 12.50, 3, 'https://picsum.photos/seed/jumprope/600/400', 300, TRUE),
  ('Fishing Rod and Reel Combo', 'Beginner-friendly fishing combo for freshwater fishing.', 39.95, 3, 'https://picsum.photos/seed/fishingrod/600/400', 60, TRUE),
  ('Bike Helmet Adult', 'Protective and comfortable helmet for cycling.', 34.00, 3, 'https://picsum.photos/seed/bikehelmet/600/400', 100, TRUE),
  ('Binoculars Compact 10x25', 'Lightweight binoculars for bird watching, hiking, and sports events.', 29.99, 3, 'https://picsum.photos/seed/binoculars/600/400', 80, FALSE),
  ('Picnic Blanket Waterproof XL', 'Large, foldable, and waterproof blanket for outdoor gatherings.', 25.00, 3, 'https://picsum.photos/seed/picnicblanket/600/400', 90, TRUE),
  ('Kayak Inflatable (2-Person)', 'Portable and durable inflatable kayak for lakes and mild rivers.', 250.00, 3, 'https://picsum.photos/seed/inflatablekayak/600/400', 15, TRUE),

  -- More Fashion
  ('Men''s Business Casual Shirt', 'Wrinkle-resistant long-sleeve shirt for office or smart-casual look.', 38.00, 4, 'https://picsum.photos/seed/mensshirt/600/400', 70, TRUE),
  ('Women''s High-Waisted Leggings', 'Comfortable and flattering leggings for workouts or casual wear.', 24.99, 4, 'https://picsum.photos/seed/womansleggings/600/400', 120, TRUE),
  ('Classic Leather Belt', 'Genuine leather belt, a staple for any wardrobe.', 29.50, 4, 'https://picsum.photos/seed/leatherbelt/600/400', 90, TRUE),
  ('Fedora Hat Wool', 'Stylish wool fedora for a touch of class.', 42.00, 4, 'https://picsum.photos/seed/fedorahat/600/400', 50, TRUE),
  ('Silk Scarf Patterned', 'Elegant silk scarf with beautiful patterns. Versatile accessory.', 22.00, 4, 'https://picsum.photos/seed/silkscarf/600/400', 100, TRUE),
  ('Men''s Athletic Shorts', 'Lightweight and breathable shorts for sports and activities.', 19.90, 4, 'https://picsum.photos/seed/mensshorts/600/400', 150, TRUE),
  ('Women''s Knit Cardigan', 'Cozy and stylish open-front cardigan for layering.', 39.99, 4, 'https://picsum.photos/seed/womanscardigan/600/400', 65, TRUE),
  ('Canvas Sneakers Low-Top', 'Comfortable and versatile sneakers for everyday wear.', 55.00, 4, 'https://picsum.photos/seed/canvassneakers/600/400', 110, TRUE),
  ('Crossbody Bag Compact', 'Stylish and practical crossbody bag for essentials.', 30.00, 4, 'https://picsum.photos/seed/crossbodybag/600/400', 75, FALSE),
  ('Winter Beanie Knit Cap', 'Warm and soft knit beanie for cold weather.', 15.00, 4, 'https://picsum.photos/seed/winterbeanie/600/400', 200, TRUE),

  -- More Health & Personal Care
  ('Aromatherapy Essential Oil Set (Top 6)', 'Popular essential oils like lavender, peppermint, tea tree.', 25.99, 5, 'https://picsum.photos/seed/essentialoilset/600/400', 90, TRUE),
  ('Sunscreen SPF 50 Broad Spectrum', 'Water-resistant sunscreen for face and body.', 14.50, 5, 'https://picsum.photos/seed/sunscreen/600/400', 180, TRUE),
  ('Shampoo & Conditioner Set (Sulfate-Free)', 'Gentle and nourishing hair care for all hair types.', 28.00, 5, 'https://picsum.photos/seed/shampooconditioner/600/400', 70, TRUE),
  ('Manicure Set Professional (12-Piece)', 'Stainless steel nail care tools in a portable case.', 18.99, 5, 'https://picsum.photos/seed/manicureset/600/400', 100, TRUE),
  ('Foam Roller for Muscle Massage', 'Deep tissue massage roller for recovery and pain relief.', 21.00, 5, 'https://picsum.photos/seed/foamroller/600/400', 85, TRUE),
  ('Sleep Mask Silk', 'Blocks out light for a restful sleep. Soft and comfortable.', 12.95, 5, 'https://picsum.photos/seed/sleepmask/600/400', 130, TRUE),
  ('Hand Sanitizer Gel (Pack of 4)', 'Kills 99.9% of germs. Travel size.', 9.99, 5, 'https://picsum.photos/seed/handsanitizer/600/400', 300, TRUE),
  ('Hair Dryer Professional Ionic', 'Fast drying with less frizz. Multiple heat and speed settings.', 49.99, 5, 'https://picsum.photos/seed/hairdryer/600/400', 50, TRUE),
  ('Bath Bombs Gift Set (6-Pack)', 'Relaxing and moisturizing bath bombs with natural ingredients.', 19.75, 5, 'https://picsum.photos/seed/bathbombs/600/400', 110, TRUE),
  ('Makeup Brush Set (14-Piece)', 'Professional quality makeup brushes for flawless application.', 24.00, 5, 'https://picsum.photos/seed/makeupbrushes/600/400', 95, TRUE);
