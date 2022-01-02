import Client from "ssh2-sftp-client";
let client = new Client();

const SFTP_HOST = process.env.SFTP_HOST,
	SFTP_PORT = process.env.SFTP_PORT as any as number,
	SFTP_USERNAME = process.env.SFTP_USERNAME,
	SFTP_PASSWORD = process.env.SFTP_PASSWORD;

var connected = false;

async function storageConnect() {
	if (!connected) {
		await client.connect({
			host: SFTP_HOST,
			port: SFTP_PORT,
			username: SFTP_USERNAME,
			password: SFTP_PASSWORD
		});
		connected = true;
	}
}

async function getClient() {
	if (connected) return client;
	return null;
}

export { storageConnect, getClient };
