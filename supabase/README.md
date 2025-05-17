# Supabase Database Setup

This directory contains the database schema and migrations for the Smart Cart application.

## Directory Structure

- `/migrations`: Contains SQL migration files for database schema changes
- `/seed`: Contains seed data to populate the database with initial data
- `/types`: Contains TypeScript type definitions generated from the database schema

## Working with the Database

### Starting the Local Supabase Instance

```bash
npm run supabase:start
```

### Generate TypeScript Types

After making changes to the database schema, generate updated TypeScript types:

```bash
npm run supabase:types
```

### Reset the Database

To reset the database to a clean state and apply all migrations:

```bash
npm run db:reset
```

### Database Schema

The database schema includes:

- `activity_logs`: Tracks user actions in the application
- `categories`: Product categories
- `products`: E-commerce product catalog
- `reviews`: User reviews for products
- `cart_items`: Shopping cart items for users
- `orders`: User orders with payment and shipping info
- `order_items`: Individual items in orders

Each table has Row Level Security (RLS) policies to ensure data security.

### Database Relationships

- Products belong to Categories
- Reviews belong to Products and Users
- Cart Items belong to Products and Users
- Orders belong to Users
- Order Items belong to Orders and Products
- Activity Logs track User actions

### Performance Optimizations

The schema includes indices on foreign keys to optimize query performance:

- `idx_products_category`
- `idx_reviews_product` and `idx_reviews_user`
- `idx_cart_items_user`
- `idx_orders_user`
- `idx_order_items_order`

### Running Migrations

To create a new migration:

1. Create a new SQL file in the `migrations` directory with a timestamp prefix
2. Add your SQL commands to the file
3. Run `supabase db reset` to apply the migration

### Connecting to Hosted Supabase

To connect to your hosted Supabase instance:

1. Set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
2. Push migrations to production using `supabase db push` 