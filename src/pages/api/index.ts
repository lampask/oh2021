import type { NextApiRequest, NextApiResponse } from 'next'

// GET /api
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  return res.status(418).json("deti nehrajte sa so strankou");
}