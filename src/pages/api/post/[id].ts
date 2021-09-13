import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// DELETE /api/post/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const postId = req.query.id
  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        where: { id: Number(postId) }
      })
      if (post === null) return res.status(404).end();
      if (session?.user.role != 'ADMIN') if (post.published === false && session?.user.id != post.authorId) return res.status(401).end();
      return res.status(200).json(post);
    } catch (error) {
      return res.status(422).end();
    }
  } else if (req.method === 'DELETE') {
    try {
      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const postId = req.query.id
      const postQ = await prisma.post.findUnique({
        select: {
          author: {
            select: { id: true },
          },
        },
        where: { id: Number(postId) }
      })
      if (session?.user.role != 'ADMIN') if (session?.user.id != postQ?.author.id) return res.status(401).end();
      const post = await prisma.post.delete({
        where: { id: Number(postId) },
      })
      res.status(200).json(post)
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}