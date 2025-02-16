import { Spacer } from "@nextui-org/spacer";
import { CustomCard } from "./card/CameraCard";
import XenocantoDataService from "./services/XenocantoDataService";
import { useEffect } from "react";
import * as React from "react";
import { Link } from "react-router-dom"; // Importa Link

const CameraComponent = () => {
    // Lista de cámaras con enlaces HLS
    const camerasData = [
        {
            id: 1,
            name: "Cámara 1",
            location: "Edificio Air Institute",
            views: "273 views",
            url: import.meta.env.HLS_BASE_URL
            //url: "http://ia4birds-pre.der.usal.es:8083/hls/79866f8d-75fc-4167-9d45-dc36c58e9277/index.m3u8"
        },
        {
            id: 2,
            name: "Cámara 2",
            location: "No disponible",
            // views: "23 views",
            url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8"
        },
        {
            id: 3,
            name: "Cámara 3",
            location: "No disponible",
            // views: "35 views",
            url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8"
        },
        {
            id: 4,
            name: "Cámara 4",
            location: "No disponible",
            // views: "48 views",
            url: "http://ia4birds-pre.der.usal.es:8083/hls/4ed3e2f5-8d39-4d68-8033-d3bada5dbb71/index.m3u8"
        }
    ];

    useEffect(() => {
        console.log("Cargando CameraComponent...");
        getXenocantoData();
    }, []);

    const getXenocantoData = () => {
        XenocantoDataService.getXenocanto().then((response) => {
            if (response.status === 200) {
                console.log("Xenocanto Response", response.data);
            } else {
                console.error("Error al obtener datos de Xenocanto", response.data);
            }
        }).catch(error => console.error("Error en la petición Xenocanto:", error));
    };

    return (
        <div className="camera-component mx-6 my-6">
            <Spacer y={5} />
            <div className="flex flex-wrap justify-center gap-8"> {/* Aumenté el gap de 6 a 8 */}
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
            </div>
        </div>
    );
};

export default CameraComponent;
