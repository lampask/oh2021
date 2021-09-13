import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, link } = req.body

      const session = await getSession({ req })
      if (!session) return res.status(401).end();
      const album = await prisma.album.create({
        data: {
          name: name,
          link: link,
        }
      })
      return res.status(201).json(album);
    } catch (error) {
      console.error(error)
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const albums = await prisma.album.findMany();
      return res.status(200).json(albums);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}