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
      const { points, place, description, clas, event } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const result = await prisma.eventResult.create({
        data: {
          points: parseInt(points),
          place: parseInt(place),
          description: description,
          class: { connect: { id: parseInt(clas) } },
          event: { connect: { id: parseInt(event) } },
        }
      })
      return res.status(201).json(result);
    } catch (error) {
      console.error(error)
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const results = await prisma.eventResult.findMany({
        include: {
          event: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
            }
          },
        },
        orderBy: [{
          points: "desc"
        }]
      });
      results.forEach(eve => { eve.points = -1 })
      return res.status(200).json(results);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}