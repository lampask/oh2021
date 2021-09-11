import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// GET /api/profile
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end();
  const prof = await prisma.user.findUnique({select: { 
    class: true,
    comments: true,
    email: true,
    imageData: true,
    name: true,
    posts: {
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
    },
    role: true,
    createdAt: true,
    publicProfile: true,
    aboutMe: true,
    updatedAt: true
   }, where: { id: session?.user.id }});
  return res.status(200).json(prof)
}