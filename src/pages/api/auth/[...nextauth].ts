import NextAuth, { NextAuthOptions } from 'next-auth'
import Adapters from 'next-auth/adapters'
import { NextApiHandler } from 'next'
import prisma from '../../../../lib/clients/prisma'
import { Role } from '@prisma/client'
import axios from 'axios'
import { JWT } from 'next-auth/jwt'

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;

const options: NextAuthOptions = {
  session: {
    jwt: true, 
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    {
      id: "gamca",
      name: "GAMČA account",
      type: "oauth",
      version: "2.0",
      scope: "https://graph.microsoft.com/user.read",
      params: { grant_type: "authorization_code" },
      domain: 'https://login.microsoftonline.com',
      accessTokenUrl: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`,
      requestTokenUrl: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
      authorizationUrl: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/authorize?response_type=code`,
      profileUrl: "https://graph.microsoft.com/oidc/userinfo",
      profile: (profile: any) => {
        return {
          id: profile.sub,
          name: profile.name,
          last_name: profile.family_name,
          first_name: profile.given_name,
          email: profile.email,
          picture: profile.picture,
          role: "",
          class: ""
        };
      },
      clientId: `${process.env.AZURE_CLIENT_ID}`,
      clientSecret: `${process.env.AZURE_CLIENT_SECRET}`,
    },
  ],
  callbacks: {
    // Getting the JWT token from API response
    async jwt(token, user: any, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) 
      {
        token.accessToken = account?.accessToken
        if (isNewUser || user.classId === null) {
          // #region PRVY STUPEN
          try {
            const userClassFirst = await axios.post('https://graph.microsoft.com/v1.0/me/checkMemberGroups',
            {
              "groupIds": (await prisma.class.findMany({
                where: {
                  thirdGrade: false
                },
                select: {
                  objectID: true
                }
              })).map((item) => item.objectID)
            },
            {
              headers: {
                'Authorization': `Bearer ${account.accessToken}`,
                'Content-Type': 'application/json'
              }
            })
            if (userClassFirst.data) {
              if (userClassFirst.data.value.length != 0) {
                const target = await prisma.class.findUnique({ where: { objectID: userClassFirst.data.value[0] } })
                await prisma.user.update({ where: { id: user.id }, data: { classId: target?.id!, role: (target?.organising ? Role.EDITOR : Role.STUDENT) } })
              }
            }
          
            //#endregion
            //#region DRUHY STUPEN
            const userClassSecond = await axios.post('https://graph.microsoft.com/v1.0/me/checkMemberGroups',
            {
              "groupIds": (await prisma.class.findMany({
                where: {
                  thirdGrade: true
                },
                select: {
                  objectID: true
                }
              })).map((item) => item.objectID)
            },
            {
              headers: {
                'Authorization': `Bearer ${account.accessToken}`,
                'Content-Type': 'application/json'
              }
            })
            if (userClassSecond.data) {
              if (userClassSecond.data.value.length != 0) {
                const target = await prisma.class.findUnique({ where: { objectID: userClassSecond.data.value[0] } })
                await prisma.user.update({ where: { id: user.id }, data: { classId: target?.id!, role: (target?.organising ? Role.EDITOR : Role.STUDENT) } })
              }
            }
            //#endregion
          } catch (error) {
            console.error(error)
          }
        }
        try {
          const userImage = await axios.get((profile?.picture as string),
          {
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
              'Content-Type': 'image/jpg'
            },
            responseType: 'arraybuffer'
          })
          if (userImage.data) {
            await prisma.user.update({ where: { id: user.id }, data: { imageData: Buffer.from(userImage.data) }});
          }
        } catch (error) {
          console.error(error)
        }
      }
      return token
    },
    async session(session, token) {
      session.accessToken = token;
      if (!session?.user || !token) {
        return session
      }
      const user = await prisma.user.findUnique({select: { id: true, role: true, class: { select: { name: true } } }, where: { email: token.email! } })
      session.user.id = user?.id!
      session.user.role = user?.role!
      session.user.class = user?.class?.name!
      session.accessToken = (token as JWT);
      return session;
    },
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: `${process.env.JWT_SECRET}`,
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler