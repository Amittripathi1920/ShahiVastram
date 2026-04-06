if (typeof window !== "undefined") {
  throw new Error("❌ serverEnv used on client");
}

export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? ""
};