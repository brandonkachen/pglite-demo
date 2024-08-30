import { Query } from "drizzle-orm";
import { useCallback } from "react";
import { PgColumn } from "drizzle-orm/pg-core";

import * as models from "../../models";
import { useQuery } from "./useQuery";
import { useDb } from "./useDb";
import schemas from "@/db/schemas";

type SelectSchema = typeof schemas.select;
type models = typeof models;

export const useTable = <T extends keyof models>({
  query,
  key,
}: {
  // Strangely, it seems like drizzle types `db.select()...` objects are subtly incorrectly
  // so we need to compensate by using a different subtype here.
  // But the `tableName` is _actually_ at the root layer and not in the private vars
  query: { _: { tableName: T }; toSQL: () => Query } & Record<any, any>;
  key?: PgColumn;
}) => {
  const { db } = useDb();
  const name: T = query.tableName;

  const table = models[name];
  type NewItem = (typeof models)[T]["$inferInsert"];
  type Item = SelectSchema[T]["_type"];

  const results = useQuery(query, key?.name);
  const items: Item[] = results?.rows ?? [];

  const add = useCallback(
    async (newItem: NewItem): Promise<Item> => {
      const result = await db.insert(table).values(newItem).returning();
      return schemas.select[name].parse(result[0]);
    },
    [db, name]
  );

  return { add, items };
};
