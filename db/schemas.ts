import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import * as models from "./models";

export const MigrationsJsonSchema = z.object({
  files: z.array(z.string()),
});

// Customers Model Validation Schema
const customerValidationSchema = {
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
};
const customerInsertSchema = createInsertSchema(
  models.customers,
  customerValidationSchema
);
const customerSelectSchema = createSelectSchema(
  models.customers,
  customerValidationSchema
);
const customersSchema = z.array(customerSelectSchema);

// Pizzas Model Validation Schema
const pizzaValidationSchema = {
  name: z.string().min(1),
  description: z.string(),
  price: z.coerce.number().positive(),
};
const pizzaInsertSchema = createInsertSchema(
  models.pizzas,
  pizzaValidationSchema
);
const pizzaSelectSchema = createSelectSchema(
  models.pizzas,
  pizzaValidationSchema
);
const pizzasSchema = z.array(pizzaSelectSchema);

// Orders Model Validation Schema
const orderValidationSchema = {
  customer_id: z.number().int().positive(),
  pizza_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  total_price: z.number().positive(),
};
const orderInsertSchema = createInsertSchema(
  models.orders,
  orderValidationSchema
);
const orderSelectSchema = createSelectSchema(
  models.orders,
  orderValidationSchema
);
const ordersSchema = z.array(orderSelectSchema);

// Toppings Model Validation Schema
const toppingValidationSchema = {
  name: z.string().min(1),
  vegetarian: z.boolean(),
  price: z.coerce.number().positive(),
};
const toppingInsertSchema = createInsertSchema(
  models.toppings,
  toppingValidationSchema
);
const toppingSelectSchema = createSelectSchema(
  models.toppings,
  toppingValidationSchema
);
const toppingsSchema = z.array(toppingSelectSchema);

// Pizza Toppings Model Validation Schema
const pizzaToppingInsertSchema = createInsertSchema(models.pizzaToppings);
const pizzaToppingSelectSchema = createSelectSchema(models.pizzaToppings);
const pizzaToppingsSchema = z.array(pizzaToppingSelectSchema);

const schemas = {
  select: {
    customers: customerSelectSchema,
    pizzas: pizzaSelectSchema,
    orders: orderSelectSchema,
    toppings: toppingSelectSchema,
    pizzaToppings: pizzaToppingSelectSchema,
  },
  insert: {
    customers: customerInsertSchema,
    pizzas: pizzaInsertSchema,
    orders: orderInsertSchema,
    toppings: toppingInsertSchema,
    pizzaToppings: pizzaToppingInsertSchema,
  },
};
type schemas = typeof schemas;

export default schemas;
