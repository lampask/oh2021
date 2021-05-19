import NextAuth, { NextAuthOptions } from 'next-auth'
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers'
import { NextApiHandler } from 'next'
import prisma from '../../../../lib/prisma'
import { Role, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import axios from 'axios'

const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const saltRounds = 10;

const options: NextAuthOptions = {
  session: {
    jwt: true, 
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Providers.Credentials({
      id: 'credentials',
      name: 'normal account',
      credentials: {
        email: {label: "Email", type: "text"},
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials: Record<string, string>): Promise<User | null> => {
        const getUser = async (): Promise<User | null> => {
            var check = await prisma.user.findUnique({ where: { email: credentials.email } })
            
            // Registration
            if (check === null) {
              var hash = await bcrypt.hash(credentials.password, saltRounds)
              
              // email check

              // proccess
              check = await prisma.user.create({
                data: {
                  name: credentials.username,
                  email: credentials.email,
                  password: hash,
                }
              })
            } 

            // Login
            else if (check?.password !== undefined) {
              var res = await bcrypt.compare(credentials.password, check.password!)
              // proccess
              if (!res) {
                check = null
              }
            }
            
            return check
        }

        // Handle
        const user = getUser()
        if (user) {
          return user
        } else {
          return null
        }
      },
    }),
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
          picture: profile.picture
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
        token.accessToken = account.accessToken
        if (isNewUser || user.classId === null) {
          // #region PRVY STUPEN
          // 7b1ccc2f-0c35-4bb8-9578-ba2a8668b56e - primaA
          // 698e71e7-9626-48af-8d50-722beffe8e69 - primaB
          // d0d9ead6-242c-404b-b115-9ed16e2bac2e - sekundaA
          // 057ebd83-8af8-410d-9c90-7a4a3e73e67a - sekundaB
          // 56672f71-3d0b-4784-8b33-9ecfa877b6a7 - terciaA
          // f3b71313-3a7c-40b5-817b-f6b16d535583 - terciaB
          // f26ae2a4-7d00-4955-b1de-e94cfcaf951f - kvartaA
          // 0851aacd-58ac-44d5-91ef-0b2067cc567f - kvartaB
          const userClassFirst = await axios.post('https://graph.microsoft.com/v1.0/me/checkMemberGroups',
          {
            "groupIds": [
              "7b1ccc2f-0c35-4bb8-9578-ba2a8668b56e",
              "698e71e7-9626-48af-8d50-722beffe8e69",
              "d0d9ead6-242c-404b-b115-9ed16e2bac2e",
              "057ebd83-8af8-410d-9c90-7a4a3e73e67a",
              "56672f71-3d0b-4784-8b33-9ecfa877b6a7",
              "f3b71313-3a7c-40b5-817b-f6b16d535583",
              "f26ae2a4-7d00-4955-b1de-e94cfcaf951f",
              "0851aacd-58ac-44d5-91ef-0b2067cc567f"
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
              'Content-Type': 'application/json'
            }
          })
          if (userClassFirst) {
            if (userClassFirst.data.value != []) {
              const target = await prisma.class.findUnique({ where: { objectID: userClassFirst.data.value[0] } })
              await prisma.user.update({ where: { id: user.id }, data: { classId: target?.id, role: (target?.organising ? Role.EDITOR : Role.STUDENT) } })
            }
          }
          //#endregion

          //#region DRUHY STUPEN
          // 001b3b4f-1943-4de6-ac93-108cf460339a - I.C
          // 195b4906-0398-423b-828e-2795d2aeea0f - kvinta
          // ed26a676-c4ac-4ca9-94f7-c6b62e05aee2 - I.A
          // f7472ac1-ae34-409e-9a15-0f11262a8b27 - I.B
          // b31d5617-6b1b-4acc-bdbf-4c8be8eafe8f - II.C
          // 489b5771-e73c-4be2-9fcc-4f3a556285cb - sexta
          // 19627e8b-3353-4686-a255-fba944c93406 - II.A
          // 7cc58117-8d25-445c-a2e8-08547a1205ee - II.B
          // 9747a936-defe-4dda-897a-d2a195112fea - septima
          // 088397ab-2fa1-498d-b1f7-6803ab3b3c41 - III.A
          // cef0741e-2a97-4e7f-b94c-299aa381547f - III.B
          // ae50baf8-bfce-47ab-981a-eec66a5e42a6 - oktava
          // 158ad62f-57b6-46d1-a9e2-05f8080d7cec - IV.A
          // 7c977040-344a-43a7-a2a5-60c2e9fc1317 - IV.B
          // b0d024cc-0503-41eb-81e8-d7a84cdd73e9 - IV.C
          // 8627ddf3-365a-4513-9ae7-dd6d3302ebba - IV.D
          const userClassSecond = await axios.post('https://graph.microsoft.com/v1.0/me/checkMemberGroups',
          {
            "groupIds": [
              "001b3b4f-1943-4de6-ac93-108cf460339a",
              "195b4906-0398-423b-828e-2795d2aeea0f",
              "ed26a676-c4ac-4ca9-94f7-c6b62e05aee2",
              "f7472ac1-ae34-409e-9a15-0f11262a8b27",
              "b31d5617-6b1b-4acc-bdbf-4c8be8eafe8f",
              "489b5771-e73c-4be2-9fcc-4f3a556285cb",
              "19627e8b-3353-4686-a255-fba944c93406",
              "7cc58117-8d25-445c-a2e8-08547a1205ee",
              "9747a936-defe-4dda-897a-d2a195112fea",
              "088397ab-2fa1-498d-b1f7-6803ab3b3c41",
              "cef0741e-2a97-4e7f-b94c-299aa381547f",
              "ae50baf8-bfce-47ab-981a-eec66a5e42a6",
              "158ad62f-57b6-46d1-a9e2-05f8080d7cec",
              "7c977040-344a-43a7-a2a5-60c2e9fc1317",
              "b0d024cc-0503-41eb-81e8-d7a84cdd73e9",
              "8627ddf3-365a-4513-9ae7-dd6d3302ebba"
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
              'Content-Type': 'application/json'
            }
          })
          if (userClassSecond) {
            if (userClassSecond.data.value != []) {
              const target = await prisma.class.findUnique({ where: { objectID: userClassSecond.data.value[0] } })
              await prisma.user.update({ where: { id: user.id }, data: { classId: target?.id, role: (target?.organising ? Role.EDITOR : Role.STUDENT) } })
            }
          }
          //#endregion
        }
      }  
      return token
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },ť
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.JWT_SECRET,
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler