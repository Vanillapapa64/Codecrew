import NextAuth, { DefaultSession } from "next-auth"
import client from "../../db"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
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
          console.log("🟢 authorize() function is running...");
          console.log("Received credentials:", credentials);
          if (!credentials || !credentials.username || !credentials.password) {
            console.log("❌ Missing credentials");
            return null;
          }
          if(!credentials){
            return null
          }
          await client.$connect();
            console.log("🔍 Searching for user:", credentials.username.trim());
            const username:string=credentials.username
            const userid=await client.user.findFirst({
              where:{
                name:username.trim()
              }
            })
            if(!userid){
              console.log("❌ User not found in database");
              return null
            }
          console.log("Stored password hash:", userid?.password);
          console.log("Entered password:", credentials.password);
          const pass:string=credentials.password
          const isPasswordValid = await bcrypt.compare(pass.trim(), userid.password);
          const hash=await bcrypt.hash(credentials.password,10)
          console.log("After hashing",hash)
          console.log("Password match:", isPasswordValid);
          try {
            await client.$connect();
            const username:string=credentials.username
            const userid=await client.user.findFirst({
              where:{
                name:username.trim()
              }
            })
            if(!userid){
              return null
            }
            console.log("cred",credentials.password)
            console.log("user",userid.password)
            const isPasswordValid = await bcrypt.compare(credentials.password, userid.password)

            if(!isPasswordValid){
              
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