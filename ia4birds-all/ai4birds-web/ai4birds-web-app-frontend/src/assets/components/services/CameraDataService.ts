import api from "./main";

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
  }) {
    const response = await api.post("/camera", cameraData);
    return response.data;
  }
}

export default new CameraService();
