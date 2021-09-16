import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { name, answer } = req.body
      const session = await getSession({ req })
      if (session) {
        let cipher = await prisma.sifra.findFirst({where: { name: name }})
        const curClass = await prisma.class.findFirst({where: {name: session?.user.class} })

        if (cipher?.answer == answer)
        {
          if (cipher?.id && curClass?.name && !curClass.ciphersDone.includes(cipher.id)) {
            var duration = moment.duration(moment(new Date()).diff(cipher.startTime));
            var hours = Math.ceil(duration.asHours());
            var oldHours = curClass.ciphersTime

            await prisma.class.updateMany({
              where: {
                name: curClass?.name
              },
              data: {
                ciphersDone: {
                  push: cipher.id
                },
                ciphersTime: hours+oldHours,
              }
            })

          }
          return res.status(202).end();
        } else {
          if (cipher?.id && curClass?.name && !curClass.ciphersDone.includes(cipher.id)) {
            var oldHours = curClass.ciphersTime

            await prisma.class.updateMany({
              where: {
                name: curClass?.name
              },
              data: {
                cipherIncorrect: curClass.cipherIncorrect+1,
              }
            })

          }
        }
      }
      return res.status(200).end();
    } catch (error) {
      console.log(error)
      return res.status(422).end();
    }
  } else if (req.method === "POST") {
    try {
      const { name, answer, start } = req.body
      const session = await getSession({ req })
      if (session?.user.role != 'ADMIN') if (session?.user.role != 'EDITOR') return res.status(401).end();
      const event = await prisma.sifra.create({
        data: {
          name: name,
          answer: answer,
          startTime: start,
        }
      })
      console.log(event)
      return res.status(201).json(event);
    } catch (error) {
      console.log(error)
      return res.status(422).end();
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}