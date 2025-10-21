import React, { useState, useEffect, useRef } from 'react';
import SidebarBirds from './sidebar/SidebarBirds';
import SidebarEolic from './sidebar/SideBarEolic';
import SideBarEolicResources from './sidebar/SideBarEolicResources';
import ExclusionEolicService from './services/ExclusionEolicService';
import BirdDataService from './services/BirdDataService';
import { MapContainer, TileLayer, WMSTileLayer, Circle, Marker, Popup, useMapEvents, GeoJSON, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Tooltip as TooltipNext } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { IconCrow } from '../components/icons/Icon';
import { TbCarFan } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { TbCarFan1 } from "react-icons/tb";
import { TbCarFan2 } from "react-icons/tb";
import L from 'leaflet';
import { GeoJsonObject } from 'geojson';
import toast, { Toaster } from 'react-hot-toast';
import {Switch} from "@nextui-org/react";
// import { ImageOverlay } from 'react-leaflet';
// import Image from '../images/ps-rn2k_cyl_zepa.png';

import castillaYLeonBorders from "../coordMap/CastillaYLeon.json";

type BirdMarker = {
  speciesCode: string;
  comName: string;
  spanishName: string;
  sciName: string;
  observations: { lat: number, lng: number }[];
  recordings: any[]; 
}

