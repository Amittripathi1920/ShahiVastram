export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  adminJwtSecret: process.env.ADMIN_JWT_SECRET ?? "change-me-in-env",
};

export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  adminJwtSecret: process.env.ADMIN_JWT_SECRET,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET
};