import api from "./main";
import { getToken } from "@/utils/utils";

class BirdCoordinateService {

  async getSegmentData(cameraId: string) {
    const response = await api.get(`/data-camera/coordinate/segment-data`, {
      params: { camera_id: cameraId },
      headers: {
        "x-access-token": getToken(),
      }
    });
    return response.data;
  }

  async getBirdStatistics(cameraId: string) {
    const response = await api.get(`/data-camera/coordinate/bird-statistics`, {
      params: { camera_id: cameraId },
      headers: {
        "x-access-token": getToken(),
      }
    });
    return response.data;
  }

  async getHeatmapData(cameraId: string) {
    const response = await api.get(`/data-camera/coordinate/heatmap-data`, {
      params: { camera_id: cameraId },
      headers: {
        "x-access-token": getToken(),
      }
    });
    return response.data;
  }

}

export default new BirdCoordinateService();
