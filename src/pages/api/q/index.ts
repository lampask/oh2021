import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, session } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'
import QRCode from 'qrcode'

// POST /api/q
// Required fields in body: id
// Optional fields in body: latitude, longitude
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { id, latitude, longitude } = req.body
      const session = await getSession({ req })
      if (session) {
        if (latitude != null && longitude != null) {
          if (session?.user.role == 'ADMIN' || session?.user.role == 'EDITOR') {
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
              const durl = await QRCode.toDataURL(`https://oh.gamca.sk/q/${id}`)
              const code = await prisma.code.create({
                data: {
                  id: id,
                  number: 0,
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
    const session = await getSession({ req })
    if (!session) return res.status(401).end();
    try {
      if (session?.user.role != 'ADMIN' && session?.user.role != 'EDITOR') return res.status(401).end();
      const qrs = await prisma.code.findMany({
        include: {
          classes: {
            select: { name: true },
          },
        },
      });
      return res.status(200).json(qrs);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}