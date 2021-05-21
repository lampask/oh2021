// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
import prisma from "../lib/prisma";

async function main() {
  const sexta = await prisma.class.upsert({
    where: { id: 0 },
    update: {
      objectID: "489b5771-e73c-4be2-9fcc-4f3a556285cb"
    },
    create: {
      id: 0,
      name: "Sexta",
      objectID: "489b5771-e73c-4be2-9fcc-4f3a556285cb",
      thirdGrade: true,
      organising: true
    },
  })
  console.log(sexta)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
export {}