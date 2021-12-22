import NextAuth from "next-auth";
import OsuProvider from "next-auth/providers/osu";

export default NextAuth({
	providers: [
		OsuProvider({
			clientId: process.env.OSU_ID,
			clientSecret: process.env.OSU_SECRET
		})
	],
	secret: process.env.SECRET
});
