# Smart Cart Database Schema

This directory contains the database schema and migrations for the Smart Cart application using your Supabase cloud instance (`iktywzahfhafyupvxhzv`).

> **Note**: For step-by-step setup instructions, see [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) in the root directory.

## Directory Structure

- `/migrations`: Contains SQL migration files for database schema changes
- `/seed`: Contains seed data to populate the database with initial data
- `/types`: Contains TypeScript type definitions generated from the database schema

## Quick Commands

```bash
# Link to your project
npm run supabase:link

# Push migrations to your Supabase cloud
npm run supabase:push

# Generate TypeScript types
npm run supabase:types

# Seed the database
npm run supabase:seed
```

## Database Schema

The database schema includes:

- `activity_logs`: Tracks user actions in the application
- `categories`: Product categories
- `products`: E-commerce product catalog
- `reviews`: User reviews for products
- `cart_items`: Shopping cart items for users
- `orders`: User orders with payment and shipping info
- `order_items`: Individual items in orders

Each table has Row Level Security (RLS) policies to ensure data security.

## Database Relationships

- Products belong to Categories
- Reviews belong to Products and Users
- Cart Items belong to Products and Users
- Orders belong to Users
- Order Items belong to Orders and Products
- Activity Logs track User actions

## Performance Optimizations

The schema includes indices on foreign keys to optimize query performance:

- `idx_products_category`
- `idx_reviews_product` and `idx_reviews_user`
- `idx_cart_items_user`
- `idx_orders_user`
- `idx_order_items_order`

## Creating New Migrations

To create a new migration:

1. Create a new SQL file in the `migrations` directory with a timestamp prefix (e.g., `20240517000000_add_new_field.sql`)
2. Add your SQL commands to the file
3. Push the migration to your remote database with `npm run supabase:push` 