const Mapa = () => {
  const [showMarkersEolic, setShowMarkersEolic] = useState(false);
  const [showMarkersEolicResources, setShowMarkersEolicResources] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [switchSelected, setSwitchSelected] = useState(false);
  const [switchSelected2, setSwitchSelected2] = useState(false);
  const [selectedBirds, setSelectedBirds] = useState<string[]>([]);
  const [streamingEolicData, setstreamingEolicData] = useState(false);
  const [eolicMarkers, setEolicMarkers] = useState<{ coordenadas: L.LatLng[], espacio?: string }[]>([]);
  const [birdMarkers, setBirdsMarkers] = useState<BirdMarker[]>([]);
  const [eolicResourcesMarkers, setEolicResourcesMarkers] = useState<{ lat: number, lng: number }[]>([]);
  const [clickedLatLng, setClickedLatLng] = useState<L.LatLng | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [gridData, setGridData] = useState<GeoJsonObject | null>(null);

  const maxDistance = 10000;

  const birdData = [
    { id: 1, name: 'Ave 1', description: 'Descripción Ave 1', url: 'https://t2.ea.ltmcdn.com/es/posts/3/3/8/caracteristicas_de_las_aves_24833_orig.jpg', num: '12' },
    { id: 2, name: 'Ave 2', description: 'Descripción Ave 2', url: 'https://okdiario.com/img/2018/06/21/reproduccion-de-las-aves.jpg', num: '4' },
    { id: 3, name: 'Ave 3', description: 'Descripción Ave 3', url: 'https://www.nationalgeographic.com.es/medio/2022/12/13/muchuelo-alpino_8598e7e9_221213120701_1280x853.jpg', num: '40' },
  ];

  const birdList = [
    "Buitre negro",
    "Águila imperial ibérica",
    "Águila real",
    "Águila perdicera",
    "Alondra ricotí",
    "Cigüeña negra",
    "Aguilucho pálido",
    "Aguilucho cenizo",
    "Cernícalo primilla",
    "Grulla común",
    "Quebrantahuesos",
    "Buitre leonado",
    "Milano real",
    "Alimoche común",
    "Águila pescadora",
    "Urogallo común",
  ];

  const birdNameMap = {
    "Buitre negro": "Cinereous Vulture",
    "Águila imperial ibérica": "Spanish Eagle",
    "Águila real": "Golden Eagle",
    "Águila perdicera": "Bonelli's Eagle",
    "Alondra ricotí": "Common albatross",
    "Cigüeña negra": "Black Stork",
    "Cigüeña blanca": "White Stork",
    "Aguilucho pálido": "Hen Harrier",
    "Aguilucho cenizo": "Montagu's Harrier",
    "Cernícalo primilla": "Lesser Kestrel",
    "Grulla común": "Common crane",
    "Quebrantahuesos": "Bearded Vulture",
    "Buitre leonado": "Eurasian Griffon",
    "Milano real": "Red kite",
    "Alimoche común": "Egyptian Vulture",
    "Águila pescadora": "Osprey",
    "Urogallo común": "Common capercaillie",
  }

  // const bounds: [[number, number], [number, number]] = [
  //   [39.95, -7.20], // Esquina suroeste
  //   [43.40, -1.50]  // Esquina noreste
  // ];
  
  const filterOptions = [
    { id: 1, label: "1 mes", value: 1 },
    { id: 2, label: "3 meses", value: 3 },
    { id: 3, label: "6 meses", value: 6 },
    { id: 4, label: "12 meses", value: 12 }
  ];

  const coordinatesCameras = 
    [{"lat": 40.48648648648644, "lng": -3.860493503041469}, 
    {"lat": 40.216216216216196, "lng": -4.185270037209593}, 
    {"lat": 40.43243243243239, "lng": -3.427458124150637}, 
    {"lat": 42.18918918918899, "lng": -2.705732492665917}, 
    {"lat": 41.37837837837825, "lng": -3.968752347764177}, 
    {"lat": 40.05405405405405, "lng": -3.030509026834041}, 
    {"lat": 40.18918918918917, "lng": -3.319199279427929}, 
    {"lat": 42.891891891891625, "lng": -5.881325271198684}, 
    {"lat": 40.78378378378371, "lng": -4.365701445080773}, 
    {"lat": 40.64864864864859, "lng": -6.494792057960696}, 
    {"lat": 42.540540540540306, "lng": -5.628721300179032}, 
    {"lat": 42.648648648648404, "lng": -4.510046571377717}, 
    {"lat": 42.32432432432411, "lng": -3.030509026834041}, 
    {"lat": 40.324324324324294, "lng": -3.896579784615705}, 
    {"lat": 41.78378378378362, "lng": -6.242188086941044}, 
    {"lat": 40.59459459459454, "lng": -6.963913718425764}, 
    {"lat": 40.29729729729727, "lng": -6.025670397495628}, 
    {"lat": 42.891891891891625, "lng": -3.427458124150637}, 
    {"lat": 42.351351351351134, "lng": -6.63913718425764}, 
    {"lat": 42.648648648648404, "lng": -3.535716968873345}, 
    {"lat": 41.81081081081064, "lng": -4.329615163506537}, 
    {"lat": 41.27027027027015, "lng": -3.210940434705221},
    {"lat": 40.83783783783776, "lng": -5.773066426475976}, 
    {"lat": 40.567567567567515, "lng": -3.788320939892997}, 
    {"lat": 42.351351351351134, "lng": -4.401787726655009}, {"lat": 42.16216216216196, "lng": -2.994422745259805}, {"lat": 40.18918918918917, "lng": -6.025670397495628}, {"lat": 41.4324324324323, "lng": -3.571803250447581}, {"lat": 40.75675675675669, "lng": -2.850077618962861}, {"lat": 40.72972972972966, "lng": -4.113097474061121}, {"lat": 41.91891891891874, "lng": -4.690477979248897}, {"lat": 41.02702702702693, "lng": -5.592635018604796}, {"lat": 41.13513513513503, "lng": -2.994422745259805}, {"lat": 40.513513513513466, "lng": -3.571803250447581}, {"lat": 42.9729729729727, "lng": -5.3039447660109085}, {"lat": 42.540540540540306, "lng": -4.185270037209593}, {"lat": 40.75675675675669, "lng": -4.365701445080773}, {"lat": 41.162162162162055, "lng": -6.747396028980348}, {"lat": 40.94594594594586, "lng": -5.73698014490174}, {"lat": 42.67567567567543, "lng": -3.788320939892997}, {"lat": 42.81081081081055, "lng": -6.63913718425764}, {"lat": 42.32432432432411, "lng": -6.386533213237988}, {"lat": 41.756756756756594, "lng": -2.5974736479432092}, {"lat": 40.270270270270245, "lng": -4.473960289803481}, {"lat": 40.89189189189181, "lng": -3.752234658318761}, {"lat": 40.16216216216215, "lng": -3.896579784615705}, {"lat": 41.18918918918908, "lng": -4.149183755635357}, {"lat": 40.513513513513466, "lng": -4.690477979248897}, {"lat": 41.48648648648635, "lng": -2.5974736479432092}, {"lat": 42.648648648648404, "lng": -5.989584115921392}];

  const [sidebarBirdOpen, setSidebarBirdOpen] = useState(false);
  const [sidebarEolicOpen, setSidebarEolicOpen] = useState(false);
  const [sidebarEolicResourcesOpen, setSidebarEolicResourcesOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<L.LatLng[]>([]);
  const [selectedButtonEolicResources, setSelectedButtonEolicResources] = useState<{ lat: number, lng: number } | null>(null);
  const [selectedButtonBirds, setSelectedButtonBirds] = useState('');
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [dataBird, setDataBird] = useState([]);
  const [showGridLayer, setShowGridLayer] = useState(false);
  

  //SSE ServerSent Events
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  const notify = () => toast('Toca cualquier parte del mapa para ver los datos de la mesoescala');

  // Función para alternar la selección de una ave individual
  const toggleBirdSelection = (bird) => {
    const birdInSpanish = birdNameMap[bird] || bird;
    setSelectedBirds((prevSelected) => {
      const newSelectedBirds = prevSelected.includes(birdInSpanish)
        ? prevSelected.filter((b) => b !== birdInSpanish)
        : [...prevSelected, birdInSpanish];
      
      // Si no quedan aves seleccionadas, desactivamos el Switch de "Aves protegidas"
      if (newSelectedBirds.length === 0) {
        setSwitchSelected(false);
        // setSwitchSelected2(true); 
      }

      // Si se deselecciona cualquier ave, activamos el Switch de "Filtrar por aves específicas" y desactivamos el de "Aves protegidas"
      if (prevSelected.includes(bird)) {
        setSwitchSelected(false);
        setSwitchSelected2(true);
      }

      // Si todas las aves están seleccionadas, activamos el Switch de "Aves protegidas"
      if (newSelectedBirds.length === birdList.length) {
        setSwitchSelected(true); 
        setSwitchSelected2(false); 
      }

      return newSelectedBirds;
    });
  };

  // Función para seleccionar todas las aves
  const toggleAllBirdsSelection = (isSelected) => {
    if (isSelected) {
      setSelectedBirds(birdList); 
      setSwitchSelected(true); 
      setSwitchSelected2(false);
    } else {
      setSelectedBirds([]); 
      setSwitchSelected(false); 
      // setSwitchSelected2(true); 
    }
  };

   // Función para manejar el cambio en el Switch de "Aves protegidas"
   const handleProtectedSwitch = (isSelected) => {
    setSwitchSelected(isSelected);
    toggleAllBirdsSelection(isSelected);
  };

  // Función para manejar el cambio en el Switch de "Filtrar por aves específicas"
  const handleSpecificBirdSwitch = (isSelected) => {
    setSwitchSelected2(isSelected);

    if (isSelected) {
      setSwitchSelected(false);
      setSelectedBirds([]);
    }
  };

  // useEffect(() => {
  //   const fetchBirds = async () => {
  //     try {
  //       const response = await api.get("/birds");
  //       setDataBird(response.data);
  //     } catch (error) {
  //       console.error("Error fetching birds:", error);
  //     }
  //   };
  
  //   fetchBirds();
  // }, []);

  useEffect(() => {
   console.log('facts', facts)
   setEolicMarkers(facts);
   setMarkersLoaded(true);
  }, [facts]);

  useEffect(() => {
    fillBirdData();
  }, []);

  useEffect(() => {
    // Esta función se ejecutará cada vez que setEolicMarkers cambie
    setMarkersLoaded(true);
  }, [eolicMarkers]);

  useEffect(() => {
    fetch('/data/grid_cyl.geojson')
      .then(res => res.json())
      .then(data => {
        console.log("GeoJSON cargado:", data);
        setGridData(data);
      })
      .catch(err => {
        console.error("Error cargando el GeoJSON:", err);
      });
  }, []);


  //====================================================================
  //EOLIC MARKERS
  //Si activo la exclusión eólica llamo al endpoint si no vacío el array y pongo valor al array de aves
  //====================================================================


  const addEolicMarkers = () => {
    setMarkersLoaded(false);

    if (!showMarkersEolic) {
      setBirdsMarkers([]);
      setSidebarEolicOpen(false);
      //setEolicMarkers(coordinatesEolic);

      ExclusionEolicService.getExclusionMap().then((response) => {
        if (response.status === 200) {
          console.log('ExclusionEolicService.getExclusionMap() response ', response.data);
          //setEolicMarkers(response.data[0]);
          setEolicMarkers(response.data);
          console.log('EolicMarkers están en proceso de cargarse: ', eolicMarkers);
          //setMarkersLoaded(true);
        }
        else {
          setMarkersLoaded(true);
          throw new Error(response.data);
        }
      });
      setShowMarkersEolic(showMarkersEolic => !showMarkersEolic);
    }
    else {
      setSidebarEolicOpen(false)
      setEolicMarkers([]);
      fillBirdData();
      setShowMarkersEolic(showMarkersEolic => !showMarkersEolic);
    }
  };

  const addEolicMarkersStreamExclusion = () => {
    setMarkersLoaded(false);
    setstreamingEolicData(true);
    setBirdsMarkers([]);
    if(!showMarkersEolic){
      if (!listening) {
        //get a Node
        //const events = new EventSource('http://localhost:5030/api/data/exclusionmap/stream-exclusion-data');
        //const events = new EventSource('http://212.128.154.81:5030/api/data/exclusionmap/stream-exclusion-data');
        //const events = new EventSource(`http://${process.env.BACKEND_URL}/api/data/exclusionmap/stream-exclusion-data`);
        const events = new EventSource(`https://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_HTTP_PORT}/api/data/exclusionmap/stream-exclusion-data`);

        events.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);
          if(parsedData.message === 'Data streaming completed.') {
            setstreamingEolicData(false);  
          }else{
            setFacts((facts) => facts.concat(parsedData));
          }
  
          setShowMarkersEolic(true);
          setShowFilter(true);
  
        };
  
        setListening(true);
      }

    }else{
      setEolicMarkers([]);
      setShowMarkersEolic(false);
      setShowFilter(false);
      if(!showMarkersEolicResources && showMarkersEolic){
        fillBirdData();
      }
    }
  }

  const getNearbyEolicMarkers = (clickedPoint, allMarkers, maxDistance) => {
    console.log('SADFHSDAHFSDHFA MAXDISTANCE', maxDistance);
    // maxDistance = maxDistance ?? 10000;
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371000; // Radio de la Tierra en metros (6371 km)
  
    return allMarkers.filter((marker) => {
      if (!marker.coordenadas || marker.coordenadas.length === 0) return false;
  
      const [lat1, lon1] = clickedPoint; // Punto de referencia
      const [lat2, lon2] = marker.coordenadas[0]; // Punto a comparar
  
      // Convertir latitudes y longitudes a radianes
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distancia en metros
  
      return distance <= maxDistance;
    });
  };
  
