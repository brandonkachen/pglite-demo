"use client";

import { PGlite, PGliteInterfaceExtensions } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { makePGliteProvider } from "@electric-sql/pglite-react";
import * as models from "./models";
import { drizzle } from "drizzle-orm/pglite";
import { Change } from "./types";
import {
  handleCustomersRowChange,
  handlePizzasRowChange,
  handlePizzaToppingsRowChange,
} from "./handlers";

type models = typeof models;

export type CustomPGlite = PGlite &
  PGliteInterfaceExtensions<{
    live: typeof live;
  }>;

const { PGliteProvider: CustomPGliteProvider, usePGlite: useCustomPGlite } =
  makePGliteProvider<
    PGlite &
      PGliteInterfaceExtensions<{
        live: typeof live;
      }>
  >();

const createCustomPgLite = () =>
  PGlite.create({
    // dataDir: "idb://localdb",
    extensions: { live },
  });

type UnsubFunc = () => Promise<void>;

const genTableListeners = async (
  client: CustomPGlite
): Promise<UnsubFunc[]> => {
  const db = drizzle(client, { schema: models });

  // Thin wrapper around `client.live.changes` that handles drizzle-orm types
  function genTableListener<
    T extends models[keyof models],
    U extends keyof T["_"]["columns"]
  >(table: T, key: U, cb: (res: Change<T>) => void) {
    const query = db.select().from(table).toSQL();
    return client.live.changes(
      query.sql,
      query.params,
      key.toString(),
      (changes) => changes.forEach((change) => cb(change as Change<T>))
    );
  }

  const listeners = [
    // Pizzas table
    genTableListener(models.pizzas, "id", handlePizzasRowChange),

    // Customers table
    genTableListener(models.customers, "id", handleCustomersRowChange),

    // PizzaToppings table
    genTableListener(
      models.pizzaToppings,
      "pizza_id",
      handlePizzaToppingsRowChange
    ),
  ];

  // Return a list of unsubscribe functions
  const listened = await Promise.all(listeners);
  return listened.map(({ unsubscribe }) => unsubscribe);
};

export {
  CustomPGliteProvider,
  useCustomPGlite,
  createCustomPgLite,
  genTableListeners,
};
