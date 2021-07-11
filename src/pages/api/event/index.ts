import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// POST /api/event
// Required fields in body: name, startDate, endDate, parentId
// Optional fields in body:

// GET /api/event
// Required fields in body:
// Optional fields in body:

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, startDate, endDate, parentId } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const event = await prisma.event.create({
        data: {
          name: name,
          startDate: startDate,
          endDate: endDate,
          parentId: parentId,
          // discipline: { connect: { id: parentId } },
        },
      })
      return res.status(201).json(event);
    } catch (error) {
      console.log(error);
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const events = await prisma.event.findMany();
      return res.status(200).json(events);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}