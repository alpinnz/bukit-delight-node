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
  for (const name of ["customer", "cashier", "owner"]) {
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
      username: "customer",
      email: "customer@bukit-delight.local",
      password: "Customer123!",
      roleName: "customer",
    },
    {
      username: "owner",
      email: "owner@bukit-delight.local",
      password: "Owner123!",
      roleName: "owner",
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

    const user = await prisma.user.upsert({
      where: { username: credential.username },
      update: {},
      create: {
        username: credential.username,
        email: credential.email,
        password: bcrypt.hashSync(credential.password, 8),
      },
      select: { id: true },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
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
