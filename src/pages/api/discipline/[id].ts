import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// GET /api/discipline/[id]
// Required fields in body:
// Optional fields in body:

// DELETE /api/discipline/[id]
// Required fields in body:
// Optional fields in body:

// TODO
// PUT /api/discipline/[id]
// Required fields in body:
// Optional fields in body: name, categoryId, icon, tags

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const disciplineId = req.query.id

      const discipline = await prisma.discipline.findFirst({
        where: { id: Number(disciplineId) },
        include: {
          posts: {
            include: {
              disciplines: true,
              categories: true,
              tags: true,
            },
            where: { published: true },
          },
          category: {
            select: {
              icon: true
            }
          },
          events: {
            include: {
              results: {
                select: {
                  class: {
                    select: {
                      name: true
                    }
                  },
                  place: true,
                }
              }
            }
          }
        }
      });
      return res.status(200).json(discipline);
    } catch (error) {
      return res.status(422).end();
    }
  } else if (req.method === "DELETE") {
    try {
      const disciplineId = req.query.id

      const discipline = await prisma.discipline.delete({
        where: { id: Number(disciplineId) },
      });
      return res.status(200).json(discipline);
    } catch (error) {
      return res.status(422).end();
    }
  } else if (req.method === "PUT"){
    // TODO nevie ci sa to da spravit nejak pekne alebo iba tak skaredo
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}