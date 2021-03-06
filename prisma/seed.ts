// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
import prisma from "../lib/clients/prisma";
import * as classes from "./classes.json";

async function main() {
  await seedClasses();
}

async function seedClasses() {
  for (let i = 0; i < classes.classes.length; i++)
  {
    const c = await prisma.class.upsert({
    where: { id: i },
    update: {
      name: classes.classes[i].name,
      objectID: classes.classes[i].objectID,
      thirdGrade: classes.classes[i].thirdGrade,
      organising: classes.classes[i].organising
    },
    create: {
      id: i,
      name: classes.classes[i].name,
      objectID: classes.classes[i].objectID,
      thirdGrade: classes.classes[i].thirdGrade,
      organising: classes.classes[i].organising
    },
  })
  console.log(c);
  }
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