import axios from 'axios';
import express, { Request, Response } from 'express';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';
import AdmZip from 'adm-zip';
import { createReadStream , existsSync} from 'fs';
import { pipeline } from 'stream/promises';
import JSONStream from 'JSONStream';
import { Transform } from 'stream';
import path from 'path';
import { tmpdir } from 'os';

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
    const jsonStream = fs.createReadStream(tempFilePath);
    const parser = JSONStream.parse('data.*');
    const transformStream = new Transform({
        objectMode: true,
        transform(data, enc, cb) {
            console.log(data);
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

// Utilidad para descargar y procesar el archivo ZIP
// async function processZip(response: any): Promise<any[]> {
//     const zip = new AdmZip(response.data);
//     const zipEntries = zip.getEntries();

//     const jsonDataEntry = zipEntries.find((entry: any) => entry.entryName === 'data.json');
//     if (!jsonDataEntry) {
//         throw new Error('Archivo data.json no encontrado en el zip');
//     }

//     const tempDir = path.join(tmpdir(), 'temp');
//     const tempFilePath = path.join(tempDir, 'data.json');
//     zip.extractEntryTo(jsonDataEntry, tempDir, true, true);

//     // Comprobar que el archivo existe después de la extracción
//     if (!existsSync(tempFilePath)) {
//         throw new Error(`El archivo ${tempFilePath} no se encuentra o no se extrajo correctamente.`);
//     }
//     const objects: any[] = [];
//     const jsonStream = createReadStream(tempFilePath);
//     const parser = JSONStream.parse('data.*');
//     const errorHandler = (err: Error) => {
//         console.error('Stream error:', err);
//         if (!jsonStream.destroyed) jsonStream.destroy(err);
//         if (!parser.destroyed) parser.destroy(err);
//     };

//     jsonStream.on('error', (err) => {
//         console.error('Error in jsonStream:', err);
//         // Asegúrate de limpiar adecuadamente
//         jsonStream.destroy(err);
//     });
    
//     parser.on('error', (err) => {
//         console.error('Error in parser:', err);
//         // Asegúrate de limpiar adecuadamente
//         parser.destroy(err);
//     });

//     const transformStream = new Transform({
//         objectMode: true,
//         transform(data, enc, cb) {
//             console.log(data);  // Muestra el objeto actual procesado.
//             objects.push(data);  // Añade el objeto al array.
//             console.log(`Número actual de objetos procesados: ${objects.length}`);  // Muestra cuántos objetos se han procesado.
//             cb();  // Continúa con el próximo objeto.
//         },
//         final(cb) {
//             console.log('Transformación completada');
//             console.log(`Total de objetos procesados: ${objects.length}`);  // Muestra el total de objetos procesados al final.
//             cb();
//         }
//     });

//     try {
//         await pipeline(
//             jsonStream,
//             parser,
//             transformStream
//         );
//         console.log('Todos los datos han sido procesados exitosamente.');
//     } catch (error) {
//         console.error('Pipeline failed:', error);
//         console.error(`Se procesaron un total de ${objects.length} objetos antes de fallar.`);  // Muestra cuántos objetos se procesaron antes del error.
//         throw error;  // Opcional: Puedes manejar el error de manera diferente si no deseas que se lance hacia arriba.
//     }

//     return objects;
// }

const getWindMapData = async (req:any, res:any) => {
    try {
        // Obtener los parámetros de entrada desde la solicitud
        const { lat, lon, z } = req.body;
        console.log(req.body)

        // Hacer la solicitud al mapa eólico ibérico
        const response = await axios.post(`${globalConfig.pythonURL}/windmap`, 
            {
                lat:lat,
                lon:lon,
                z:z
            }
        );

        // Verificar si la solicitud fue exitosa
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos del mapa eólico ibérico.');
        }

        // Extraer los datos del mapa eólico ibérico
        const windMapData = response.data;

        // Enviar los datos al frontend
        return res.status(200).json(windMapData);
    } catch (err) {
        // console.error(err);
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

// async function processZipAndSend(response: any, res: Response) {
//     const zip = new AdmZip(response.data);
//     const zipEntries = zip.getEntries();

//     const jsonDataEntry = zipEntries.find((entry: any) => entry.entryName === 'data.json');
//     if (!jsonDataEntry) {
//         throw new Error('Archivo data.json no encontrado en el zip');
//     }

//     const tempDir = path.join(tmpdir(), 'temp');
//     const tempFilePath = path.join(tempDir, 'data.json');
//     zip.extractEntryTo(jsonDataEntry, tempDir, true, true);

//     if (!existsSync(tempFilePath)) {
//         throw new Error(`El archivo ${tempFilePath} no se encuentra o no se extrajo correctamente.`);
//     }

//     const jsonStream = createReadStream(tempFilePath);
//     const parser = JSONStream.parse('data.*');

//     parser.on('data', (data) => {
//         // Enviar un evento SSE con los datos
//         res.write(`data: ${JSON.stringify(data)}\n\n`);
//     });

//     await pipeline(jsonStream, parser);

//     // Finalizar la respuesta SSE cuando se complete el stream
//     res.end();
// }

// const getExclusionMapData = async (req: Request, res: Response) => {
//     // Configuración de headers para SSE
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     try {
//         const response = await axios({
//             method: 'get',
//             url: `${globalConfig.pythonURL}/exclusionmap/zip`,
//             responseType: 'arraybuffer'
//         });

//         if (response.status !== 200) {
//             throw new Error('No se pudieron obtener los datos del mapa de exclusión eólica.');
//         }

//         // Enviar datos a medida que se procesan
//         await processZipAndSend(response, res);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Event Stream Closed');
//     }
// };



export { getWindMapData, getExclusionMapData };