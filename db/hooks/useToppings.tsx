"use client";

import * as models from "../models";
import { NewTopping, Topping } from "../types";
import { useDb } from "./base/useDb";
import { useTable } from "./base/useTable";

const { toppings } = models;
type NewToppingRow = typeof toppings.$inferInsert;

export const useToppings = (): {
  addTopping: (newTopping: NewTopping) => Promise<Topping>;
  toppings: Topping[];
} => {
  const { db } = useDb();
  const { add, items } = useTable({
    query: db.select().from(toppings),
  });

  const addTopping = (newTopping: NewTopping) => {
    const newToppingRow: NewToppingRow = {
      ...newTopping,
      price: newTopping.price.toString(),
    };
    return add(newToppingRow);
  };

  return { addTopping, toppings: items };
};
