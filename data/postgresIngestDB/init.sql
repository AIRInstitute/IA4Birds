-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de especies
CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    comName VARCHAR(255) NOT NULL,
    sciName VARCHAR(255) NOT NULL,
    CONSTRAINT species_comname_sciname_unique UNIQUE (comName, sciName)
);

-- Observaciones
CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    locationId VARCHAR(255),
    locationName VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    date TIMESTAMP,
    numObservation INT,
    speciesId INT NULL,
    CONSTRAINT fk_species
        FOREIGN KEY (speciesId) 
        REFERENCES species(id)
        ON DELETE SET NULL
);

-- Grabaciones
CREATE TABLE IF NOT EXISTS recording (
    id SERIAL PRIMARY KEY,
    recordingId VARCHAR(255) UNIQUE,
    location VARCHAR(255),
    quality VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    alt INT,
    file VARCHAR(255),
    fileName VARCHAR(255),
    time VARCHAR(255),
    date TIMESTAMP,
    observationId INT NULL,
    CONSTRAINT fk_observation
        FOREIGN KEY (observationId)
        REFERENCES observation(id)
        ON DELETE SET NULL
);

-- Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT FALSE
);

-- Estado del dispositivo
CREATE TABLE IF NOT EXISTS device_status (
    id SERIAL PRIMARY KEY,
    gps_latitude DECIMAL(9,6) NOT NULL,
    gps_longitude DECIMAL(9,6) NOT NULL,
    status VARCHAR(255) NOT NULL,
    storage_status DECIMAL(5,2) NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estadísticas de aves
CREATE TABLE IF NOT EXISTS bird_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id VARCHAR NOT NULL,
    bird_name VARCHAR NOT NULL,
    count INT NOT NULL DEFAULT 1,
    last_seen TIMESTAMP NOT NULL DEFAULT now(),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT unique_camera_bird UNIQUE (camera_id, bird_name)
);

-- Segmentos de datos
CREATE TABLE IF NOT EXISTS segment_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id VARCHAR,
    segment_idx INT,
    colatitude FLOAT,
    azimuth FLOAT,
    zoom_level INT,
    average_area FLOAT,
    total_big_birds INT,
    frames JSONB,
    received_at TIMESTAMP NOT NULL DEFAULT now(),
);

-- Imágenes de mapas de calor
CREATE TABLE IF NOT EXISTS heatmap_image (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id VARCHAR,
    heatmap_for TEXT,
    image_url TEXT,
    generated_at TIMESTAMP NOT NULL DEFAULT now()
);
