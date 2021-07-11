import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// POST /api/discipline
// Required fields in body: name
// Optional fields in body: categoryId, icon

// GET /api/discipline
// Required fields in body:
// Optional fields in body:

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, categoryId, icon } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const discipline = await prisma.discipline.create({
        data: {
          name: name,
          slug: name.replace(/ /g, '-').toLowerCase(),
          category: { connect: { id: categoryId } },
          icon: icon,
        },
      })
      return res.status(201).json(discipline);
    } catch (error) {
      console.log(error);
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const disciplines = await prisma.discipline.findMany();
      return res.status(200).json(disciplines);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}