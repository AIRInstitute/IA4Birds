import { Router, Request, Response } from "express";
import axios from "axios";

const INGEST_SERVICE_URL = process.env.INGEST_SERVICE_URL || "http://ai4birds-ingest:5000";

export default (): Router => {
    const router = Router();

    // Proxy para reenviar todas las peticiones al servicio de ingestión
    router.all("/*", async (req: Request, res: Response) => {
        try {
            const url = `${INGEST_SERVICE_URL}${req.path}`;
            console.log(`Proxying request to: ${url}`);
            
            const config = {
                method: req.method.toLowerCase() as any,
                url,
                params: req.query,
                data: req.body,
                headers: {
                    ...req.headers,
                    host: undefined, // Remove host header to avoid conflicts
                },
            };

            const response = await axios(config);
            
            // Forward response headers
            Object.keys(response.headers).forEach(key => {
                if (key !== 'content-encoding' && key !== 'content-length') {
                    res.set(key, response.headers[key]);
                }
            });
            
            res.status(response.status).json(response.data);
        } catch (error: any) {
            console.error(`Proxy error for ${req.path}:`, error.message);
            
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({ 
                    error: "Service unavailable", 
                    message: "Could not connect to ingest service" 
                });
            }
        }
    });

    return router;
};
