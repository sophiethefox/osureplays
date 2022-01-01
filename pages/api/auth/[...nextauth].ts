import OsuProvider from "next-auth/providers/osu";
import NextAuth, { ISODateString } from "next-auth";
import { User } from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export interface ISession extends Record<string, unknown> {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
		id?: string | null;
	};
	expires: ISODateString;
	accessToken?: string | null;
}

export default NextAuth({
	providers: [
		OsuProvider({
			clientId: process.env.OSU_ID,
			clientSecret: process.env.OSU_SECRET,
			authorization: {
				params: {
					scope: "identify public"
				}
			}
		})
	],
	secret: process.env.SECRET,
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account?.access_token;
			}
			return token;
		},
		async signIn({ user, account, profile, email }) {
			await dbConnect();

			var dbUser = await User.findOne({ ID: user.id });

			if (!dbUser) {
				await User.create({
					ID: user.id,
					osu_username: user.name
				});
			}

			return true;
		},
		async session({ session, user, token }) {
			(session as ISession).user.id = token.sub;
			session.accessToken = token.accessToken;

			return session;
		}
	}
});
