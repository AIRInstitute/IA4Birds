import { Request, Response } from "express";
import { Camera } from "../models/connection";
import globalConfig from "../config/global.config";

const fetch = require("node-fetch");

/**
 * Get all cameras
 * @returns {Camera[]} Array of all cameras
 */
const getAll = async (req: Request, res: Response) => {
  try {
    const cameras = await Camera.findAll();
    return res.json(cameras);
  } catch (error) {
    console.error("Error fetching cameras:", error);
    return res.status(500).send("Server error");
  }
};

/**
 * Get a camera by ID
 * @param {number} id ID of the camera
 * @returns {Camera} Camera data
 */
const getById = async (req: Request, res: Response) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });
    return res.json(camera);
  } catch (error) {
    console.error("Error fetching camera:", error);
    return res.status(500).send("Server error");
  }
};

/**
 * Create a new camera
 */
const create = async (req: Request, res: Response) => {
  const {
    name,
    source_url,
    location,
    source_type,
    status,
    latitude,
    longitude,
    storage_info,
    additional_data,
  } = req.body;

  try {
    const camera = await Camera.create({
      name,
      source_url,
      location,
      source_type,
      status,
      latitude,
      longitude,
      storage_info,
      additional_data,
    });

    const apiUrl = `${globalConfig.mediamtxApi}/v3/config/paths/add/${name}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}`,
      },
      body: JSON.stringify({ source: source_url }),
    });

    if (!response.ok) {
      console.error("MediaMTX error:", await response.text());
      return res.status(500).json({ error: "Failed to register camera with MediaMTX" });
    }

    const playback_url = `${globalConfig.streamBaseURL}/${name}/index.m3u8`;
    await camera.update({ playback_url });

    return res.status(201).json(camera);
  } catch (error) {
    console.error("Error creating camera:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update a camera by ID
 */
const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    source_url,
    location,
    source_type,
    status,
    latitude,
    longitude,
    storage_info,
    additional_data,
  } = req.body;

  try {
    const camera = await Camera.findByPk(id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });

    await camera.update({
      name,
      source_url,
      location,
      source_type,
      status,
      latitude,
      longitude,
      storage_info,
      additional_data,
    });

    return res.json(camera);
  } catch (error) {
    console.error("Error updating camera:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a camera by ID and remove its MediaMTX path
 */
const remove = async (req: Request, res: Response) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });

    // Eliminar path de MediaMTX
    const apiUrl = `${globalConfig.mediamtxApi}/v3/config/paths/remove/${camera.name}`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`MediaMTX delete warning: ${errorText}`);
    }

    // Eliminar de base de datos
    await camera.destroy();

    return res.json({ message: "Camera and MediaMTX path deleted" });
  } catch (error) {
    console.error("Error deleting camera:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export default { getAll, getById, create, update, remove };
