import axios from 'axios';
import { Request, Response } from 'express';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';
import redis from '../config/redis.config';

type RequestWithSession = Request & {
  session: {
    id: number;
  };
};

/**
 * Get cached or fresh XenoCanto recordings from the Python backend
 * 
 * - Checks Redis for cached data (key: "xenocantoRecordings")
 * - If no cache is found, fetches data from the Python service at /xenocanto
 * - The request includes a Bearer token from the x-access-token header
 * - The result is cached for 1 hour (3600 seconds) in Redis
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON array of XenoCanto recordings
 */
const getXenoCantoRecordings = async (req: Request, res: Response) => {
  try {
    const session = (req as RequestWithSession).session;
    const userId = session?.id;

    const cacheKey = "xenocantoRecordings";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const token = req.headers["x-access-token"] as string;

    const response = await axios.get(`${globalConfig.pythonURL}/xenocanto`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("No se pudieron obtener las grabaciones de Xenocanto.");
    }

    const recordings = response.data;
    await redis.set(cacheKey, JSON.stringify(recordings), "EX", 3600);

    return res.status(200).json(recordings);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: globalMessages[500].INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Get cached or fresh eBird observation data from the Python backend
 * 
 * - Checks Redis for cached data (key: "ebirdData")
 * - If no cache is found, fetches data from the Python service at /ebird
 * - The request includes a Bearer token from the x-access-token header
 * - The result is cached for 1 hour (3600 seconds) in Redis
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON array of eBird observation data
 */
const getEBirdData = async (req: Request, res: Response) => {
  try {
    const session = (req as RequestWithSession).session;
    const userId = session?.id;

    const cacheKey = "ebirdData";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const token = req.headers["x-access-token"] as string;

    const response = await axios.get(`${globalConfig.pythonURL}/ebird`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("No se pudieron obtener los datos de avistamientos de aves de eBird.");
    }

    const coordinates = response.data;

    await redis.set(cacheKey, JSON.stringify(coordinates), "EX", 3600);

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

/**
 * Get cached or fresh dataBird dataset from the Python backend
 * 
 * - Checks Redis for cached data (key: "dataBirdKey")
 * - If no cache is found, fetches data from the Python service at /dataBird
 * - The result is cached in Redis (without explicit expiration)
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON object containing the dataBird dataset
 */
const getDataBird = async (req: Request, res: Response) => {
  try {
    const cachedData = await redis.get("dataBirdKey");

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const dataBirdResponse = await axios.get(`${globalConfig.pythonURL}/dataBird`);

    if (dataBirdResponse.status !== 200) {
      throw new Error("No se pudieron obtener los datos necesarios.");
    }

    const dataBirdData = dataBirdResponse.data;
    await redis.set("dataBirdKey", JSON.stringify(dataBirdData));

    return res.status(200).json(dataBirdData);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: globalMessages[500].INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Get cached or fresh sensitivity data from the Python backend
 * 
 * - Checks Redis for cached data (key: "sensitivityData")
 * - If no cache is found, fetches data from the Python service at /sensitivity
 * - The request includes a Bearer token from the x-access-token header
 * - The result is cached for 1 hour (3600 seconds) in Redis
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON object containing sensitivity data
 */
const getSensitivityData = async (req: Request, res: Response) => {
  try {
    const session = (req as RequestWithSession).session;
    const userId = session?.id;

    const cacheKey = "sensitivityData";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const token = req.headers["x-access-token"] as string;

    const response = await axios.get(`${globalConfig.pythonURL}/sensitivity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("No se pudieron obtener los datos de sensibilidad.");
    }

    const sensitivity = response.data;

    await redis.set(cacheKey, JSON.stringify(sensitivity), "EX", 3600);

    return res.status(200).json(sensitivity);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: globalMessages[500].INTERNAL_SERVER_ERROR,
    });
  }
};

export { getXenoCantoRecordings, getEBirdData, getDataBird, getSensitivityData };
