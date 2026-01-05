// @deno-types="npm:@types/node"
// @ts-ignore - Deno npm: specifier
import { Hono } from "npm:hono";
// @ts-ignore - Deno npm: specifier
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Create Supabase client with service role key for admin operations
const getSupabaseAdmin = () => {
  // @ts-ignore - Deno global
  return createClient(
    // @ts-ignore - Deno global
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore - Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

/**
 * POST /make-server-3e5c72fb/register/client
 * Register a new client user
 */
app.post('/register/client', async (c) => {
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
app.post('/register/owner', async (c) => {
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
 * POST /make-server-3e5c72fb/check-verified-and-confirm-email
 * Check is_verified status and confirm email if user is verified
 */
app.post('/check-verified-and-confirm-email', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json(
        { 
          success: false, 
          error: 'Email is required' 
        },
        400
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Find user by email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return c.json(
        { 
          success: false, 
          error: `Failed to find user: ${listError.message}` 
        },
        400
      );
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return c.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        404
      );
    }

    console.log(`🔍 Checking verification for user: ${email} (ID: ${user.id})`);
    
    // Check is_verified in customer.customers table
    // Try both by ID and by email to ensure we find the record
    try {
      // First try by ID (preferred method)
      let customerData: { is_verified: boolean; id: string; email: string } | null = null;
      let customerError = null;
      
      const { data: dataById, error: errorById } = await supabaseAdmin
        .schema('customer')
        .from('customers')
        .select('is_verified, id, email')
        .eq('id', user.id)
        .maybeSingle();

      console.log('📊 Database query by ID result:', { dataById, errorById });

      if (errorById || !dataById) {
        // If not found by ID, try by email
        console.log('🔄 User not found by ID, trying by email...');
        const { data: dataByEmail, error: errorByEmail } = await supabaseAdmin
          .schema('customer')
          .from('customers')
          .select('is_verified, id, email')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        console.log('📊 Database query by email result:', { dataByEmail, errorByEmail });
        
        if (dataByEmail) {
          customerData = dataByEmail;
          customerError = null;
        } else {
          customerData = null;
          customerError = errorByEmail || errorById;
        }
      } else {
        customerData = dataById;
        customerError = null;
      }

      console.log('📊 Final customer data:', { customerData, customerError });

      if (customerError) {
        console.error('❌ Error checking customer data from DB:', customerError);
        console.log('🔄 Falling back to KV store...');
        
        // If table doesn't exist or error, check KV store as fallback
        const customerFromKV = await kv.get(`customer:${user.id}`);
        console.log('📦 KV store data:', customerFromKV);
        
        if (customerFromKV && customerFromKV.is_verified === true) {
          console.log('✅ User is verified in KV store');
          // User is verified in KV store
          if (!user.email_confirmed_at) {
            // Confirm email in Auth
            const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              user.id,
              {
                email_confirm: true
              }
            );

            if (updateError) {
              console.error('Error confirming email:', updateError);
              return c.json(
                { 
                  success: false, 
                  error: `Failed to confirm email: ${updateError.message}` 
                },
                400
              );
            }

            console.log(`✅ Email confirmed for verified user (from KV): ${email}`);
            return c.json({
              success: true,
              message: 'User is verified, email confirmed',
              user_id: user.id,
              should_confirm_email: false
            });
          } else {
            return c.json({
              success: true,
              message: 'User is verified and email already confirmed',
              user_id: user.id,
              should_confirm_email: false
            });
          }
        } else {
          console.log('❌ User not found in KV store or is_verified is false');
        }
      } else if (customerData) {
        console.log('📊 Found customer data in DB:', customerData);
        
        if (customerData.is_verified === true) {
          console.log('✅ User is verified in database');
          
          // User is verified in database
          if (!user.email_confirmed_at) {
            console.log('📧 Confirming email in Auth...');
            
            // Confirm email in Auth
            const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              user.id,
              {
                email_confirm: true
              }
            );

            if (updateError) {
              console.error('❌ Error confirming email:', updateError);
              return c.json(
                { 
                  success: false, 
                  error: `Failed to confirm email: ${updateError.message}` 
                },
                400
              );
            }

            console.log(`✅ Email confirmed for verified user: ${email}`);
          } else {
            console.log('✅ Email already confirmed in Auth');
          }

          return c.json({
            success: true,
            message: 'User is verified',
            user_id: user.id,
            email_confirmed: !!user.email_confirmed_at,
            should_confirm_email: false
          });
        } else {
          console.log('❌ User is_verified is false in database');
        }
      } else {
        console.log('❌ No customer data found in database');
      }
    } catch (dbError) {
      console.error('❌ Error checking verification status:', dbError);
    }

    // User is not verified
    console.log('❌ User is not verified, requiring email confirmation');
    return c.json({
      success: false,
      error: 'Email not confirmed. Please check your email and confirm your account.',
      should_confirm_email: true
    }, 403);

  } catch (error) {
    console.error('❌ Error in check-verified-and-confirm-email endpoint:', error);
    return c.json(
      { 
        success: false, 
        error: 'Server error during verification check',
        details: error instanceof Error ? error.message : String(error)
      },
      500
    );
  }
});

/**
 * GET /make-server-3e5c72fb/test-db-connection
 * Test KV Store connection
 */
app.get('/test-db-connection', async (c) => {
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