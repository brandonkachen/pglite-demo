import { useMemo } from "react";
import { drizzle } from "drizzle-orm/pglite";

import { useCustomPGlite } from "../../CustomPGLiteProvider";
import * as models from "../../models";

export const useDb = () => {
  const client = useCustomPGlite();
  const db = useMemo(() => drizzle(client, { schema: models }), [client]);

  return { db, client };
};
