# skills.md

## Technologies Used
- Next.js 15 App Router with React 19
- Tailwind CSS with shadcn-style reusable UI components
- Supabase for database and storage
- Route Handlers for backend APIs
- JWT cookie-based admin authentication
- Razorpay test-mode checkout integration
- react-hook-form and zod for forms and validation

## Key Features Implemented
- Responsive landing page with hero, featured products, and categories
- Product listing with URL-based category filters
- Product detail page with pricing, description, and add-to-cart
- Local cart state with quantity updates and subtotal calculation
- Checkout flow that creates orders and supports Razorpay or COD
- Admin login, dashboard stats, product CRUD, image upload, and order status updates
- Supabase SQL schema and sample product seed data

## Project Architecture
- `src/app` contains App Router pages and API route handlers
- `src/components/ui` contains the reusable shadcn-style primitives
- `src/components/store` contains storefront-specific client components
- `src/components/admin` contains admin interactions and forms
- `src/lib/services` contains data access logic for products and orders
- `src/lib/auth.ts` handles signed admin session cookies
- `supabase/schema.sql` defines the relational schema and base seed data

## APIs Used
- `GET /api/products` for storefront products
- `POST /api/products` for admin product creation
- `PUT /api/products/[id]` for admin product updates
- `DELETE /api/products/[id]` for admin product deletion
- `POST /api/orders` for COD or direct order creation
- `GET /api/orders` for admin order listing
- `PATCH /api/orders/[id]/status` for admin fulfillment updates
- `POST /api/auth/login` and `POST /api/auth/logout` for admin session control
- `POST /api/upload` for product image uploads to Supabase storage
- `POST /api/payment/razorpay/order` and `POST /api/payment/razorpay/verify` for payment flow

## Challenges and Solutions
- Needed a full-stack app from an empty repo, so the project was scaffolded with a modular structure first.
- Admin auth needed to stay simple, so a JWT cookie flow was used instead of full user auth.
- Supabase might not be configured during local development, so fallback product data was added for faster startup.
- Payment setup can block demos, so cash on delivery is available when Razorpay keys are missing.

## Future Improvements
- Add customer accounts and order history
- Add product search, sorting, and pagination
- Add image galleries and variant support by size or color
- Add webhook-driven payment confirmation and email notifications
- Add automated tests and stronger form error surfacing
