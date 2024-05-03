CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    comName VARCHAR(255) UNIQUE,
    sciName VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    locationId VARCHAR(255),
    locationName VARCHAR(255),
    lat DECIMAL(9,6),  -- Asumiendo una precisión adecuada para coordenadas geográficas
    lng DECIMAL(9,6),
    date TIMESTAMP,  -- Usa TIMESTAMP para almacenar tanto fecha como hora
    numObservation INT,
    speciesId INT NULL,  -- Hacer opcional el speciesId
    CONSTRAINT fk_species
        FOREIGN KEY (speciesId) 
        REFERENCES species(id)
        ON DELETE SET NULL  
);

CREATE TABLE IF NOT EXISTS recording (
    id SERIAL PRIMARY KEY,
    recordingId VARCHAR(255) UNIQUE,  -- Asegurarse de que recordingId sea único si se usa en lógicas de inserción condicionales
    location VARCHAR(255),
    quality VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    alt INT,
    file VARCHAR(255),
    fileName VARCHAR(255),
    time VARCHAR(255),  -- Si es un timestamp, considerar cambiar el tipo a TIME o TIMESTAMP
    date TIMESTAMP,
    observationId INT NULL,  -- Hacer opcional el observationId
    CONSTRAINT fk_observation
        FOREIGN KEY (observationId)
        REFERENCES observation(id)
        ON DELETE SET NULL  
);
