# Supabase Database Setup

This directory contains the database schema and migrations for the Smart Cart application using a remote Supabase instance.

## Directory Structure

- `/migrations`: Contains SQL migration files for database schema changes
- `/seed`: Contains seed data to populate the database with initial data
- `/types`: Contains TypeScript type definitions generated from the database schema

## Working with the Cloud Supabase Database

### Setup Supabase CLI for Remote Access

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install --save-dev supabase
   ```

2. Login to Supabase:
   ```bash
   npx supabase login
   ```

3. Link your local project to your remote Supabase project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
   Replace `your-project-ref` with your Supabase project reference ID. You can find this in your Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`.

### Apply Migrations to Remote Database

To push your local migrations to the remote Supabase database:

```bash
npm run supabase:push
```

### Generate TypeScript Types from Remote Schema

You'll need to modify the package.json script with your actual project ID:

```bash
"supabase:types": "supabase gen types typescript --project-id your-project-id > supabase/types/supabase.ts"
```

Then run:

```bash
npm run supabase:types
```

### Pull Remote Database Changes

If you've made changes to the database schema through the Supabase dashboard UI, pull those changes to update your local migrations:

```bash
npm run supabase:pull
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

### Creating New Migrations

To create a new migration:

1. Create a new SQL file in the `migrations` directory with a timestamp prefix (e.g., `20240517000000_add_new_field.sql`)
2. Add your SQL commands to the file
3. Push the migration to your remote database with `npm run supabase:push` 