import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Edit this list to add/remove people, then re-run:
//   npx prisma db seed
// Re-running is safe — existing accounts are matched by email and
// only their name/password are updated, nothing is duplicated.
// IMPORTANT: after seeding, tell each person their temporary password
// and ask them to note it somewhere safe — there is no self-service
// "forgot password" flow, only re-seeding with a new password here.
const USERS = [
  { email: "papoutsidakekate@gmail.com", name: "Κατερίνα Παπουτσιδάκη", password: "12345678" },
  { email: "giorgosdoriakis89@gmail.com", name: "Γιώργος Δοριάκης", password: "12345678" },
  { email: "pitsoulakis01@gmail.com", name: "Δημήτρης Πιτσουλάκης", password: "12345678" },
  { email: "viskadouros@hmu.gr", name: "Γιώργος Βισκαδούρος", password: "12345678" },
  { email: "nikchanialakis@yahoo.gr", name: "Νίκος Χανιαλάκης", password: "12345678" },
  { email: "lampis1949@gmail.com", name: "Χαράλαμπος Γιαννόπουλος", password: "12345678" },
  { email: "antreasgiannopoulos1978@gmail.com", name: "Αντρέας Γιαννόπουλος", password: "12345678" },
];

async function main() {
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.user.upsert({
      where: { email: u.email.toLowerCase() },
      update: { name: u.name, passwordHash },
      create: { email: u.email.toLowerCase(), name: u.name, passwordHash },
    });
    console.log(`OK: ${u.email}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
