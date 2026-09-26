import { readFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: "../../.env" });

type RecordValue = Record<string, any>;
type CollectionPlan = {
  file: string;
  delegate: string;
  map: (source: RecordValue) => RecordValue;
};

function normalizeExtendedJson(value: any): any {
  if (Array.isArray(value)) return value.map(normalizeExtendedJson);
  if (!value || typeof value !== "object") return value;
  if (typeof value.$oid === "string") return value.$oid;
  if ("$date" in value) {
    const timestamp = value.$date?.$numberLong ?? value.$date;
    return new Date(
      Number.isNaN(Number(timestamp)) ? timestamp : Number(timestamp),
    ).toISOString();
  }
  for (const numericKey of [
    "$numberInt",
    "$numberLong",
    "$numberDouble",
    "$numberDecimal",
  ]) {
    if (numericKey in value) return Number(value[numericKey]);
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      normalizeExtendedJson(entry),
    ]),
  );
}

function requiredString(value: any, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing string field ${field}`);
  }
  return value;
}

function normalizeRoleName(name: string): string {
  if (name.toLowerCase() === "kasir") return "cashier";
  if (name.toLowerCase() === "user") return "customer";
  return name;
}

function requiredNumber(value: any, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Missing numeric field ${field}`);
  }
  return value;
}

function optionalString(value: any): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function migrationId(source: RecordValue): string {
  return requiredString(source._id, "_id");
}

function migrationDate(value: any, field: string, fallback?: Date): Date {
  if (value === undefined || value === null) {
    if (fallback) return fallback;
    throw new Error(`Missing date field ${field}`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw new Error(`Invalid date field ${field}`);
  return date;
}

function timestamps(source: RecordValue): RecordValue {
  const now = new Date(0);
  return {
    createdAt: migrationDate(source.createdAt, "createdAt", now),
    updatedAt: migrationDate(source.updatedAt, "updatedAt", now),
  };
}

const collections: CollectionPlan[] = [
  {
    file: "roles.json",
    delegate: "role",
    map: (row) => ({
      id: migrationId(row),
      name: normalizeRoleName(requiredString(row.name, "name")),
      ...timestamps(row),
    }),
  },
  {
    file: "accounts.json",
    delegate: "account",
    map: (row) => ({
      id: migrationId(row),
      username: requiredString(row.username, "username"),
      email: requiredString(row.email, "email"),
      password: requiredString(row.password, "password"),
      activateLink: row.activateLink,
      resetLink: row.resetLink,
      roleId: optionalString(row.id_role),
      ...timestamps(row),
    }),
  },
  {
    file: "customers.json",
    delegate: "customer",
    map: (row) => ({
      id: migrationId(row),
      username: requiredString(row.username, "username"),
      ...timestamps(row),
    }),
  },
  {
    file: "refreshtokens.json",
    delegate: "refreshToken",
    map: (row) => ({
      id: migrationId(row),
      accountId: optionalString(row.id_account),
      customerId: optionalString(row.id_customer),
      token: optionalString(row.token),
      expires: row.expires ? migrationDate(row.expires, "expires") : undefined,
      created: migrationDate(row.created, "created", new Date(0)),
      createdByIp: optionalString(row.createdByIp),
      revoked: row.revoked ? migrationDate(row.revoked, "revoked") : undefined,
      revokedByIp: optionalString(row.revokedByIp),
      replacedByToken: optionalString(row.replacedByToken),
    }),
  },
  {
    file: "categories.json",
    delegate: "category",
    map: (row) => ({
      id: migrationId(row),
      name: requiredString(row.name, "name"),
      desc: requiredString(row.desc, "desc"),
      image: optionalString(row.image),
      ...timestamps(row),
    }),
  },
  {
    file: "menus.json",
    delegate: "menu",
    map: (row) => ({
      id: migrationId(row),
      name: requiredString(row.name, "name"),
      desc: optionalString(row.desc),
      image: requiredString(row.image, "image"),
      categoryId: requiredString(row.id_category, "id_category"),
      price: requiredNumber(row.price, "price"),
      promo: requiredNumber(row.promo, "promo"),
      duration: requiredNumber(row.duration, "duration"),
      isAvailable: Boolean(row.isAvailable),
      isFavorite: Boolean(row.isFavorite),
      ...timestamps(row),
    }),
  },
  {
    file: "tables.json",
    delegate: "diningTable",
    map: (row) => ({
      id: migrationId(row),
      name: requiredString(row.name, "name"),
      ...timestamps(row),
    }),
  },
  {
    file: "orders.json",
    delegate: "order",
    map: (row) => ({
      id: migrationId(row),
      customerId: optionalString(row.id_customer),
      tableId: optionalString(row.id_table),
      quality: requiredNumber(row.quality, "quality"),
      duration: requiredNumber(row.duration, "duration"),
      promo: requiredNumber(row.promo, "promo"),
      price: requiredNumber(row.price, "price"),
      totalPrice: requiredNumber(row.total_price, "total_price"),
      note: optionalString(row.note),
      status: requiredString(row.status, "status").toUpperCase(),
      estimasi: migrationDate(row.estimasi, "estimasi"),
      expires: migrationDate(row.expires, "expires"),
      ...timestamps(row),
    }),
  },
  {
    file: "itemorders.json",
    delegate: "orderItem",
    map: (row) => ({
      id: migrationId(row),
      orderId: requiredString(row.id_order, "id_order"),
      menuId: requiredString(row.id_menu, "id_menu"),
      quality: requiredNumber(row.quality, "quality"),
      duration: requiredNumber(row.duration, "duration"),
      promo: requiredNumber(row.promo, "promo"),
      price: requiredNumber(row.price, "price"),
      totalPrice: requiredNumber(row.total_price, "total_price"),
      note: optionalString(row.note),
      ...timestamps(row),
    }),
  },
  {
    file: "transactions.json",
    delegate: "transaction",
    map: (row) => ({
      id: migrationId(row),
      accountId: requiredString(row.id_account, "id_account"),
      orderId: requiredString(row.id_order, "id_order"),
      note: optionalString(row.note),
      status: requiredString(row.status, "status")
        .toUpperCase()
        .replace("PROSES", "PROCESS"),
      ...timestamps(row),
    }),
  },
];

async function readCollection(
  inputDirectory: string,
  plan: CollectionPlan,
): Promise<RecordValue[]> {
  const content = await readFile(path.join(inputDirectory, plan.file), "utf8");
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed))
    throw new Error(`${plan.file} must contain a JSON array`);
  return parsed.map(normalizeExtendedJson).map(plan.map);
}

