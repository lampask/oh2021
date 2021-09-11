import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma'
import QRCode from 'qrcode'

// POST /api/q
// Required fields in body: id, number
// Optional fields in body: latitude, longitude
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { id, number, latitude, longitude } = req.body
      const session = await getSession({ req })
      if (session) {
        if (session?.user.role == 'ADMIN' || session?.user.role == 'EDITOR') {
          if (latitude != null && longitude != null) {
            const exc = await prisma.code.findUnique({ where: { id: id  } })
            if (exc != null) {
              if (exc.active == false) {
                await prisma.code.update({ where: { id: id }, data: {
                  active: true,
                  latitude: latitude,
                  longitude: longitude
                }})
              }
            } else {
              const durl = await QRCode.toDataURL('text')
              const code = await prisma.code.create({
                data: { 
                  id: id,
                  number: number,
                  qr: Buffer.from(durl, 'base64'),
                  active: true,
                  latitude: latitude,
                  longitude: longitude
                }
              })
            }
          }
        } else {
          const user = await prisma.user.findUnique({ where: { id: session?.user.id } })
          const exc = await prisma.code.findFirst({ where: { id: id, classes: { none: { id: user?.classId!! } } } })
            if (exc != null) {
              if (exc.active == true ) {
                await prisma.code.update({ where: { id: id }, data: {
                  classes: { connect: [{id: user?.classId!!}] }
                }})
              }
              return res.status(201).end();
            } else {
              return res.status(201).end();
            }
        }
      }
      return res.status(201).end();
    } catch (error) {
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const session = await getSession({ req })
      if (!session) return res.status(401).end();
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