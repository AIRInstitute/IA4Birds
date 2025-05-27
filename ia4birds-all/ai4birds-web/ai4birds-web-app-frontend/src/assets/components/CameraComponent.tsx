import { Spacer } from "@nextui-org/spacer";
import { Tooltip } from "@nextui-org/tooltip";
import { CustomCard } from "./card/CameraCard";
import { useEffect, useState } from "react";
import * as React from "react";
import { Link } from "react-router-dom";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Switch, Tabs, Tab, Select, SelectItem
} from "@nextui-org/react";

import { RxQuestionMarkCircled } from "react-icons/rx";
import CameraService from "./services/CameraDataService";

// Definición del tipo Camera
type Camera = {
  id: number;
  name: string;
  source_url: string;
  source_type: "RTSP" | "RTMP" | "HLS" | "WebRTC" | "YouTube" | "Twitch" | "MJPEG" | "DASH" | "Other";
  location?: string;
  playback_url?: string;
  status: "active" | "inactive" | "pending";
  latitude?: string;
  longitude?: string;
  storage_info?: string;
  additional_data?: string;
};

const CameraComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cameraName, setCameraName] = useState("");
  const [cameraLocation, setCameraLocation] = useState("");
  const [cameraUrl, setCameraUrl] = useState("");
  const [cameraStatus, setCameraStatus] = useState<"active" | "inactive">("inactive");
  const [cameraAvailability, setCameraAvailability] = useState<"public" | "private">("private");
  const [cameraSourceType, setCameraSourceType] = useState("RTSP");
  const [datosGPS, setDatosGPS] = useState({ latitude: "", longitude: "" });
  const [storageInfo, setStorageInfo] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [activeTab, setActiveTab] = useState("externa");
  const [camerasData, setCamerasData] = useState<Camera[]>([]);
  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await CameraService.getAllCamera();
        setCamerasData(data);
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    };
    fetchCameras();
  }, []);

  const handleGPSChange = (name: string, value: string) => {
    setDatosGPS((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setCameraName("");
    setCameraLocation("");
    setCameraUrl("");
    setCameraSourceType("RTSP");
    setDatosGPS({ latitude: "", longitude: "" });
    setCameraStatus("inactive");
    setCameraAvailability("private");
    setStorageInfo("");
    setAdditionalData("");
  };

  const handleAddCamera = async () => {
    const newCameraData = {
      name: cameraName,
      source_url: cameraUrl,
      location: cameraLocation,
      source_type: cameraSourceType,
      status: cameraStatus,
      latitude: datosGPS.latitude,
      longitude: datosGPS.longitude,
      storage_info: storageInfo,
      additional_data: additionalData,
      availability: cameraAvailability,
    };

    console.log("Datos de la nueva cámara:", newCameraData);

    try {
      const createdCamera = await CameraService.insertCamera(newCameraData);
      console.log("Camera created:", createdCamera);

      // Actualiza la lista sin recargar
      setCamerasData((prev) => [...prev, createdCamera]);

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error inserting camera:", error);
    }
  };

  return (
    <div className="camera-component mx-6 my-6">
      <Spacer y={5} />
      <div className="flex flex-wrap justify-center gap-8">
        {camerasData.map((camera: any) => (
          <React.Fragment key={camera.id}>
            <Link to={`/camera-panel-component?camera=${camera.id}`}>
              <div className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <CustomCard
                  cameraData={{
                    id: camera.id,
                    name: camera.name,
                    location: camera.location || "Desconocida",
                    views: "N/A",
                    url: camera.playback_url,
                  }}
                />
              </div>
            </Link>
            <Spacer x={4} />
          </React.Fragment>
        ))}
        {isLoggedIn && (
          <div
            className="w-[424px] h-[300px] mt-3 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 text-xl font-semibold">+ Añadir Cámara</span>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            {activeTab === "externa" ? "Añadir cámara externa" : "Añadir cámara propia"}
          </ModalHeader>
          <ModalBody>
            <Tabs
              aria-label="Opciones de la Cámara"
              className="justify-center"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(String(key))}
            >
              <Tab key="externa" title="Externa">
                <div className="mb-4">
                  <Input label="Nombre de la Cámara" value={cameraName} onChange={(e) => setCameraName(e.target.value)} />
                </div>
                <div className="mb-4">
                  <Input label="Ubicación" value={cameraLocation} onChange={(e) => setCameraLocation(e.target.value)} />
                </div>
                <div className="mb-4">
                  <Input label="URL de la Cámara" value={cameraUrl} onChange={(e) => setCameraUrl(e.target.value)} />
                </div>
                <div className="mb-4">
                  <Select label="Tipo de Fuente" value={cameraSourceType} onChange={(e) => setCameraSourceType(e.target.value)}>
                    <SelectItem key="RTSP" value="RTSP">RTSP</SelectItem>
                    <SelectItem key="RTMP" value="RTMP">RTMP</SelectItem>
                    <SelectItem key="HLS" value="HLS">HLS</SelectItem>
                    <SelectItem key="WebRTC" value="WebRTC">WebRTC</SelectItem>
                    <SelectItem key="YouTube" value="YouTube">YouTube</SelectItem>
                    <SelectItem key="Twitch" value="Twitch">Twitch</SelectItem>
                    <SelectItem key="MJPEG" value="MJPEG">MJPEG</SelectItem>
                    <SelectItem key="DASH" value="DASH">DASH</SelectItem>
                    <SelectItem key="Other" value="Other">Other</SelectItem>
                  </Select>
                </div>

                <div className="mb-4">
                  <Input label="Latitud" value={datosGPS.latitude} onChange={(e) => handleGPSChange("latitude", e.target.value)} />
                </div>

                <div className="mb-4">
                  <Input label="Longitud" value={datosGPS.longitude} onChange={(e) => handleGPSChange("longitude", e.target.value)} />
                </div>
              
                <div className="mb-4 flex items-center gap-4">
                  <span>Estado Cámara:</span>
                  <Switch
                    isSelected={cameraStatus === "active"}
                    onChange={(e) => setCameraStatus(e.target.checked ? "active" : "inactive")}
                  />
                  <p className="text-small text-default-500">{cameraStatus === "active" ? "Activa" : "Inactiva"}</p>
                </div>
                <div className="mb-4">
                  <Input label="Datos de Almacenamiento" value={storageInfo} onChange={(e) => setStorageInfo(e.target.value)} />
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <span>Visibilidad de la cámara:</span>
                  <Switch
                    isSelected={cameraAvailability === "public"}
                    onChange={(e) => setCameraAvailability(e.target.checked ? "public" : "private")}
                  />
                  <p className="text-small text-default-500">{cameraAvailability === "public" ? "Pública" : "Privada"}</p>
                  <Tooltip content="Si selecciona 'pública' la cámara será visible para todos los usuarios, en cambio, si selecciona 'privada' sólo será visible para usted.">
                    <span className="cursor-pointer text-lg text-gray-500 ml-auto">
                      <RxQuestionMarkCircled />
                    </span>
                  </Tooltip>
                </div>
              </Tab>
              <Tab key="otro" title="Propia">
                <Input
                  label="Información Adicional"
                  value={additionalData}
                  onChange={(e) => setAdditionalData(e.target.value)}
                  description="Introduce información adicional sobre la cámara."
                />
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Button onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancelar</Button>
            <Button color="primary" onClick={handleAddCamera}>Agregar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CameraComponent;