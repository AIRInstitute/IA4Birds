import { Request, Response } from "express";
import { Camera } from "../models/connection";
import fetch from "node-fetch";
import globalConfig from "../config/global.config";

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
 * @body {string} name Camera name
 * @body {string} source_url Stream source URL
 * @body {string} location Camera location
 * @returns {Camera} Created camera with playback URL
 */
const create = async (req: Request, res: Response) => {
  const { name, source_url, location } = req.body;

  try {
    const camera = await Camera.create({
      name,
      source_type: "RTSP",
      source_url,
      location,
      status: "pending",
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
 * @param {number} id Camera ID
 * @body {string} name Name
 * @body {string} source_url Source URL
 * @body {string} source_type Source type
 * @body {string} location Location
 * @body {string} status Status
 * @returns {Camera} Updated camera
 */
const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, source_url, source_type, location, status } = req.body;

  try {
    const camera = await Camera.findByPk(id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });

    await camera.update({ name, source_url, source_type, location, status });
    return res.json(camera);
  } catch (error) {
    console.error("Error updating camera:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a camera by ID
 * @param {number} id Camera ID
 * @returns {string} Deletion message
 */
const remove = async (req: Request, res: Response) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });
    await camera.destroy();
    return res.json({ message: "Camera deleted" });
  } catch (error) {
    console.error("Error deleting camera:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export default { getAll, getById, create, update, remove };
