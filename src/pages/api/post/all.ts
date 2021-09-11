
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// GET /api/post/all
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  if (req.method === "GET") {
    try {
      let filter = {}
      if (session.user.role == 'EDITOR') {
        filter = {
          OR: [
            {
              authorId: session.user.id,
              published: false
            },
            {
              published: true
            }
          ]
        }
      }
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { name: true },
          },
          categories: {
            select: {
              name: true,
              icon: true
            }
          },
          disciplines: {
            select: {
              id: true,
              name: true,
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        where: filter,
        orderBy: [
          {
            published: 'asc',
          },
          {
            createdAt: "desc",
          },
        ],
      });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}