import React, { useState,useEffect } from 'react';
import { MapContainer, TileLayer , Circle, Marker, Popup, GeoJSON} from 'react-leaflet';
import { FaCrow } from "react-icons/fa";
import {Button,Tooltip, Card, CardBody} from "@nextui-org/react";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaFan } from "react-icons/fa";
import SidebarBirds from './sidebar/SidebarBirds';
import SidebarEolic from './sidebar/SideBarEolic';
import {  IconCrow  } from './icons/Icon';
import castillaYLeonBorders from '../coordMap/CastillaYLeon.json';
import { FaCheck } from "react-icons/fa6";
import ExclusionEolicService from './services/exclusionEolicService';
import 'leaflet/dist/leaflet.css';

const Mapa = () => {
    const [showMarkers, setShowMarkers] = useState(false);
    const [showMarkersEolic, setShowMarkersEolic] = useState(false);
    const [markerBird, setMarkerBird] = useState(false);
    
    const [eolicMarkers, setEolicMarkers] = useState([]);
    useEffect(() => {
      console.log(castillaYLeonBorders); // Check if your GeoJSON data is correctly loaded
    }, []);
    // const jsonDataData = JSON.parse(filePath);

    // interface JsonData {
    //   Latitud: number;
    //   Longitud: number;
    // }

    // const jsonnData: JsonData = jsonDataData;
    const castillaYLeonCoordinates = [
      [41.9999, -6.2715], // Northwest corner
      [41.9999, -1.3679], // Northeast corner
      [40.1792, -1.3679], // Southeast corner
      [40.1792, -6.2715], // Southwest corner
    ];

    const birdData = [
      { id: 1, name: 'Ave 1', description: 'Descripción Ave 1',  url: 'https://t2.ea.ltmcdn.com/es/posts/3/3/8/caracteristicas_de_las_aves_24833_orig.jpg', num: '12'},
      { id: 2, name: 'Ave 2', description: 'Descripción Ave 2',  url: 'https://okdiario.com/img/2018/06/21/reproduccion-de-las-aves.jpg', num: '4'},
      { id: 3, name: 'Ave 3', description: 'Descripción Ave 3',  url: 'https://www.nationalgeographic.com.es/medio/2022/12/13/muchuelo-alpino_8598e7e9_221213120701_1280x853.jpg',  num: '40'},        
    ];
    const coordinatesBirds = [
      { latitude: 40.9429, longitude: -4.1088 }, 
      { latitude: 40.9647, longitude: -5.6631 }, 
      { latitude: 40.6566, longitude: -4.7006 }, 
      { latitude: 41.652, longitude: -4.7286 }, 
      { latitude: 42.599, longitude: -5.5713 }
    ];

    const [markers, setMarkers] = useState(coordinatesBirds);

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
    
    const coordinatesEolic = [
      {
        "Latitud": 42.2, 
        "Longitud": -6.53, 
        "ambito": "RANP - Red Natura 2000", 
        "area_excl": "ZEPA", 
        "criterio": "Red de \ufffdreas Naturales Protegidas", 
        "espacio": "Sierra de la Cabrera - ZEPA", 
        "fid": 34745, 
        "identific": "Sierra de la Cabrera - ZEPA", 
        "t_instalac": "Parques e\ufffdlicos"
      }, 
      {
        "Latitud": 42.26, 
        "Longitud": -5.39, 
        "ambito": "RANP - Red Natura 2000", 
        "area_excl": "ZEPA", 
        "criterio": "Red de \ufffdreas Naturales Protegidas", 
        "espacio": "Oteros-Campos", 
        "fid": 34746, 
        "identific": "Oteros-Campos", 
        "t_instalac": "Parques e\ufffdlicos"
      }, 
      {
        "Latitud": 42.15, 
        "Longitud": -4.93, 
        "ambito": "RANP - Red Natura 2000", 
        "area_excl": "ZEPA", 
        "criterio": "Red de \ufffdreas Naturales Protegidas", 
        "espacio": "La Nava-Campos Norte", 
        "fid": 34747, 
        "identific": "La Nava-Campos Norte", 
        "t_instalac": "Parques e\ufffdlicos"
      }, 
      {
        "Latitud": 41.8, 
        "Longitud": -4.58, 
        "ambito": "RANP - Red Natura 2000", 
        "area_excl": "ZEPA", 
        "criterio": "Red de \ufffdreas Naturales Protegidas", 
        "espacio": "Riberas del Pisuerga", 
        "fid": 34748, 
        "identific": "Riberas del Pisuerga", 
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.31,
        "Longitud": -3.82,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39859,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.0,
        "Longitud": -4.12,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39860,
        "identific": "Normas Subsidiarias Municipales (NS)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.8,
        "Longitud": -3.35,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39861,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.29,
        "Longitud": -3.52,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39862,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.83,
        "Longitud": -3.79,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39863,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.58,
        "Longitud": -3.5,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39864,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.99,
        "Longitud": -3.24,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39865,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 40.84,
        "Longitud": -6.05,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39866,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.24,
        "Longitud": -5.72,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn cartograf\ufffda de entidades de poblaci\ufffdn",
        "fid": 39867,
        "identific": "Sin planeamiento general (SPG)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.25,
        "Longitud": -3.66,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39870,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.49,
        "Longitud": -3.13,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39871,
        "identific": "Normas Subsidiarias Municipales (NS)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.9,
        "Longitud": -3.47,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39872,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.27,
        "Longitud": -3.88,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39873,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.06,
        "Longitud": -3.0,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39874,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 40.89,
        "Longitud": -5.68,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39934,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.16,
        "Longitud": -3.93,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39875,
        "identific": "Normas Subsidiarias Municipales (NS)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.2,
        "Longitud": -3.7,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39876,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.13,
        "Longitud": -5.11,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39877,
        "identific": "Normas Urban\ufffdsticas Territoriales (NUT)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.17,
        "Longitud": -5.16,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39889,
        "identific": "Normas Urban\ufffdsticas Territoriales (NUT)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.04,
        "Longitud": -3.53,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39878,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.73,
        "Longitud": -3.98,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39879,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.69,
        "Longitud": -3.47,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39880,
        "identific": "Normas Subsidiarias Municipales (NS)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.31,
        "Longitud": -3.84,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39881,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.17,
        "Longitud": -3.61,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39882,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.59,
        "Longitud": -3.64,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39883,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.15,
        "Longitud": -3.2,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39884,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.33,
        "Longitud": -3.21,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39885,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.63,
        "Longitud": -3.87,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39886,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.98,
        "Longitud": -3.04,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39887,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.9,
        "Longitud": -3.26,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39888,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.76,
        "Longitud": -3.8,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39890,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.42,
        "Longitud": -3.68,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39891,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.58,
        "Longitud": -3.8,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39892,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.09,
        "Longitud": -3.69,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39893,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.81,
        "Longitud": -2.78,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39896,
        "identific": "Normas Subsidiarias Municipales (NS)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.81,
        "Longitud": -3.38,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39894,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.98,
        "Longitud": -3.29,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39895,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.19,
        "Longitud": -3.64,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39897,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.74,
        "Longitud": -3.52,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39898,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.15,
        "Longitud": -3.66,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39899,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.14,
        "Longitud": -3.73,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39910,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.45,
        "Longitud": -6.02,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39900,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 42.34,
        "Longitud": -3.93,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39901,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      },
      {
        "Latitud": 41.83,
        "Longitud": -3.91,
        "ambito": "N\ufffdcleo urbano",
        "area_excl": "Distancia de 1.000 m.",
        "criterio": "N\ufffdcleos urbanos, c. educativos, c. sanitarios o c. att. sociosanitaria",
        "espacio": "Delimitaci\ufffdn planeamiento urban\ufffdstico",
        "fid": 39902,
        "identific": "Normas Urban\ufffdsticas Municipales (NUM)",
        "t_instalac": "Parques e\ufffdlicos"
      }, ]

    // const addMarkersBirds = () => {
    //   if(showMarkers  && markerBird) {
    //     setMarkers([]);
    //       setMarkerBird(false);
    //     setMarkers(coordinatesBirds);
    //     setMarkerBird(true);}
    //   else if(showMarkers && markerBird){
    //     setMarkers(coordinatesBirds);
    //     setMarkerBird(true);}
    //     setShowMarkers(showMarkersBird => !showMarkersBird);
    //     }
        
      //   else{
      //     setMarkers(coordinatesBirds);
      //   setMarkerBird(true);
      // }
      //setMarkers(coordinatesBirds);

    // const addMarkersCameras = () => {
    //   if(!showMarkers) {
    //     setMarkers(coordinatesCameras);
    //     setMarkerBird(false);}
    //     else{
    //       setMarkers([]);
    //       setMarkerBird(true);
    //     }

    //   setShowMarkers(showMarkers => !showMarkers);
    // };

    const addEolicMarkers = () => {
      
      if(!showMarkersEolic){
        setMarkers([]);
        setSidebarBirdOpen(false);
        setEolicMarkers(coordinatesEolic);

        ExclusionEolicService.getExclusionMap().then((response) => {
          if (response.status === 200) { 
            console.log("Responsee",response);
          }
          else {
            throw new Error(response.data);
          }
        });
        setShowMarkersEolic(showMarkersEolic => !showMarkersEolic);
      }
      else{
        setSidebarEolicOpen(false)
        setEolicMarkers([]);
        setMarkers(coordinatesBirds);
        setShowMarkersEolic(showMarkersEolic => !showMarkersEolic);
      }
    };
    const handleOpen = (backdrop) => {
      setBackdrop(backdrop)
      onOpen();
    }
    
    const [sidebarBirdOpen, setSidebarBirdOpen] = useState(false);
    const [sidebarEolicOpen, setSidebarEolicOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');
  
    const buttons = [
      { id: 1, title: 'Latitud 1', description: 'Fecha, carga de datosss' },
      { id: 2, title: 'Latitud 2', description: 'Fecha, carga de datosss' },];


      const handleButtonClickBirds = (button) => {
        setSidebarBirdOpen(true);
        setSelectedButton(button);
      };
    
      const handleCancelClickBirds = () => {
        setSidebarBirdOpen(false);
      };

      const handleButtonClickEolic = (button) => {
        setSelectedButton(button);
        setSidebarEolicOpen(true);
      };
    
      const handleCancelClickEolic = () => {
        setSidebarEolicOpen(false);
      };

  return (
    <>
      <div className='map-button'>
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
        <Tooltip  placement="right" content="Capa eólica">
          <Button className='camera'  color={!showMarkersEolic ? 'primary' : 'danger'} isIconOnly size='lg' onClick={addEolicMarkers}><FaFan/></Button>
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
        maxZoom={10}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={castillaYLeonBorders} />
        { markers.length > 0 && markers.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}  icon={ IconCrow } eventHandlers={{
            click: () => {
                handleButtonClickBirds(buttons[0])
            },
          }} >
          <Popup>{`Ave ${index + 1}`}</Popup>
        </Marker>

        ))}
        {eolicMarkers.length > 0 && eolicMarkers.map((marker, index) => (
          console.log(marker),
          <>
        <Circle
        key={index}
        center={[marker.Latitud, marker.Longitud]} 
        pathOptions={{ fillColor: 'blue', color: 'blue' }} 
        radius={1000}
        eventHandlers={{
            click: () => {
                handleButtonClickEolic(index + 1)
            },
          }}
      />
      </>
        ))}
        </MapContainer>
    </div>
       {/* <div className="buttons">
        {buttons.map((button) => (
          <button key={button.id} onClick={() => handleButtonClick(button)}>
            {button.title}
          </button>
        ))}
      </div> */}
      <SidebarBirds
        isOpen={sidebarBirdOpen}
        onCancel={handleCancelClickBirds}
        birdData={birdData}  
      />

      {selectedButton && coordinatesEolic[selectedButton] && (
        <SidebarEolic
          isOpen={sidebarEolicOpen}
          onCancel={handleCancelClickEolic}
          eolicdata={coordinatesEolic[selectedButton]}
        />
      )}
    </>
  );
};


export default Mapa;