//====================================================================
  //FILL EOLIC RESOURCES
  //====================================================================
  const addEolicMarkersResources = () => {
    
    if(!showMarkersEolicResources){
      notify();
      // setBirdsMarkers([]); // Vacío el array de aves para que aparezcan ocultas
      setShowFilter(true);
      //setEolicResourcesMarkers(coordinatesCameras);
      setShowMarkersEolicResources(true);

    } else{
      setSidebarEolicResourcesOpen(false);
      setEolicResourcesMarkers([]);
      setShowMarkersEolicResources(false);
      setShowFilter(false);
      if(!showMarkersEolic && showMarkersEolicResources){
        fillBirdData();
      }
    }
  }


  //====================================================================
  //FILL BIRD MARKERS
  //====================================================================
  const fillBirdData = () => {
    BirdDataService.getDataBird().then((response) => {
      setMarkersLoaded(true);
      if (response.status === 200) {
        console.log("bird Response", response.data)
        const updatedBirdMarkers = response.data.map((birdMarker) => {
          const spanishName = birdNameMap[birdMarker.comName] || birdMarker.comName;
          return {
            ...birdMarker,
            spanishName,
          };
        });
        setBirdsMarkers(updatedBirdMarkers);
      } else {
        throw new Error(response.data);
      }
    });
  };

  const handleFilter = (value: number) => {
    console.log(`Filter selected: ${value} months`);
    // Missing logic for the filter
    // Cuando exista el endpoint, se debe enviar el ${value} al backend
  };

  const handleButtonClickBirds = (button) => {
    setSelectedButtonBirds(button);
    setSidebarBirdOpen(true);
  };

  const handleCancelClickBirds = () => {
    setSidebarBirdOpen(false);
  };

  // Cambiando color de los círculos (Ongoing)
  // const handleCardClick = (coordenadas) => {
  //   setSelectedCircle(coordenadas);
  // };

  // const handleButtonClickEolic = (button) => {

  //   setSelectedButton(button);
  //   setSidebarEolicOpen(true);
  // };

  const handleButtonClickEolic = (clickedPoint) => {
    const nearbyEolicMarkers = getNearbyEolicMarkers(clickedPoint, eolicMarkers, maxDistance);
  
    setSelectedButton(nearbyEolicMarkers);
    setSidebarEolicOpen(true);

    if (nearbyEolicMarkers.length > 0) {
      setTooltipContent(`Zona de exclusión eólica: ${nearbyEolicMarkers.espacio}`);
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  };

  // const handleButtonClickEolic = (clickedPoint) => {
  //   setSidebarEolicOpen(true);
  
  //   const R = 6371; // Radio de la Tierra en km
  //   const maxDistance = 10; // 10 km
  
  //   const getDistance = (lat1, lon1, lat2, lon2) => {
  //     const dLat = ((lat2 - lat1) * Math.PI) / 180;
  //     const dLon = ((lon2 - lon1) * Math.PI) / 180;
  //     const a =
  //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //       Math.cos((lat1 * Math.PI) / 180) *
  //         Math.cos((lat2 * Math.PI) / 180) *
  //         Math.sin(dLon / 2) *
  //         Math.sin(dLon / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //     return R * c; // Distancia en km
  //   };
  
  //   // Filtrar los puntos dentro de 10 km
  //   const nearbyEolicMarkers = eolicMarkers.flatMap(({ coordenadas }) =>
  //     coordenadas.filter((point) => {
  //       const distance = getDistance(
  //         clickedPoint.lat,
  //         clickedPoint.lng,
  //         point.lat,
  //         point.lng
  //       );
  //       return distance <= maxDistance;
  //     })
  //   );
  
  //   console.log("Puntos dentro de 10km:", nearbyEolicMarkers);
    
  //   // Guardar los puntos filtrados en el estado
  //   setSelectedButton(nearbyEolicMarkers);
  // };
  

  const handleCancelClickEolic = () => {
    setSidebarEolicOpen(false);
  };

  const handleButtonClickEolicResources = (button) => {

    console.log('coordenadas del punto', button);
    setSelectedButtonEolicResources(button);
    setSidebarEolicResourcesOpen(true);
  };
  function LocationMarker() {

    if(showMarkersEolicResources){
      useMapEvents({
        click(e) {
          setClickedLatLng(e.latlng);
          console.log('Latitud y longitud', e.latlng);
          handleButtonClickEolicResources(e.latlng);
        }
      });
    }

    const defaultIcon = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
    
    return clickedLatLng === null ? null : (
      // <Marker position={clickedLatLng} icon={defaultIcon}>
      //   <Popup position={clickedLatLng} openOnClick={true}>
      //     Lat: {clickedLatLng.lat} <br/> Lng: {clickedLatLng.lng}
      //   </Popup>
      // </Marker>
      showMarkersEolicResources && (
        <Marker position={clickedLatLng} icon={defaultIcon}>
        <Popup position={clickedLatLng}>
          Lat: {clickedLatLng.lat} <br/> Lng: {clickedLatLng.lng}
        </Popup>
      </Marker>
      )
    );
  }
  return (
    <>
    <Toaster containerStyle={{top: 150,
    left: 20,
    bottom: 40,
    right: 20,
  }} 
    position="top-center" />
      <div className='map-component'>
        <div className='map-button' >
          <Card className='buttons opacity-90' >
            <CardBody className='butttons gap-3'>
              <p className="p-1 font-semibold">Capas</p>
              {/* <Tooltip placement="right" content="Capa de aves">
                <Button className='bird' isIconOnly color="primary" size='lg' onClick={addMarkersBirds}><FaCrow/></Button>
              </Tooltip> */}
              {/* <Tooltip  placement="right" content="Capa de cámaras">
                <Button className='camera'  isIconOnly color="primary" size='lg' onClick={addMarkersCameras}><FaCrow/></Button>
              </Tooltip>  */}


              {/*Botón de exclusion eólica*/}
               {/* <div className="flex items-center gap-2">
                <TooltipNext placement="right" content="Capa exclusión eólica">
                  <Button className='camera' disabled={streamingEolicData} color={!showMarkersEolic ? 'primary' : 'danger'} isIconOnly size='lg' onClick={addEolicMarkersStreamExclusion}>
                    <TbCarFan style={{ height: '25px', width: '25px' }} />
                  </Button>
                </TooltipNext>
                {showMarkersEolic && (
                  <FaCheck />
                )}
              </div> */}


              <div className="flex items-center gap-2">
                <TooltipNext placement="right" content="Capa recursos eólicos">
                  <Button className='camera' disabled={streamingEolicData} color={!showMarkersEolicResources ? 'primary' : 'danger'} isIconOnly size='lg' onClick={addEolicMarkersResources}>
                    <TbCarFan2 style={{ height: '25px', width: '25px' }} />
                  </Button>
                </TooltipNext>
                {showMarkersEolicResources && (
                  <div className="d-flex align-items-center gap-2">
                  <FaCheck />
                  
                </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TooltipNext placement="right" content="Capa cuadrícula mesoescalar">
                  <Button
                    className='camera'
                    isIconOnly
                    color={!showGridLayer ? 'primary' : 'danger'}
                    size='lg'
                    onClick={() => setShowGridLayer(!showGridLayer)}
                  >
                    <TbCarFan style={{ height: '25px', width: '25px' }} />
                  </Button>
                </TooltipNext>
                {showGridLayer && (
                  <FaCheck />
                )}
              </div>
            </CardBody>
          </Card>
        </div>
        {/* Comentado para la muestra (Es el filtro de meses pájaros) */}
        <div className={`fixed top-20 right-4 z-10 rounded-lg p-4 w-60 opacity-90`}>
          <Card className="p-1">
            <CardBody className="flex flex-col gap-3">
              <p className="text-lg font-semibold">Filtrar por tiempo</p>
              <select
                onChange={(e) => handleFilter(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* <div className="flex flex-col gap-2">
                <Switch
                  isSelected={switchSelected}
                  onValueChange={(isSelected) => {
                    setSwitchSelected(isSelected);
                    toggleAllBirdsSelection(isSelected); // Marcar todas las aves cuando se activa el switch
                  }}
                >
                  Aves protegidas
                </Switch>
              </div> */}
              <div className="flex flex-col gap-2">
                <Switch
                  isSelected={switchSelected}
                  onValueChange={handleProtectedSwitch}
                >
                  Aves protegidas
                </Switch>
              </div>

              <div className="flex flex-col gap-2">
                <Switch
                  isSelected={switchSelected2}
                  onValueChange={handleSpecificBirdSwitch}
                >
                  Filtrar por aves específicas
                </Switch>
              </div>
              {/* <div className="flex flex-col gap-2">
                <Switch isSelected={switchSelected2} onValueChange={setSwitchSelected2}>
                  Selección aves protegidas
                </Switch>
              </div> */}
            </CardBody>
          </Card>

          {/* Card flotante para aves específicas */}
          {(switchSelected2 || switchSelected) && (
            <div
              style={{
                position: "fixed",
                bottom: 70,
                left: 20,
                zIndex: 1000,
                background: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                width: "350px",
              }}
            >
              <p className="font-semibold">Selecciona las aves:</p>
              <div className="grid grid-cols-2 gap-2">
                {birdList.map((bird) => (
                  <label key={bird} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBirds.includes(bird)}
                      onChange={() => toggleBirdSelection(bird)}
                    />
                    {bird}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "fixed", bottom: 70, right: 20, zIndex: 10, fontSize: "12px" }}>
          {/* Botón para mostrar/ocultar leyenda */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {showLegend ? "❌ Cerrar leyenda" : "ℹ️ Leyenda"}
          </button>

          {/* Contenedor de la leyenda 1 */}
          {showLegend && !showGridLayer && (
            <div
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
                width: "150px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>Leyenda</p>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#FF6666",
                    borderRadius: "50%",
                    marginRight: "5px",
                  }}
                ></span>
                <span>Exclusión eólica</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="22px" style={{ marginRight: '5px' }} width="22px" xmlns="http://www.w3.org/2000/svg"><path d="M544 32h-16.36C513.04 12.68 490.09 0 464 0c-44.18 0-80 35.82-80 80v20.98L12.09 393.57A30.216 30.216 0 0 0 0 417.74c0 22.46 23.64 37.07 43.73 27.03L165.27 384h96.49l44.41 120.1c2.27 6.23 9.15 9.44 15.38 7.17l22.55-8.21c6.23-2.27 9.44-9.15 7.17-15.38L312.94 384H352c1.91 0 3.76-.23 5.66-.29l44.51 120.38c2.27 6.23 9.15 9.44 15.38 7.17l22.55-8.21c6.23-2.27 9.44-9.15 7.17-15.38l-41.24-111.53C485.74 352.8 544 279.26 544 192v-80l96-16c0-35.35-42.98-64-96-64zm-80 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path></svg>
                <span>Datos Xenocanto y eBird</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px", marginRight: "5px" }}>
                <img style={{ height: '22px', width: '22px', marginRight: '5px' }} src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"></img>
                <span>Datos de los recursos eólicos</span>
              </div>
            </div>
          )}
          {/* Contenedor de la leyenda 2 */}
          {showLegend && showGridLayer && (
            <div
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
                width: "150px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>Leyenda</p>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px", marginRight: "5px" }}>
                🟩
                <span>Disponible y viento favorable</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px", marginRight: "5px" }}>
                🟨
                <span>Disponible pero viento &lt;5.5 m/s</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "5px", marginRight: "5px" }}>
                🟥
                <span>No disponible ({'>'}25% solape con exclusión eólica)</span>
              </div>
            </div>
          )}
        </div>
        <div className='map'>
          <MapContainer
            center={[41.6528, -4.7281]}
            zoom={8.4}
            minZoom={5}
            maxZoom={16}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={castillaYLeonBorders as GeoJsonObject} style={{ color: 'black', weight: 1, fill: false }} />

            {/* {(showMarkersEolic || showMarkersEolicResources) &&( */}
            {(!showGridLayer || !gridData) &&(

              <WMSTileLayer 
                url="https://idecyl.jcyl.es/geoserver/er/wms"
                layers="enre_cyl_excl_eoli"
                format="image/png"
                transparent={true}
                version="1.3.0"
                className="hue-rotate-[10deg]"
              />
            )}

            <GeoJSON data={castillaYLeonBorders as GeoJsonObject} style={{ color: 'black', weight: 1, fill: false }} />

            {/* {(showMarkersEolic || showMarkersEolicResources) &&( */}
              {/* <WMSTileLayer 

                url="https://idecyl.jcyl.es/geoserver/ps/wms"
                layers="rn2k_cyl_zepa"
                format="image/png"
                transparent={true}
                version="1.3.0"

                className="hue-rotate-[5deg]"
              /> */}
            {/* )} */}

            {showGridLayer && gridData && (
              <GeoJSON
              data={gridData}
              style={(feature: any) => {
                const props = feature.properties || {};
                const coverage = props.coverage ?? 0;
                const viento = props.viento_medio ?? 0;

                let fillColor = "gray";
                if (coverage > 25) {
                  fillColor = "red";
                } else if (viento < 5.5) {
                  fillColor = "orange";
                } else {
                  fillColor = "green";
                }


                return {
                  fillColor,
                  color: "black",
                  weight: 0.3,
                  fillOpacity: 0.6,
                };
              }}
              onEachFeature={(feature, layer) => {
                const props = feature.properties || {};
                const especies = props.bird_species?.join(", ") || "[]";

                layer.bindTooltip(
                  `
                  FID: ${props.fid ?? "undefined"}<br/>
                  Viento medio: ${props.viento_medio?.toFixed(2) ?? "N/A"} m/s<br/>
                  WTG: ${props.wtg_count ?? 0}<br/>
                  Aves observadas: ${props.bird_count ?? 0}<br/>
                  Especies: ${especies}<br/>
                  Cobertura: ${props.coverage?.toFixed(2) ?? "N/A"}
                  `,
                  { sticky: true }
                );
              }}
            />
            )}
            
            {/* {showMarkersEolic && (
              <ImageOverlay
                url={Image}  // Ruta local de la imagen
                bounds={bounds}  // Especifica los límites geográficos
                opacity={0.7}  // Ajusta la opacidad si es necesario
              />
            )} */}
            
            {!markersLoaded ?
              <>
                <div className='blurredLayer'>
                </div>
                <div className="ajaxLoad">
                  <svg className='loader-bird'
                    x="0px" y="0px" viewBox="0 0 1498.2 1265.9" enableBackground="new 0 0 1498.2 1265.9" xmlSpace="preserve">
                    <g>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FF9900" d="M890.8,920c26,29.6,83.7,79,122,96.6c0,0-83,3.1-89.2,84.2
                      c108.6-148.5,240.7,17.2,185.2,97.9c69.1-48.2,18.3-126.4-6.7-147.9c0,0,69.9,45.4,63.1,117.8c53.4-132.4-119.4-144.6-228.9-261.6
                      C929.5,903.1,903.7,902.9,890.8,920L890.8,920z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#D4D4D4" d="M884.1,1010.5c0,0-129.8,67.6-254.3,33.1
                      c-80.9,40-206.1,85.8-343.1,124c-13.9-4.2-27.7-43.4-24.3-49.1c28.5-18.8,57.4-38.6,85.5-59C473,968.8,590.1,871.7,666.7,857.2
                      C751.4,841.2,849.9,950.5,884.1,1010.5L884.1,1010.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#00A6FF" d="M347.8,1059.6c68.2-49.3,232.5-206.6,290.6-245.4
                      c-16.2,176.1-206.7,306.7-351.8,353.4c-8.4-0.7-31.3-28.2-24.3-49.1C267.3,1115.7,331.3,1071.5,347.8,1059.6L347.8,1059.6z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M286.7,1167.6c-75.4,21.7-151.9,40.8-222.1,54.8c55.7-23.8,118.9-59,197.7-103.9
                      C273,1128.2,284.9,1153.8,286.7,1167.6L286.7,1167.6z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M1398.9,193.5c-65.1,68.2-69.6,85.3-51.9,143.9
                      c-251.9,10.5-206.4-240.1-184.1-278.6c28-19.9,136.2-42.9,210,18.6C1430.8,137.3,1401.7,161.4,1398.9,193.5L1398.9,193.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FF0800" d="M1338.1,294.9c-169.9-14.1-156.2-174.3-145-249.1
                      c44.4-16.2,121.7-18.6,179.7,31.6c55.7,57.5,30.6,85.7,26,116C1374.5,224.8,1337,250.9,1338.1,294.9L1338.1,294.9z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FFD900" d="M1346.4,335.5c16.9,38.9,141.9,246.4-146.6,509.1
                      c-76.2,55.3-191.8,122.2-315.4,165.7C430.8,1090.5,967.1,342.4,1346.4,335.5L1346.4,335.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FFBB00" d="M1346.4,335.5c21.8,37,196,263.7-146.7,509.1
                      c-113.3-47.1-190.9-142.7-190.9-252.9c0-52.4,17.5-101.5,48.1-143.6C1152.7,382.3,1254.8,337.5,1346.4,335.5L1346.4,335.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#214197" d="M1346.4,335.5c23.9,38.3,161.7,213.3-46.6,424.2
                      c-130-44.1-241.9-192.7-200.3-339.3C1182.2,370,1267.9,337.2,1346.4,335.5L1346.4,335.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#3E5881" d="M1346.4,335.5c16.8,27,90,121.4,59.3,249
                      c-120.4-36.9-149.4-140.4-152-234.1C1285.3,341.4,1316.4,336.2,1346.4,335.5L1346.4,335.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#0F7D00" d="M1162.9,58.9c-2.5,11-20.8,19-41.2,29.6
                      c-25.5,26-57.4,73.2-76.2,154.5c-36.1,155.6-580.5,710.2-696.7,816c357.3-117.5,786.6-244.7,773.8-598.4
                      c88-53.9,152.4-100,223.8-125.1C1248.4,330.1,1124.9,279.2,1162.9,58.9L1162.9,58.9z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#00A6FF" d="M1162.9,58.9c-3,2.2-22.7,12.3-41.2,29.6
                      c-8.3,100.1,2.5,238.9,133.7,290.2c30.7-17.6,60.2-32.3,91-43.2C1248.4,330.1,1124.9,279.2,1162.9,58.9L1162.9,58.9z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#D4D4D4" d="M1260.4,107.8c-17.5,0-31.6,14.1-31.6,31.6
                      c0,17.5,14.1,31.6,31.6,31.6c17.5,0,31.6-14.2,31.6-31.6C1292,122,1277.9,107.8,1260.4,107.8L1260.4,107.8z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M1260.4,115.5c-13.2,0-24,10.7-24,24c0,13.2,10.7,24,24,24c13.2,0,24-10.7,24-24
                      C1284.4,126.2,1273.7,115.5,1260.4,115.5L1260.4,115.5z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#17AD03" d="M1042.9,251.9c11,13.8,380.8,387.9-549.8,665.2
                      C705.6,684.1,827.5,526,1042.9,251.9L1042.9,251.9z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FF9900" d="M799.5,987.2c26,29.6,83.7,79,122,96.6c0,0-83,3.1-89.2,84.2
                      c108.6-148.5,240.7,17.2,185.2,97.9c69.1-48.2,18.3-126.4-6.7-147.9c0,0,69.9,45.4,63.1,117.8c53.4-132.4-119.4-144.6-228.9-261.6
                      C838.2,970.2,812.3,970.1,799.5,987.2L799.5,987.2z"/>
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FFB3B0" d="M1498.2,149.5l-99.4,44l-50.3,15.3l11.7-56l-23.4-72.1l36-3.2
                      C1413.5,87.5,1458.6,107,1498.2,149.5L1498.2,149.5z"/>
                      <path d="M1498.2,149.5c-49.7-14.9-120-15.5-138,3.3C1369.9,148.2,1418.6,140.5,1498.2,149.5L1498.2,149.5z" />
                      <path fillRule="evenodd" clipRule="evenodd" fill="#FFFFFF" d="M1265.6,124.8c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8
                      c3.2,0,5.8-2.6,5.8-5.8C1271.3,127.4,1268.8,124.8,1265.6,124.8L1265.6,124.8z"/>
                    </g>
                  </svg>
                </div>
              </>
              :
              <>
                <MarkerClusterGroup
                  polygonOptions={{
                    fillColor: '#ffffff',
                    color: '#F2F2F2',
                    weight: 5,
                    opacity: 1,
                    fillOpacity: 0.8,
                  }}>
                  {/* {(!showGridLayer || !gridData) && birdMarkers.length > 0 && birdMarkers.map((birdMarker, index) => {
                    if (birdMarker.observations && birdMarker.observations.length > 0 && birdMarker.observations[0].lat) {
                      return (
                        <>
                          <Marker key={index} position={[birdMarker.observations[0].lat, birdMarker.observations[0].lng]} icon={IconCrow} eventHandlers={{
                            click: () => {
                              handleButtonClickBirds(index);
                            },
                          }}>
                            <Popup>{`Ave ${index + 1}`}</Popup>
                          </Marker>
                        </>
                      );
                    }
                    return null;
                  })} */}

                  {(!showGridLayer || !gridData) &&
                    birdMarkers
                      .filter(
                        birdMarker =>
                          (selectedBirds.length === 0 || selectedBirds.includes(birdMarker.spanishName)) &&
                          birdMarker.observations &&
                          birdMarker.observations.length > 0 &&
                          birdMarker.observations[0].lat !== undefined &&
                          birdMarker.observations[0].lng !== undefined
                      )
                      .map((birdMarker, index) => (
                        <Marker
                          key={index}
                          position={[birdMarker.observations[0].lat, birdMarker.observations[0].lng]}
                          icon={IconCrow}
                          eventHandlers={{ click: () => handleButtonClickBirds(index) }}
                        >
                          <Popup>{birdMarker.speciesCode || `Ave ${index + 1}`}</Popup>
                        </Marker>
                     ))
                  }
                </MarkerClusterGroup>

                {/* <MarkerClusterGroup
                  maxClusterRadius={80}>  
                    {eolicMarkers.length > 0 && eolicMarkers.map((marker, index) => (
                      <>
                        <Circle
                        key={index}
                        center={[marker.Latitud, marker.Longitud]} 
                        pathOptions={{ fillColor: 'blue', color: 'blue' }} 
                        radius={1000}
                        eventHandlers={{
                            click: () => {
                                handleButtonClickEolic(index)
                            },
                          }}
                          />
                    </>
                  ))}
                </MarkerClusterGroup> */}
                {/* <MarkerClusterGroup
                  maxClusterRadius={80}>
                  {eolicMarkers.length > 0 && eolicMarkers.map((coordinatesValues: { coordenadas: L.LatLng[] }, coordinates: number) => {
                    console.log('Coordenadas de los marcadores eólicos: ', coordinatesValues);
                    console.log('COORDENADAS.LENGTH: ', coordinatesValues.coordenadas.length);
                    for (let i = 0; i < coordinatesValues.coordenadas.length; i++) {
                      const eolicPoint = coordinatesValues.coordenadas[i];
                      console.log('eolicPoint', eolicPoint);
                      return (
                        <>
                           <Circle
                              key={coordinates}
                              center={eolicPoint} 
                              pathOptions={{ fillColor: 'blue', color: 'blue' }} 
                              // pathOptions={{ fillOpacity: 0, stroke: false }} // Con esto hago invisibles los círculos
                              radius={1500} // Radio del círculo aumentado de 100 a 1500
                              eventHandlers={{
                                  click: () => {
                                      handleButtonClickEolic(coordinates)
                                  },
                                }}
                          />
                        </>
                      );
                    }
                  })}
                </MarkerClusterGroup> */}

                {/* <MarkerClusterGroup maxClusterRadius={80}>
                  {eolicMarkers.length > 0 &&
                    eolicMarkers.flatMap((coordinatesValues: { coordenadas: L.LatLng[] }, coordinates: number) => {
                      // console.log('Coordenadas de los marcadores eólicos: ', coordinatesValues);
                      return coordinatesValues.coordenadas.map((eolicPoint, i) => (
                        <Circle
                          key={`${coordinates}-${i}`} // Unique key for each circle
                          center={eolicPoint} 
                          pathOptions={{ fillColor: 'blue', color: 'blue' }} 
                          radius={1500}
                          eventHandlers={{
                            click: () => handleButtonClickEolic(coordinates),
                          }}
                        />
                      ));
                    })}
                </MarkerClusterGroup> */}

                <MarkerClusterGroup maxClusterRadius={80}>
                  {eolicMarkers.length > 0 &&
                    eolicMarkers.flatMap(({ coordenadas, espacio }, index) =>
                      coordenadas.map((eolicPoint, i) => (
                        <Circle
                          key={`${index}-${i}`} 
                          center={eolicPoint}

                          pathOptions={{ fillColor: "#FF9999", color: "#FF9999" }}

                          // pathOptions={{
                          //   fillColor: selectedCircle === eolicPoint ? "red" : "blue",
                          //   color: selectedCircle === eolicPoint ? "red" : "blue",
                          // }}
                          radius={1500}
                          eventHandlers={{
                            click: () => handleButtonClickEolic(eolicPoint),
                          }}
                        >
                           <Tooltip direction="top" permanent={tooltipVisible}>
                            {`Zona de exclusión eólica: ${espacio || "Sin información"}`}
                          </Tooltip>
                        </Circle>
                      ))
                    )}
                </MarkerClusterGroup>

                <LocationMarker />

                {eolicResourcesMarkers.length > 0 && eolicResourcesMarkers.map((coordinatesValues, coordinates) => {
                      return (
                        <>
                         <Circle
                              key={coordinates}
                              center={[coordinatesValues.lat, coordinatesValues.lng]} 
                              pathOptions={{ fillColor: '#A955F2', color: '#A955F2' }} 
                              radius={3000}
                              eventHandlers={{
                                  click: () => {
                                      handleButtonClickEolicResources(coordinatesValues)
                                  },
                                }}
                          />
                        </>
                      );
                  
                    return null;})}
              </>
            }
          </MapContainer>
        </div>
        {/* <div className="buttons">
          {buttons.map((button) => (
            <button key={button.id} onClick={() => handleButtonClick(button)}>
              {button.title}
            </button>
          ))}
        </div> */}

        {selectedButtonBirds && birdMarkers[selectedButtonBirds] && (
          <SidebarBirds
            isOpen={sidebarBirdOpen}
            onCancel={handleCancelClickBirds}
            birdData={birdMarkers[selectedButtonBirds]}
          />
        )}

        {/* {selectedButton && eolicMarkers[selectedButton] && (
          <SidebarEolic
            isOpen={sidebarEolicOpen}
            onCancel={handleCancelClickEolic}
            eolicdata={eolicMarkers[selectedButton]}
            // eolicdata={nearbyEolicMarkers}
          />
        )} */}

        {selectedButton.length > 0 && (
          <SidebarEolic
            isOpen={sidebarEolicOpen}
            onCancel={handleCancelClickEolic}
            eolicdata={selectedButton}
            // onSelectCircle={handleCardClick}
            maxDistance={maxDistance}
          />
        )}


        {selectedButtonEolicResources && selectedButtonEolicResources.lat && selectedButtonEolicResources.lng && (
          <SideBarEolicResources
            key={selectedButtonEolicResources.lat + '-' + selectedButtonEolicResources.lng}
            isOpen={sidebarEolicResourcesOpen}
            onCancel={()=>setSidebarEolicResourcesOpen(false)}
            eolicResourcesdata={selectedButtonEolicResources}
          />
        )}
        
      </div>
    </>
  );
};

export default Mapa;

