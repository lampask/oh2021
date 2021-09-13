import type { NextApiRequest, NextApiResponse } from 'next'
import {getSession} from 'next-auth/client';
import prisma from '../../../../../lib/clients/prisma'

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
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
  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: { published: true },
  })
  res.json(post)
}