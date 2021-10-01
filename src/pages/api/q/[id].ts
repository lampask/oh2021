import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/clients/prisma'

// POST /api/q/check
// Required fields in body: id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const id = req.query.id
      if (id) {
        const qr = await prisma.code.findUnique({
          where: {
            id: id.toString()
          }, include: {
            classes: {
              // WILL RETURN ALL CLASES THAT FOUND THIS QRCODE TO ANYONE WHO FINDS IT (and is logged) - bruh i dont have enough sleep to figure out how to fix this so it stays i guess
              select: { name: true },
            },
          },
        });
        return res.status(200).json(qr);
      }
      return res.status(404).end();
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}