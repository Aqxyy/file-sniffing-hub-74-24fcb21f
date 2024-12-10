import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

export const validateUser = async (authHeader: string | null) => {
  console.log("Starting user validation");
  
  if (!authHeader) {
    console.error("No authorization header provided");
    throw new Error('No authorization header');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables");
    throw new Error('Server configuration error');
  }

  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  const token = authHeader.replace('Bearer ', '');
  
  console.log("Validating user token");
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

  if (userError || !user) {
    console.error("Auth error:", userError);
    throw new Error('Unauthorized');
  }

  console.log("User validated successfully:", user.id);
  return { user, supabaseClient };
};

export const checkAccess = async (supabaseClient: any, user: any) => {
  console.log("Checking access for user:", user.id);
  
  const isAdmin = user.email === "williamguerif@gmail.com";
  console.log("Is admin:", isAdmin);

  if (!isAdmin) {
    console.log("Checking subscription for non-admin user");
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subError) {
      console.error("Subscription fetch error:", subError);
      throw new Error('Error fetching subscription');
    }

    if (!subscription || !['pro', 'lifetime'].includes(subscription.plan_type)) {
      console.error("No valid subscription found");
      throw new Error('No valid subscription found');
    }

    if (!subscription.api_access) {
      console.error("API access not enabled for user");
      throw new Error('API access not enabled');
    }
  }

  console.log("Checking site settings");
  const { data: siteSettings, error: settingsError } = await supabaseClient
    .from('site_settings')
    .select('api_enabled')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error("Error fetching site settings:", settingsError);
    throw new Error('Error fetching site settings');
  }

  if (!siteSettings?.api_enabled && !isAdmin) {
    console.error("API access is currently disabled");
    throw new Error('API access is currently disabled');
  }

  console.log("Access check completed successfully");
  return isAdmin;
};