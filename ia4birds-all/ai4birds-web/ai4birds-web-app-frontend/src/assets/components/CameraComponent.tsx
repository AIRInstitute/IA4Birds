import { Spacer } from "@nextui-org/spacer";
import { CustomCard } from "./card/CameraCard";
import XenocantoDataService from "./services/XenocantoDataService";
import { useEffect, useState } from "react";
import * as React from "react";
import { Link } from "react-router-dom";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Tabs, Tab } from "@nextui-org/react";

const CameraComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cameraName, setCameraName] = useState("");
    const [cameraLocation, setCameraLocation] = useState("");
    const [cameraUrl, setCameraUrl] = useState("");
    const [datosGPS, setDatosGPS] = useState({ latitude: "", longitude: "" });
    const [cameraStatus, setCameraStatus] = useState(false);
    const [storageInfo, setStorageInfo] = useState("");
    const isLoggedIn = localStorage.getItem('accessToken');
    const [additionalData, setAdditionalData] = useState("");
    const [activeTab, setActiveTab] = useState("externa");

    const resetForm = () => {
        setCameraName("");
        setCameraLocation("");
        setCameraUrl("");
        setDatosGPS({ latitude: "", longitude: "" });
        setCameraStatus(false);
        setStorageInfo("");
        setAdditionalData("");
    };

    const handleGPSChange = (name, value) => {
        setDatosGPS((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddCamera = () => {
        const newCameraData = { 
            name: cameraName, 
            location: cameraLocation, 
            url: cameraUrl, 
            gps: datosGPS, 
            status: cameraStatus, 
            storage: storageInfo, 
        };
        console.log("Datos de la nueva cámara:", newCameraData);
        setIsModalOpen(false);
        resetForm();
    };

    const camerasData = [
        { id: 1, name: "Cámara 1", location: "Edificio Air Institute", views: "273 visitas", url: "http://ia4birds-pre.der.usal.es:8083/hls/129d9c94-e321-4c69-b7b6-8dd7bd6d8d56/index.m3u8" },
        { id: 2, name: "Cámara 2", location: "No disponible", url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8" },
        { id: 3, name: "Cámara 3", location: "No disponible", url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8" },
        { id: 4, name: "Cámara 4", location: "No disponible", url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8" }
    ];

    useEffect(() => {
        console.log("Cargando CameraComponent...");
        getXenocantoData();
    }, []);

    const getXenocantoData = () => {
        XenocantoDataService.getXenocanto()
            .then((response) => {
                if (response.status === 200) {
                    console.log("Xenocanto Response", response.data);
                } else {
                    console.error("Error al obtener datos de Xenocanto", response.data);
                }
            })
            .catch((error) => console.error("Error en la petición Xenocanto:", error));
    };

    return (
        <div className="camera-component mx-6 my-6">
            <Spacer y={5} />
            <div className="flex flex-wrap justify-center gap-8">
                {camerasData.map((camera) => (
                    <React.Fragment key={camera.id}>
                        <Link to={`/camera-panel-component?camera=${camera.id}`}>
                            <div className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                                <CustomCard cameraData={camera} />
                            </div>
                        </Link>
                        <Spacer x={4} />
                    </React.Fragment>
                ))}
                {isLoggedIn && (
                    <>
                        <div
                            className="w-[424px] h-[300px] mt-3 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span className="text-gray-500 text-xl font-semibold">+ Añadir Cámara</span>
                        </div>
                    </>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                    {/* Renderizado dinámico del ModalHeader */}
                    <ModalHeader>
                        {activeTab === "externa" ? "Añadir cámara externa" : "Añadir cámara propia"}
                    </ModalHeader>
                    <ModalBody>
                        <Tabs
                            aria-label="Opciones de la Cámara"
                            className="justify-center"
                            selectedKey={activeTab} // Enlaza el estado de la tab activa
                            onSelectionChange={(key) => setActiveTab(String(key))} // Actualiza el estado al cambiar de tab
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
                                    <Input label="Latitud" value={datosGPS.latitude} onChange={(e) => handleGPSChange("latitude", e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <Input label="Longitud" value={datosGPS.longitude} onChange={(e) => handleGPSChange("longitude", e.target.value)} />
                                </div>
                                <div className="mb-4 flex items-center gap-4">
                                    <span>Estado Cámara:</span>
                                    <Switch
                                        isSelected={cameraStatus}
                                        onChange={(e) => setCameraStatus(e.target.checked)}
                                    />
                                    <p className="text-small text-default-500">{cameraStatus ? "Activa" : "Inactiva"}</p>
                                </div>
                                <div className="mb-4">
                                    <Input label="Datos de Almacenamiento" value={storageInfo} onChange={(e) => setStorageInfo(e.target.value)} />
                                </div>
                            </Tab>
                            <Tab key="otro" title="Propia">
                                <div className="mb-4">
                                    <Input
                                        label="Información Adicional"
                                        value={additionalData}
                                        onChange={(e) => setAdditionalData(e.target.value)}
                                        description="Introduce información adicional sobre la cámara."
                                    />
                                </div>
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