import api from "./main";
import { getToken } from "@/utils/utils";

class CameraService {
  async getAllCamera() {
    const response = await api.get("/camera");
    return response.data;
  }

  async getCameraById(id: number) {
    const response = await api.get(`/camera/${id}`);
    return response.data;
  }

  async insertCamera(cameraData: {
    name: string;
    source_url: string;
    location: string;
    source_type: string;
    status: string;
    latitude?: string;
    longitude?: string;
    storage_info?: string;
    additional_data?: string;
    is_public: boolean;
  }) {

    const response = await api.post("/camera", cameraData, {
      headers: {
        'x-access-token': getToken(),
      },
    });

    return response.data;
  }

  async getAccessibleCameras() {
    const response = await api.get("/camera/accessible", {
      headers: {
        "x-access-token": getToken(),
      },
    });
    return response.data;
  }

  async getPrivateCameras() {
    const response = await api.get("/camera/private", {
      headers: {
        "x-access-token": getToken(),
      },
    });
    return response.data;
  }

  async deleteCamera(id: number) {
    const response = await api.delete(`/camera/${id}`, {
      headers: {
        "x-access-token": getToken(),
      },
    });
    return response.data;
  }
}

export default new CameraService();
