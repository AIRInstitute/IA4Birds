import app from "../app";
import https from "https";
import http from "http";
import debug from "debug";
import config from "../config/global.config";
import fs from "fs";

const port = normalizePort(config.port || "3030");
app.set("port", port);

function normalizePort(val: string) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

let server: http.Server | https.Server;
if (fs.existsSync(config.ssl.key) && fs.existsSync(config.ssl.cert)) {
	server = https.createServer(
		{
			key: fs.readFileSync(config.ssl.key, "utf8"),
			cert: fs.readFileSync(config.ssl.cert, "utf8"),
		},
		app
	);
} else {
	server = http.createServer(app);
}

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
server.on("error", onError);
server.on("listening", onListening);

function onError(error: { syscall: string; code: any }) {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === "string" ? "pipe " + addr : "port " + 3030;
	debug("Listening on " + bind);
}
