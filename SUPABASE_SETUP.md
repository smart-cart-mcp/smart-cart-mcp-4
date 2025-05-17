# Smart Cart Supabase Cloud Setup

This guide will help you apply your database migrations and seed data to your cloud Supabase instance.

## Prerequisites

- Your Supabase project is already set up with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env` file
- You have the Supabase CLI installed with `npm install --save-dev supabase`

## Getting Started

1. **Login to Supabase CLI**

   ```bash
   npx supabase login
   ```

   This will open a browser window where you'll authenticate with your Supabase account.

2. **Link your project**

   ```bash
   npm run supabase:link
   ```

   This will link your local project to your remote Supabase instance.

3. **Apply the database schema**

   ```bash
   npm run supabase:push
   ```

   This will push your migrations from the `supabase/migrations` folder to your remote Supabase database.

4. **Seed your database with initial data**

   ```bash
   npm run supabase:seed
   ```

   This will execute the SQL seed file to populate your database with initial categories and products.

5. **Generate TypeScript types**

   ```bash
   npm run supabase:types
   ```

   This will generate TypeScript types based on your database schema and save them to `supabase/types/supabase.ts`.

## Making Schema Changes

1. Create a new migration file in `supabase/migrations` with a timestamp prefix, like:
   ```
   supabase/migrations/20240517123000_add_new_feature.sql
   ```

2. Write your SQL statements in the file.

3. Push the changes to your Supabase cloud instance:
   ```bash
   npm run supabase:push
   ```

4. Update your TypeScript types:
   ```bash
   npm run supabase:types
   ```

## Troubleshooting

- If you encounter permission issues, make sure you're logged in with the correct Supabase account.
- If migrations fail, check your SQL syntax and make sure your changes don't conflict with existing schema.
- If type generation fails, check that your project ID is correctly set in package.json.

## Database Documentation

For detailed information about the database schema, relationships, and Row Level Security policies, see [supabase/README.md](./supabase/README.md). 