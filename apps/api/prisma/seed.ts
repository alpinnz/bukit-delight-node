import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const bcrypt = require("bcryptjs");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function seedRoles(): Promise<void> {
  for (const name of ["customer", "cashier", "admin"]) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedLocalAccounts(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;

  const credentials = [
    {
      username: "admin",
      email: "admin@bukit-delight.local",
      password: "admin",
      roleName: "admin",
    },
    {
      username: "cashier",
      email: "cashier@bukit-delight.local",
      password: "cashier",
      roleName: "cashier",
    },
  ];

  for (const credential of credentials) {
    const role = await prisma.role.findUnique({
      where: { name: credential.roleName },
      select: { id: true },
    });
    if (!role) throw new Error(`Role ${credential.roleName} is missing`);

    await prisma.account.upsert({
      where: { username: credential.username },
      update: {},
      create: {
        username: credential.username,
        email: credential.email,
        password: bcrypt.hashSync(credential.password, 8),
        roleId: role.id,
      },
    });
  }
}

seedRoles()
  .then(seedLocalAccounts)
  .catch((error: unknown) => {
    console.error("Failed to seed roles", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
