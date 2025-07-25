import { Camera } from "../models/connection";
import globalConfig from "../config/global.config";
const fetch = require("node-fetch");

const insertDefaultCamera = async () => {
  const name = "camara_air";
  const source_url = "rtsp://root:Airinstitute00@10.189.0.88:10554/axis-media/media.amp";
  const location = "Air Institute";

  try {
    const existing = await Camera.findOne({ where: { name } });
    if (existing) {
      console.log("Default camera already exists in the database.");
      return;
    }

    const apiUrl = `${globalConfig.mediamtxApi}/v3/config/paths/add/${name}`;
    const mtxResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}`,
      },
      body: JSON.stringify({ source: source_url }),
    });

    if (!mtxResponse.ok) {
      const errorText = await mtxResponse.text();
      console.error("MediaMTX registration error:", errorText);
      return;
    }

    const playback_url = `${globalConfig.streamBaseURL}/${name}/index.m3u8`;

    // Insertar en la base de datos con los nuevos campos requeridos
    await Camera.create({
      name,
      source_type: "RTSP",
      source_url,
      location,
      status: "pending",
      playback_url,
      latitude: null,
      longitude: null,
      storage_info: null,
      additional_data: null,
      is_public: true,
      user_id: 1
    });

    console.log("Default camera registered in MediaMTX and database.");
  } catch (error) {
    console.error("Error during default camera initialization:", error);
  }
};

export default insertDefaultCamera;