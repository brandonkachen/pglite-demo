import { useEffect, useMemo, useState } from "react";
import { Results } from "@electric-sql/pglite";
import { Query } from "drizzle-orm";

import { useCustomPGlite } from "../../CustomPGLiteProvider";
import * as models from "../../models";
import schemas from "@/db/schemas";

type models = typeof models;
type SelectSchema = typeof schemas.select;

function useLiveQueryImpl<T = { [key: string]: unknown }>(
  query: string,
  params: unknown[],
  key?: string
): Omit<Results<T>, "affectedRows"> | undefined {
  const client = useCustomPGlite();
  const [results, setResults] = useState<Results<T>>();

  useEffect(() => {
    console.log(query, params);

    let cancelled = false;
    const cb = (results: Results<T>) => {
      if (cancelled) return;
      setResults(results);
    };
    const ret = !!key
      ? client.live.incrementalQuery<T>(query, params, key, cb)
      : client.live.query<T>(query, params, cb);

    return () => {
      cancelled = true;
      ret.then(({ unsubscribe }) => unsubscribe());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, key, query]);

  return (
    results && {
      rows: results.rows,
      fields: results.fields,
    }
  );
}

export function useQuery<
  T extends keyof models,
  U extends SelectSchema[T]["_type"]
>(
  query: { toSQL: () => Query } & Record<any, any>,
  key?: string // pass in if we want to use `incremental` query
): Results<U> | undefined {
  const sqlQuery = useMemo(() => query.toSQL(), [query]);
  return useLiveQueryImpl<U>(sqlQuery.sql, sqlQuery.params, key);
}
