import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const pizzas = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  pizza_id: integer("pizza_id")
    .notNull()
    .references(() => pizzas.id),
  quantity: integer("quantity").notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const toppings = pgTable("toppings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  vegetarian: boolean("vegetarian").notNull().default(false),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const pizzaToppings = pgTable(
  "pizza_toppings",
  {
    pizza_id: integer("pizza_id")
      .notNull()
      .references(() => pizzas.id),
    topping_id: integer("topping_id")
      .notNull()
      .references(() => toppings.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.pizza_id, t.topping_id] }),
  })
);
