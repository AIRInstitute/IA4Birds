import axios from 'axios';
import { Request, Response } from 'express';
import globalMessages from '../utils/messages/global.messages';
import redis from '../config/redis.config';
import globalConfig from '../config/global.config';

const getCameraIdFromQuery = (req: Request): string => {
  const cameraId = req.query.camera_id as string;
  if (!cameraId) throw new Error("Parámetro 'camera_id' requerido en la query.");
  return cameraId;
};

const getTokenFromHeader = (req: Request): string => {
  const token = req.headers['x-access-token'] as string;
  if (!token) throw new Error("Token de acceso no proporcionado en 'x-access-token'.");
  return token;
};

export const getSegmentData = async (req: Request, res: Response) => {
  try {
    const cameraId = getCameraIdFromQuery(req);
    const token = getTokenFromHeader(req);
    const cacheKey = `coordinate_segment_data_${cameraId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const url = `${globalConfig.pythonURL}/coordinate/segment-data?camera_id=${cameraId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Segment Data Response:", JSON.stringify(response.data, null, 2));

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 3600);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting segment data:", error);
    return res.status(500).json({ message: globalMessages[500].INTERNAL_SERVER_ERROR });
  }
};

export const getBirdStatistics = async (req: Request, res: Response) => {
  try {
    const cameraId = getCameraIdFromQuery(req);
    const token = getTokenFromHeader(req);
    const cacheKey = `coordinate_bird_statistics_${cameraId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const url = `${globalConfig.pythonURL}/coordinate/bird-statistics/by-camera?camera_id=${cameraId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Bird Statistics Response:", JSON.stringify(response.data, null, 2));

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 3600);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting bird statistics:", error);
    return res.status(500).json({ message: globalMessages[500].INTERNAL_SERVER_ERROR });
  }
};

export const getHeatmapData = async (req: Request, res: Response) => {
  try {
    const cameraId = getCameraIdFromQuery(req);
    const token = getTokenFromHeader(req);
    const cacheKey = `coordinate_heatmap_data_${cameraId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const url = `${globalConfig.pythonURL}/coordinate/heatmap-data?camera_id=${cameraId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Heatmap Data Response:", JSON.stringify(response.data, null, 2));

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 3600);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting heatmap data:", error);
    return res.status(500).json({ message: globalMessages[500].INTERNAL_SERVER_ERROR });
  }
};
