import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { unstable_getServerSession, type Session } from "next-auth";

import { prisma } from "@server/db/client";
import { authOptions } from "pages/api/auth/[...nextauth]";

type CreateContextOptions = {
  session: Session | null;
};


// for testing
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};


// for next
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await unstable_getServerSession(req, res, authOptions);

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
