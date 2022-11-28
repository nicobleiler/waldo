import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, {type NextAuthOptions} from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { prisma } from '@server/db/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // image can be null, undefined, or a string,
        // this limits to either undefined or a string
        session.user.avatarUrl = user.image === null ? undefined : user.image;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.token = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
