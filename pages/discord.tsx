import Layout from "../components/Layout";

export default function Discord(): React.ReactElement {
	return (
		<Layout>
			<iframe
				src="https://canary.discord.com/widget?id=934197646141309008&theme=dark"
				width="350"
				height="500"
				allowTransparency
				style={{ display: "block", margin: "auto" }}
				sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
			></iframe>
		</Layout>
	);
}
