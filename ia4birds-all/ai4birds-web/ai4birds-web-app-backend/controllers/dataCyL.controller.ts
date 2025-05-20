import axios from 'axios';
import express from 'express';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';
import redis from '../config/redis.config';

const getXenoCantoRecordings = async (req, res) => {
    try {
        const token = req.headers["x-access-token"] as string;

        if (!token) {
        return res.status(403).json({ error: "Token no proporcionado" });
        }

        // Hacer la solicitud al servidor Python para obtener las grabaciones
        const response = await axios.get(`${globalConfig.pythonURL}/xenocanto`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Verificar si la solicitud fue exitosa
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener las grabaciones de Xenocanto.');
        }

        // Extraer los datos de las grabaciones de la respuesta
        const recordings = response.data;

        // Enviar las grabaciones al frontend
        return res.status(200).json(recordings);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
};

const getEBirdData = async (req, res) => {
    try {
        const token = req.headers["x-access-token"] as string;

        if (!token) {
        return res.status(403).json({ error: "Token no proporcionado" });
        }
        
        console.log("Calling:", `${globalConfig.pythonURL}/ebird`);
        console.log("TOKEN:", token);
        // Hacer la solicitud al servidor Python para obtener los datos de avistamientos de aves
        const response = await axios.get(`${globalConfig.pythonURL}/ebird`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Verificar si la solicitud fue exitosa
        if (response.status !== 200) {
            throw new Error('No se pudieron obtener los datos de avistamientos de aves de eBird.');
        }

        // Extraer los datos de las coordenadas de la respuesta
        const coordinates = response.data;

        // Enviar las coordenadas al frontend
        return res.status(200).json(coordinates);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            console.error("AXIOS ERROR:", err.response?.status, err.response?.data);
        } else {
            console.error("GENERAL ERROR:", err.message);
        }
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }

};

const getDataBird = async (req, res) => {
    try {
        const cachedData = await redis.get('dataBirdKey');
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            const dataBirdResponse = await axios.get(`${globalConfig.pythonURL}/dataBird`);

            if (dataBirdResponse.status !== 200) {
                throw new Error('No se pudieron obtener los datos necesarios.');
            }

            const dataBirdData = dataBirdResponse.data;
            await redis.set('dataBirdKey', JSON.stringify(dataBirdData));

            return res.status(200).json(dataBirdData);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
};

const getSensitivityData = async (req, res) => {
    try {

        const token = req.headers["x-access-token"] as string;

        if (!token) {
        return res.status(403).json({ error: "Token no proporcionado" });
        }

        // Hacer la solicitud al servidor Python para obtener los datos de sensibilidad
        const sesitivityResponse = await axios.get(`${globalConfig.pythonURL}/sensitivity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        

        // Verificar si la solicitud fue exitosa
        if (sesitivityResponse.status !== 200) {
            throw new Error('No se pudieron obtener los datos de sensibilidad.');
        }

        // Extraer los datos de sensibilidad de la respuesta
        const sensitivity = sesitivityResponse.data;

        // Enviar los datos de sensibilidad al frontend
        return res.status(200).json(sensitivity);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: globalMessages[500].INTERNAL_SERVER_ERROR,
        });
    }
}

export { getXenoCantoRecordings, getEBirdData, getDataBird, getSensitivityData };