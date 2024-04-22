import axios from 'axios';
import express, { Request, Response } from 'express';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';
import AdmZip from 'adm-zip';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import JSONStream from 'JSONStream';
import { Transform } from 'stream';
import path from 'path';
import { tmpdir } from 'os';

// Utilidad para descargar y procesar el archivo ZIP
async function processZip(response: any): Promise<any[]> {
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();

    const jsonDataEntry = zipEntries.find((entry: any) => entry.entryName === 'data.json');
    if (!jsonDataEntry) {
        throw new Error('Archivo data.json no encontrado en el zip');
    }

    const tempDir = path.join(tmpdir(), 'temp');
    const tempFilePath = path.join(tempDir, 'data.json');
    zip.extractEntryTo(jsonDataEntry, tempDir, true, true);

    const objects: any[] = [];
    const jsonStream = createReadStream(tempFilePath);
    const parser = JSONStream.parse('*');
    await pipeline(
        jsonStream,
        parser,
        new Transform({
            objectMode: true,
            transform(data, enc, cb) {
                objects.push(data);
                cb();
            }
        })
    );

    return objects;
}

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

export { getWindMapData, getExclusionMapData };