# Shahi Vastram

Shahi Vastram is a full-stack ecommerce web application for a premium clothing store built with Next.js App Router, Tailwind CSS, shadcn-style UI components, Supabase, and a simple JWT cookie-based admin login.

## Features

- Landing page with hero, featured products, and category sections
- Product listing page with URL-driven category filtering
- Product detail page with image, pricing, description, and add-to-cart
- Cart system with quantity updates, removal, and subtotal calculation
- Checkout form with Razorpay test-mode support or cash on delivery fallback
- Order confirmation flow and Supabase order persistence
- Protected admin login using signed JWT cookies
- Admin dashboard with stats, product CRUD, image upload, and order status management
- Sample data and fallback local product data when Supabase is not configured

## Tech Stack

- Next.js App Router + React 19
- Tailwind CSS
- shadcn-style component architecture
- Supabase database + storage
- Next.js Route Handlers for APIs
- Razorpay test-mode integration
- react-hook-form + zod validation

## Project Structure

- `src/app` - App Router pages and API routes
- `src/components` - UI, storefront, admin, and provider components
- `src/lib` - services, auth, env, formatters, validation, and sample data
- `supabase/schema.sql` - database schema and seed inserts
- `public/images/products` - placeholder product artwork

## Setup

1. Install dependencies:
   `npm install`
2. Copy env file:
   `cp .env.example .env.local`
3. Create a Supabase project and run [`supabase/schema.sql`](/d:/VS%20Code%20Projects/ShahiVastram/supabase/schema.sql).
4. Create a public storage bucket named `product-images` in Supabase.
5. Add your Razorpay test keys if you want payment checkout enabled.
6. Run the app:
   `npm run dev`

## Admin Login

Use the values from `.env.local`:

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

## Notes

- If Supabase is missing, storefront pages still render using local sample data.
- Orders require Supabase service role credentials for persistence.
- Uploaded admin product images are sent to the `product-images` bucket.
