"use client";

import * as models from "../models";
import { Customer } from "../types";
import { useDb } from "./base/useDb";
import { useTable } from "./base/useTable";

const { customers } = models;
type NewCustomer = typeof customers.$inferInsert;

export const useCustomers = (): {
  addCustomer: (newCustomer: NewCustomer) => Promise<Customer>;
  customers: Customer[];
} => {
  const { db } = useDb();
  const { add, items } = useTable({
    query: db.select().from(customers),
  });

  const addCustomer = add;

  return { addCustomer, customers: items };
};
