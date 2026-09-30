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
      password: "customer",
      roleName: "customer",
    },
    {
      username: "owner",
      email: "owner@bukit-delight.local",
      password: "owner",
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

    const hashedPassword = bcrypt.hashSync(credential.password, 8);
    const user = await prisma.user.upsert({
      where: { username: credential.username },
      update: { password: hashedPassword },
      create: {
        username: credential.username,
        email: credential.email,
        password: hashedPassword,
      },
      select: { id: true },
    });
    await prisma.userRole.upsert({
      where: { user_id_role_id: { user_id: user.id, role_id: role.id } },
      update: {},
      create: { user_id: user.id, role_id: role.id },
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
