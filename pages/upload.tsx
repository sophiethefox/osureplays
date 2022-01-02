import { getSession } from "next-auth/react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Layout from "../components/Layout";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextauth]";

export default function Upload({ session }: { session: ISession }): React.ReactElement {
	const [fileInput, setFileInput] = useState("");

	return (
		<Layout>
			<form action="/api/upload" method="POST" encType="multipart/form-data">
				<Form.Group className="mb-3" role="form">
					<Form.Label>Upload .osr file here</Form.Label>
					<Form.Control
						type="file"
						name="file"
						accept=".osr"
						onChange={(e) => setFileInput(e.target.value)}
					/>
					<Button type="submit" disabled={fileInput.length == 0}>
						Upload
					</Button>
				</Form.Group>
			</form>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();
	const session: ISession | null = await getSession(context);

	return { props: { session: session } };
}

Upload.auth = true;
