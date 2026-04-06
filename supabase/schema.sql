create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  slug text unique not null,
  category text not null check (category in ('Coats', 'Blazers', 'Sherwanis', 'Indo-Western', 'Kurta Pajama', 'Modi Jackets')),
  description text not null,
  price numeric(10, 2) not null,
  stock integer not null default 0,
  featured boolean not null default false,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  address text not null,
  phone text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Shipped', 'Delivered')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  payment_provider text not null check (payment_provider in ('razorpay', 'cod')),
  payment_reference text,
  total_amount numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order_id on order_items(order_id);

alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy if not exists "Public can view products"
  on products for select
  using (true);

create policy if not exists "Service role manages profiles"
  on profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy if not exists "Service role manages products"
  on products for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy if not exists "Service role manages orders"
  on orders for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy if not exists "Service role manages order items"
  on order_items for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into profiles (email, full_name, role, password_hash)
values
  ('admin@shahivastram.com', 'Store Owner', 'admin', 'b7bc1548a00c8892a0ced4c26e6d07b1395452b4dbaab45f854e913d3f201c77')
on conflict (email) do update set role = excluded.role;

insert into products (id, name, slug, category, description, price, stock, featured, image_url)
values
  ('coat-regal-01', 'Regal Winter Coat', 'regal-winter-coat', 'Coats', 'Structured wool-blend coat with a tailored silhouette for elevated winter occasionwear.', 6999, 8, true, 'https://images.unsplash.com/photo-1593032465171-8f0b9c4a7c3c?auto=format&fit=crop&w=800&q=80'),
  ('blazer-midnight-01', 'Midnight Velvet Blazer', 'midnight-velvet-blazer', 'Blazers', 'Textured evening blazer designed for receptions, festive dinners, and modern celebrations.', 8499, 10, true, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80'),
  ('sherwani-royal-01', 'Royal Ivory Sherwani', 'royal-ivory-sherwani', 'Sherwanis', 'Handsome sherwani with tonal embroidery and a rich ceremonial finish.', 18999, 4, true, 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'),
  ('indo-western-ember-01', 'Ember Indo-Western Set', 'ember-indo-western-set', 'Indo-Western', 'A fashion-forward layered silhouette with clean tailoring and festive detailing.', 12999, 6, true, 'https://images.unsplash.com/photo-1621786030484-4c855eed6974?auto=format&fit=crop&w=800&q=80'),
  ('kurta-jade-01', 'Jade Kurta Pajama', 'jade-kurta-pajama', 'Kurta Pajama', 'Lightweight kurta pajama set designed for celebrations, pujas, and effortless style.', 3999, 20, false, 'https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=800&q=80'),
  ('modi-jacket-sand-01', 'Sandstone Modi Jacket', 'sandstone-modi-jacket', 'Modi Jackets', 'Versatile Nehru-style jacket with a polished finish for day-to-night festive dressing.', 4999, 15, false, 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80')
on conflict (id) do nothing;


INSERT INTO "public"."products"
("id", "name", "slug", "category", "description", "price", "stock", "featured", "image_url", "created_at")
VALUES

-- ================= COATS =================
('coat-black-01', 'Black Blazer', 'black-blazer', 'Coats', 'Elegant black blazer designed for formal and evening wear.', '5999.00', 12, true, 'https://images.unsplash.com/photo-1675877879221-871aa9f7c314?q=80&w=764&auto=format&fit=crop', now()),
('coat-navy-01', 'Navy Blazer', 'navy-blazer', 'Coats', 'Classic navy blazer suitable for formal and semi-formal occasions.', '6499.00', 10, false, 'https://images.unsplash.com/photo-1637589274742-8d4c152720a2?q=80&w=1331&auto=format&fit=crop', now()),
('coat-grey-01', 'Grey Blazer', 'grey-blazer', 'Coats', 'Modern grey blazer with a sleek and tailored finish.', '5799.00', 14, false, 'https://plus.unsplash.com/premium_photo-1674507924618-47df259094eb?q=80&w=687&auto=format&fit=crop', now()),
('coat-velvet-01', 'Velvet Blazer', 'velvet-blazer', 'Coats', 'Luxurious velvet blazer crafted for festive and wedding events.', '7999.00', 6, true, 'https://images.unsplash.com/photo-1720876479040-187c9286ab36?q=80&w=687&auto=format&fit=crop', now()),
('coat-white-01', 'White Blazer', 'white-blazer', 'Coats', 'Stylish white blazer perfect for summer weddings and parties.', '6899.00', 8, true, 'https://images.unsplash.com/photo-1720876479071-7ae8a3694545?q=80&w=687&auto=format&fit=crop', now()),

-- ================= SHERWANIS =================
('sherwani-gold-02', 'Golden Sherwani', 'golden-sherwani', 'Sherwanis', 'Premium golden sherwani with intricate detailing for weddings.', '15999.00', 5, true, 'https://images.unsplash.com/photo-1610047402714-307d99a677db?q=80&w=687&auto=format&fit=crop', now()),
('sherwani-white-02', 'White Sherwani', 'white-sherwani', 'Sherwanis', 'Classic white sherwani offering a royal and elegant look.', '14999.00', 7, false, 'https://images.unsplash.com/photo-1681717055630-c62333c22fec?q=80&w=687&auto=format&fit=crop', now()),
('sherwani-maroon-02', 'Maroon Sherwani', 'maroon-sherwani', 'Sherwanis', 'Rich maroon sherwani perfect for traditional ceremonies.', '16999.00', 4, true, 'https://images.unsplash.com/photo-1534217466718-ef4950786e24?q=80&w=687&auto=format&fit=crop', now()),
('sherwani-blue-02', 'Blue Sherwani', 'blue-sherwani', 'Sherwanis', 'Royal blue sherwani designed for premium wedding occasions.', '17499.00', 3, true, 'https://plus.unsplash.com/premium_photo-1682090781379-4d177df45267?q=80&w=688&auto=format&fit=crop', now()),
('sherwani-beige-02', 'Beige Sherwani', 'beige-sherwani', 'Sherwanis', 'Elegant beige sherwani with subtle embroidery.', '13999.00', 6, false, 'https://images.unsplash.com/photo-1760080839107-6798cee22d95?q=80&w=687&auto=format&fit=crop', now()),

-- ================= INDO WESTERN =================
('indo-western-01', 'Indo Western 1', 'indo-western-1', 'Indo-Western', 'Fusion outfit combining traditional and modern styles.', '11999.00', 9, true, 'https://images.unsplash.com/photo-1695461569773-e7c75f38ac3b?q=80&w=687&auto=format&fit=crop', now()),
('indo-western-02', 'Indo Western 2', 'indo-western-2', 'Indo-Western', 'Stylish indo-western attire for festive celebrations.', '10999.00', 11, false, 'https://images.unsplash.com/photo-1654758790539-766103dd71d5?q=80&w=764&auto=format&fit=crop', now()),
('indo-western-03', 'Indo Western 3', 'indo-western-3', 'Indo-Western', 'Premium indo-western outfit with designer finish.', '12999.00', 7, true, 'https://plus.unsplash.com/premium_photo-1682090768709-b00ac36f72de?q=80&w=688&auto=format&fit=crop', now()),
('indo-western-04', 'Indo Western 4', 'indo-western-4', 'Indo-Western', 'Contemporary indo-western style for modern occasions.', '11499.00', 8, false, 'https://images.unsplash.com/photo-1630694892664-99ec5225361a?q=80&w=687&auto=format&fit=crop', now()),
('indo-western-05', 'Indo Western 5', 'indo-western-5', 'Indo-Western', 'Elegant fusion wear with clean tailoring.', '12499.00', 5, true, 'https://images.unsplash.com/photo-1628157509079-9f8eb45557e7?q=80&w=687&auto=format&fit=crop', now()),

-- ================= KURTA PAJAMA =================
('kurta-white-02', 'White Kurta', 'white-kurta', 'Kurta Pajama', 'Simple and elegant white kurta for everyday wear.', '2499.00', 20, false, 'https://plus.unsplash.com/premium_photo-1691030256404-101d1aadd42c?q=80&w=687&auto=format&fit=crop', now()),
('kurta-black-02', 'Black Kurta', 'black-kurta', 'Kurta Pajama', 'Classic black kurta suitable for all occasions.', '2799.00', 18, false, 'https://plus.unsplash.com/premium_photo-1691030254364-544fc2ec0af0?q=80&w=687&auto=format&fit=crop', now()),
('kurta-silk-02', 'Silk Kurta', 'silk-kurta', 'Kurta Pajama', 'Premium silk kurta with a luxurious finish.', '3499.00', 12, true, 'https://images.unsplash.com/photo-1774267230654-ad5335ecd6f0?q=80&w=704&auto=format&fit=crop', now()),
('kurta-festive-02', 'Festive Kurta', 'festive-kurta', 'Kurta Pajama', 'Festive kurta designed for celebrations and events.', '3199.00', 15, true, 'https://images.unsplash.com/photo-1774527929835-282b1b85cd3a?q=80&w=687&auto=format&fit=crop', now()),
('kurta-designer-02', 'Designer Kurta', 'designer-kurta', 'Kurta Pajama', 'Trendy designer kurta for modern ethnic wear.', '3699.00', 10, true, 'https://images.unsplash.com/photo-1716538249194-8c8ede48db1b?q=80&w=687&auto=format&fit=crop', now()),

-- ================= MODI JACKETS =================
('modi-black-02', 'Black Nehru Jacket', 'black-nehru-jacket', 'Modi Jackets', 'Classic black Nehru jacket for versatile styling.', '4599.00', 10, false, 'https://mayankmodi.com/cdn/shop/files/MMWC0244_1_360x.jpg?v=1761818960', now()),
('modi-printed-02', 'Printed Nehru Jacket', 'printed-nehru-jacket', 'Modi Jackets', 'Stylish printed Nehru jacket for festive occasions.', '4999.00', 8, true, 'https://mayankmodi.com/cdn/shop/files/MMWC0238_1_360x.jpg?v=1748328963', now()),
('modi-silk-02', 'Silk Jacket', 'silk-jacket', 'Modi Jackets', 'Premium silk Modi jacket with elegant texture.', '5299.00', 6, true, 'https://mayankmodi.com/cdn/shop/files/MMWC0236_1_360x.jpg?v=1748328748', now()),
('modi-casual-02', 'Casual Jacket', 'casual-jacket', 'Modi Jackets', 'Casual Nehru jacket for everyday ethnic wear.', '3999.00', 14, false, 'https://mayankmodi.com/cdn/shop/files/MMWC0233_4_360x.jpg?v=1727339951', now()),
('modi-classic-02', 'Classic Jacket', 'classic-jacket', 'Modi Jackets', 'Timeless Modi jacket with a refined look.', '4799.00', 9, true, 'https://mayankmodi.com/cdn/shop/files/MMWC0228_1_360x.jpg?v=1687759195', now());