"use client";

import React, { ReactNode, useState, useEffect } from "react";

import {
  createCustomPgLite,
  CustomPGlite,
  CustomPGliteProvider,
  genTableListeners,
} from "./CustomPGLiteProvider";
import { MigrationsJsonSchema } from "@/db/schemas";

const getMigrations = async (): Promise<string[]> => {
  // First, fetch the list of migrations
  const response = await fetch("/migrations/files.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const validatedData = MigrationsJsonSchema.parse(data);
  const files = validatedData.files;

  // Then, fetch each migration
  const returnFiles = [];
  for (const file of files) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.text();
    returnFiles.push(data);
  }
  return returnFiles;
};

// Props for the DbProvider component
interface DbProviderProps {
  children: ReactNode;
}

export const DbProvider: React.FC<DbProviderProps> = ({ children }) => {
  const [client, setClient] = useState<CustomPGlite | undefined>(undefined);
  const [unsubscribes, setUnsubscribes] = useState<(() => Promise<void>)[]>([]);

  useEffect(() => {
    createCustomPgLite().then(async (client) => {
      // Get the migrations, and apply them to the database
      const migrations = await getMigrations();
      for (const migration of migrations) {
        client.exec(migration);
      }
      setClient(client);

      // Listen and react to table changes
      const newUnsubs = await genTableListeners(client);

      // Grab handle to unsubscribe from each listener later
      setUnsubscribes((prev) => [...prev, ...newUnsubs]);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  if (!client) return <></>;
  return <CustomPGliteProvider db={client}>{children}</CustomPGliteProvider>;
};
