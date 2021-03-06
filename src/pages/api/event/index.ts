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
      const { title, dateRange, color, discipline } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      if (session?.user.role != 'ADMIN') if (session?.user.role != 'EDITOR') return res.status(401).end();
      const event = await prisma.event.create({
        data: {
          name: title,
          startDate: dateRange[0],
          endDate: dateRange[1],
          color: color,
          discipline: discipline ? { connect: { id: parseInt(discipline) } } : undefined,
        },
      })
      return res.status(201).json(event);
    } catch (error) {
      console.error(error)
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const events = await prisma.event.findMany({
        include: {
          discipline: {
            select: {
              id: true,
              name: true,
            }
          },
          results: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
            orderBy: [{
              points: "desc"
            }]
          },
        }
      });
      events.forEach(eve => eve.results.forEach(res => res.points = -1 ))
      return res.status(200).json(events);
    } catch (error) {
      console.error(error)
      return res.status(422).end();
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body
      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      if (session?.user.role != 'ADMIN') if (session?.user.role != 'EDITOR') return res.status(401).end();
      const events = await prisma.event.delete({
        where: {
          id: id
        }
      })
      return res.status(200).json(events);
    } catch (error) {
      console.error(error)
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}