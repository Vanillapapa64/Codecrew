import NextAuth, { DefaultSession } from "next-auth"
import client from "../../db"
import CredentialsProvider from "next-auth/providers/credentials"
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
  }
}
const handler = NextAuth({
  providers:[
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {
          if(!credentials){
            return null
          }
          try {
            await client.$connect();
            const userid=await client.user.findFirst({
              where:{
                name:credentials.username,
                password:credentials.password
              }
            })
            if(!userid){
              return null
            }
            return {
                id: userid.id.toString(),
                name:userid.name,
                email:"no email"
            };
          } catch (error) {
            console.error("Authorization error:", error);
            return null;
          }
            finally{
              await client.$disconnect()
            }
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  pages:{
    signIn:'/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach the user ID to the token if it's the initial login
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user ID from the token to the session
      if (token && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  }
})

export { handler as GET, handler as POST }