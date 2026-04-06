export type Category =
  | "Coats"
  | "Blazers"
  | "Sherwanis"
  | "Indo-Western"
  | "Kurta Pajama"
  | "Modi Jackets";

export type OrderStatus = "Pending" | "Shipped" | "Delivered";
export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  password_hash?: string;
  created_at?: string;
}

export interface AppSession {
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  price: number;
  featured: boolean;
  stock: number;
  image_url: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  postal_code: string;
  status: OrderStatus;
  payment_status: "pending" | "paid";
  order_status: "pending" | "paid";
  payment_provider: "razorpay" | "cod";
  payment_reference?: string | null;
  total_amount: number;
  order_items: OrderItem[];
  created_at?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}
