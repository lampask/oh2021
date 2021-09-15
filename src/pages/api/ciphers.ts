import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma';

// POST /api/q
// Required fields in body: id, number
// Optional fields in body: latitude, longitude
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await getSession({ req })
    const curClass = await prisma.class.findFirst({where: {name: session?.user.class} })
    if (session) {
      const ciphers = await prisma.sifra.findMany({
        where: {
          id: {
            notIn: curClass?.ciphersDone,
          },
        },
        select: {
          id: true,
          name: true
        }
      });
      return res.status(200).json(ciphers);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      )
    }
  }
}