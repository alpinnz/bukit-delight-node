import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

export const prisma = databaseUrl
  ? new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    })
  : null;
