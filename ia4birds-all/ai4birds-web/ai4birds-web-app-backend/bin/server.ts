import app from "../app";
import https from "https";
import http from "http";
import debug from "debug";
import config from "../config/global.config";
import fs from "fs";
const bodyParser = require('body-parser');
import globalConfig from "../config/global.config";

const port = normalizePort(config.port || "5030");
app.set("port", port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Asegura que esté en un formato válido antes de pasarlo a la función de creación del servidor
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

//Creación del servidor HTTP o HTTPS
let server: http.Server | https.Server;
//Si existen archivos de certificado y clave SSL, se crea un servidor HTTPS
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

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})

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
	const bind = typeof addr === "string" ? "pipe " + addr : "port " + 5030;
	debug("Listening on " + bind);
}