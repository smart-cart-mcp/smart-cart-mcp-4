// This script sets an admin role for a user in Supabase
// Usage: node scripts/set-admin-role.js user@example.com

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase client with service role for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setAdminRole(email) {
  try {
    // Find user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw userError;
    }
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    
    // Update user metadata to add admin role
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { app_metadata: { role: 'admin' } }
    );
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully set admin role for ${email}`);
    console.log(`User metadata updated:`, data);
    
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/set-admin-role.js user@example.com');
  process.exit(1);
}

// Call the function with the provided email
setAdminRole(email); 