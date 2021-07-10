import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// GET /api/profile/picture
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end();
  const pic = await prisma.user.findUnique({select: { imageData: true }, where: { id: session?.user.id }});
  return res.status(200).send(pic?.imageData)
}