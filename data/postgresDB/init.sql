-- Crear tipos ENUM
CREATE TYPE entity_enum AS ENUM ('public', 'private', 'external');

CREATE TYPE camera_source_enum AS ENUM (
  'RTSP', 'RTMP', 'HLS', 'YouTube'
);

CREATE TYPE camera_status_enum AS ENUM ('active', 'inactive', 'pending');

-- Tabla species
CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    comName VARCHAR(255),
    sciName VARCHAR(255)
);

-- Tabla observation
CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    locationId VARCHAR(255),
    locationName VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    date TIMESTAMP,
    numObservation INT,
    speciesId INT,
    CONSTRAINT fk_species
        FOREIGN KEY (speciesId) 
        REFERENCES species(id)
        ON DELETE SET NULL
);

-- Tabla recording
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
    time VARCHAR(255),
    date TIMESTAMP,
    observationId INT,
    CONSTRAINT fk_observation
        FOREIGN KEY (observationId)
        REFERENCES observation(id)
        ON DELETE SET NULL
);

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    ocupation VARCHAR(255),
    entity entity_enum NOT NULL,
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT FALSE
);

-- Tabla cameras
CREATE TABLE IF NOT EXISTS cameras (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR NOT NULL,
    source_type camera_source_enum NOT NULL,
    source_url VARCHAR NOT NULL,
    playback_url VARCHAR,
    status camera_status_enum NOT NULL DEFAULT 'pending',
    location VARCHAR,
    latitude VARCHAR,
    longitude VARCHAR,
    storage_info VARCHAR,
    additional_data TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
