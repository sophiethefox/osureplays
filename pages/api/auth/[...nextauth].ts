import OsuProvider from "next-auth/providers/osu";
import NextAuth, { ISODateString } from "next-auth";

export interface ISession extends Record<string, unknown> {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
		id?: string | null;
	};
	expires: ISODateString;
}

export default NextAuth({
	providers: [
		OsuProvider({
			clientId: process.env.OSU_ID,
			clientSecret: process.env.OSU_SECRET
		})
	],
	secret: process.env.SECRET,
	callbacks: {
		async session({ session, user, token }) {
			(session as ISession).user.id = token.sub;
			return session;
		}
	}
});
