import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { title, content } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const post = await prisma.post.create({
        data: {
          title: title,
          slug: title.replace(/ /g, '-').toLowerCase(),
          content: content,
          author: { connect: { email: session?.user?.email! } },
        },
      })
      return res.status(201).json(post);
    } catch (error) {
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { name: true },
          },
        },
        where: { published: true },
        orderBy: [
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