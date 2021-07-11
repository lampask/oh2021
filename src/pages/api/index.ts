import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/clients/prisma'

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  return res.status(418).json("deti nehrajte sa so strankou");
}