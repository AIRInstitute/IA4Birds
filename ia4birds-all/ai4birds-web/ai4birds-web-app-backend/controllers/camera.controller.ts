import { Request, Response } from "express";
import { Camera } from "../models/connection";
import { Op } from "sequelize";
import globalConfig from "../config/global.config";

const fetch = require("node-fetch");

interface RequestWithSession extends Request {
  session: {
    id: number;
  };
}

/**
 * Get all cameras from the database
 * @param {Request} req - Request object
 * @param {Response} res - Response object
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
 * Get a camera by its ID
 * @param {Request} req - Request object with camera ID in req.params.id
 * @param {Response} res - Response object
 * @returns {Camera} Camera data or 404 if not found
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
 * Get all public cameras and private cameras owned by the current user
 * @param {RequestWithSession} req - Request object with session containing user ID
 * @param {Response} res - Response object
 * @returns {Camera[]} Array of cameras (public + user's private)
 */
const getVisibleCameras = async (req: RequestWithSession, res: Response) => {
  try {
    const userId = req.session?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cameras = await Camera.findAll({
      where: {
        [Op.or]: [
          { is_public: false },
          { user_id: userId },
        ],
      },
    });

    return res.json(cameras);
  } catch (error) {
    console.error("Error fetching visible cameras:", error);
    return res.status(500).send("Server error");
  }
};


/**
 * Get all private cameras owned by the current user
 * @param {RequestWithSession} req - Request object containing the session with the user ID
 * @param {Response} res - Response object
 * @returns {Promise<Response>} JSON response with an array of the user's private cameras
 */

const getUserPrivateCameras = async (req: RequestWithSession, res: Response) => {
  try {
    const userId = req.session?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cameras = await Camera.findAll({
      where: {
        user_id: userId,
        is_public: false,
      },
    });

    return res.json(cameras);
  } catch (error) {
    console.error("Error fetching private cameras:", error);
    return res.status(500).send("Server error");
  }
};



/**
 * Create a new camera and register it in MediaMTX
 * @param {RequestWithSession} req - Request object with body and session.user_id
 * @param {Response} res - Response object
 * @returns {Camera} The newly created camera
 */
const create = async (req: RequestWithSession, res: Response) => {
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
    is_public = false,
  } = req.body;

  console.log("SESSION ID: ",req.session?.id)
  console.log("BODY: ",req.body)
  const userId = req.session?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: missing user session" });
  }

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
      user_id: userId,
      is_public,
    });

    // MediaMTX config
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
 * Update a camera by its ID
 * @param {Request} req - Request object with camera ID in req.params.id and updated fields in body
 * @param {Response} res - Response object
 * @returns {Camera} Updated camera data or 404 if not found
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
 * Delete a camera by its ID and remove its MediaMTX path
 * @param {Request} req - Request object with camera ID in req.params.id
 * @param {Response} res - Response object
 * @returns {Object} Message indicating deletion success or 404 if not found
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

export default { getAll, getById, getVisibleCameras, getUserPrivateCameras, create, update, remove };
