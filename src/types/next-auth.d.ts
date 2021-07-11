import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface User {
    email: string,
    name: string,
    id: number,
    role: string,
    class: string
  }

  interface Session {
    user: User,
    accessToken: JWT,
  }
}