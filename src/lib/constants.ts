import { type Category } from "@/lib/types";

export const categories = [
  "Coats",
  "Blazers",
  "Sherwanis",
  "Indo-Western",
  "Kurta Pajama",
  "Modi Jackets"
] as const satisfies readonly Category[];

export const orderStatuses = ["Pending", "Shipped", "Delivered"] as const;

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" }
];
