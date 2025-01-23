import axios from 'axios';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';
import AdmZip from 'adm-zip';
import { createReadStream, existsSync } from 'fs';
import JSONStream from 'JSONStream';
import { Transform } from 'stream';
import path from 'path';
import { tmpdir } from 'os';
import app from "../app";
const bodyParser = require('body-parser');
import express, { Request, Response, NextFunction, response } from 'express';
import redis from '../config/redis.config';

//SSE

let clients = [];
let facts = [];

const getExclusionMapDataStreaming = async (req: Request, res: Response) => {
    console.log(`New client: ${req.body}`);

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        res
    };

    console.log(`${clientId} Connection opened`);

    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });

    //Forma de hacerlo con async y await
    //   const response = await axios.post(`${globalConfig.pythonURL}/exclusionmap/stream-exclusion-data`);
    //   if(response.status !== 200){
    //       throw new Error('No se pudieron obtener los datos del mapa de exclusión eólica en Stream.');
    //   }
    //   else{
    //       addFact(response.data);
    //   }

    axios.post(`${globalConfig.pythonURL}/exclusionmap/stream-exclusion-data?id=${newClient.id}`)
    .then((response) => {
        console.log("Data received");
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos del mapa de exclusión eólica en Stream.');
        }
        else {
            notifyNoMoreData(newClient.id)
            console.log(response.data)
            // addFact(response.data)
        }
    }).catch((error) => {
        console.error(error);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    })
}

//Envía eventos a todos los clientes conectados
function sendEventToClient(newFact, clientId) {
    console.log(clients)
    console.log(clientId)
    const client = clients.filter(client => client.id == clientId).pop();
    console.log(client)
    if (client && client.res) {
        try {
            client.res.write(`data: ${JSON.stringify(newFact)}\n\n`);
        } catch (error) {
            console.error('Error writing to client stream:', error);
        }
    } else {
        console.error(`Client with ID ${clientId} not found or client.res is undefined`);
    }
}


async function addFact(req: Request, res: Response) {
    const { client_id } = req.query;
    console.log(`New fact: ${req.body}`);
    const newFact = req.body;

    facts.push(newFact);
    res.json(newFact);

    sendEventToClient(newFact, client_id);

}

function notifyNoMoreData(clientId) {
    const client = clients.find(client => client.id === clientId);
    if (client) {
        client.res.write(`data: {"message": "Data streaming completed."}\n\n`);
    } else {
        console.log(`Cliente con ID ${clientId} no encontrado`);
    }
}


// Utilidad para descargar y procesar el archivo ZIP
async function processZip(response: any): Promise<any[]> {
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();
    const jsonDataEntry = zipEntries.find(entry => entry.entryName === 'data.json');

    if (!jsonDataEntry) {
        throw new Error('Archivo data.json no encontrado en el zip');
    }

    const tempDir = path.join(tmpdir(), 'temp');
    const tempFilePath = path.join(tempDir, 'data.json');
    zip.extractEntryTo(jsonDataEntry, tempDir, true, true);

    if (!existsSync(tempFilePath)) {
        throw new Error(`El archivo ${tempFilePath} no se encuentra o no se extrajo correctamente.`);
    }

    const objects = [];
    const jsonStream = createReadStream(tempFilePath);
    const parser = JSONStream.parse('data.*');
    const transformStream = new Transform({
        objectMode: true,
        transform(data, enc, cb) {
            //console.log(data);
            objects.push(data);
            console.log(`Número actual de objetos procesados: ${objects.length}`);
            cb();
        }
    });

    jsonStream.on('error', error => console.error('Error in jsonStream:', error));
    parser.on('error', error => console.error('Error in parser:', error));
    transformStream.on('error', error => console.error('Error in transformStream:', error));

    // Usando pipe() en lugar de pipeline()
    return new Promise((resolve, reject) => {
        jsonStream.pipe(parser).pipe(transformStream)
            .on('finish', () => {
                console.log('Todos los datos han sido procesados exitosamente.');
                console.log(`Total de objetos procesados: ${objects.length}`);
                resolve(objects);
            })
            .on('error', (error) => {
                console.error('Pipeline failed:', error);
                console.error(`Se procesaron un total de ${objects.length} objetos antes de fallar.`);
                reject(error);
            });
    });
}


const getWindMapData = async (req, res) => {
    try {
        // Obtener los parámetros de entrada desde la solicitud
        const { lat, lng, z } = req.body;
        console.log(req.body);

        // Hacer la solicitud al mapa eólico ibérico
        const response = await axios.post(`${globalConfig.pythonURL}/windmap`, {
            lat: lat,
            lon: lng,
            z: z
        });

        // Verificar si la solicitud fue exitosa
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos del mapa eólico ibérico.');
        }

        // Extraer los datos del mapa eólico ibérico
        const windMapData = response.data;

        // Direcciones del viento
        const windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        // Alturas del viento
        const windHeights = ['0-3', '3-6', '6-9', '9-12', '12-15', '15-18', '> 18'];

        // Crear un nuevo array con los datos formateados
        const chartData: { angle: string; total: number }[] = windDirections.map((direction, dirIndex) => {
            const directionData = { angle: direction, total: 0 };
        
            windHeights.forEach((height, heightIndex) => {
                const value = parseFloat(windMapData.wind_rose.data.yhist2[heightIndex][dirIndex]) || 0;
                directionData[height] = value;
                directionData.total += value;
            });
        
            return directionData;
        });

        // Actualizar el objeto windMapData
        const windMapDataUpdated = {
            ...windMapData,
            wind_rose: {
                ...windMapData.wind_rose,
                data: {
                    ...windMapData.wind_rose.data,
                    chartData: chartData
                }
            }
        };

        console.log(windMapDataUpdated);

        // Enviar los datos al frontend
        return res.status(200).json(windMapDataUpdated);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
};



const getExclusionMapData = async (req: Request, res: Response) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${globalConfig.pythonURL}/exclusionmap/zip`,
            responseType: 'arraybuffer'  // Important to handle binary data correctly
        });

        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos del mapa de exclusión eólica.');
        }

        const exclusionMapData = await processZip(response);


        return res.status(200).json(exclusionMapData);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
};


// };
export { getWindMapData, getExclusionMapData, getExclusionMapDataStreaming, addFact };