import prisma from "../src/lib/prisma.js";
import { auth } from "../src/lib/auth.js";

async function main() {
  console.log("Resetting all data...");

  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log("All data cleared.");

  const admin = await auth.api.signUpEmail({
    body: {
      email: "admin@admin.com",
      password: "admin123",
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin account created:", admin.user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