async function importCollection(
  prisma: PrismaClient,
  plan: CollectionPlan,
  rows: RecordValue[],
): Promise<void> {
  const delegate = (prisma as any)[plan.delegate];
  const sourceIds = new Set(rows.map((row) => row.id));
  const existing = await delegate.findMany({ select: { id: true } });
  if (existing.some((row: { id: string }) => !sourceIds.has(row.id))) {
    throw new Error(
      `${plan.file}: target contains IDs absent from the source snapshot`,
    );
  }

  for (let start = 0; start < rows.length; start += 500) {
    await delegate.createMany({
      data: rows.slice(start, start + 500),
      skipDuplicates: true,
    });
  }

  const imported = await delegate.findMany({ select: { id: true } });
  if (
    imported.length !== sourceIds.size ||
    imported.some((row: { id: string }) => !sourceIds.has(row.id))
  ) {
    throw new Error(
      `${plan.file}: target IDs do not match the source snapshot`,
    );
  }
  console.log(`${plan.file}: ${rows.length} records reconciled`);
}

async function main(): Promise<void> {
  const inputIndex = process.argv.indexOf("--input");
  if (inputIndex < 0 || !process.argv[inputIndex + 1]) {
    throw new Error(
      "Usage: db:import -- --input <mongoexport-directory> [--apply] [--allow-remote]",
    );
  }

  const inputDirectory = path.resolve(
    process.cwd(),
    process.argv[inputIndex + 1],
  );
  const snapshots = await Promise.all(
    collections.map(
      async (plan) =>
        [plan, await readCollection(inputDirectory, plan)] as const,
    ),
  );
  for (const [plan, rows] of snapshots)
    console.log(`${plan.file}: ${rows.length} records ready`);

  if (!process.argv.includes("--apply")) {
    console.log(
      "Dry run only. Pass --apply to write these snapshots to PostgreSQL.",
    );
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for import");
  const databaseHost = new URL(databaseUrl).hostname;
  const localHosts = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);
  if (
    !localHosts.has(databaseHost) &&
    !process.argv.includes("--allow-remote")
  ) {
    throw new Error(
      "Refusing to import into a remote database without --allow-remote",
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  try {
    for (const [plan, rows] of snapshots)
      await importCollection(prisma, plan, rows);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("MongoDB snapshot import failed", error);
  process.exitCode = 1;
});
