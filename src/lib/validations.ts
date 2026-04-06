import { z } from "zod";

import { categories, orderStatuses } from "@/lib/constants";

export const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  category: z.enum(categories),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  image_url: z.string().min(1),
  featured: z.boolean().default(false)
});

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    address: z.string().min(10),
    phone: z.string().min(10),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4)
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
        image_url: z.string(),
        stock: z.number().int().nonnegative()
      })
    )
    .min(1),
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay")
});

export const statusSchema = z.object({
  status: z.enum(orderStatuses)
});
