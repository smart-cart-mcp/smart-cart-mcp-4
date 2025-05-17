# Admin Dashboard & Order Management Setup

This document explains how to set up and use the Smart Cart Admin Dashboard for order management, product administration, and customer support.

## Setting Up Admin Users

Smart Cart uses Supabase role-based access control (RBAC). To designate a user as an admin:

1. First ensure the user has registered for an account through the regular sign-up process.
2. Then, you'll need to update their user metadata to assign the admin role.

### Option 1: Using the Admin Script (Recommended)

We've included a utility script to make this process easy:

```bash
# Make sure you have the SUPABASE_SERVICE_ROLE_KEY in your .env file
# This key can be found in your Supabase dashboard under Project Settings > API

# Run the script with the user's email
node scripts/set-admin-role.js admin@example.com
```

### Option 2: Through Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to **Authentication** > **Users**
3. Find the user you want to make an admin
4. Click **Edit** 
5. In the **Metadata** section, add or modify the JSON to include the admin role:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save changes

## Database Migrations

For the admin functionality to work correctly, you need to apply the database migrations that:

1. Add the `tracking_number` column to the orders table
2. Set up the correct RLS (Row Level Security) policies for admin access

Run the migrations using the Supabase CLI:

```bash
npx supabase migration up
```

Or apply the migration SQL file manually via the Supabase SQL Editor:
- Copy the contents of `supabase/migrations/20240510000000_add_admin_and_tracking.sql`
- Paste and run in the SQL Editor

## Accessing the Admin Dashboard

Once a user has been granted admin privileges:

1. Log in to Smart Cart with the admin account
2. Navigate to `/admin` in your browser
3. You should now have access to the admin dashboard

## Features

### Order Management

- **View Orders**: See all orders with filtering by status
- **Order Details**: Click on any order to view complete details
- **Update Orders**:
  - Change order status (Order Received, Processing, Shipped, Delivered, etc.)
  - Add tracking numbers for shipping
  - All changes are logged with timestamps

### Status Workflow

Smart Cart supports the following order statuses:

- **Order Received**: Initial status when an order is placed
- **Processing**: Order is being prepared for shipping
- **Shipped**: Order has been dispatched
- **Delivered**: Order has reached the customer
- **Cancelled**: Order was cancelled
- **Refunded**: Payment was returned to customer

## Security Notes

- Admin access gives users elevated privileges in the database
- Only trusted team members should be granted admin roles
- The admin dashboard should only be accessed from secure devices
- All admin actions are logged for accountability

## Troubleshooting

- If you cannot access the admin dashboard after setting the role, try signing out and back in
- If RLS policies aren't working correctly, verify the migrations were applied properly
- Check browser console and server logs for detailed error messages 