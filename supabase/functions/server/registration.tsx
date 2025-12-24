import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Create Supabase client with service role key for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

/**
 * POST /make-server-3e5c72fb/register/client
 * Register a new client user
 */
app.post('/make-server-3e5c72fb/register/client', async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, phone, password } = body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return c.json(
        { 
          success: false, 
          error: 'Missing required fields: full_name, email, password are required' 
        },
        400
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
        full_name,
        phone,
        customer_type: 'Client'
      }
    });

    if (authError) {
      console.error('Error creating auth user for client:', authError);
      return c.json(
        { 
          success: false, 
          error: `Failed to create auth user: ${authError.message}` 
        },
        400
      );
    }

    // Step 2: Create customer record using KV Store
    const customerData = {
      id: authData.user.id,
      full_name: full_name,
      email: email,
      phone: phone || null,
      customer_type: 'Client',
      created_at: new Date().toISOString()
    };

    try {
      await kv.set(`customer:${authData.user.id}`, customerData);
      console.log('Client registered successfully:', customerData);
    } catch (kvError) {
      console.error('Error creating customer record for client:', kvError);
      
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return c.json(
        { 
          success: false, 
          error: `Failed to create customer record: ${kvError.message}` 
        },
        500
      );
    }

    return c.json({
      success: true,
      data: {
        user_id: customerData.id,
        email: customerData.email,
        full_name: customerData.full_name,
        customer_type: customerData.customer_type
      }
    });

  } catch (error) {
    console.error('Error in client registration endpoint:', error);
    return c.json(
      { 
        success: false, 
        error: `Server error during client registration: ${error.message}` 
      },
      500
    );
  }
});

/**
 * POST /make-server-3e5c72fb/register/owner
 * Register a new salon owner
 */
app.post('/make-server-3e5c72fb/register/owner', async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, phone, password, salon_name } = body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return c.json(
        { 
          success: false, 
          error: 'Missing required fields: full_name, email, password are required' 
        },
        400
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
        full_name,
        phone,
        customer_type: 'Owner',
        salon_name: salon_name || null
      }
    });

    if (authError) {
      console.error('Error creating auth user for owner:', authError);
      return c.json(
        { 
          success: false, 
          error: `Failed to create auth user: ${authError.message}` 
        },
        400
      );
    }

    // Step 2: Create customer record using KV Store
    const customerData = {
      id: authData.user.id,
      full_name: full_name,
      email: email,
      phone: phone || null,
      customer_type: 'Owner',
      salon_name: salon_name || null,
      created_at: new Date().toISOString()
    };

    try {
      await kv.set(`customer:${authData.user.id}`, customerData);
      console.log('Owner registered successfully:', customerData);
    } catch (kvError) {
      console.error('Error creating customer record for owner:', kvError);
      
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return c.json(
        { 
          success: false, 
          error: `Failed to create customer record: ${kvError.message}` 
        },
        500
      );
    }

    return c.json({
      success: true,
      data: {
        user_id: customerData.id,
        email: customerData.email,
        full_name: customerData.full_name,
        customer_type: customerData.customer_type,
        salon_name: salon_name || null
      }
    });

  } catch (error) {
    console.error('Error in owner registration endpoint:', error);
    return c.json(
      { 
        success: false, 
        error: `Server error during owner registration: ${error.message}` 
      },
      500
    );
  }
});

/**
 * GET /make-server-3e5c72fb/test-db-connection
 * Test KV Store connection
 */
app.get('/make-server-3e5c72fb/test-db-connection', async (c) => {
  try {
    // Test KV Store by trying to read/write a test value
    const testKey = 'test:connection';
    const testValue = { 
      timestamp: new Date().toISOString(),
      message: 'KV Store connection test'
    };
    
    // Try to set a value
    await kv.set(testKey, testValue);
    
    // Try to get it back
    const retrieved = await kv.get(testKey);
    
    if (!retrieved) {
      return c.json({
        success: false,
        error: 'Could not retrieve test value from KV Store'
      });
    }
    
    // Clean up test data
    await kv.del(testKey);
    
    return c.json({
      success: true,
      message: 'KV Store connection successful!',
      storage: 'kv_store_3e5c72fb',
      test_result: 'Read/Write operations working'
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

export default app;