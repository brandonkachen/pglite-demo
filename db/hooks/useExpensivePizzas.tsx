"use client";

import { gt } from "drizzle-orm";

import * as models from "../models";
import { NewPizza, Pizza } from "../types";
import { useTable } from "./base/useTable";
import { useDb } from "./base/useDb";

const { pizzas } = models;
type NewPizzaRow = typeof pizzas.$inferInsert;

export const useExpensivePizzas = (): {
  addPizza: (newPizza: NewPizza) => Promise<Pizza>;
  pizzas: Pizza[];
} => {
  const { db } = useDb();
  const query = db.select().from(pizzas).where(gt(pizzas.price, "20"));
  const { add, items } = useTable({
    query,
  });

  const addPizza = (newPizza: NewPizza) => {
    const newPizzaRow: NewPizzaRow = {
      ...newPizza,
      price: newPizza.price.toString(),
    };
    return add(newPizzaRow);
  };

  return { addPizza, pizzas: items };
};
