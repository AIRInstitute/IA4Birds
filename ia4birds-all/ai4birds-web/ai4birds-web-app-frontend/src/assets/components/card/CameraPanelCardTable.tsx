import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Tabs, Tab } from "@nextui-org/tabs";
import BirdCoordinateService from "../services/BirdCoordinateService";

export const CustomCardCameraTable = ({ cameraPanelData, onDelete }) => {
    const [segmentData, setSegmentData] = useState<SegmentData | null>(null);
    const [speciesStats, setSpeciesStats] = useState([]);
    const isMainCamera = cameraPanelData?.camera_id === "AXIS_Q6225-LE_PTZ";

    type Detection = {
        id_ave: number;
        area: number;
        coordenadas: [number, number, number, number];
        distances?: Record<string, [number, number]>;
     };

    type SegmentData = {
        frames: Record<string, Detection[]>;
    };

    type ParsedDetection = {
        frame: string;
        idAve: string;
        coordenadas: string;
        area: string;
        especieProbable: string;
        confianza: string;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMainCamera) return;

            try {
                const segment = await BirdCoordinateService.getSegmentData(cameraPanelData.camera_id);
                const stats = await BirdCoordinateService.getBirdStatistics(cameraPanelData.camera_id);

                console.log("Segment Data:", segment); 
                console.log("Bird Statistics:", stats);

                setSegmentData(segment.segment_data); // segment_data
                setSpeciesStats(stats);  // camera_statistics
            } catch (error) {
                console.error("Error cargando datos de cámara:", error);
            }
        };

        fetchData();
    }, [cameraPanelData.camera_id, isMainCamera]);

    const parseDetections = (frames: SegmentData["frames"]): ParsedDetection[] => {
        if (!frames) return [];

        console.log("Raw frames received in parseDetections:", frames);


        return Object.entries(frames).flatMap(([frameNumber, detections]) => {
            if (!Array.isArray(detections)) return [];

            return detections.map((detection) => {
                console.log(`Parsing detection in frame ${frameNumber}:`, detection);
                const distances = detection.distances || {};
                const speciesEntries = Object.entries(distances);

                let probableSpecies = "Desconocida";
                let confianza = "0";

                if (speciesEntries.length > 0) {
                    const [bestSpecies] = speciesEntries.reduce((best, current) =>
                    current[1][0] < best[1][0] ? current : best
                    );

                    const bestDistance = Math.min(
                    ...speciesEntries.map(([_, values]) => values[0])
                    );

                    probableSpecies = bestSpecies.replace(/_/g, " ");
                    confianza = (100 - bestDistance).toFixed(1);
                }

                const parsed = {
                    frame: frameNumber,
                    idAve: `AVE${String(detection.id_ave).padStart(3, "0")}`,
                    coordenadas: `X1: ${Math.round(detection.coordenadas[0])}, Y1: ${Math.round(detection.coordenadas[1])}`,
                    area: `${detection.area.toFixed(1)} px²`,
                    especieProbable: probableSpecies,
                    confianza,
                };

                console.log("Parsed detection:", parsed);

                return parsed;
            });
        });
    };
    console.log("Llamando a parseDetections con frames:", segmentData?.frames);
    const detectionData = segmentData ? parseDetections(segmentData.frames) : [];
    console.log("detectionData:", detectionData);


    if (!isMainCamera) return null;

    return (
        <Card className="py-4 mt-4">
            <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-large">Información Detallada de Especies</h4>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div>
                    <Tabs className="mb-6">
                        <Tab title="Detecciones">
                            <Table aria-label="Tabla de detecciones de aves">
                                <TableHeader>
                                    <TableColumn>Frame</TableColumn>
                                    <TableColumn>ID Ave</TableColumn>
                                    <TableColumn>Coordenadas</TableColumn>
                                    <TableColumn>Área</TableColumn>
                                    <TableColumn>Especie Probable</TableColumn>
                                    <TableColumn>Confianza</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {detectionData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.frame}</TableCell>
                                            <TableCell>{item.idAve}</TableCell>
                                            <TableCell>{item.coordenadas}</TableCell>
                                            <TableCell>{item.area}</TableCell>
                                            <TableCell className="capitalize">{item.especieProbable}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        parseFloat(item.confianza) > 85
                                                            ? 'bg-green-100 text-green-800'
                                                            : parseFloat(item.confianza) > 70
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {item.confianza}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Tab>
                        <Tab title="Especies">
                            <Table aria-label="Tabla de especies detectadas">
                                <TableHeader>
                                    <TableColumn>Cámara</TableColumn>
                                    <TableColumn>Nombre Común</TableColumn>
                                    <TableColumn>Detecciones</TableColumn>
                                    <TableColumn>Última Detección</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(speciesStats?.camera_statistics) ? (
                                        speciesStats.camera_statistics.map((item, index) => (
                                            <TableRow key={index}>
                                            <TableCell>{item.camera_id}</TableCell>
                                            <TableCell>{item.bird_name}</TableCell>
                                            <TableCell>{item.count}</TableCell>
                                            <TableCell>{new Date(item.last_seen).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                        ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>Cargando estadísticas...</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Tab>
                    </Tabs>
                </div>
            </CardBody>
        </Card>
    );
};
