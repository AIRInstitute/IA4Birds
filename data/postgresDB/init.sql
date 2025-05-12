-- Definir el tipo ENUM para el campo entity
CREATE TYPE entity_enum AS ENUM ('public', 'private', 'external');

CREATE TYPE IF NOT EXISTS camera_source_enum AS ENUM (
  'RTSP', 'RTMP', 'HLS', 'WebRTC', 'YouTube', 'Twitch', 'MJPEG', 'DASH', 'Other'
);


CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    comName VARCHAR(255),
    sciName VARCHAR(255)

);

CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    locationId VARCHAR(255),
    locationName VARCHAR(255),
    lat DECIMAL(9,6),  -- Asumiendo una precisión adecuada para coordenadas geográficas
    lng DECIMAL(9,6),
    date TIMESTAMP,  -- Usa TIMESTAMP para almacenar tanto fecha como hora
    numObservation INT,
    speciesId INT,
    CONSTRAINT fk_species
        FOREIGN KEY (speciesId) 
        REFERENCES species(id)
        ON DELETE SET NULL  
);


CREATE TABLE IF NOT EXISTS recording (
    id SERIAL PRIMARY KEY,
    recordingId VARCHAR(255),
    location VARCHAR(255),
    quality VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    alt INT,
    file VARCHAR(255),
    fileName VARCHAR(255),
    time VARCHAR(255),  -- Si es un timestamp, considerar cambiar el tipo a TIME o TIMESTAMP
    date TIMESTAMP,
    observationId INT,
    CONSTRAINT fk_observation
        FOREIGN KEY (observationId)
        REFERENCES observation(id)
        ON DELETE SET NULL  
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    ocupation VARCHAR(255), -- Nuevo campo de ocupación
    entity entity_enum NOT NULL, -- Nuevo campo ENUM
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cameras (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  source_type camera_source_enum NOT NULL,
  source_url VARCHAR NOT NULL,
  playback_url VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending',
  location VARCHAR
);