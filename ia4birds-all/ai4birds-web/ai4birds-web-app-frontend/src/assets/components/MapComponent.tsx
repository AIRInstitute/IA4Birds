import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polygon, GeoJSON } from 'react-leaflet';
import { FaCrow } from "react-icons/fa";
import { Button, Tooltip, Card, CardBody } from "@nextui-org/react";
import { FaFan } from "react-icons/fa";
import SidebarBirds from './sidebar/SidebarBirds';
import SidebarEolic from './sidebar/SideBarEolic';
import { IconCrow } from '../components/icons/Icon';
import castillaYLeonBorders from '../coordMap/CastillaYLeon.json';
import { FaCheck } from "react-icons/fa6";
import ExclusionEolicService from './services/exclusionEolicService';
import BirdDataService from './services/BirdDataService';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster'

const Mapa = () => {
  const [showMarkersEolic, setShowMarkersEolic] = useState(false);
  const [markerBird, setMarkerBird] = useState(false);

  const [eolicMarkers, setEolicMarkers] = useState([]);
  const [birdMarkers, setBirdsMarkers] = useState([]);

  const birdData = [
    { id: 1, name: 'Ave 1', description: 'Descripción Ave 1', url: 'https://t2.ea.ltmcdn.com/es/posts/3/3/8/caracteristicas_de_las_aves_24833_orig.jpg', num: '12' },
    { id: 2, name: 'Ave 2', description: 'Descripción Ave 2', url: 'https://okdiario.com/img/2018/06/21/reproduccion-de-las-aves.jpg', num: '4' },
    { id: 3, name: 'Ave 3', description: 'Descripción Ave 3', url: 'https://www.nationalgeographic.com.es/medio/2022/12/13/muchuelo-alpino_8598e7e9_221213120701_1280x853.jpg', num: '40' },
  ];
  const coordinatesBirds = [
    { latitude: 40.9429, longitude: -4.1088 },
    { latitude: 40.9647, longitude: -5.6631 },
    { latitude: 40.6566, longitude: -4.7006 },
    { latitude: 41.652, longitude: -4.7286 },
    { latitude: 42.599, longitude: -5.5713 }
  ];

  const coordinatesCameras = [
    { latitude: 39.5712, longitude: 2.6466 }, // Palma de Mallorca
    { latitude: 28.4636, longitude: -16.2518 }, // Tenerife
    { latitude: 36.7213, longitude: -4.4214 }, // Málaga
    { latitude: 43.263, longitude: -2.935 }, // Getxo
    { latitude: 37.3913, longitude: -5.9825 }, // Sevilla
    { latitude: 43.2627, longitude: -2.9253 }, // Bilbao
    { latitude: 41.3818, longitude: 2.1685 }, // Barcelona
    { latitude: 37.8882, longitude: -4.7794 }, // Córdoba
    { latitude: 37.1773, longitude: -3.5986 }, // Granada
    { latitude: 39.4699, longitude: -0.3763 } // Valencia
  ];

  const [sidebarBirdOpen, setSidebarBirdOpen] = useState(false);
  const [sidebarEolicOpen, setSidebarEolicOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedButtonBirds, setSelectedButtonBirds] = useState('');
  const [markersLoaded, setMarkersLoaded] = useState(false);

  //SSE ServerSent Events
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
   console.log('facts', facts)
   setEolicMarkers(facts);
  }, [facts]);

  useEffect(() => {
    // Esta función se ejecutará una vez cuando el componente se monte en el DOM
    console.log('La página se ha cargado MapComponent');

    // Llama a tu función aquí
    fillBirdData();
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
    setBirdsMarkers([]);
    if (!listening) {
      //get a Node
      const events = new EventSource('http://212.128.141.36:5030/api/data/exclusionmap/stream-exclusion-data');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setFacts((facts) => facts.concat(parsedData));
        console.log('parsedData', parsedData);

        

        setShowMarkersEolic(true);

      };

      setListening(true);
    }
  }

  useEffect(() => {
    // Esta función se ejecutará cada vez que setEolicMarkers cambie
    console.log('Los marcadores eólicos se han cargado:', markersLoaded);
  }, [markersLoaded]);

  useEffect(() => {
    // Esta función se ejecutará cada vez que setEolicMarkers cambie
    console.log('Los marcadores eólicos han cambiado', eolicMarkers);
    setMarkersLoaded(true);
  }, [eolicMarkers]);

  //====================================================================
  //FILL BIRD MARKERS
  //====================================================================
  const fillBirdData = () => {
    BirdDataService.getDataBird().then((response) => {
      if (response.status === 200) {
        //console.log("bird Response", response.data)
        setMarkersLoaded(true);
        return setBirdsMarkers(response.data);
      }
      else {
        setMarkersLoaded(true);
        throw new Error(response.data);
      }
    });
  };

  const handleButtonClickBirds = (button) => {
    setSelectedButtonBirds(button);
    setSidebarBirdOpen(true);
  };

  const handleCancelClickBirds = () => {
    setSidebarBirdOpen(false);
  };

  const handleButtonClickEolic = (button) => {

    console.log('He tocado el Button número', button);
    setSelectedButton(button);
    setSidebarEolicOpen(true);
    console.log('sideBar tiene que estar a true', sidebarEolicOpen);
    console.log('selectedButton', selectedButton)
    console.log("Si estas variables tienen datos debería de funcionar: ", selectedButton + " y ", eolicMarkers[selectedButton])
  };

  const handleCancelClickEolic = () => {
    setSidebarEolicOpen(false);
  };

  return (
    <>
      <div className='map-component'>
        <div className='map-button' >
          <Card className='buttons' >
            <CardBody className='butttons gap-3'>
              <p className="p-1">Capas</p>
              {/* <Tooltip placement="right" content="Capa de aves">
                <Button className='bird' isIconOnly color="primary" size='lg' onClick={addMarkersBirds}><FaCrow/></Button>
              </Tooltip> */}
              {/* <Tooltip  placement="right" content="Capa de cámaras">
                <Button className='camera'  isIconOnly color="primary" size='lg' onClick={addMarkersCameras}><FaCrow/></Button>
              </Tooltip>  */}
              <div className="flex items-center gap-4">
                {/* <Tooltip placement="right" content="Capa eólica">
                  <Button className='camera' color={!showMarkersEolic ? 'primary' : 'danger'} isIconOnly size='lg' onClick={addEolicMarkers}><FaFan /></Button>
                </Tooltip>
                {showMarkersEolic && (
                  <FaCheck />
                )} */}
                <Tooltip placement="right" content="Capa eólica">
                  <Button className='camera' color={!showMarkersEolic ? 'primary' : 'danger'} isIconOnly size='lg' onClick={addEolicMarkersStreamExclusion}><FaFan /></Button>
                </Tooltip>
                {showMarkersEolic && (
                  <FaCheck />
                )}
              </div>
            </CardBody>
          </Card>
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
            {/* <GeoJSON data={castillaYLeonBorders} style={{ color: 'gray', weight: 0.5 }} /> */}
            {!markersLoaded ?
              <>
                <div className='blurredLayer'>
                </div>
                <div className="ajaxLoad">
                  <svg className='loader-bird'
                    x="0px" y="0px" viewBox="0 0 1498.2 1265.9" enable-background="new 0 0 1498.2 1265.9" xml:space="preserve">
                    <g>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FF9900" d="M890.8,920c26,29.6,83.7,79,122,96.6c0,0-83,3.1-89.2,84.2
                      c108.6-148.5,240.7,17.2,185.2,97.9c69.1-48.2,18.3-126.4-6.7-147.9c0,0,69.9,45.4,63.1,117.8c53.4-132.4-119.4-144.6-228.9-261.6
                      C929.5,903.1,903.7,902.9,890.8,920L890.8,920z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#D4D4D4" d="M884.1,1010.5c0,0-129.8,67.6-254.3,33.1
                      c-80.9,40-206.1,85.8-343.1,124c-13.9-4.2-27.7-43.4-24.3-49.1c28.5-18.8,57.4-38.6,85.5-59C473,968.8,590.1,871.7,666.7,857.2
                      C751.4,841.2,849.9,950.5,884.1,1010.5L884.1,1010.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#00A6FF" d="M347.8,1059.6c68.2-49.3,232.5-206.6,290.6-245.4
                      c-16.2,176.1-206.7,306.7-351.8,353.4c-8.4-0.7-31.3-28.2-24.3-49.1C267.3,1115.7,331.3,1071.5,347.8,1059.6L347.8,1059.6z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M286.7,1167.6c-75.4,21.7-151.9,40.8-222.1,54.8c55.7-23.8,118.9-59,197.7-103.9
                      C273,1128.2,284.9,1153.8,286.7,1167.6L286.7,1167.6z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M1398.9,193.5c-65.1,68.2-69.6,85.3-51.9,143.9
                      c-251.9,10.5-206.4-240.1-184.1-278.6c28-19.9,136.2-42.9,210,18.6C1430.8,137.3,1401.7,161.4,1398.9,193.5L1398.9,193.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FF0800" d="M1338.1,294.9c-169.9-14.1-156.2-174.3-145-249.1
                      c44.4-16.2,121.7-18.6,179.7,31.6c55.7,57.5,30.6,85.7,26,116C1374.5,224.8,1337,250.9,1338.1,294.9L1338.1,294.9z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFD900" d="M1346.4,335.5c16.9,38.9,141.9,246.4-146.6,509.1
                      c-76.2,55.3-191.8,122.2-315.4,165.7C430.8,1090.5,967.1,342.4,1346.4,335.5L1346.4,335.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFBB00" d="M1346.4,335.5c21.8,37,196,263.7-146.7,509.1
                      c-113.3-47.1-190.9-142.7-190.9-252.9c0-52.4,17.5-101.5,48.1-143.6C1152.7,382.3,1254.8,337.5,1346.4,335.5L1346.4,335.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#214197" d="M1346.4,335.5c23.9,38.3,161.7,213.3-46.6,424.2
                      c-130-44.1-241.9-192.7-200.3-339.3C1182.2,370,1267.9,337.2,1346.4,335.5L1346.4,335.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#3E5881" d="M1346.4,335.5c16.8,27,90,121.4,59.3,249
                      c-120.4-36.9-149.4-140.4-152-234.1C1285.3,341.4,1316.4,336.2,1346.4,335.5L1346.4,335.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#0F7D00" d="M1162.9,58.9c-2.5,11-20.8,19-41.2,29.6
                      c-25.5,26-57.4,73.2-76.2,154.5c-36.1,155.6-580.5,710.2-696.7,816c357.3-117.5,786.6-244.7,773.8-598.4
                      c88-53.9,152.4-100,223.8-125.1C1248.4,330.1,1124.9,279.2,1162.9,58.9L1162.9,58.9z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#00A6FF" d="M1162.9,58.9c-3,2.2-22.7,12.3-41.2,29.6
                      c-8.3,100.1,2.5,238.9,133.7,290.2c30.7-17.6,60.2-32.3,91-43.2C1248.4,330.1,1124.9,279.2,1162.9,58.9L1162.9,58.9z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#D4D4D4" d="M1260.4,107.8c-17.5,0-31.6,14.1-31.6,31.6
                      c0,17.5,14.1,31.6,31.6,31.6c17.5,0,31.6-14.2,31.6-31.6C1292,122,1277.9,107.8,1260.4,107.8L1260.4,107.8z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M1260.4,115.5c-13.2,0-24,10.7-24,24c0,13.2,10.7,24,24,24c13.2,0,24-10.7,24-24
                      C1284.4,126.2,1273.7,115.5,1260.4,115.5L1260.4,115.5z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#17AD03" d="M1042.9,251.9c11,13.8,380.8,387.9-549.8,665.2
                      C705.6,684.1,827.5,526,1042.9,251.9L1042.9,251.9z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FF9900" d="M799.5,987.2c26,29.6,83.7,79,122,96.6c0,0-83,3.1-89.2,84.2
                      c108.6-148.5,240.7,17.2,185.2,97.9c69.1-48.2,18.3-126.4-6.7-147.9c0,0,69.9,45.4,63.1,117.8c53.4-132.4-119.4-144.6-228.9-261.6
                      C838.2,970.2,812.3,970.1,799.5,987.2L799.5,987.2z"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFB3B0" d="M1498.2,149.5l-99.4,44l-50.3,15.3l11.7-56l-23.4-72.1l36-3.2
                      C1413.5,87.5,1458.6,107,1498.2,149.5L1498.2,149.5z"/>
                      <path d="M1498.2,149.5c-49.7-14.9-120-15.5-138,3.3C1369.9,148.2,1418.6,140.5,1498.2,149.5L1498.2,149.5z" />
                      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M1265.6,124.8c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8
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
                  {birdMarkers.length > 0 && birdMarkers.map((marker: any, index) => {
                    if (marker.observations && marker.observations.length > 0 && marker.observations[0].lat) {
                      return (
                        <>
                          <Marker key={index} position={[marker.observations[0].lat, marker.observations[0].lng]} icon={IconCrow} eventHandlers={{
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
                  })}
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
                <MarkerClusterGroup
                  maxClusterRadius={80}>
                  {eolicMarkers.length > 0 && eolicMarkers.map((coordinatesValues, coordinates) => {
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
                              radius={100}
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
                </MarkerClusterGroup>
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

        {selectedButton && eolicMarkers[selectedButton] && (
          <SidebarEolic
            isOpen={sidebarEolicOpen}
            onCancel={handleCancelClickEolic}
            eolicdata={eolicMarkers[selectedButton]}
          />
        )}
      </div>
    </>
  );
};


export default Mapa;

