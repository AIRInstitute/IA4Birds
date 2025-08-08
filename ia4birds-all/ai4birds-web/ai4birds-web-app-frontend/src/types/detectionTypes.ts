export interface BirdDetection {
  area: number;
  id_ave: number;
  is_new: boolean;
  distances: {
    [species: string]: [number, number];
  };
  timestamp: number;
  coordenadas: [number, number, number, number];
  enter_pos_x: number;
  enter_pos_y: number;
  ultimo_frame: boolean;
  absolute_azimuth: number;
  absolute_colatitude: number;
}

export interface SegmentData {
  camera_id: string;
  segment_idx: number;
  colatitude: number;
  azimuth: number;
  zoom_level: number;
  average_area: number;
  total_big_birds: number;
  frames: {
    [frameNumber: string]: BirdDetection[];
  };
  received_at: string;
}

export interface SegmentDataResponse {
  segment_data: SegmentData;
}

export interface ProcessedDetection {
  frame: string;
  idAve: number;
  coordenadas: string;
  area: string;
  especieProbable: string;
  confianza: string;
  timestamp: number;
  rawCoordinates: [number, number, number, number];
}
