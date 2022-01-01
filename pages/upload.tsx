import { getSession } from "next-auth/react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Layout from "../components/Layout";
import dbConnect from "../utils/dbConnect";
import { ISession } from "./api/auth/[...nextauth]";

export default function Upload({ session }: { session: ISession }): React.ReactElement {
	const [file, setFile] = useState();

	// function submit(e) {
	// 	e.preventDefault();

	// 	const uploadedFile = file;
	// 	const url = "/api/upload";
	// 	const formData = new FormData();
	// 	formData.append("file", file);
	// 	const config = {
	// 		headers: {
	// 			'content-type'
	// 		}
	// 	}

	// 	console.log(e);
	// }

	return (
		<Layout>
			{/* <form onSubmit={(e) => submit(e)}> */}
			<form action="/api/upload" method="POST" encType="multipart/form-data">
				{/* <form onSubmit={submit}> */}
				<Form.Group className="mb-3" role="form">
					<Form.Label>Upload .osr file here</Form.Label>
					<Form.Control type="file" name="file" accept=".osr" />
					{/*onChange={(e)=>setFile((e.target as any).files[0])}*/}
					<Button type="submit">Upload</Button>
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
