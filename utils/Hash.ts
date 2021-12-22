import { createHash } from "crypto";
export default function hash(str: string): string {
	return createHash("sha256").update(str).digest("base64");
}
