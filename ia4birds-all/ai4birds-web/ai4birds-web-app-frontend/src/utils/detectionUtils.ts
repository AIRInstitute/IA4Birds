import { ProcessedDetection } from '../types/detectionTypes';

/**
 * Formatea el nombre de una especie de snake_case a formato legible
 */
export const formatSpeciesName = (species: string): string => {
  return species
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Calcula la confianza basada en la distancia mínima
 */
export const calculateConfidence = (minDistance: number): number => {
  // Invertir la distancia: menor distancia = mayor confianza
  // Usar una función logarítmica para mapear las distancias a porcentajes
  const maxDistance = 1000; // Distancia máxima esperada
  const confidence = Math.max(0, Math.min(100, 100 - (minDistance / maxDistance) * 100));
  return confidence;
};

/**
 * Formatea las coordenadas para mostrar
 */
export const formatCoordinates = (coords: [number, number, number, number]): string => {
  return `X: ${Math.round(coords[0])}-${Math.round(coords[2])}, Y: ${Math.round(coords[1])}-${Math.round(coords[3])}`;
};

/**
 * Formatea el área con unidades
 */
export const formatArea = (area: number): string => {
  return `${area.toFixed(1)} px²`;
};

/**
 * Formatea el número de frame a formato de tiempo
 */
export const formatFrame = (frameNumber: string): string => {
  const frame = parseInt(frameNumber);
  // Asumiendo 30 FPS, convertir frames a tiempo
  const seconds = Math.floor(frame / 30);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  const displaySeconds = seconds % 60;
  const displayMinutes = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
};

/**
 * Ordena las detecciones por frame
 */
export const sortDetectionsByFrame = (detections: ProcessedDetection[]): ProcessedDetection[] => {
  return detections.sort((a, b) => {
    // Extraer el número de frame del string de tiempo
    const frameA = parseFloat(a.frame.split(':').join(''));
    const frameB = parseFloat(b.frame.split(':').join(''));
    return frameA - frameB;
  });
};
