import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// GET /api/profile/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id;
  const session = await getSession({ req })
  let role = null;
  if (session) {
    role = await prisma.user.findUnique({select: { role: true }, where: { id: session.user.id }})
  }
  const prof = await prisma.user.findUnique({select: { 
    class: true,
    comments: true,
    email: true,
    imageData: true,
    name: true,
    posts: true,
    role: true,
    createdAt: true,
    publicProfile: true,
    aboutMe: true,
    updatedAt: true
  }, where: { id: Number(userId) }});
  if ((!prof?.publicProfile && role?.role != 'ADMIN') && Number(userId) != session?.user.id) {
    return res.status(401).end();
  }
  if (prof == undefined) return res.status(404).end()
  return res.status(200).json(prof)
}