import axios from 'axios';
import express from 'express';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';

const getWindMapData = async (req, res) => {
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


const getExclusionMapData = async (req, res) => {
    try {
        // Hacer la solicitud al servicio WFS del idecyl
        const response = await axios.get(globalConfig.pythonURL + '/exclusionmap');

        // Verificar si la solicitud fue exitosa
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos del mapa de exclusión eólica del idecyl.');
        }

        // Extraer el archivo SHP y cualquier otra información relevante de la respuesta
        const exclusionMapData = response.data;


        // // Convertir el objeto a una cadena JSON
        // const jsonData = JSON.stringify({ exclusionMapData });

        // // Enviar los datos al frontend
        // res.setHeader('Content-Type', 'application/json');
        // res.end(jsonData);
        // Enviar los datos al frontend
        return res.status(200).send(exclusionMapData);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
};

export { getWindMapData, getExclusionMapData };