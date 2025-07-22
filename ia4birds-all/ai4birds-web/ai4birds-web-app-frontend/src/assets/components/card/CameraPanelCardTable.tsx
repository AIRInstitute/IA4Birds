import { useEffect, useRef } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import Hls from "hls.js";
import { RxTrash } from "react-icons/rx";
import { Tabs, Tab } from "@nextui-org/tabs";

export const CustomCardCameraTable = ({ cameraPanelData, onDelete }) => {
    const handleDeleteClick = () => {
        if (onDelete && cameraPanelData.id) {
            onDelete(cameraPanelData.id, cameraPanelData.name);
        }
    };

    const detectionData = [
        {
            frame: "00:01:23",
            idAve: "AVE001",
            coordenadas: "X: 245, Y: 180",
            area: "45.2 px²",
            especieProbable: "Cardenal Rojo",
            confianza: "87.3%"
        },
        {
            frame: "00:02:15",
            idAve: "AVE002",
            coordenadas: "X: 320, Y: 220",
            area: "62.8 px²",
            especieProbable: "Gorrión Común",
            confianza: "92.1%"
        },
        {
            frame: "00:03:42",
            idAve: "AVE003",
            coordenadas: "X: 180, Y: 150",
            area: "38.5 px²",
            especieProbable: "Petirrojo",
            confianza: "79.6%"
        }
    ];

    const speciesData = [
        {
            nombreComun: "Cardenal Rojo",
            nombreCientifico: "Cardinalis cardinalis",
            estadoConservacion: "Preocupación Menor",
            detecciones: 15
        },
        {
            nombreComun: "Gorrión Común",
            nombreCientifico: "Passer domesticus",
            estadoConservacion: "Preocupación Menor",
            detecciones: 8
        },
        {
            nombreComun: "Petirrojo",
            nombreCientifico: "Erithacus rubecula",
            estadoConservacion: "Preocupación Menor",
            detecciones: 3
        },
        {
            nombreComun: "Jilguero Europeo",
            nombreCientifico: "Carduelis carduelis",
            estadoConservacion: "Preocupación Menor",
            detecciones: 12
        },
        {
            nombreComun: "Mirlo Común",
            nombreCientifico: "Turdus merula",
            estadoConservacion: "Preocupación Menor",
            detecciones: 6
        }
    ];

    return (
        <Card className="py-4 mt-4">
            <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-large">Información Detallada de Especies</h4>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div>
                    <Tabs

                        className="mb-6"
                    >
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
                                            <TableCell>{item.especieProbable}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${parseFloat(item.confianza) > 85
                                                        ? 'bg-green-100 text-green-800'
                                                        : parseFloat(item.confianza) > 70
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.confianza}
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
                                    <TableColumn>Nombre Común</TableColumn>
                                    <TableColumn>Nombre Científico</TableColumn>
                                    <TableColumn>Estado de Conservación</TableColumn>
                                    <TableColumn>Detecciones</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {speciesData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.nombreComun}</TableCell>
                                            <TableCell className="italic">{item.nombreCientifico}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                    {item.estadoConservacion}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                    <span className="font-semibold text-blue-600">
                                                        {item.detecciones}
                                                    </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Tab>
                        <Tab title="Estadísticas">

                        </Tab>

                    </Tabs>
                </div>
            </CardBody>
        </Card>
    );
};
