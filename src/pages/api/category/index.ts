import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../../lib/clients/prisma'

// POST /api/category
// Required fields in body: name
// Optional fields in body: categoryId, icon

// GET /api/category
// Required fields in body:
// Optional fields in body:

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      //TODO
    } catch (error) {
      console.error(error);
      return res.status(422).end();
    }
  } else if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}