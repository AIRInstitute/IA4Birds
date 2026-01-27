import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import Hls from "hls.js";
import { RxTrash, RxMagnifyingGlass, RxZoomIn, RxZoomOut, RxReset } from "react-icons/rx";
import heatmapImage from "../../images/heatmap.png";
import BirdCoordinateService from "../services/BirdCoordinateService";

interface HeatmapMetadata {
  heatmap_for: string;
  generated_at: string;
}

export const CustomCardCameraHeatMap = ({ cameraPanelData, onDelete }) => {
  const [heatmapImageUrl, setHeatmapImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [heatmapMetadata, setHeatmapMetadata] = useState<HeatmapMetadata | null>(null);

  const handleDeleteClick = () => {
    if (onDelete && cameraPanelData.id) {
      onDelete(cameraPanelData.id, cameraPanelData.name);
    }
  };

  // Aqui obtengo url de back para el heatmap
  const fetchHeatmap = async () => {
    const cameraId = cameraPanelData?.camera_id; 
    if (!cameraId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      //const response = await fetch(`/api/cameras/${cameraPanelData.id}/heatmap`);
      const resp = await BirdCoordinateService.getHeatmapData(cameraId)

      const heatmapData = resp?.heatmap_data;

      if (!heatmapData?.image_url) {
        setError("No se encontró la imagen del mapa de calor");
        setHeatmapImageUrl(null);
        return;
      }

      console.log("heatmap Data:", heatmapData); 
  
      setHeatmapMetadata(heatmapData);
      setHeatmapImageUrl(heatmapData.image_url);
      
      
    } catch (error) {
      console.error("Error fetching heatmap:", error);
      setError("No se pudo cargar el mapa de calor");
      setHeatmapImageUrl(null);

    } finally {
      setIsLoading(false);
    }
  };

  // Esto es para cargar el heatmap cuando cambie la cámara en la que estoy
  useEffect(() => {
    fetchHeatmap();
    
    return () => {
      if (heatmapImageUrl && heatmapImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(heatmapImageUrl);
      }
    };
  }, [cameraPanelData?.camera_id]);

  const handleRefresh = () => {
    fetchHeatmap();
  };

  // Funciones para la lupa/zoom del modal
  const openModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className="py-4 mt-4 mb-20">
      <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-large">Mapa de Calor</h4>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="p-4">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-2 text-gray-500">Cargando mapa de calor...</p>
              </div>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2">Error: {error}</p>
                <Button size="sm" color="primary" onClick={handleRefresh}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}
          
          {heatmapImageUrl && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <div className="relative group">
                <img 
                  src={heatmapImageUrl} 
                  alt={`Mapa de calor para ${cameraPanelData.name}`}
                  className="max-w-md h-auto rounded-lg shadow-md cursor-pointer"
                  onError={() => setError("Error al cargar la imagen del heatmap")}
                  onClick={openModal}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <Button
                    isIconOnly
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    color="primary"
                    variant="shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal();
                    }}
                  >
                    <RxMagnifyingGlass size={20} />
                  </Button>
                </div>
              </div>
              {heatmapMetadata && (
                <div className="mt-4 text-sm text-gray-600 text-center max-w-md">
                  <p><strong>Descripción:</strong> {heatmapMetadata.heatmap_for}</p>
                  <p><strong>Última generación:</strong> {(() => {
                      const date = new Date(heatmapMetadata.generated_at);
                      date.setHours(date.getHours() + 1);
                      return date.toLocaleString();
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!heatmapImageUrl && !isLoading && !error && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No hay datos de mapa de calor disponibles</p>
            </div>
          )}
        </div>
      </CardBody>

      {/* Modal con funcionalidad de zoom */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        size="5xl"
        classNames={{
          body: "p-0",
          base: "bg-transparent shadow-none",
          backdrop: "bg-black/80"
        }}
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center bg-white rounded-t-lg">
            <h3 className="text-lg font-semibold">Mapa de Calor - {cameraPanelData.name}</h3>
            <div className="flex gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <RxZoomOut size={16} />
              </Button>
              <span className="text-sm self-center min-w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
              >
                <RxZoomIn size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={resetZoom}
              >
                <RxReset size={16} />
              </Button>
            </div>
          </ModalHeader>
          <ModalBody 
            className="bg-gray-100 overflow-hidden"
            style={{ height: '70vh' }}
          >
            <div 
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={heatmapImageUrl || ""}
                alt={`Mapa de calor ampliado para ${cameraPanelData.name}`}
                className="max-w-none select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                draggable={false}
              />
            </div>
          </ModalBody>
          <ModalFooter className="bg-white rounded-b-lg">
            <div className="flex justify-between items-center w-full">
              <p className="text-sm text-gray-600">
                Usa los controles de zoom o arrastra la imagen para explorar
              </p>
              <Button color="primary" onPress={closeModal}>
                Cerrar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
